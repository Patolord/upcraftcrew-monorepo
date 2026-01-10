import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin } from "./users";

/**
 * ============================================================================
 * TEAM ACCESS MODEL
 *
 * Simple role-based access control:
 * - admin: Full access to everything
 * - member: Can read and write (create/edit/delete)
 * - viewer: Can only read (no create/edit/delete)
 * ============================================================================
 */

// ============================================================================
// ACCESS CHECKS
// ============================================================================

/**
 * Check if current user has access to the app
 * All authenticated users with a role have access
 */
export const checkUserHasAccess = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // All users with a role have basic access
    return true;
  },
});

/**
 * Check if current user can write (create/edit/delete)
 */
export const checkUserCanWrite = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // Admin and member can write, viewer cannot
    return user.role === "admin" || user.role === "member";
  },
});

/**
 * Check if current user is admin
 */
export const checkUserIsAdmin = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    return user.role === "admin";
  },
});

/**
 * Get current user's role and permissions
 */
export const getUserRole = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return {
        role: null,
        canWrite: false,
        isAdmin: false,
      };
    }

    return {
      role: user.role,
      canWrite: user.role === "admin" || user.role === "member",
      isAdmin: user.role === "admin",
    };
  },
});

// ============================================================================
// PROJECT-SPECIFIC ACCESS
// ============================================================================

/**
 * Check if current user has access to a specific project
 * Users have access if they're assigned to the project OR if they're admin
 */
export const checkProjectAccess = query({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // Admins have access to all projects
    if (user.role === "admin") return true;

    // Check if user is assigned to this project
    const project = await ctx.db.get(args.projectId);
    if (!project) return false;

    return project.teamIds.includes(user._id);
  },
});

/**
 * Check if current user can edit a specific project
 * Users can edit if they're assigned AND have write permissions
 */
export const checkProjectWriteAccess = query({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // Admins can edit all projects
    if (user.role === "admin") return true;

    // Viewers cannot edit
    if (user.role === "viewer") return false;

    // Members can edit if they're assigned to the project
    const project = await ctx.db.get(args.projectId);
    if (!project) return false;

    return project.teamIds.includes(user._id);
  },
});

// ============================================================================
// TASK-SPECIFIC ACCESS
// ============================================================================

/**
 * Check if current user can view a specific task
 * Private tasks can only be viewed by owner or admin
 */
export const checkTaskAccess = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const task = await ctx.db.get(args.taskId);
    if (!task) return false;

    // Admins can view all tasks
    if (user.role === "admin") return true;

    // Private tasks only visible to owner
    if (task.isPrivate && task.ownerId !== user._id) {
      return false;
    }

    // If task belongs to a project, check project access
    if (task.projectId) {
      const project = await ctx.db.get(task.projectId);
      if (project && !project.teamIds.includes(user._id)) {
        return false;
      }
    }

    return true;
  },
});

/**
 * Check if current user can edit a specific task
 */
export const checkTaskWriteAccess = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // Viewers cannot edit
    if (user.role === "viewer") return false;

    const task = await ctx.db.get(args.taskId);
    if (!task) return false;

    // Admins can edit all tasks
    if (user.role === "admin") return true;

    // Task owner can edit their own tasks
    if (task.ownerId === user._id) return true;

    // If task is assigned to user, they can edit it
    if (task.assignedTo === user._id) return true;

    // If task belongs to a project the user is on, they can edit it
    if (task.projectId) {
      const project = await ctx.db.get(task.projectId);
      if (project && project.teamIds.includes(user._id)) {
        return true;
      }
    }

    return false;
  },
});

// ============================================================================
// ADMIN MUTATIONS
// ============================================================================

/**
 * Update user role (admin only)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  },
  async handler(ctx, args) {
    await requireAdmin(ctx);

    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    return { success: true };
  },
});

/**
 * Update user department (admin only)
 */
export const updateUserDepartment = mutation({
  args: {
    userId: v.id("users"),
    department: v.optional(v.string()),
  },
  async handler(ctx, args) {
    await requireAdmin(ctx);

    await ctx.db.patch(args.userId, {
      department: args.department,
    });

    return { success: true };
  },
});

// ============================================================================
// ONBOARDING
// ============================================================================

export const completeOnboarding = mutation({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
    });

    return null;
  },
});
