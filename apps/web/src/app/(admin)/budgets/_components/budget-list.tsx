"use client";

import { useState, useMemo } from "react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List, Eye, FileDown, Pencil, Trash2, AlertCircle } from "lucide-react";
import { BudgetCard } from "./budget-card";

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

interface BudgetListProps {
  budgets: Budget[];
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

type StatusFilter = "all" | Budget["status"];

function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function BudgetList({ budgets, onView, onEdit, onDelete }: BudgetListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Filter budgets
  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const matchesSearch =
        budget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || budget.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [budgets, searchQuery, statusFilter]);

  const handleDownloadPDF = (budgetId: Id<"budgets">) => {
    window.open(`/budgets/${budgetId}/pdf`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/60" />
          <Input
            className="pl-9"
            placeholder="Buscar orçamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="sent">Enviado</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
          <option value="expired">Expirado</option>
        </select>
        <div className="join">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            className="join-item"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            className="join-item"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredBudgets.length === 0 ? (
        <div className="text-center py-12 border border-base-300 rounded-lg">
          <span className="iconify lucide--file-text size-16 text-base-content/20 mx-auto block mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
          <p className="text-base-content/60 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Tente ajustar os filtros"
              : "Crie seu primeiro orçamento para começar"}
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Orçamento</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Válido Até</th>
                <th>Criado Em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.map((budget) => {
                const isExpiringSoon =
                  budget.status === "sent" &&
                  budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;
                const statusInfo = statusConfig[budget.status];

                return (
                  <tr key={budget._id} className="hover">
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`iconify ${statusInfo.icon} size-5 text-base-content/60`}
                        />
                        <div>
                          <p className="font-medium">{budget.title}</p>
                          <p className="text-xs text-base-content/60 line-clamp-1">
                            {budget.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{budget.client}</td>
                    <td className="font-semibold">
                      {formatCurrency(budget.totalAmount, budget.currency)}
                    </td>
                    <td>
                      <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {isExpiringSoon && <AlertCircle className="h-4 w-4 text-warning" />}
                        <span className={isExpiringSoon ? "text-warning font-medium" : ""}>
                          {new Date(budget.validUntil).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(budget.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(budget)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownloadPDF(budget._id)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(budget)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-error"
                          onClick={() => onDelete(budget._id, budget.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredBudgets.length > 0 && (
        <div className="text-center text-sm text-base-content/60">
          Mostrando {filteredBudgets.length} de {budgets.length} orçamentos
        </div>
      )}
    </div>
  );
}
