import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { requireMember } from "./users";
import { throwNotFound } from "./errors";
import { paginationOptsValidator } from "convex/server";
import {
  mutationWithBudgetTriggers as mutation,
  budgetsByStatus,
  budgetsByCurrency,
} from "./budgetAggregates";

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

    // Populate project and client data if exists
    const budgetsWithProject = await Promise.all(
      budgets.map(async (budget) => {
        const project = budget.projectId ? await ctx.db.get(budget.projectId) : null;
        const clientDoc = budget.clientId ? await ctx.db.get(budget.clientId) : null;
        const clientDisplay = clientDoc?.name ?? budget.client ?? undefined;
        return {
          ...budget,
          client: clientDisplay,
          project,
        };
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

    // Populate project and client data for each budget in the page
    const budgetsWithProject = await Promise.all(
      paginatedResult.page.map(async (budget) => {
        const project = budget.projectId ? await ctx.db.get(budget.projectId) : null;
        const clientDoc = budget.clientId ? await ctx.db.get(budget.clientId) : null;
        const clientDisplay = clientDoc?.name ?? budget.client ?? undefined;
        return {
          ...budget,
          client: clientDisplay,
          project,
        };
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

    // Populate project and client
    const project = budget.projectId ? await ctx.db.get(budget.projectId) : null;
    const clientDoc = budget.clientId ? await ctx.db.get(budget.clientId) : null;
    const clientDisplay = clientDoc?.name ?? budget.client ?? undefined;

    return {
      ...budget,
      client: clientDisplay,
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

// Query: Get budgets by client (legacy - by client name string)
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

// Query: Get budgets by client ID
export const getBudgetsByClientId = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .collect();

    return budgets;
  },
});

// Query: Get budget statistics (aggregate-backed, no full-table scan)
// Defaults to BRL; used by native app
export const getBudgetStats = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);

    const [total, draft, sentCount, approvedCount, rejectedCount, cancelledCount] =
      await Promise.all([
        budgetsByStatus.count(ctx),
        budgetsByStatus.count(ctx, { bounds: { prefix: ["BRL", "draft"] as const } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: ["BRL", "sent"] as const } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: ["BRL", "approved"] as const } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: ["BRL", "rejected"] as const } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: ["BRL", "cancelled"] as const } }),
      ]);

    const sent = sentCount + approvedCount + rejectedCount;

    const [totalValue, approvedValue] = await Promise.all([
      budgetsByStatus.sum(ctx, { bounds: { prefix: ["BRL"] as [string] } }),
      budgetsByStatus.sum(ctx, { bounds: { prefix: ["BRL", "approved"] as const } }),
    ]);

    const conversionRate = sent > 0 ? (approvedCount / sent) * 100 : 0;

    return {
      total,
      draft,
      sent,
      approved: approvedCount,
      rejected: rejectedCount,
      cancelled: cancelledCount,
      totalValue,
      approvedValue,
      conversionRate,
    };
  },
});

// Query: Get budget statistics by currency (aggregate-backed)
export const getBudgetStatsByCurrency = query({
  args: { currency: v.string() },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const c = args.currency;

    const [total, draft, sentCount, approvedCount, rejectedCount, cancelledCount] =
      await Promise.all([
        budgetsByStatus.count(ctx, { bounds: { prefix: [c] as [string] } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: [c, "draft"] as [string, string] } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: [c, "sent"] as [string, string] } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: [c, "approved"] as [string, string] } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: [c, "rejected"] as [string, string] } }),
        budgetsByStatus.count(ctx, { bounds: { prefix: [c, "cancelled"] as [string, string] } }),
      ]);

    const sent = sentCount + approvedCount + rejectedCount;

    const [totalValue, approvedValue] = await Promise.all([
      budgetsByStatus.sum(ctx, { bounds: { prefix: [c] as [string] } }),
      budgetsByStatus.sum(ctx, { bounds: { prefix: [c, "approved"] as [string, string] } }),
    ]);

    const conversionRate = sent > 0 ? (approvedCount / sent) * 100 : 0;

    return {
      total,
      draft,
      sent,
      approved: approvedCount,
      rejected: rejectedCount,
      cancelled: cancelledCount,
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
    client: v.optional(v.string()), // Legacy
    clientId: v.optional(v.id("clients")),
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
    budgetDate: v.optional(v.number()), // Allow retroactive date
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const now = Date.now();
    const createdAt = args.budgetDate || now;

    const budgetId = await ctx.db.insert("budgets", {
      type: "budget",
      title: args.title,
      client: args.client,
      clientId: args.clientId,
      description: "",
      status: args.status,
      totalAmount: args.totalAmount,
      currency: args.currency || "BRL",
      items: [],
      validUntil: args.validUntil,
      createdAt,
      updatedAt: now,
    });

    return budgetId;
  },
});

// Mutation: Update simple budget (basic fields only)
export const updateSimpleBudget = mutation({
  args: {
    id: v.id("budgets"),
    title: v.string(),
    client: v.optional(v.string()), // Legacy
    clientId: v.optional(v.id("clients")),
    totalAmount: v.number(),
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

    const budget = await ctx.db.get(args.id);
    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      client: args.client,
      clientId: args.clientId,
      totalAmount: args.totalAmount,
      status: args.status,
      validUntil: args.validUntil,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Mutation: Create proposal (full budget with PDF support)
export const createBudget = mutation({
  args: {
    title: v.string(),
    client: v.optional(v.string()), // Legacy
    clientId: v.optional(v.id("clients")),
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
    budgetDate: v.optional(v.number()), // Allow retroactive date
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    // Calculate total amount from items
    const totalAmount = args.items.reduce((sum, item) => sum + item.total, 0);

    const now = Date.now();
    const { budgetDate, ...restArgs } = args;
    const createdAt = budgetDate || now;

    const budgetId = await ctx.db.insert("budgets", {
      ...restArgs,
      type: "proposal",
      totalAmount,
      createdAt,
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
    client: v.optional(v.string()), // Legacy
    clientId: v.optional(v.id("clients")),
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

// Internal mutation: Backfill aggregates for existing budgets.
// Run once via `npx convex run budgets:backfillAggregates`
export const backfillAggregates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allBudgets = await ctx.db.query("budgets").collect();
    for (const doc of allBudgets) {
      await budgetsByStatus.insertIfDoesNotExist(ctx, doc);
      await budgetsByCurrency.insertIfDoesNotExist(ctx, doc);
    }
    return { backfilledCount: allBudgets.length };
  },
});
