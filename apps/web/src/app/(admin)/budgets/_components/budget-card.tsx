"use client";

import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  FileDownIcon,
  PencilIcon,
  Trash2Icon,
  FileEditIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SendIcon,
} from "lucide-react";

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
  updatedAt: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  objectives?: Array<{
    title: string;
    description: string;
  }>;
  scopeOptions?: Array<{
    name: string;
    features: string[];
    value?: number;
    isSelected: boolean;
  }>;
  extras?: Array<{
    description: string;
    value: number;
    recurrence?: string;
  }>;
  paymentTerms?: string[];
  deliveryDeadline?: string;
  projectId?: Id<"projects">;
}

interface BudgetCardProps {
  budget: Budget;
  onView: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: Id<"budgets">, title: string) => void;
}

const statusConfig = {
  draft: { label: "Rascunho", color: "badge-ghost", icon: "FileEditIcon" },
  sent: { label: "Enviado", color: "badge-info", icon: "SendIcon" },
  approved: { label: "Aprovado", color: "badge-success", icon: "CheckCircleIcon" },
  rejected: { label: "Rejeitado", color: "badge-error", icon: "XCircleIcon" },
  expired: { label: "Expirado", color: "badge-warning", icon: "ClockIcon" },
};

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function BudgetCard({ budget, onView, onEdit, onDelete }: BudgetCardProps) {
  const statusInfo = statusConfig[budget.status];
  const isExpiringSoon =
    budget.status === "sent" && budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;

  const handleDownloadPDF = () => {
    window.open(`/budgets/${budget._id}/pdf`, "_blank");
  };

  return (
    <div className="card bg-base-100 border border-orange-500 rounded-md hover:shadow-lg hover:shadow-orange-500/50 p-8 transition-shadow">
      <div className="card-body">
        {/* Title and client */}
        <h3 className="card-title text-base pt-0 line-clamp-1">{budget.title}</h3>
        <p className="text-sm text-base-content/60">{budget.client}</p>
        <p className="text-xs text-base-content/60 line-clamp-2 mt-2">{budget.description}</p>

        <div className="divider my-2" />

        {/* Amount and validity */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60">Valor Total</p>
            <p className="text-lg font-bold">
              {formatCurrency(budget.totalAmount, budget.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-base-content/60">Válido até</p>
            <p className={`text-sm font-medium ${isExpiringSoon ? "text-warning" : ""}`}>
              {new Date(budget.validUntil).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions flex justify-end mt-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-error"
            onClick={() => onDelete(budget._id, budget.title)}
          >
            <Trash2Icon className="h-4 w-4 mr-1 text-orange-500" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onView(budget)}>
            <EyeIcon className="h-4 w-4 mr-1 text-orange-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
            <FileDownIcon className="h-4 w-4 mr-1 text-orange-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
            <PencilIcon className="h-4 w-4 mr-1 text-orange-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
