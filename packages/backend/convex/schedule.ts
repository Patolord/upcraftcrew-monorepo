import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow, requireWrite } from "./users";
import { throwNotFound } from "./errors";

// Helper to require auth and return user (for backwards compatibility)
async function requireAuth(ctx: any) {
  return await getCurrentUserOrThrow(ctx);
}

// Helper to transform user to attendee format
function transformUserToAttendee(user: any) {
  if (!user) return null;
  return {
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
  };
}

// Query: Get all events
export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const events = await ctx.db.query("events").withIndex("by_start_time").order("desc").collect();

    // Populate attendees and project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          ...event,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
          project,
        };
      }),
    );

    return eventsWithDetails;
  },
});

// Query: Get event by ID
export const getEventById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const event = await ctx.db.get(args.id);

    if (!event) {
      return null;
    }

    const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

    const project = event.projectId ? await ctx.db.get(event.projectId) : null;

    return {
      ...event,
      attendees: attendees.filter((a) => a !== null),
      project,
    };
  },
});

// Query: Get events by month
export const getEventsByMonth = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    // Calculate start and end of month
    const startDate = new Date(args.year, args.month - 1, 1).getTime();
    const endDate = new Date(args.year, args.month, 0, 23, 59, 59).getTime();

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter((q) =>
        q.and(q.gte(q.field("startTime"), startDate), q.lte(q.field("startTime"), endDate)),
      )
      .collect();

    // Populate attendees and project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          ...event,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
          project,
        };
      }),
    );

    return eventsWithDetails;
  },
});

// Query: Get events by date range
export const getEventsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), args.startDate),
          q.lte(q.field("startTime"), args.endDate),
        ),
      )
      .collect();

    // Populate attendees and project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          ...event,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
          project,
        };
      }),
    );

    return eventsWithDetails;
  },
});

// Query: Get events by project
export const getEventsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const events = await ctx.db
      .query("events")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Populate attendees
    const eventsWithAttendees = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

        return {
          ...event,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
        };
      }),
    );

    return eventsWithAttendees;
  },
});

// Query: Get events by type
export const getEventsByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();

    return events;
  },
});

// Query: Get events for a user
export const getEventsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const events = await ctx.db.query("events").collect();

    const userEvents = events.filter((event) => event.attendeeIds.includes(args.userId));

    // Populate project data
    const eventsWithProject = await Promise.all(
      userEvents.map(async (event) => {
        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          ...event,
          project,
        };
      }),
    );

    return eventsWithProject;
  },
});

// Query: Get upcoming events
export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = Date.now();
    const limit = args.limit ?? 10;

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter((q) => q.gte(q.field("startTime"), now))
      .order("asc")
      .take(limit);

    // Populate attendees and project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));

        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          ...event,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
          project,
        };
      }),
    );

    return eventsWithDetails;
  },
});

// Mutation: Create event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendeeIds: v.array(v.id("users")),
    projectId: v.optional(v.id("projects")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const eventId = await ctx.db.insert("events", args);

    return eventId;
  },
});

// Mutation: Update event
export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    location: v.optional(v.string()),
    attendeeIds: v.optional(v.array(v.id("users"))),
    projectId: v.optional(v.id("projects")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const { id, ...updates } = args;

    const existingEvent = await ctx.db.get(id);
    if (!existingEvent) {
      throwNotFound("Event");
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete event
export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const event = await ctx.db.get(args.id);

    if (!event) {
      throwNotFound("Event");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Add attendee to event
export const addAttendeeToEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throwNotFound("Event");
    }

    // Check if user is already an attendee
    if (event.attendeeIds.includes(args.userId)) {
      return { success: false, message: "User is already an attendee" };
    }

    await ctx.db.patch(args.eventId, {
      attendeeIds: [...event.attendeeIds, args.userId],
    });

    return { success: true };
  },
});

// Mutation: Remove attendee from event
export const removeAttendeeFromEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireWrite(ctx);
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throwNotFound("Event");
    }

    await ctx.db.patch(args.eventId, {
      attendeeIds: event.attendeeIds.filter((id) => id !== args.userId),
    });

    return { success: true };
  },
});

// Query: Get all schedule items by month (aggregates events, projects, budgets, transactions, tasks)
export const getAllScheduleItemsByMonth = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Calculate start and end of month
    const startDate = new Date(args.year, args.month - 1, 1).getTime();
    const endDate = new Date(args.year, args.month, 0, 23, 59, 59).getTime();

    // 1. Get events for the month
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter((q) =>
        q.and(q.gte(q.field("startTime"), startDate), q.lte(q.field("startTime"), endDate)),
      )
      .collect();

    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const attendees = await Promise.all(event.attendeeIds.map((userId) => ctx.db.get(userId)));
        const project = event.projectId ? await ctx.db.get(event.projectId) : null;

        return {
          sourceType: "event" as const,
          sourceId: event._id,
          title: event.title,
          description: event.description,
          date: event.startTime,
          endDate: event.endTime,
          type: event.type,
          priority: event.priority,
          location: event.location,
          attendees: attendees.map(transformUserToAttendee).filter((a) => a !== null),
          project: project ? { _id: project._id, name: project.name } : null,
          projectId: event.projectId,
        };
      }),
    );

    // 2. Get projects with endDate in this month
    const allProjects = await ctx.db.query("projects").collect();
    const projectsInMonth = allProjects.filter(
      (p) => p.endDate >= startDate && p.endDate <= endDate,
    );

    const projectItems = await Promise.all(
      projectsInMonth.map(async (project) => {
        const manager = await ctx.db.get(project.managerId);
        const team = await Promise.all(project.teamIds.map((userId) => ctx.db.get(userId)));

        return {
          sourceType: "project" as const,
          sourceId: project._id,
          title: `${project.name} - Deadline`,
          description: project.description,
          date: project.endDate,
          endDate: project.endDate,
          type: "deadline",
          priority: project.priority === "urgent" ? "high" : project.priority,
          responsible: manager ? transformUserToAttendee(manager) : null,
          team: team.map(transformUserToAttendee).filter((t) => t !== null),
          projectStatus: project.status,
          projectProgress: project.progress,
          client: project.client,
          project: { _id: project._id, name: project.name },
          projectId: project._id,
        };
      }),
    );

    // 3. Get budgets (follow-ups) with validUntil in this month (excluding approved/rejected)
    const allBudgets = await ctx.db.query("budgets").collect();
    const budgetsInMonth = allBudgets.filter(
      (b) =>
        b.validUntil >= startDate &&
        b.validUntil <= endDate &&
        b.status !== "approved" &&
        b.status !== "rejected",
    );

    const budgetItems = budgetsInMonth.map((budget) => ({
      sourceType: "budget" as const,
      sourceId: budget._id,
      title: `Follow-up: ${budget.title}`,
      description: budget.description,
      date: budget.validUntil,
      endDate: budget.validUntil,
      type: "reminder",
      priority: "medium" as const,
      budgetStatus: budget.status,
      budgetAmount: budget.totalAmount,
      budgetCurrency: budget.currency,
      client: budget.client,
      project: null,
      projectId: budget.projectId,
    }));

    // 4. Get pending transactions with date in this month
    const allTransactions = await ctx.db.query("transactions").collect();
    const transactionsInMonth = allTransactions.filter(
      (t) => t.date >= startDate && t.date <= endDate && t.status === "pending",
    );

    const transactionItems = await Promise.all(
      transactionsInMonth.map(async (transaction) => {
        const project = transaction.projectId ? await ctx.db.get(transaction.projectId) : null;

        return {
          sourceType: "transaction" as const,
          sourceId: transaction._id,
          title: `${transaction.type === "income" ? "Payment Due" : "Payment Out"}: ${transaction.description}`,
          description: transaction.description,
          date: transaction.date,
          endDate: transaction.date,
          type: transaction.type === "income" ? "milestone" : "task",
          priority: "medium" as const,
          transactionType: transaction.type,
          transactionAmount: transaction.amount,
          transactionCategory: transaction.category,
          transactionStatus: transaction.status,
          client: transaction.clientId,
          project: project ? { _id: project._id, name: project.name } : null,
          projectId: transaction.projectId,
        };
      }),
    );

    // 5. Get tasks with dueDate in this month
    const allTasks = await ctx.db.query("tasks").collect();
    const tasksInMonth = allTasks.filter(
      (t) => t.dueDate && t.dueDate >= startDate && t.dueDate <= endDate && t.status !== "done",
    );

    const taskItems = await Promise.all(
      tasksInMonth.map(async (task) => {
        const assignedUser = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const project = task.projectId ? await ctx.db.get(task.projectId) : null;

        return {
          sourceType: "task" as const,
          sourceId: task._id,
          title: task.title,
          description: task.description,
          date: task.dueDate!,
          endDate: task.dueDate!,
          type: "task",
          priority: task.priority === "urgent" ? "high" : task.priority,
          responsible: assignedUser ? transformUserToAttendee(assignedUser) : null,
          taskStatus: task.status,
          project: project ? { _id: project._id, name: project.name } : null,
          projectId: task.projectId,
        };
      }),
    );

    // Combine all items and sort by date
    const allItems = [
      ...eventsWithDetails,
      ...projectItems,
      ...budgetItems,
      ...transactionItems,
      ...taskItems,
    ].sort((a, b) => a.date - b.date);

    return allItems;
  },
});
