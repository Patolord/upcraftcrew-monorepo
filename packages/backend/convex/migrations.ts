import { mutation } from "./_generated/server";

/**
 * Migration: Convert legacy client strings to clients table references.
 * Run this after deploying the clients schema if you have existing data.
 * Creates client records from unique names in projects, budgets, and transactions,
 * then updates all references to use clientId/clientIdRef.
 */
export const migrateClientsFromLegacyStrings = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const clientNameToId = new Map<string, string>();

    // 1. Collect unique client names from projects and budgets
    const projects = await ctx.db.query("projects").collect();
    const budgets = await ctx.db.query("budgets").collect();
    const transactions = await ctx.db.query("transactions").collect();

    const uniqueNames = new Set<string>();
    for (const p of projects) {
      if (p.client) uniqueNames.add(p.client);
    }
    for (const b of budgets) {
      if (b.client) uniqueNames.add(b.client);
    }
    for (const t of transactions) {
      if (t.clientId) uniqueNames.add(t.clientId); // clientId was storing name
    }

    // 2. Create client records for each unique name
    for (const name of uniqueNames) {
      const existing = await ctx.db
        .query("clients")
        .withIndex("by_name", (q) => q.eq("name", name))
        .first();
      if (existing) {
        clientNameToId.set(name, existing._id);
      } else {
        const id = await ctx.db.insert("clients", {
          name,
          createdAt: now,
          updatedAt: now,
        });
        clientNameToId.set(name, id);
      }
    }

    // 3. Update projects with clientId
    for (const project of projects) {
      if (project.client && !project.clientId) {
        const id = clientNameToId.get(project.client);
        if (id) {
          await ctx.db.patch(project._id, { clientId: id as any });
        }
      }
    }

    // 4. Update budgets with clientId
    for (const budget of budgets) {
      if (budget.client && !budget.clientId) {
        const id = clientNameToId.get(budget.client);
        if (id) {
          await ctx.db.patch(budget._id, { clientId: id as any });
        }
      }
    }

    // 5. Update transactions with clientIdRef
    for (const tx of transactions) {
      if (tx.clientId && !tx.clientIdRef) {
        const id = clientNameToId.get(tx.clientId);
        if (id) {
          await ctx.db.patch(tx._id, { clientIdRef: id as any });
        }
      }
    }

    return {
      success: true,
      clientsCreated: clientNameToId.size,
      projectsUpdated: projects.filter((p) => p.client).length,
      budgetsUpdated: budgets.filter((b) => b.client).length,
      transactionsUpdated: transactions.filter((t) => t.clientId).length,
    };
  },
});
