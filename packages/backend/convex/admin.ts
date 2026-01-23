import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Internal mutation to promote a user to admin by email
 * This is useful for bootstrapping the first admin user
 *
 * Usage from CLI:
 * pnpm convex run admin:promoteUserToAdmin '{"email": "your-email@example.com"}'
 */
export const promoteUserToAdmin = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    await ctx.db.patch(user._id, {
      role: "admin",
    });

    console.log(`User ${email} promoted to admin`);
    return { success: true, userId: user._id, email };
  },
});

/**
 * Internal mutation to promote a user to admin by Clerk ID
 *
 * Usage from CLI:
 * pnpm convex run admin:promoteUserToAdminByClerkId '{"clerkUserId": "user_xxx"}'
 */
export const promoteUserToAdminByClerkId = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error(`User not found with Clerk ID: ${clerkUserId}`);
    }

    await ctx.db.patch(user._id, {
      role: "admin",
    });

    console.log(`User ${clerkUserId} (${user.email}) promoted to admin`);
    return { success: true, userId: user._id, email: user.email };
  },
});
