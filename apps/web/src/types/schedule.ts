export type EventType = "meeting" | "deadline" | "task" | "reminder" | "milestone";

export type EventPriority = "low" | "medium" | "high";

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
  attendees?: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  projectId?: string;
  projectName?: string;
  color?: string;
  completed?: boolean;
};
