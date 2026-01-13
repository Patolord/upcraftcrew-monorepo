import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

export interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BudgetObjective {
  title: string;
  description: string;
}

export interface BudgetScopeOption {
  name: string;
  features: string[];
  value?: number;
  isSelected: boolean;
}

export interface BudgetExtra {
  description: string;
  value: number;
  recurrence?: string;
}

export interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  currency: string;
  items: BudgetItem[];
  validUntil: number;
  createdAt: number;
  updatedAt: number;
  projectId?: Id<"projects">;
  notes?: string;
  objectives?: BudgetObjective[];
  scopeOptions?: BudgetScopeOption[];
  extras?: BudgetExtra[];
  paymentTerms?: string[];
  deliveryDeadline?: string;
}

export interface PDFTemplateProps {
  budget: Budget;
}
