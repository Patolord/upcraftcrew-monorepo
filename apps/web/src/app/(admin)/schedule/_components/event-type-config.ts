import type { EventType } from "@/types/schedule";

export const eventTypeConfig: Record<EventType, { label: string; icon: string; color: string }> = {
  meeting: {
    label: "Meeting",
    icon: "VideoIcon",
    color: "badge-primary",
  },
  deadline: {
    label: "Deadline",
    icon: "FlagIcon",
    color: "badge-error",
  },
  task: {
    label: "Task",
    icon: "CheckCircleIcon",
    color: "badge-success",
  },
  reminder: {
    label: "Reminder",
    icon: "BellIcon",
    color: "badge-warning",
  },
  milestone: {
    label: "Milestone",
    icon: "TargetIcon",
    color: "badge-secondary",
  },
};
