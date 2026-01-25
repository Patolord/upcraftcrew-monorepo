import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember } from "./users";
import { throwNotFound } from "./errors";
import { paginationOptsValidator } from "convex/server";

// Query: Get all budgets
export const getBudgets = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    // Populate project data if exists
    const budgetsWithProject = await Promise.all(
      budgets.map(async (budget) => {
        if (budget.projectId) {
          const project = await ctx.db.get(budget.projectId);
          return {
            ...budget,
            project,
          };
        }
        return budget;
      }),
    );

    return budgetsWithProject;
  },
});

// Query: Get paginated budgets
export const getBudgetsPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const paginatedResult = await ctx.db
      .query("budgets")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(args.paginationOpts);

    // Populate project data if exists for each budget in the page
    const budgetsWithProject = await Promise.all(
      paginatedResult.page.map(async (budget) => {
        if (budget.projectId) {
          const project = await ctx.db.get(budget.projectId);
          return {
            ...budget,
            project,
          };
        }
        return budget;
      }),
    );

    return {
      ...paginatedResult,
      page: budgetsWithProject,
    };
  },
});

// Query: Get budget by ID
export const getBudgetById = query({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const budget = await ctx.db.get(args.id);

    if (!budget) {
      return null;
    }

    // Populate project if exists
    const project = budget.projectId ? await ctx.db.get(budget.projectId) : null;

    return {
      ...budget,
      project,
    };
  },
});

// Query: Get budgets by status
export const getBudgetsByStatus = query({
  args: {
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("expired"),
    ),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    return budgets;
  },
});

// Query: Get budgets by client
export const getBudgetsByClient = query({
  args: { client: v.string() },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_client", (q) => q.eq("client", args.client))
      .collect();

    return budgets;
  },
});

// Query: Get budget statistics
export const getBudgetStats = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);
    const budgets = await ctx.db.query("budgets").collect();

    const total = budgets.length;
    const draft = budgets.filter((b) => b.status === "draft").length;

    // "Sent" includes all budgets that have been sent, including those that
    // later received a response (approved/rejected). Once sent, always sent.
    const sentStatuses = ["sent", "approved", "rejected"];
    const sent = budgets.filter((b) => sentStatuses.includes(b.status)).length;

    const approved = budgets.filter((b) => b.status === "approved").length;
    const rejected = budgets.filter((b) => b.status === "rejected").length;
    const cancelled = budgets.filter((b) => b.status === "cancelled").length;

    const totalValue = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
    const approvedValue = budgets
      .filter((b) => b.status === "approved")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Conversion rate: percentage of sent budgets that were approved
    const conversionRate = sent > 0 ? (approved / sent) * 100 : 0;

    return {
      total,
      draft,
      sent,
      approved,
      rejected,
      cancelled,
      totalValue,
      approvedValue,
      conversionRate,
    };
  },
});

// Mutation: Create simple budget (no PDF, minimal fields)
export const createSimpleBudget = mutation({
  args: {
    title: v.string(),
    client: v.string(),
    totalAmount: v.number(),
    currency: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("expired"),
    ),
    validUntil: v.number(),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const now = Date.now();

    const budgetId = await ctx.db.insert("budgets", {
      type: "budget",
      title: args.title,
      client: args.client,
      description: "",
      status: args.status,
      totalAmount: args.totalAmount,
      currency: args.currency || "BRL",
      items: [],
      validUntil: args.validUntil,
      createdAt: now,
      updatedAt: now,
    });

    return budgetId;
  },
});

// Mutation: Create proposal (full budget with PDF support)
export const createBudget = mutation({
  args: {
    title: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("expired"),
    ),
    currency: v.string(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      }),
    ),
    validUntil: v.number(),
    projectId: v.optional(v.id("projects")),
    notes: v.optional(v.string()),
    objectives: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        }),
      ),
    ),
    scopeOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          features: v.array(v.string()),
          value: v.optional(v.number()),
          isSelected: v.boolean(),
        }),
      ),
    ),
    extras: v.optional(
      v.array(
        v.object({
          description: v.string(),
          value: v.number(),
          recurrence: v.optional(v.string()),
        }),
      ),
    ),
    paymentTerms: v.optional(v.array(v.string())),
    deliveryDeadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    // Calculate total amount from items
    const totalAmount = args.items.reduce((sum, item) => sum + item.total, 0);

    const now = Date.now();

    const budgetId = await ctx.db.insert("budgets", {
      ...args,
      type: "proposal",
      totalAmount,
      createdAt: now,
      updatedAt: now,
    });

    return budgetId;
  },
});

// Mutation: Update budget
export const updateBudget = mutation({
  args: {
    id: v.id("budgets"),
    title: v.optional(v.string()),
    client: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("cancelled"),
        v.literal("expired"),
      ),
    ),
    currency: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitPrice: v.number(),
          total: v.number(),
        }),
      ),
    ),
    validUntil: v.optional(v.number()),
    projectId: v.optional(v.id("projects")),
    notes: v.optional(v.string()),
    // New fields
    objectives: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        }),
      ),
    ),
    scopeOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          features: v.array(v.string()),
          value: v.optional(v.number()),
          isSelected: v.boolean(),
        }),
      ),
    ),
    extras: v.optional(
      v.array(
        v.object({
          description: v.string(),
          value: v.number(),
          recurrence: v.optional(v.string()),
        }),
      ),
    ),
    paymentTerms: v.optional(v.array(v.string())),
    deliveryDeadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const { id, ...updates } = args;

    const existingBudget = await ctx.db.get(id);
    if (!existingBudget) {
      throwNotFound("Budget");
    }

    // Recalculate total if items changed
    const totalAmount = updates.items
      ? updates.items.reduce((sum, item) => sum + item.total, 0)
      : existingBudget.totalAmount;

    await ctx.db.patch(id, {
      ...updates,
      totalAmount,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Delete budget
export const deleteBudget = mutation({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const budget = await ctx.db.get(args.id);

    if (!budget) {
      throwNotFound("Budget");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Update budget status
export const updateBudgetStatus = mutation({
  args: {
    id: v.id("budgets"),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("expired"),
    ),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
