import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    role: v.union(v.literal("user"), v.literal("admin")),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
    hasActiveYearAccess: v.boolean(),
    paid: v.boolean(),
    paymentDate: v.optional(v.number()),
    paymentId: v.optional(v.string()),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    testeId: v.optional(v.string()),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_hasActiveYearAccess", ["hasActiveYearAccess"]),

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
    budget: v.object({
      total: v.number(),
      spent: v.number(),
      remaining: v.number(),
    }),
    teamIds: v.array(v.id("users")),
    tags: v.array(v.string()),
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
    tags: v.array(v.string()),
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
