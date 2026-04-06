import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .searchIndex("search_name", { searchField: "name" })
    .index("by_name", ["name"])
    .index("by_created_at", ["createdAt"]),

  users: defineTable({
    // Clerk authentication
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),

    // Profile information
    phone: v.optional(v.string()),
    age: v.optional(v.number()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        twitter: v.optional(v.string()),
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
      }),
    ),

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
    client: v.optional(v.string()), // Legacy, prefer clientId
    clientId: v.optional(v.id("clients")),
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
    managerId: v.id("users"), // Project manager/owner
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
    budgetId: v.optional(v.id("budgets")), // Reference to the budget this project was created from
  })
    .searchIndex("search_name", { searchField: "name" })
    .index("by_manager", ["managerId"])
    .index("by_clientId", ["clientId"]),

  transactions: defineTable({
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    currency: v.optional(v.string()),
    date: v.number(),
    clientId: v.optional(v.string()), // Legacy client name
    clientIdRef: v.optional(v.id("clients")), // Reference to clients table
    projectId: v.optional(v.id("projects")),
    imageUrl: v.optional(v.string()),
  })
    .index("by_date", ["date"])
    .index("by_project", ["projectId"])
    .index("by_clientIdRef", ["clientIdRef"]),

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
    // Type: "budget" (simple) or "proposal" (full with PDF)
    type: v.optional(v.union(v.literal("budget"), v.literal("proposal"))),

    // Basic info
    title: v.string(),
    client: v.optional(v.string()), // Legacy, prefer clientId
    clientId: v.optional(v.id("clients")),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
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
    .searchIndex("search_title", { searchField: "title", filterFields: ["type"] })
    .index("by_status", ["status"])
    .index("by_client", ["client"])
    .index("by_clientId", ["clientId"])
    .index("by_created_at", ["createdAt"])
    .index("by_type", ["type"]),

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
    assignedTo: v.optional(v.id("users")), // @deprecated - usar assignedToIds
    assignedToIds: v.optional(v.array(v.id("users"))),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    imageUrl: v.optional(v.string()), // @deprecated - usar imageUrls
    imageUrls: v.optional(v.array(v.string())), // Imagens/anexos da tarefa
    createdAt: v.number(),
    updatedAt: v.number(),
    isPrivate: v.optional(v.boolean()),
    ownerId: v.optional(v.id("users")),
    labelIds: v.optional(v.array(v.id("taskLabels"))),
    clientId: v.optional(v.id("clients")),
    isArchived: v.optional(v.boolean()),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_project", ["projectId"])
    .index("by_created_at", ["createdAt"])
    .index("by_owner", ["ownerId"])
    .index("by_client", ["clientId"]),

  // Subtasks for tasks (checklist items)
  subtasks: defineTable({
    taskId: v.id("tasks"),
    title: v.string(),
    completed: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_task_order", ["taskId", "order"]),

  // Comments on tasks
  taskComments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_task_created", ["taskId", "createdAt"]),

  // Reusable labels for tasks
  taskLabels: defineTable({
    name: v.string(),
    color: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  // Connected email accounts for unified inbox (supports N accounts per provider)
  emailAccounts: defineTable({
    userId: v.id("users"),
    provider: v.union(v.literal("gmail"), v.literal("outlook")),
    email: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    tokenExpiry: v.number(),
    isActive: v.boolean(),
    connectedAt: v.number(),
    lastSyncAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_email", ["userId", "email"]),

  // Favorited sender addresses (all emails from these addresses appear in Favorites)
  emailFavorites: defineTable({
    userId: v.id("users"),
    emailAddress: v.string(),
    displayName: v.optional(v.string()),
    favoritedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_address", ["userId", "emailAddress"]),
});
