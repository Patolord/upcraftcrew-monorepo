import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk authentication
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),

    // Team member info
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    department: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),

    // Status tracking
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away"),
      v.literal("busy"),
    ),
    joinedAt: v.number(),
    lastActive: v.number(),

    // Projects relationship
    projectIds: v.array(v.id("projects")),

    // Onboarding
    onboardingCompleted: v.boolean(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_department", ["department"])
    .index("by_status", ["status"]),

  projects: defineTable({
    name: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(v.literal("planning"), v.literal("in-progress"), v.literal("completed")),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    startDate: v.number(),
    endDate: v.number(),
    progress: v.number(),
    budget: v.number(),
    teamIds: v.array(v.id("users")),
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
  }),

  transactions: defineTable({
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    date: v.number(),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  })
    .index("by_date", ["date"])
    .index("by_project", ["projectId"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendeeIds: v.array(v.id("users")),
    projectId: v.optional(v.id("projects")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  })
    .index("by_start_time", ["startTime"])
    .index("by_project", ["projectId"]),

  budgets: defineTable({
    // Basic info
    title: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("expired"),
    ),

    // Objectives for the proposal
    objectives: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
        }),
      ),
    ),

    // Scope options (multiple pricing tiers)
    scopeOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          features: v.array(v.string()),
          value: v.optional(v.number()),
          isSelected: v.boolean(),
        }),
      ),
    ),

    // Extra services/items
    extras: v.optional(
      v.array(
        v.object({
          description: v.string(),
          value: v.number(),
          recurrence: v.optional(v.string()),
        }),
      ),
    ),

    // Payment and delivery terms
    paymentTerms: v.optional(v.array(v.string())),
    deliveryDeadline: v.optional(v.string()),

    // Investment items (legacy support)
    totalAmount: v.number(),
    currency: v.string(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      }),
    ),

    // Dates and metadata
    validUntil: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    projectId: v.optional(v.id("projects")),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_client", ["client"])
    .index("by_created_at", ["createdAt"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    isPrivate: v.optional(v.boolean()),
    ownerId: v.optional(v.id("users")),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_project", ["projectId"])
    .index("by_created_at", ["createdAt"])
    .index("by_owner", ["ownerId"]),
});
