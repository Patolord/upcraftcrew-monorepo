import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow, requireWrite } from "./users";
import { throwNotFound, throwUnauthorized } from "./errors";

// Helper to require auth
async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Query: Get comments by task ID
export const getCommentsByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task_created", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();

    // Populate user info for each comment
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: user
            ? {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
              }
            : null,
        };
      }),
    );

    return commentsWithUser;
  },
});

// Query: Get comment count for a task
export const getCommentCount = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    return comments.length;
  },
});

// Mutation: Create comment
export const createComment = mutation({
  args: {
    taskId: v.id("tasks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    // Verify task exists
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throwNotFound("Task");
    }

    const commentId = await ctx.db.insert("taskComments", {
      taskId: args.taskId,
      userId: user._id,
      content: args.content,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

// Mutation: Update comment
export const updateComment = mutation({
  args: {
    id: v.id("taskComments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throwNotFound("Comment");
    }

    // Only the author can update their comment
    if (comment.userId !== user._id) {
      throwUnauthorized("Only the author can update this comment");
    }

    await ctx.db.patch(args.id, {
      content: args.content,
    });

    return args.id;
  },
});

// Mutation: Delete comment
export const deleteComment = mutation({
  args: { id: v.id("taskComments") },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throwNotFound("Comment");
    }

    // Only the author can delete their comment
    if (comment.userId !== user._id) {
      throwUnauthorized("Only the author can delete this comment");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
