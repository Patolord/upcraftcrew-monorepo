import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getCurrentUser } from "../users";

/**
 * Require authentication - throws if no user
 * Use this for queries and mutations that require authentication
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<void> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
}

/**
 * Require write permission (authenticated users)
 * Currently same as requireAuth, but can be extended for more granular permissions
 */
export async function requireWrite(ctx: QueryCtx | MutationCtx): Promise<void> {
  await requireAuth(ctx);
}

/**
 * Require team member role (authenticated users with active access)
 * Use for operations that require paid/active member access
 */
export async function requireMember(ctx: QueryCtx | MutationCtx): Promise<void> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  // Check if user has active access
  if (user.status !== "active" || !user.paid || !user.hasActiveYearAccess) {
    throw new Error("Unauthorized: Active membership required");
  }
}
