"use client";

import { useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, FileText } from "lucide-react";
import { BudgetDashboard } from "./budget-dashboard";
import { BudgetList } from "./budget-list";
import { BudgetSlideOver } from "./budget-slide-over";
import { BudgetForm } from "./budget-form";
import { DeleteBudgetDialog } from "./delete-budget-dialog";

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

interface BudgetStats {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}

interface BudgetsPageProps {
  preloadedBudgets: Preloaded<typeof api.budgets.getBudgets>;
  preloadedStats: Preloaded<typeof api.budgets.getBudgetStats>;
}

type SlideOverMode = "create" | "edit" | "view" | null;

export function BudgetsPage({ preloadedBudgets, preloadedStats }: BudgetsPageProps) {
  const budgets = usePreloadedQuery(preloadedBudgets) as Budget[];
  const stats = usePreloadedQuery(preloadedStats) as BudgetStats;

  const [activeTab, setActiveTab] = useState<"dashboard" | "all">("dashboard");
  const [slideOverMode, setSlideOverMode] = useState<SlideOverMode>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    budgetId: Id<"budgets"> | null;
    title: string;
  }>({ budgetId: null, title: "" });

  const handleCreateNew = () => {
    setSelectedBudget(null);
    setSlideOverMode("create");
  };

  const handleView = (budget: Budget) => {
    setSelectedBudget(budget);
    setSlideOverMode("view");
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setSlideOverMode("edit");
  };

  const handleDelete = (budgetId: Id<"budgets">, title: string) => {
    setDeleteDialog({ budgetId, title });
  };

  const handleCloseSlideOver = () => {
    setSlideOverMode(null);
    setSelectedBudget(null);
  };

  const handleFormSuccess = () => {
    handleCloseSlideOver();
  };

  const getSlideOverTitle = () => {
    switch (slideOverMode) {
      case "create":
        return "Novo Orçamento";
      case "edit":
        return "Editar Orçamento";
      case "view":
        return "Visualizar Orçamento";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Gerencie propostas e orçamentos para clientes
          </p>
        </div>
        {activeTab === "all" && (
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Orçamento
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-fit">
        <button
          type="button"
          className={`tab gap-2 ${activeTab === "dashboard" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button
          type="button"
          className={`tab gap-2 ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <FileText className="h-4 w-4" />
          Todos os Orçamentos
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" ? (
        <BudgetDashboard budgets={budgets} stats={stats} />
      ) : (
        <BudgetList
          budgets={budgets}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Slide Over for Create/Edit/View */}
      <BudgetSlideOver
        isOpen={slideOverMode !== null}
        onClose={handleCloseSlideOver}
        title={getSlideOverTitle()}
      >
        {slideOverMode === "view" && selectedBudget ? (
          <div className="p-6 space-y-6">
            {/* View mode content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedBudget.title}</h3>
                <p className="text-sm text-base-content/60">Cliente: {selectedBudget.client}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-xs text-base-content/60 mb-1">Valor Total</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: selectedBudget.currency,
                    }).format(selectedBudget.totalAmount)}
                  </p>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-xs text-base-content/60 mb-1">Status</p>
                  <p className="text-xl font-bold capitalize">{selectedBudget.status}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-sm text-base-content/80">{selectedBudget.description}</p>
              </div>

              {/* Items table */}
              <div>
                <h4 className="font-semibold mb-2">Itens</h4>
                <div className="overflow-x-auto border border-base-300 rounded-lg">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th className="text-center">Qtd</th>
                        <th className="text-right">Unit.</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBudget.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: selectedBudget.currency,
                            }).format(item.unitPrice)}
                          </td>
                          <td className="text-right font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: selectedBudget.currency,
                            }).format(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedBudget.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Observações</h4>
                  <p className="text-sm text-base-content/80 whitespace-pre-wrap">
                    {selectedBudget.notes}
                  </p>
                </div>
              )}
            </div>

            {/* View mode actions */}
            <div className="flex items-center justify-between pt-4 border-t border-base-300">
              <Button variant="outline" onClick={handleCloseSlideOver}>
                Fechar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/budgets/${selectedBudget._id}/pdf`, "_blank")}
                >
                  Gerar PDF
                </Button>
                <Button onClick={() => handleEdit(selectedBudget)}>Editar</Button>
              </div>
            </div>
          </div>
        ) : (
          <BudgetForm
            initialData={slideOverMode === "edit" ? selectedBudget || undefined : undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSlideOver}
          />
        )}
      </BudgetSlideOver>

      {/* Delete Dialog */}
      <DeleteBudgetDialog
        isOpen={deleteDialog.budgetId !== null}
        onClose={() => setDeleteDialog({ budgetId: null, title: "" })}
        budgetId={deleteDialog.budgetId}
        budgetTitle={deleteDialog.title}
      />
    </div>
  );
}
