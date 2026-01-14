import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember } from "./users";
import { throwNotFound } from "./errors";

// Query: Get all transactions
export const getTransactions = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .order("desc")
      .collect();

    // Populate project data for each transaction
    const transactionsWithProject = await Promise.all(
      transactions.map(async (transaction) => {
        if (transaction.projectId) {
          const project = await ctx.db.get(transaction.projectId);
          return {
            ...transaction,
            project,
          };
        }
        return transaction;
      }),
    );

    return transactionsWithProject;
  },
});

// Query: Get transactions by type
export const getTransactionsByType = query({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();

    return transactions;
  },
});

// Query: Get transactions by status
export const getTransactionsByStatus = query({
  args: {
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    return transactions;
  },
});

// Query: Get transactions by project
export const getTransactionsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return transactions;
  },
});

// Query: Get transactions by date range
export const getTransactionsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .filter((q) =>
        q.and(q.gte(q.field("date"), args.startDate), q.lte(q.field("date"), args.endDate)),
      )
      .collect();

    return transactions;
  },
});

// Query: Get financial summary
export const getFinancialSummary = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);
    const transactions = await ctx.db.query("transactions").collect();

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = transactions
      .filter((t) => t.type === "income" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate by category
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const incomeByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .forEach((t) => {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense,
      expensesByCategory,
      incomeByCategory,
      transactionCount: transactions.length,
    };
  },
});

// Query: Get monthly financial summary
export const getMonthlyFinancialSummary = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    // Calculate start and end of month
    const startDate = new Date(args.year, args.month - 1, 1).getTime();
    const endDate = new Date(args.year, args.month, 0, 23, 59, 59).getTime();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .filter((q) => q.and(q.gte(q.field("date"), startDate), q.lte(q.field("date"), endDate)))
      .collect();

    const totalIncome = transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      year: args.year,
      month: args.month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  },
});

// Mutation: Create transaction
export const createTransaction = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    date: v.number(),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transactionId = await ctx.db.insert("transactions", args);

    // If transaction is linked to a project and is completed, update project budget
    if (args.projectId && args.status === "completed") {
      const project = await ctx.db.get(args.projectId);
      if (project) {
        const updatedBudget = project.budget + args.amount;

        await ctx.db.patch(args.projectId, {
          budget: updatedBudget,
        });
      }
    }

    return transactionId;
  },
});

// Mutation: Update transaction
export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"))),
    date: v.optional(v.number()),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const { id, ...updates } = args;

    const existingTransaction = await ctx.db.get(id);
    if (!existingTransaction) {
      throwNotFound("Transaction");
    }

    // If status is changing to completed and transaction is linked to a project
    if (
      updates.status === "completed" &&
      existingTransaction.status !== "completed" &&
      existingTransaction.projectId
    ) {
      const project = await ctx.db.get(existingTransaction.projectId);
      if (project) {
        const amount = updates.amount ?? existingTransaction.amount;
        const type = updates.type ?? existingTransaction.type;

        const updatedBudget =
          type === "expense" ? project.budget + amount : project.budget + amount;

        await ctx.db.patch(existingTransaction.projectId, {
          budget: updatedBudget,
        });
      }
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete transaction
export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const transaction = await ctx.db.get(args.id);

    if (!transaction) {
      throwNotFound("Transaction");
    }

    // If transaction was completed and linked to a project, revert budget changes
    if (
      transaction.status === "completed" &&
      transaction.projectId &&
      transaction.type === "expense"
    ) {
      const project = await ctx.db.get(transaction.projectId);
      if (project) {
        const updatedBudget = project.budget - transaction.amount;

        await ctx.db.patch(transaction.projectId, {
          budget: updatedBudget,
        });
      }
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
