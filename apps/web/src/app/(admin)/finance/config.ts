import type { TransactionCategory } from "@/types/finance";

export const categoryConfig: Record<TransactionCategory, { label: string; icon: string }> = {
  "project-payment": { label: "Project Payment", icon: "lucide--briefcase" },
  salary: { label: "Salary", icon: "lucide--user" },
  subscription: { label: "Subscription", icon: "lucide--repeat" },
  equipment: { label: "Equipment", icon: "lucide--monitor" },
  marketing: { label: "Marketing", icon: "lucide--megaphone" },
  office: { label: "Office", icon: "lucide--building" },
  software: { label: "Software", icon: "lucide--code" },
  consultant: { label: "Consultant", icon: "lucide--user-check" },
  other: { label: "Other", icon: "lucide--more-horizontal" },
};

export const statusConfig = {
  completed: { label: "Completed", color: "badge-success" },
  pending: { label: "Pending", color: "badge-warning" },
};
