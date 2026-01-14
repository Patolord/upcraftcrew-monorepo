import type { TransactionCategory } from "@/types/finance";

export const categoryConfig: Record<TransactionCategory, { label: string; icon: string }> = {
  "project-payment": { label: "Project Payment", icon: "BriefcaseIcon" },
  salary: { label: "Salary", icon: "UserIcon" },
  subscription: { label: "Subscription", icon: "RepeatIcon" },
  equipment: { label: "Equipment", icon: "MonitorIcon" },
  marketing: { label: "Marketing", icon: "MegaphoneIcon" },
  office: { label: "Office", icon: "BuildingIcon" },
  software: { label: "Software", icon: "CodeIcon" },
  consultant: { label: "Consultant", icon: "UserCheckIcon" },
  other: { label: "Other", icon: "MoreHorizontalIcon" },
};

export const statusConfig = {
  completed: { label: "Completed", color: "badge-success" },
  pending: { label: "Pending", color: "badge-warning" },
};
