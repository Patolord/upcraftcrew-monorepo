import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember } from "./users";
import { throwNotFound } from "./errors";

// Query: Get all clients
export const getClients = query({
  args: {},
  handler: async (ctx) => {
    await requireMember(ctx);
    return ctx.db.query("clients").withIndex("by_created_at").order("desc").collect();
  },
});

// Query: Get client by ID
export const getClientById = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    return ctx.db.get(args.id);
  },
});

// Query: Get client with all related data (projects, budgets, transactions, tasks, events)
export const getClientWithRelations = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const client = await ctx.db.get(args.id);
    if (!client) return null;

    // Projects linked to this client
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.id))
      .collect();

    // Budgets linked to this client
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.id))
      .collect();

    // Transactions linked to this client (via clientIdRef)
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_clientIdRef", (q) => q.eq("clientIdRef", args.id))
      .collect();

    // Tasks via projects
    const projectIds = projects.map((p) => p._id);
    const tasks = await ctx.db.query("tasks").collect();
    const tasksForClient = tasks.filter((t) => t.projectId && projectIds.includes(t.projectId));

    // Events via projects
    const events = await ctx.db.query("events").collect();
    const eventsForClient = events.filter((e) => e.projectId && projectIds.includes(e.projectId));

    return {
      ...client,
      projects,
      budgets,
      transactions,
      tasks: tasksForClient,
      events: eventsForClient,
    };
  },
});

// Query: Get clients for combobox (search)
export const getClientsSearch = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    let clients = await ctx.db.query("clients").withIndex("by_created_at").order("desc").collect();

    if (args.search?.trim()) {
      const searchLower = args.search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          (c.company?.toLowerCase().includes(searchLower) ?? false) ||
          (c.email?.toLowerCase().includes(searchLower) ?? false),
      );
    }

    return clients;
  },
});

// Mutation: Create client
export const createClient = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const now = Date.now();
    return ctx.db.insert("clients", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Update client
export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throwNotFound("Client");
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return id;
  },
});

// Mutation: Delete client
export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await requireMember(ctx);
    const client = await ctx.db.get(args.id);
    if (!client) throwNotFound("Client");

    // Check if client has linked projects or budgets
    const projectsCount = await ctx.db
      .query("projects")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.id))
      .collect();
    const budgetsCount = await ctx.db
      .query("budgets")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.id))
      .collect();

    if (projectsCount.length > 0 || budgetsCount.length > 0) {
      throw new Error(
        "Não é possível excluir este cliente pois existem projetos ou orçamentos vinculados. Desvincule-os primeiro.",
      );
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
