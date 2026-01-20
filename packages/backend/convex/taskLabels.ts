import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow, requireWrite } from "./users";
import { throwNotFound, throwUnauthorized } from "./errors";

// Helper to require auth
async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Query: Get all labels for current user
export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const labels = await ctx.db
      .query("taskLabels")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();

    return labels;
  },
});

// Query: Get label by ID
export const getLabelById = query({
  args: { id: v.id("taskLabels") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const label = await ctx.db.get(args.id);
    return label;
  },
});

// Query: Get labels by IDs (for populating task labels)
export const getLabelsByIds = query({
  args: { ids: v.array(v.id("taskLabels")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const labels = await Promise.all(args.ids.map((id) => ctx.db.get(id)));

    return labels.filter(Boolean);
  },
});

// Mutation: Create label
export const createLabel = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const labelId = await ctx.db.insert("taskLabels", {
      name: args.name,
      color: args.color,
      ownerId: user._id,
      createdAt: Date.now(),
    });

    return labelId;
  },
});

// Mutation: Update label
export const updateLabel = mutation({
  args: {
    id: v.id("taskLabels"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);
    const { id, ...updates } = args;

    const label = await ctx.db.get(id);
    if (!label) {
      throwNotFound("Label");
    }

    // Only the owner can update the label
    if (label.ownerId !== user._id) {
      throwUnauthorized("Only the owner can update this label");
    }

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );

    await ctx.db.patch(id, filteredUpdates);

    return id;
  },
});

// Mutation: Delete label
export const deleteLabel = mutation({
  args: { id: v.id("taskLabels") },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    const label = await ctx.db.get(args.id);
    if (!label) {
      throwNotFound("Label");
    }

    // Only the owner can delete the label
    if (label.ownerId !== user._id) {
      throwUnauthorized("Only the owner can delete this label");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Predefined label colors for UI
export const LABEL_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];
