"use client";

import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Pencil, Trash2 } from "lucide-react";

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
  draft: { label: "Rascunho", color: "badge-ghost", icon: "lucide--file-edit" },
  sent: { label: "Enviado", color: "badge-info", icon: "lucide--send" },
  approved: { label: "Aprovado", color: "badge-success", icon: "lucide--check-circle" },
  rejected: { label: "Rejeitado", color: "badge-error", icon: "lucide--x-circle" },
  expired: { label: "Expirado", color: "badge-warning", icon: "lucide--clock" },
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
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <span className={`iconify ${statusInfo.icon} size-6 text-base-content/60`} />
          <span className={`badge ${statusInfo.color} badge-sm`}>{statusInfo.label}</span>
        </div>

        {/* Title and client */}
        <h3 className="card-title text-base line-clamp-1">{budget.title}</h3>
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
        <div className="card-actions justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-error"
            onClick={() => onDelete(budget._id, budget.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(budget)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
