import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow, requireMember } from "./users";
import { throwNotFound } from "./errors";
import { paginationOptsValidator } from "convex/server";

// Helper to require auth and return user (for backwards compatibility)
async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Helper for write access
async function requireWrite(ctx: any) {
  return await requireMember(ctx);
}

// Helper to transform user to team member format
function transformUserToTeamMember(user: any) {
  if (!user) return null;
  return {
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl,
  };
}

// Query: Get all projects
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const projects = await ctx.db.query("projects").collect();

    // Populate team members and manager for each project
    const projectsWithTeam = await Promise.all(
      projects.map(async (project) => {
        try {
          const team = await Promise.all(
            (project.teamIds || []).map((userId) => ctx.db.get(userId)),
          );
          const manager = project.managerId ? await ctx.db.get(project.managerId) : null;

          return {
            ...project,
            team: team.filter((member) => member !== null).map(transformUserToTeamMember),
            manager: transformUserToTeamMember(manager),
          };
        } catch (error) {
          console.error(`Error processing project ${project._id}:`, error);
          return {
            ...project,
            team: [],
            manager: null,
          };
        }
      }),
    );

    return projectsWithTeam;
  },
});

// Query: Get paginated projects
export const getProjectsPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const paginatedResult = await ctx.db
      .query("projects")
      .order("desc")
      .paginate(args.paginationOpts);

    // Populate team members and manager for each project in the page
    const projectsWithTeam = await Promise.all(
      paginatedResult.page.map(async (project) => {
        const team = await Promise.all(project.teamIds.map((userId) => ctx.db.get(userId)));
        const manager = await ctx.db.get(project.managerId);

        return {
          ...project,
          team: team.filter((member) => member !== null).map(transformUserToTeamMember),
          manager: transformUserToTeamMember(manager),
        };
      }),
    );

    return {
      ...paginatedResult,
      page: projectsWithTeam,
    };
  },
});

// Query: Get project by ID
export const getProjectById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    // Populate team members and manager
    const team = await Promise.all(project.teamIds.map((userId) => ctx.db.get(userId)));
    const manager = await ctx.db.get(project.managerId);

    return {
      ...project,
      team: team.filter((member) => member !== null).map(transformUserToTeamMember),
      manager: transformUserToTeamMember(manager),
    };
  },
});

// Query: Get projects by status
export const getProjectsByStatus = query({
  args: {
    status: v.union(
      v.literal("planning"),
      v.literal("in-progress"),

      v.literal("completed"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    // Populate team members and manager for each project
    const projectsWithTeam = await Promise.all(
      projects.map(async (project) => {
        const team = await Promise.all(project.teamIds.map((userId) => ctx.db.get(userId)));
        const manager = await ctx.db.get(project.managerId);

        return {
          ...project,
          team: team.filter((member) => member !== null).map(transformUserToTeamMember),
          manager: transformUserToTeamMember(manager),
        };
      }),
    );

    return projectsWithTeam;
  },
});

// Query: Get projects by manager
export const getProjectsByManager = query({
  args: { managerId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_manager", (q) => q.eq("managerId", args.managerId))
      .collect();

    // Populate team members and manager for each project
    const projectsWithTeam = await Promise.all(
      projects.map(async (project) => {
        const team = await Promise.all(project.teamIds.map((userId) => ctx.db.get(userId)));
        const manager = await ctx.db.get(project.managerId);

        return {
          ...project,
          team: team.filter((member) => member !== null).map(transformUserToTeamMember),
          manager: transformUserToTeamMember(manager),
        };
      }),
    );

    return projectsWithTeam;
  },
});

// Mutation: Create project
export const createProject = mutation({
  args: {
    name: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("in-progress"),

      v.literal("completed"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    startDate: v.number(),
    endDate: v.number(),
    progress: v.number(),
    budget: v.optional(v.number()),
    managerId: v.id("users"), // Required project manager
    teamIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);

    // Verify that managerId exists
    const manager = await ctx.db.get(args.managerId);
    if (!manager) {
      throw new Error("Manager not found");
    }

    const projectId = await ctx.db.insert("projects", {
      ...args,
      budget: args.budget || 0,
    });

    // Update team members' projectIds (including manager if not already in team)
    const teamIdsToUpdate = args.teamIds.includes(args.managerId)
      ? args.teamIds
      : [...args.teamIds, args.managerId];

    for (const userId of teamIdsToUpdate) {
      const user = await ctx.db.get(userId);
      if (user) {
        await ctx.db.patch(userId, {
          projectIds: [...user.projectIds, projectId],
        });
      }
    }

    return projectId;
  },
});

// Mutation: Update project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    client: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("planning"), v.literal("in-progress"), v.literal("completed")),
    ),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    progress: v.optional(v.number()),
    budget: v.optional(v.number()),
    managerId: v.optional(v.id("users")), // Allow changing project manager
    teamIds: v.optional(v.array(v.id("users"))),
    notes: v.optional(v.string()),
    files: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          size: v.number(),
          uploadedAt: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const { id, ...updates } = args;

    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throwNotFound("Project");
    }

    // If managerId is being updated, verify it exists and update projectIds
    if (updates.managerId && updates.managerId !== existingProject.managerId) {
      const newManager = await ctx.db.get(updates.managerId);
      if (!newManager) {
        throw new Error("Manager not found");
      }

      // Remove project from old manager if they're not in teamIds
      const oldManager = await ctx.db.get(existingProject.managerId);
      if (oldManager && !existingProject.teamIds.includes(existingProject.managerId)) {
        await ctx.db.patch(existingProject.managerId, {
          projectIds: oldManager.projectIds.filter((pid) => pid !== id),
        });
      }

      // Add project to new manager if not already in projectIds
      if (!newManager.projectIds.includes(id)) {
        await ctx.db.patch(updates.managerId, {
          projectIds: [...newManager.projectIds, id],
        });
      }
    }

    // If teamIds are being updated, update users' projectIds
    if (updates.teamIds) {
      // Remove project from old team members
      for (const oldUserId of existingProject.teamIds) {
        const user = await ctx.db.get(oldUserId);
        if (user) {
          await ctx.db.patch(oldUserId, {
            projectIds: user.projectIds.filter((pid) => pid !== id),
          });
        }
      }

      // Add project to new team members
      for (const newUserId of updates.teamIds) {
        const user = await ctx.db.get(newUserId);
        if (user && !user.projectIds.includes(id)) {
          await ctx.db.patch(newUserId, {
            projectIds: [...user.projectIds, id],
          });
        }
      }

      // Ensure manager is also in projectIds if not in team
      const currentManagerId = updates.managerId || existingProject.managerId;
      if (!updates.teamIds.includes(currentManagerId)) {
        const manager = await ctx.db.get(currentManagerId);
        if (manager && !manager.projectIds.includes(id)) {
          await ctx.db.patch(currentManagerId, {
            projectIds: [...manager.projectIds, id],
          });
        }
      }
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Update project status
export const updateProjectStatus = mutation({
  args: {
    id: v.id("projects"),
    status: v.union(v.literal("planning"), v.literal("in-progress"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const project = await ctx.db.get(args.id);

    if (!project) {
      throwNotFound("Project");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });

    return args.id;
  },
});

// Mutation: Delete project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const project = await ctx.db.get(args.id);

    if (!project) {
      throwNotFound("Project");
    }

    // Remove project from team members' projectIds
    for (const userId of project.teamIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        await ctx.db.patch(userId, {
          projectIds: user.projectIds.filter((pid) => pid !== args.id),
        });
      }
    }

    // Delete related transactions
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("projectId"), args.id))
      .collect();

    for (const transaction of transactions) {
      await ctx.db.delete(transaction._id);
    }

    // Delete related events
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("projectId"), args.id))
      .collect();

    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Create project from approved budget
export const createProjectFromBudget = mutation({
  args: {
    budgetId: v.id("budgets"),
  },
  handler: async (ctx, args) => {
    const user = await requireWrite(ctx);

    // Get the budget
    const budget = await ctx.db.get(args.budgetId);
    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    // Check if budget is approved
    if (budget.status !== "approved") {
      throw new Error("Apenas orçamentos aprovados podem ser convertidos em projetos");
    }

    // Check if project already exists for this budget
    const existingProject = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("budgetId"), args.budgetId))
      .first();

    if (existingProject) {
      throw new Error("Já existe um projeto criado a partir deste orçamento");
    }

    // Create the project from budget data
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

    const projectId = await ctx.db.insert("projects", {
      name: budget.title,
      client: budget.client,
      description: budget.description || "",
      status: "planning",
      priority: "medium",
      startDate: now,
      endDate: thirtyDaysFromNow,
      progress: 0,
      budget: budget.totalAmount,
      managerId: user._id,
      teamIds: [user._id],
      budgetId: args.budgetId, // Link to the original budget
    });

    // Update user's projectIds
    await ctx.db.patch(user._id, {
      projectIds: [...user.projectIds, projectId],
    });

    // Update budget with project reference
    await ctx.db.patch(args.budgetId, {
      projectId: projectId,
    });

    return projectId;
  },
});
