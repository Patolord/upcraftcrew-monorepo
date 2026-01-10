import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  type MutationCtx,
  query,
  type QueryCtx as QueryContext,
} from "./_generated/server";

// ============================================================================
// CURRENT USER QUERIES
// ============================================================================

/**
 * Get the current authenticated user
 */
export const current = query({
  args: {},
  handler: async (context) => {
    return await getCurrentUser(context);
  },
});

/**
 * Ensure the current user exists in Convex
 * This is a fallback in case the webhook hasn't fired yet
 */
export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const existingUser = await userByClerkUserId(ctx, identity.subject);
    if (existingUser) {
      return existingUser._id;
    }

    // Create user from Clerk identity with default team member settings
    const userId = await ctx.db.insert("users", {
      firstName: identity.givenName || "",
      lastName: identity.familyName || "",
      email: identity.email || "",
      clerkUserId: identity.subject,
      imageUrl: identity.pictureUrl,
      onboardingCompleted: false,
      role: "member", // default role for new users
      status: "offline",
      joinedAt: Date.now(),
      lastActive: Date.now(),
      projectIds: [],
    });

    return userId;
  },
});

/**
 * Get user by Clerk ID (internal use)
 */
export const getUserByClerkId = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await userByClerkUserId(ctx, args.clerkUserId);
  },
});

// ============================================================================
// CLERK WEBHOOK HANDLERS
// ============================================================================

/**
 * Upsert user from Clerk webhook
 * This handles both user creation and updates from Clerk
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.object({
      id: v.string(),
      first_name: v.optional(v.string()),
      last_name: v.optional(v.string()),
      email_addresses: v.optional(
        v.array(
          v.object({
            email_address: v.string(),
          }),
        ),
      ),
      image_url: v.optional(v.string()),
    }),
  },
  async handler(context, { data }) {
    const existingUser = await userByClerkUserId(context, data.id);

    // Base user data to update or insert
    const userData = {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      email: data.email_addresses?.[0]?.email_address,
      clerkUserId: data.id,
      imageUrl: data.image_url,
    };

    if (existingUser !== null) {
      // Update existing user, preserve team-related fields
      return await context.db.patch(existingUser._id, {
        ...userData,
        lastActive: Date.now(),
      });
    }

    // Create new user with default team member settings
    return await context.db.insert("users", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email || "",
      clerkUserId: userData.clerkUserId,
      imageUrl: userData.imageUrl,
      onboardingCompleted: false,
      role: "member",
      status: "offline",
      joinedAt: Date.now(),
      lastActive: Date.now(),
      projectIds: [],
    });
  },
});

/**
 * Delete user from Clerk webhook
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(context, { clerkUserId }) {
    const user = await userByClerkUserId(context, clerkUserId);

    if (user === null) {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    } else {
      await context.db.delete(user._id);
    }

    return null;
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe version - returns user or null (no throwing)
 * Use this for queries that should gracefully handle unauthenticated users
 */
export async function getCurrentUser(context: QueryContext) {
  const identity = await context.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkUserId(context, identity.subject);
}

/**
 * Protected version - throws if no user
 * Use this for mutations and queries that require authentication
 */
export async function getCurrentUserOrThrow(context: QueryContext) {
  const userRecord = await getCurrentUser(context);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

/**
 * Internal helper to get user by Clerk user ID
 */
async function userByClerkUserId(context: QueryContext, clerkUserId: string) {
  return await context.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}

/**
 * Require admin access - throws if not admin
 * This helper is exported for use in other files
 */
export async function requireAdmin(context: QueryContext | MutationCtx): Promise<void> {
  const user = await getCurrentUser(context);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Check if user has write permissions (admin or member)
 * Viewers can only read
 */
export async function hasWriteAccess(context: QueryContext | MutationCtx): Promise<boolean> {
  const user = await getCurrentUser(context);
  if (!user) return false;
  return user.role === "admin" || user.role === "member";
}

/**
 * Require write access - throws if user is only a viewer
 */
export async function requireWrite(context: QueryContext | MutationCtx) {
  const user = await getCurrentUser(context);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (user.role === "viewer") {
    throw new Error("Unauthorized: Write access required. Viewers can only read.");
  }

  return user;
}

/**
 * Require member or admin access (anyone who is not a viewer)
 * This is an alias for requireWrite for semantic clarity
 */
export async function requireMember(context: QueryContext | MutationCtx) {
  return await requireWrite(context);
}

// ============================================================================
// ADMIN QUERIES AND MUTATIONS
// ============================================================================

/**
 * Get all users (admin only)
 */
export const getUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(args.limit || 100);

    return users;
  },
});

/**
 * Set user role (admin only)
 */
export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});
