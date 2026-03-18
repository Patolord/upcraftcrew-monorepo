import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow, requireWrite } from "./users";
import { throwNotFound, throwUnauthorized } from "./errors";

// Helper to require auth and return user (for backwards compatibility)
async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Soft auth check for queries - returns null instead of throwing when
// the client-side subscription fires before Clerk has loaded the auth token
async function softAuth(ctx: any) {
  return await getCurrentUser(ctx);
}

// Helper to transform user to assignedUser format
function transformUserToAssignedUser(user: any) {
  if (!user) return null;
  return {
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
  };
}

// Query: Get all tasks
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    const user = await softAuth(ctx);
    if (!user) return [];

    const allTasks = await ctx.db.query("tasks").withIndex("by_created_at").order("desc").collect();

    const tasks = allTasks.filter(
      (task) =>
        !(task.isArchived ?? false) && (!(task.isPrivate ?? false) || task.ownerId === user._id),
    );

    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const assignedUser = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const project = task.projectId ? await ctx.db.get(task.projectId) : null;

        const labels = task.labelIds
          ? await Promise.all(task.labelIds.map((id) => ctx.db.get(id)))
          : [];

        const subtasks = await ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();
        const subtaskStats = {
          total: subtasks.length,
          completed: subtasks.filter((s) => s.completed).length,
        };

        const comments = await ctx.db
          .query("taskComments")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        return {
          ...task,
          assignedUser: transformUserToAssignedUser(assignedUser),
          project,
          labels: labels.filter(Boolean),
          subtaskStats,
          commentCount: comments.length,
        };
      }),
    );

    return tasksWithDetails;
  },
});

// Query: Get task by ID (with full details)
export const getTaskById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const task = await ctx.db.get(args.id);

    if (!task) {
      return null;
    }

    // Check if user has permission to view this task
    // Tasks without isPrivate field are treated as public (false)
    if ((task.isPrivate ?? false) && task.ownerId !== user._id) {
      throwUnauthorized("You don't have permission to view this private task");
    }

    const assignedUser = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
    const project = task.projectId ? await ctx.db.get(task.projectId) : null;

    // Get labels
    const labels = task.labelIds
      ? await Promise.all(task.labelIds.map((id) => ctx.db.get(id)))
      : [];

    // Get subtask stats
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", task._id))
      .collect();
    const subtaskStats = {
      total: subtasks.length,
      completed: subtasks.filter((s) => s.completed).length,
    };

    // Get comment count
    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task", (q) => q.eq("taskId", task._id))
      .collect();

    return {
      ...task,
      assignedUser: transformUserToAssignedUser(assignedUser),
      project,
      labels: labels.filter(Boolean),
      subtaskStats,
      commentCount: comments.length,
    };
  },
});

// Query: Get tasks by status
export const getTasksByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    return tasks;
  },
});

// Query: Get tasks by project
export const getTasksByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Filter tasks: show all public tasks + user's private tasks
    const tasks = allTasks.filter(
      (task) => !(task.isPrivate ?? false) || task.ownerId === user._id,
    );

    // Populate assigned user, project, labels, and subtask stats
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const assignedUser = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const project = task.projectId ? await ctx.db.get(task.projectId) : null;

        // Get labels
        const labels = task.labelIds
          ? await Promise.all(task.labelIds.map((id) => ctx.db.get(id)))
          : [];

        // Get subtask stats
        const subtasks = await ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();
        const subtaskStats = {
          total: subtasks.length,
          completed: subtasks.filter((s) => s.completed).length,
        };

        // Get comment count
        const comments = await ctx.db
          .query("taskComments")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        return {
          ...task,
          assignedUser: transformUserToAssignedUser(assignedUser),
          project,
          labels: labels.filter(Boolean),
          subtaskStats,
          commentCount: comments.length,
        };
      }),
    );

    return tasksWithDetails;
  },
});

// Query: Get tasks assigned to user
export const getTasksByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.userId))
      .collect();

    return tasks;
  },
});

// Query: Get all public tasks (for "View All" feature)
// Shows all public tasks from all users to compare workloads
export const getAllPublicTasks = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const allTasks = await ctx.db.query("tasks").withIndex("by_created_at").order("desc").collect();

    // Filter only public tasks (isPrivate === false or undefined)
    const publicTasks = allTasks.filter((task) => !(task.isPrivate ?? false));

    // Populate assigned user, project, labels, and subtask stats
    const tasksWithDetails = await Promise.all(
      publicTasks.map(async (task) => {
        const assignedUser = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const owner = task.ownerId ? await ctx.db.get(task.ownerId) : null;
        const project = task.projectId ? await ctx.db.get(task.projectId) : null;

        // Get labels
        const labels = task.labelIds
          ? await Promise.all(task.labelIds.map((id) => ctx.db.get(id)))
          : [];

        // Get subtask stats
        const subtasks = await ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();
        const subtaskStats = {
          total: subtasks.length,
          completed: subtasks.filter((s) => s.completed).length,
        };

        // Get comment count
        const comments = await ctx.db
          .query("taskComments")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        return {
          ...task,
          assignedUser: transformUserToAssignedUser(assignedUser),
          owner: owner
            ? {
                _id: owner._id,
                name: `${owner.firstName} ${owner.lastName}`,
                imageUrl: owner.imageUrl,
              }
            : null,
          project,
          labels: labels.filter(Boolean),
          subtaskStats,
          commentCount: comments.length,
        };
      }),
    );

    return tasksWithDetails;
  },
});

// Mutation: Create task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    imageUrls: v.optional(v.array(v.string())),
    isPrivate: v.optional(v.boolean()),
    labelIds: v.optional(v.array(v.id("taskLabels"))),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);
    const now = Date.now();

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      // Default isPrivate to false if not specified
      isPrivate: args.isPrivate ?? false,
      ownerId: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return taskId;
  },
});

// Mutation: Update task (supports multiple images via imageUrls)
export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("review"),
        v.literal("done"),
        v.literal("blocked"),
      ),
    ),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    ),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    imageUrl: v.optional(v.string()), // @deprecated - mantido para compatibilidade
    imageUrls: v.optional(v.array(v.string())), // Array de URLs das imagens
    isPrivate: v.optional(v.boolean()),
    labelIds: v.optional(v.array(v.id("taskLabels"))),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);
    const { id, imageUrl: _imageUrl, ...updates } = args;

    const existingTask = await ctx.db.get(id);
    if (!existingTask) {
      throwNotFound("Task");
    }

    // Only owner can update private tasks
    // Tasks without isPrivate field are treated as public (false)
    if ((existingTask.isPrivate ?? false) && existingTask.ownerId !== user._id) {
      throwUnauthorized("Only the owner can update this private task");
    }

    // Se imageUrls for atualizado, limpar o campo imageUrl antigo
    const patchData: Record<string, unknown> = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Se está atualizando imageUrls, remover imageUrl antigo
    if (updates.imageUrls !== undefined) {
      patchData.imageUrl = undefined;
    }

    await ctx.db.patch(id, patchData);

    return id;
  },
});

// Mutation: Delete task
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);
    const task = await ctx.db.get(args.id);

    if (!task) {
      throwNotFound("Task");
    }

    // Only owner can delete private tasks
    // Tasks without isPrivate field are treated as public (false)
    if ((task.isPrivate ?? false) && task.ownerId !== user._id) {
      throwUnauthorized("Only the owner can delete this private task");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Update task status (for drag & drop)
export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked"),
    ),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const archiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const task = await ctx.db.get(args.id);
    if (!task) {
      throwNotFound("Task");
    }
    await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});
