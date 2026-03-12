import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow, requireWrite } from "./users";
import { throwNotFound, throwAlreadyExists } from "./errors";

async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Query: Get all team members
export const getTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const members = await ctx.db.query("users").collect();

    // Populate projects for each member
    const membersWithProjects = await Promise.all(
      members.map(async (member) => {
        const projects = await Promise.all(
          member.projectIds.map((projectId) => ctx.db.get(projectId)),
        );

        return {
          ...member,
          projects: projects.filter((project) => project !== null),
        };
      }),
    );

    return membersWithProjects;
  },
});

// Query: Get team member by ID
export const getTeamMemberById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const member = await ctx.db.get(args.id);

    if (!member) {
      return null;
    }

    // Populate projects
    const projects = await Promise.all(member.projectIds.map((projectId) => ctx.db.get(projectId)));

    return {
      ...member,
      projects: projects.filter((project) => project !== null),
    };
  },
});

// Query: Get team members by status
export const getTeamMembersByStatus = query({
  args: {
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away"),
      v.literal("busy"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const members = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    return members;
  },
});

// Query: Get team members by department
export const getTeamMembersByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const members = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("department"), args.department))
      .collect();

    return members;
  },
});

// Mutation: Create team member
export const createTeamMember = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    department: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    // Check if email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throwAlreadyExists("User", "email");
    }

    // Generate a temporary clerkUserId until they actually sign up
    const tempClerkUserId = `temp_${Date.now()}_${args.email}`;

    const userId = await ctx.db.insert("users", {
      clerkUserId: tempClerkUserId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      imageUrl: args.imageUrl,
      role: args.role,
      department: args.department,
      skills: args.skills,
      status: "offline",
      joinedAt: Date.now(),
      lastActive: Date.now(),
      projectIds: [],
      onboardingCompleted: false,
    });

    return userId;
  },
});

// Mutation: Update team member
export const updateTeamMember = mutation({
  args: {
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"), v.literal("viewer"))),
    department: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("online"), v.literal("offline"), v.literal("away"), v.literal("busy")),
    ),
    skills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const { id, ...updates } = args;

    const existingMember = await ctx.db.get(id);
    if (!existingMember) {
      throwNotFound("Team member");
    }

    // If email is being updated, check for duplicates
    if (updates.email && updates.email !== existingMember.email) {
      const emailToCheck = updates.email;
      const duplicateUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", emailToCheck))
        .first();

      if (duplicateUser) {
        throwAlreadyExists("User", "email");
      }
    }

    // Update lastActive when status changes
    if (updates.status) {
      await ctx.db.patch(id, {
        ...updates,
        lastActive: Date.now(),
      });
    } else {
      await ctx.db.patch(id, updates);
    }

    return id;
  },
});

// Mutation: Delete team member
export const deleteTeamMember = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const member = await ctx.db.get(args.id);

    if (!member) {
      throwNotFound("Team member");
    }

    // Remove member from all projects
    for (const projectId of member.projectIds) {
      const project = await ctx.db.get(projectId);
      if (project) {
        await ctx.db.patch(projectId, {
          teamIds: project.teamIds.filter((userId) => userId !== args.id),
        });
      }
    }

    // Remove member from all events
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      if (event.attendeeIds.includes(args.id)) {
        await ctx.db.patch(event._id, {
          attendeeIds: event.attendeeIds.filter((userId) => userId !== args.id),
        });
      }
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Update team member's last active timestamp
export const updateLastActive = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    await ctx.db.patch(args.id, {
      lastActive: Date.now(),
    });

    return { success: true };
  },
});
