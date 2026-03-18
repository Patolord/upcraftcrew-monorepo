import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireWrite } from "./users";
import { throwNotFound } from "./errors";

// Query: Get subtasks by task ID
export const getSubtasksByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task_order", (q) => q.eq("taskId", args.taskId))
      .collect();

    return subtasks;
  },
});

// Query: Get subtask stats for a task (count and completed count)
export const getSubtaskStats = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { total: 0, completed: 0 };
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    const total = subtasks.length;
    const completed = subtasks.filter((s) => s.completed).length;

    return { total, completed };
  },
});

// Mutation: Create subtask
export const createSubtask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);

    // Verify task exists
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throwNotFound("Task");
    }

    // Get the highest order number for this task
    const existingSubtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    const maxOrder = existingSubtasks.reduce((max, s) => Math.max(max, s.order), -1);

    const subtaskId = await ctx.db.insert("subtasks", {
      taskId: args.taskId,
      title: args.title,
      completed: false,
      order: maxOrder + 1,
      createdAt: Date.now(),
    });

    return subtaskId;
  },
});

// Mutation: Update subtask
export const updateSubtask = mutation({
  args: {
    id: v.id("subtasks"),
    title: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const { id, ...updates } = args;

    const existingSubtask = await ctx.db.get(id);
    if (!existingSubtask) {
      throwNotFound("Subtask");
    }

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );

    await ctx.db.patch(id, filteredUpdates);

    return id;
  },
});

// Mutation: Toggle subtask completion
export const toggleSubtask = mutation({
  args: { id: v.id("subtasks") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);

    const subtask = await ctx.db.get(args.id);
    if (!subtask) {
      throwNotFound("Subtask");
    }

    await ctx.db.patch(args.id, {
      completed: !subtask.completed,
    });

    return { success: true, completed: !subtask.completed };
  },
});

// Mutation: Delete subtask
export const deleteSubtask = mutation({
  args: { id: v.id("subtasks") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);

    const subtask = await ctx.db.get(args.id);
    if (!subtask) {
      throwNotFound("Subtask");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Reorder subtasks
export const reorderSubtasks = mutation({
  args: {
    taskId: v.id("tasks"),
    subtaskIds: v.array(v.id("subtasks")),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);

    // Update order for each subtask
    await Promise.all(args.subtaskIds.map((id, index) => ctx.db.patch(id, { order: index })));

    return { success: true };
  },
});
