import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser, requireWrite } from "./users";
import { throwNotFound, throwUnauthorized } from "./errors";

// Query: Get all messages for a project (newest first), with author info + reply count
export const getMessagesByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_project_created", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    return await Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          author: author
            ? {
                _id: author._id,
                firstName: author.firstName,
                lastName: author.lastName,
                imageUrl: author.imageUrl,
              }
            : null,
          replyCount: message.replyCount ?? 0,
        };
      }),
    );
  },
});

// Query: Get a single message by ID with author info
export const getMessageById = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const message = await ctx.db.get(args.messageId);
    if (!message) return null;

    const author = await ctx.db.get(message.authorId);
    return {
      ...message,
      author: author
        ? {
            _id: author._id,
            firstName: author.firstName,
            lastName: author.lastName,
            imageUrl: author.imageUrl,
          }
        : null,
    };
  },
});

// Query: Get replies for a message (oldest first) with author info
export const getRepliesByMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const replies = await ctx.db
      .query("messageReplies")
      .withIndex("by_message_created", (q) => q.eq("messageId", args.messageId))
      .order("asc")
      .collect();

    return await Promise.all(
      replies.map(async (reply) => {
        const author = await ctx.db.get(reply.authorId);
        return {
          ...reply,
          author: author
            ? {
                _id: author._id,
                firstName: author.firstName,
                lastName: author.lastName,
                imageUrl: author.imageUrl,
              }
            : null,
        };
      }),
    );
  },
});

// Mutation: Create a new message
export const createMessage = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throwNotFound("Project");
    }

    const now = Date.now();
    return await ctx.db.insert("messages", {
      projectId: args.projectId,
      authorId: user._id,
      title: args.title,
      content: args.content,
      isPinned: false,
      replyCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Update message (author only)
export const updateMessage = mutation({
  args: {
    id: v.id("messages"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const message = await ctx.db.get(args.id);
    if (!message) {
      throwNotFound("Message");
    }

    if (message.authorId !== user._id) {
      throwUnauthorized("Only the author can update this message");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Mutation: Delete message (author or admin), cascades to replies
export const deleteMessage = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const message = await ctx.db.get(args.id);
    if (!message) {
      throwNotFound("Message");
    }

    if (message.authorId !== user._id && user.role !== "admin") {
      throwUnauthorized("Only the author or an admin can delete this message");
    }

    // Cascade delete all replies
    const replies = await ctx.db
      .query("messageReplies")
      .withIndex("by_message", (q) => q.eq("messageId", args.id))
      .collect();
    await Promise.all(replies.map((reply) => ctx.db.delete(reply._id)));

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Mutation: Pin/unpin message (admin or project manager)
export const pinMessage = mutation({
  args: {
    id: v.id("messages"),
    isPinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const message = await ctx.db.get(args.id);
    if (!message) {
      throwNotFound("Message");
    }

    const project = await ctx.db.get(message.projectId);
    const isManager = project?.managerId === user._id;

    if (user.role !== "admin" && !isManager) {
      throwUnauthorized("Only admins or project managers can pin messages");
    }

    await ctx.db.patch(args.id, { isPinned: args.isPinned });
    return args.id;
  },
});

// Mutation: Create a reply to a message
export const createReply = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throwNotFound("Message");
    }

    const replyId = await ctx.db.insert("messageReplies", {
      messageId: args.messageId,
      authorId: user._id,
      content: args.content,
      createdAt: Date.now(),
    });

    const currentCount = message.replyCount ?? 0;
    await ctx.db.patch(args.messageId, { replyCount: currentCount + 1 });

    return replyId;
  },
});

// Mutation: Delete a reply (author only)
export const deleteReply = mutation({
  args: { id: v.id("messageReplies") },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const reply = await ctx.db.get(args.id);
    if (!reply) {
      throwNotFound("Reply");
    }

    if (reply.authorId !== user._id) {
      throwUnauthorized("Only the author can delete this reply");
    }

    const parentMessage = await ctx.db.get(reply.messageId);
    if (parentMessage) {
      const currentCount = parentMessage.replyCount ?? 0;
      await ctx.db.patch(reply.messageId, {
        replyCount: Math.max(0, currentCount - 1),
      });
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/** One-time / maintenance: set replyCount from actual replies (fixes legacy docs). */
export const backfillMessageReplyCounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allMessages = await ctx.db.query("messages").collect();
    let updated = 0;
    for (const m of allMessages) {
      const replies = await ctx.db
        .query("messageReplies")
        .withIndex("by_message", (q) => q.eq("messageId", m._id))
        .collect();
      await ctx.db.patch(m._id, { replyCount: replies.length });
      updated += 1;
    }
    return { updated };
  },
});
