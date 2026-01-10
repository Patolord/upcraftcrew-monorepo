import type { EventType } from "@/types/schedule";

export const eventTypeConfig: Record<EventType, { label: string; icon: string; color: string }> = {
  meeting: {
    label: "Meeting",
    icon: "lucide--video",
    color: "badge-primary",
  },
  deadline: {
    label: "Deadline",
    icon: "lucide--flag",
    color: "badge-error",
  },
  task: {
    label: "Task",
    icon: "lucide--check-circle",
    color: "badge-success",
  },
  reminder: {
    label: "Reminder",
    icon: "lucide--bell",
    color: "badge-warning",
  },
  milestone: {
    label: "Milestone",
    icon: "lucide--target",
    color: "badge-secondary",
  },
};
