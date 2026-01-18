import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if database already has data
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0 && !args.force) {
      console.log("Database already seeded, skipping...");
      return {
        success: false,
        message: "Database already has data. Use force: true to override.",
      };
    }

    if (args.force && existingUsers.length > 0) {
      console.log("Force mode enabled: proceeding with seed despite existing data...");
    }

    console.log("Starting database seed...");

    // Seed Users
    // NOTE: These are demo users for development/testing only
    // DO NOT use real email addresses or PII in seed data
    const users = [
      {
        clerkUserId: "demo_user_alice_admin",
        firstName: "Alice",
        lastName: "Admin",
        email: "alice.admin@example.com",
        imageUrl: "/default-avatar.png",
        role: "admin" as const,
        department: "Leadership",
        status: "online" as const,
        joinedAt: new Date("2024-01-15").getTime(),
        lastActive: Date.now(),
        skills: ["Leadership", "Strategy", "Business Development"],
        projectIds: [],
        onboardingCompleted: true,
      },
      {
        clerkUserId: "demo_user_mike_chen",
        firstName: "Mike",
        lastName: "Chen",
        email: "mike.chen@example.com",
        imageUrl: "/images/avatars/2.png",
        role: "admin" as const,
        department: "Engineering",
        status: "online" as const,
        joinedAt: new Date("2024-02-01").getTime(),
        lastActive: Date.now(),
        skills: ["Full-Stack", "Architecture", "DevOps", "React", "Node.js"],
        projectIds: [],
        onboardingCompleted: true,
      },
      {
        clerkUserId: "demo_user_emma_wilson",
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@example.com",
        imageUrl: "/images/avatars/3.png",
        role: "member" as const,
        department: "Product",
        status: "busy" as const,
        joinedAt: new Date("2024-03-10").getTime(),
        lastActive: Date.now(),
        skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
        projectIds: [],
        onboardingCompleted: true,
      },
    ];

    const userIds = await Promise.all(users.map((user) => ctx.db.insert("users", user)));

    console.log(`Seeded ${userIds.length} users`);

    // Seed Projects
    const projects = [
      {
        name: "Website Redesign",
        client: "Tech Corp",
        description: "Complete overhaul of company website with modern UI/UX",
        status: "in-progress" as const,
        priority: "high" as const,
        startDate: new Date("2025-09-01").getTime(),
        endDate: new Date("2025-12-15").getTime(),
        progress: 65,
        budget: 45000,
        managerId: userIds[0], // Alice Admin is the manager
        teamIds: [userIds[0], userIds[1], userIds[2]],
      },
      {
        name: "Mobile App Development",
        client: "Retail Solutions Inc",
        description: "iOS and Android app for customer engagement",
        status: "in-progress" as const,
        priority: "urgent" as const,
        startDate: new Date("2025-08-15").getTime(),
        endDate: new Date("2026-01-30").getTime(),
        progress: 45,
        budget: 80000,
        managerId: userIds[1], // Mike Chen is the manager
        teamIds: [userIds[1]],
      },
      {
        name: "Brand Identity",
        client: "StartUp XYZ",
        description: "Create comprehensive brand guidelines and assets",
        status: "completed" as const,
        priority: "medium" as const,
        startDate: new Date("2025-06-01").getTime(),
        endDate: new Date("2025-08-30").getTime(),
        progress: 100,
        budget: 25000,
        managerId: userIds[2], // Emma Wilson is the manager
        teamIds: [userIds[0]],
      },
      {
        name: "E-commerce Platform",
        client: "Fashion Outlet",
        description: "Full-stack e-commerce solution with payment integration",
        status: "planning" as const,
        priority: "high" as const,
        startDate: new Date("2026-01-15").getTime(),
        endDate: new Date("2026-06-30").getTime(),
        progress: 10,
        budget: 120000,
        managerId: userIds[1], // Mike Chen is the manager
        teamIds: [userIds[1]],
      },
      {
        name: "Marketing Campaign",
        client: "Local Business",
        description: "Q1 2026 digital marketing campaign across all channels",
        status: "planning" as const,
        priority: "low" as const,
        startDate: new Date("2025-11-01").getTime(),
        endDate: new Date("2026-02-28").getTime(),
        progress: 20,
        budget: 30000,
        managerId: userIds[0], // Alice Admin is the manager
        teamIds: [],
      },
      {
        name: "Internal CRM System",
        client: "UpCraft Crew",
        description: "Custom CRM for tracking clients and projects",
        status: "in-progress" as const,
        priority: "medium" as const,
        startDate: new Date("2025-09-15").getTime(),
        endDate: new Date("2025-11-30").getTime(),
        progress: 55,
        budget: 55000,
        managerId: userIds[1], // Mike Chen is the manager
        teamIds: [userIds[1], userIds[2]],
      },
    ];

    const projectIds = await Promise.all(
      projects.map((project) => ctx.db.insert("projects", project)),
    );

    console.log(`Seeded ${projectIds.length} projects`);

    // Update users with project IDs
    await ctx.db.patch(userIds[0], {
      projectIds: [projectIds[0], projectIds[2]],
    });
    await ctx.db.patch(userIds[1], {
      projectIds: [projectIds[0], projectIds[1], projectIds[3], projectIds[5]],
    });
    await ctx.db.patch(userIds[2], {
      projectIds: [projectIds[0], projectIds[5]],
    });

    // Seed Transactions
    const transactions = [
      {
        description: "Final milestone payment from Tech Corp",
        amount: 15000,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
        clientId: "Tech Corp",
        projectId: projectIds[0],
      },
      {
        description: "First phase payment",
        amount: 25000,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-09-28").getTime(),
        clientId: "Retail Solutions Inc",
        projectId: projectIds[1],
      },
      {
        description: "Monthly payroll for all team members",
        amount: 45000,
        type: "expense" as const,
        category: "salary",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
      {
        description: "Annual subscription renewal",
        amount: 599,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-03").getTime(),
      },
      {
        description: "Monthly cloud infrastructure costs",
        amount: 1250,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-05").getTime(),
      },
      {
        description: "Initial deposit for new project",
        amount: 30000,
        type: "income" as const,
        category: "project-payment",
        status: "pending" as const,
        date: new Date("2025-10-15").getTime(),
        clientId: "Fashion Outlet",
        projectId: projectIds[3],
      },
      {
        description: "Monthly office space rental",
        amount: 3500,
        type: "expense" as const,
        category: "office",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
      {
        description: "Q4 digital marketing budget",
        amount: 2500,
        type: "expense" as const,
        category: "marketing",
        status: "completed" as const,
        date: new Date("2025-10-02").getTime(),
      },
      {
        description: "Equipment for new developer",
        amount: 3200,
        type: "expense" as const,
        category: "equipment",
        status: "completed" as const,
        date: new Date("2025-09-25").getTime(),
      },
      {
        description: "Final payment for branding project",
        amount: 8500,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-09-20").getTime(),
        clientId: "StartUp XYZ",
        projectId: projectIds[2],
      },
      {
        description: "External UX consultant for mobile app",
        amount: 4500,
        type: "expense" as const,
        category: "consultant",
        status: "pending" as const,
        date: new Date("2025-10-10").getTime(),
        projectId: projectIds[1],
      },
      {
        description: "Design tool subscription",
        amount: 450,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-04").getTime(),
      },
      {
        description: "First milestone for internal project",
        amount: 12000,
        type: "income" as const,
        category: "project-payment",
        status: "pending" as const,
        date: new Date("2025-10-20").getTime(),
        projectId: projectIds[5],
      },
      {
        description: "Team tickets for tech conference",
        amount: 1800,
        type: "expense" as const,
        category: "other",
        status: "completed" as const,
        date: new Date("2025-09-30").getTime(),
      },
      {
        description: "Development platform subscription",
        amount: 210,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
    ];

    const transactionIds = await Promise.all(
      transactions.map((transaction) => ctx.db.insert("transactions", transaction)),
    );

    console.log(`Seeded ${transactionIds.length} transactions`);

    // Seed Events
    const events = [
      {
        title: "Team Standup",
        description: "Daily standup meeting with engineering team",
        type: "meeting",
        startTime: new Date("2025-10-06T09:00:00").getTime(),
        endTime: new Date("2025-10-06T09:30:00").getTime(),
        location: "Zoom - Meeting Room 1",
        attendeeIds: [userIds[1]],
        priority: "medium" as const,
      },
      {
        title: "Client Presentation",
        description: "Present Q4 progress to Tech Corp client",
        type: "meeting",
        startTime: new Date("2025-10-06T14:00:00").getTime(),
        endTime: new Date("2025-10-06T15:30:00").getTime(),
        location: "Conference Room A",
        attendeeIds: [userIds[0], userIds[2]],
        projectId: projectIds[0],
        priority: "high" as const,
      },
      {
        title: "Website Redesign Deadline",
        description: "Final delivery date for website redesign project",
        type: "deadline",
        startTime: new Date("2025-10-15T00:00:00").getTime(),
        endTime: new Date("2025-10-15T23:59:59").getTime(),
        attendeeIds: [],
        projectId: projectIds[0],
        priority: "high" as const,
      },
      {
        title: "Design Review",
        description: "Review mobile app designs with team",
        type: "task",
        startTime: new Date("2025-10-07T10:00:00").getTime(),
        endTime: new Date("2025-10-07T11:30:00").getTime(),
        attendeeIds: [userIds[1]],
        projectId: projectIds[1],
        priority: "medium" as const,
      },
      {
        title: "Sprint Planning",
        description: "Plan sprint for next 2 weeks",
        type: "meeting",
        startTime: new Date("2025-10-08T13:00:00").getTime(),
        endTime: new Date("2025-10-08T15:00:00").getTime(),
        location: "Office - Room 3",
        attendeeIds: [userIds[2], userIds[1]],
        priority: "high" as const,
      },
      {
        title: "Code Review Session",
        description: "Review PRs from the week",
        type: "task",
        startTime: new Date("2025-10-09T11:00:00").getTime(),
        endTime: new Date("2025-10-09T12:00:00").getTime(),
        attendeeIds: [userIds[1]],
        projectId: projectIds[5],
        priority: "low" as const,
      },
      {
        title: "Q4 Strategy Meeting",
        description: "Quarterly business review and planning",
        type: "meeting",
        startTime: new Date("2025-10-10T10:00:00").getTime(),
        endTime: new Date("2025-10-10T12:00:00").getTime(),
        location: "Board Room",
        attendeeIds: [userIds[0], userIds[1], userIds[2]],
        priority: "high" as const,
      },
      {
        title: "Team Lunch",
        description: "Monthly team building lunch",
        type: "reminder",
        startTime: new Date("2025-10-11T12:30:00").getTime(),
        endTime: new Date("2025-10-11T14:00:00").getTime(),
        location: "Italian Restaurant",
        attendeeIds: [],
        priority: "low" as const,
      },
      {
        title: "Mobile App Beta Launch",
        description: "Release beta version to test users",
        type: "milestone",
        startTime: new Date("2025-10-20T00:00:00").getTime(),
        endTime: new Date("2025-10-20T23:59:59").getTime(),
        attendeeIds: [],
        projectId: projectIds[1],
        priority: "high" as const,
      },
      {
        title: "1-on-1 with Team Leads",
        description: "Individual check-ins with team leads",
        type: "meeting",
        startTime: new Date("2025-10-12T09:00:00").getTime(),
        endTime: new Date("2025-10-12T11:00:00").getTime(),
        location: "Office",
        attendeeIds: [userIds[0]],
        priority: "medium" as const,
      },
    ];

    const eventIds = await Promise.all(events.map((event) => ctx.db.insert("events", event)));

    console.log(`Seeded ${eventIds.length} events`);

    console.log("Database seed completed successfully!");

    return {
      success: true,
      message: "Database seeded successfully",
      stats: {
        users: userIds.length,
        projects: projectIds.length,
        transactions: transactionIds.length,
        events: eventIds.length,
      },
    };
  },
});
