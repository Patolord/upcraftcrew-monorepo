"use client";

import { useState, useMemo } from "react";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  EyeIcon,
  FileDownIcon,
  PencilIcon,
  Trash2Icon,
  AlertCircleIcon,
  FileEditIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SendIcon,
  FileTextIcon,
} from "lucide-react";
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
  draft: { label: "Rascunho", color: "badge-ghost", icon: "FileEditIcon" },
  sent: { label: "Enviado", color: "badge-info", icon: "SendIcon" },
  approved: { label: "Aprovado", color: "badge-success", icon: "CheckCircleIcon" },
  rejected: { label: "Rejeitado", color: "badge-error", icon: "XCircleIcon" },
  expired: { label: "Expirado", color: "badge-warning", icon: "ClockIcon" },
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
          <SearchIcon className="absolute left-3 text-orange-500 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/60" />
          <Input
            className="pl-9 text-orange-500 border border-orange-500 rounded-md"
            placeholder="Buscar orçamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full text-sm sm:w-48 pl-2 border border-orange-500 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">Status</option>
          <option value="draft">Rascunho</option>
          <option value="sent">Enviado</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
          <option value="expired">Expirado</option>
        </select>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            className="join-item border border-orange-500 bg-white hover:shadow-lg rounded-md"
            onClick={() => setViewMode("table")}
          >
            <ListIcon className="text-orange-500 h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            className="join-item border border-orange-500 bg-white hover:shadow-lg rounded-md"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGridIcon className="text-orange-500  h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredBudgets.length === 0 ? (
        <div className="text-center py-12 border border-base-300 rounded-lg">
          <FileTextIcon className="h-16 w-16 text-base-content/20 mx-auto block mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
          <p className="text-base-content/60 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Tente ajustar os filtros"
              : "Crie seu primeiro orçamento para começar"}
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="overflow-x-auto bg-base-100 rounded-lg border border-orange-500 p-2 pl-8">
          <div className=" flex-col gap-2 grid grid-cols-7">
            <div>
              Orçamento
              <p className="font-medium">{filteredBudgets.map((budget) => budget.title)}</p>
              <p className="text-xs text-base-content/60 line-clamp-1">
                {filteredBudgets.map((budget) => budget.description)}
              </p>
            </div>
            <div>
              Cliente
              <div>{filteredBudgets.map((budget) => budget.client)}</div>
            </div>
            <div>
              Valor
              <div className="font-semibold">
                {filteredBudgets.map((budget) =>
                  formatCurrency(budget.totalAmount, budget.currency),
                )}
              </div>
            </div>
            <div>
              Status
              <div>{filteredBudgets.map((budget) => statusConfig[budget.status].label)}</div>
            </div>
            <div>
              Validade
              <div>
                {filteredBudgets.map((budget) =>
                  new Date(budget.validUntil).toLocaleDateString("pt-BR"),
                )}
              </div>
            </div>
            <div>
              Criado Em
              <div>
                {filteredBudgets.map((budget) =>
                  new Date(budget.createdAt).toLocaleDateString("pt-BR"),
                )}
              </div>
            </div>
            <div>
              Ações
              <div>
                {filteredBudgets.map((budget) => (
                  <div key={budget._id}>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-4"
                        onClick={() => onView(budget)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-4"
                        onClick={() => handleDownloadPDF(budget._id)}
                      >
                        <FileDownIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-4"
                        onClick={() => onEdit(budget)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-4 text-error"
                        onClick={() => onDelete(budget._id, budget.title)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
