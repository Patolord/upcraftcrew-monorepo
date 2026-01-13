import { auth as clerkAuth } from "@clerk/nextjs/server";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

/**
 * Server-side authorization utilities
 * Use these in Server Components, Server Actions, and middleware
 */

// Re-export Clerk auth for convenience
export { clerkAuth as auth };

export type UserRole = "admin" | "member" | "viewer";

export interface AuthUser {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  imageUrl?: string;
  department?: string;
  skills?: string[];
  status: "online" | "offline" | "away" | "busy";
  joinedAt: number;
  lastActive: number;
  projectIds: string[];
  onboardingCompleted: boolean;
}

/**
 * Get the Convex authentication token from Clerk
 * Use this when you need to manually pass token to preloadQuery
 */
export async function getConvexToken(): Promise<string | null> {
  const { userId, getToken } = await clerkAuth();

  if (!userId) {
    return null;
  }

  try {
    const token = await getToken({ template: "convex" });
    return token;
  } catch (error) {
    console.error("Failed to get Clerk token for Convex:", error);
    return null;
  }
}

/**
 * Get the current authenticated user from Convex (server-side)
 * Returns null if not authenticated or user not found
 *
 * SECURITY: Uses preloadQuery with Clerk auth token to properly authenticate
 * the Convex query. This ensures ctx.auth.getUserIdentity() works correctly.
 */
export async function getCurrentUserServer(): Promise<AuthUser | null> {
  const { userId } = await clerkAuth();

  if (!userId) {
    return null;
  }

  try {
    const token = await getConvexToken();

    if (!token) {
      console.error("Failed to get Clerk token for Convex");
      return null;
    }

    // Use preloadQuery with authentication token
    // This properly passes the Clerk auth context to Convex
    const preloaded = await preloadQuery(api.users.current, {}, { token });

    const user = preloaded._valueJSON as unknown as AuthUser;

    if (!user) {
      return null;
    }

    return user as AuthUser;
  } catch (error) {
    console.error("Error fetching user from Convex:", error);
    return null;
  }
}

/**
 * Check if the current user has admin role (server-side)
 * Use this in Server Components and Server Actions
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUserServer();
  return user?.role === "admin";
}

/**
 * Require admin role or throw error (server-side)
 * Use this at the top of admin-only Server Components
 *
 * @throws Error if user is not authenticated or not an admin
 */
export async function requireAdminServer(): Promise<AuthUser> {
  const user = await getCurrentUserServer();

  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

/**
 * Get authenticated user and token for preloadQuery operations
 * Returns both user and token, or throws if not admin
 *
 * @throws Error if user is not authenticated or not an admin
 * @returns Object with user and token
 */
export async function requireAdminWithToken(): Promise<{ user: AuthUser; token: string }> {
  const user = await getCurrentUserServer();
  const token = await getConvexToken();

  if (!user || !token) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return { user, token };
}

/**
 * Get authenticated user and token for preloadQuery operations
 * Returns both user and token, or throws if not authenticated
 *
 * @throws Error if user is not authenticated
 * @returns Object with user and token
 */
export async function requireAuthWithToken(): Promise<{ user: AuthUser; token: string }> {
  const user = await getCurrentUserServer();
  const token = await getConvexToken();

  if (!user || !token) {
    throw new Error("Unauthorized: Authentication required");
  }

  return { user, token };
}

/**
 * Check if user has required role
 */
export async function hasRequiredRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUserServer();

  if (!user) {
    return false;
  }

  // Admin has access to everything
  if (user.role === "admin") {
    return true;
  }

  return user.role === requiredRole;
}

/**
 * Require authentication (any role) or throw error (server-side)
 * Use this at the top of authenticated Server Components
 *
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUserServer();

  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return user;
}

/**
 * Wrapper for Server Actions that require authentication
 * Automatically handles authentication and passes the user to the handler
 *
 * @example
 * export const myAction = handler(async (user, formData: FormData) => {
 *   // user is guaranteed to be authenticated
 *   // do something with user and formData
 * });
 */
export function handler<TArgs extends unknown[], TResult>(
  fn: (user: AuthUser, ...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    const user = await requireAuth();
    return fn(user, ...args);
  };
}

/**
 * Wrapper for Server Actions that require admin role
 * Automatically handles authentication and admin check
 *
 * @example
 * export const myAdminAction = adminHandler(async (user, formData: FormData) => {
 *   // user is guaranteed to be an admin
 *   // do something with user and formData
 * });
 */
export function adminHandler<TArgs extends unknown[], TResult>(
  fn: (user: AuthUser, ...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    const user = await requireAdminServer();
    return fn(user, ...args);
  };
}
