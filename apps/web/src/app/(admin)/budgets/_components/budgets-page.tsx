"use client";

import { useState, useEffect } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryState } from "nuqs";
import { BudgetSlideOver } from "./budget-slide-over";
import { BudgetFormModal } from "./budget-new/budget-form-modal";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { BudgetHeader } from "./budget-header";
import { BudgetDashboard } from "./budget-dashboard";
import React from "react";

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

export function BudgetsPage({ preloadedBudgets, preloadedStats }: BudgetsPageProps) {
  const budgets = usePreloadedQuery(preloadedBudgets) as Budget[];
  const stats = usePreloadedQuery(preloadedStats) as BudgetStats;

  const [newBudget, setNewBudget] = useQueryState("new");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    budgetId: Id<"budgets"> | null;
    title: string;
  }>({ budgetId: null, title: "" });

  // Sync query string with modal state
  useEffect(() => {
    if (newBudget === "true" && !isModalOpen) {
      setIsModalOpen(true);
      setSelectedBudget(null);
    } else if (newBudget === null && isModalOpen && !selectedBudget) {
      setIsModalOpen(false);
    }
  }, [newBudget, isModalOpen, selectedBudget]);

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsViewOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBudget(null);
    setNewBudget(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedBudget(null);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
  };

  const handleNewBudget = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
    setNewBudget("true");
  };

  return (
    <div className="p-6 space-y-6">
      <BudgetHeader onNewBudget={handleNewBudget} />
      <BudgetDashboard budgets={budgets} stats={stats} />

      {/* Modal for Create/Edit */}
      <BudgetFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedBudget || undefined}
        onSuccess={handleFormSuccess}
      />

      {/* Slide Over for View */}
      <BudgetSlideOver isOpen={isViewOpen} onClose={handleCloseView} title="Visualizar Orçamento">
        {selectedBudget && (
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
                <div className="border border-base-300 rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBudget.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: selectedBudget.currency,
                            }).format(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: selectedBudget.currency,
                            }).format(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
              <Button variant="outline" onClick={handleCloseView}>
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
