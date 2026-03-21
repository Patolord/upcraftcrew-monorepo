export type EventType = "meeting" | "deadline" | "task" | "reminder" | "milestone";

export type EventPriority = "low" | "medium" | "high";

export type SourceType =
  | "event"
  | "project"
  | "budget"
  | "transaction"
  | "task"
  | "google-calendar"
  | "outlook-calendar";

export type Attendee = {
  id: string;
  name: string;
  imageUrl: string;
};

export type ScheduleEvent = {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  priority: EventPriority;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  allDay?: boolean;
  location?: string;
  attendees?: Attendee[];
  projectId?: string;
  projectName?: string;
  color?: string;
  completed?: boolean;

  // New fields for unified schedule
  sourceType: SourceType;
  sourceId: string;

  // Responsible person (for projects/tasks)
  responsible?: Attendee | null;

  // Team members (for projects)
  team?: Attendee[];

  // Client info (for projects/budgets/transactions)
  client?: string | null;

  // Project-specific fields
  projectStatus?: "planning" | "in-progress" | "completed";
  projectProgress?: number;

  // Budget-specific fields
  budgetStatus?: "draft" | "sent" | "approved" | "rejected" | "expired";
  budgetAmount?: number;
  budgetCurrency?: string;

  // Transaction-specific fields
  transactionType?: "income" | "expense";
  transactionAmount?: number;
  transactionCategory?: string;
  transactionStatus?: "pending" | "completed" | "failed";

  // Task-specific fields
  taskStatus?: "todo" | "in-progress" | "review" | "done" | "blocked";

  // External calendar fields
  calendarProvider?: "gmail" | "outlook";
  calendarAccountEmail?: string;
  calendarEventLink?: string;
};
