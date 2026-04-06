"use client";

import { useState, useEffect, useMemo } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import { BudgetFormModal } from "./budget-new/budget-form-modal";
import { SimpleBudgetModal } from "./simple-budget-modal";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { BudgetHeader } from "./budget-header";
import { BudgetDashboard } from "./budget-dashboard";
import { BudgetCard } from "./budget-card";
import { PlusIcon, FileTextIcon, Loader2 } from "lucide-react";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

interface Budget {
  _id: Id<"budgets">;
  type?: "budget" | "proposal";
  title: string;
  client: string;
  description: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
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

export function BudgetsPage() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.budgets.getBudgetsPaginated,
    {},
    { initialNumItems: 6 },
  );
  const budgets = (results || []) as Budget[];

  const [newBudget, setNewBudget] = useQueryState("new");

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isSimpleBudgetModalOpen, setIsSimpleBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("BRL");
  const [deleteDialog, setDeleteDialog] = useState<{
    budgetId: Id<"budgets"> | null;
    title: string;
  }>({ budgetId: null, title: "" });

  // Aggregate-backed stats from the backend — stable regardless of pagination
  const aggregateStats = useQuery(api.budgets.getBudgetStatsByCurrency, { currency });

  const currencyBudgets = useMemo(() => {
    return budgets.filter((budget) => (budget.currency || "BRL") === currency);
  }, [budgets, currency]);

  const filteredBudgets = useMemo(() => {
    if (!searchQuery.trim()) return currencyBudgets;

    const query = searchQuery.toLowerCase();
    return currencyBudgets.filter((budget) => {
      return (
        budget.title?.toLowerCase().includes(query) ||
        budget.client?.toLowerCase().includes(query) ||
        budget.status?.toLowerCase().includes(query) ||
        budget.description?.toLowerCase().includes(query)
      );
    });
  }, [currencyBudgets, searchQuery]);

  // Sync query string with modal state (for proposal modal)
  useEffect(() => {
    if (newBudget === "proposal" && !isProposalModalOpen) {
      setIsProposalModalOpen(true);
      setSelectedBudget(null);
    } else if (newBudget === null && isProposalModalOpen && !selectedBudget) {
      setIsProposalModalOpen(false);
    }
  }, [newBudget, isProposalModalOpen, selectedBudget]);

  const handleCloseProposalModal = () => {
    setIsProposalModalOpen(false);
    setSelectedBudget(null);
    setNewBudget(null);
  };

  const handleCloseSimpleBudgetModal = () => {
    setIsSimpleBudgetModalOpen(false);
  };

  const handleProposalFormSuccess = () => {
    handleCloseProposalModal();
  };

  const handleSimpleBudgetSuccess = () => {
    handleCloseSimpleBudgetModal();
  };

  // Opens the full proposal modal (with PDF support)
  const handleNewProposal = () => {
    setSelectedBudget(null);
    setIsProposalModalOpen(true);
    setNewBudget("proposal");
  };

  // Opens the simple budget modal (no PDF)
  const handleNewSimpleBudget = () => {
    setIsSimpleBudgetModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      <BudgetHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <BudgetDashboard stats={aggregateStats ?? undefined} currency={currency} />

      {/* Our Budgets Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            Nossos Orçamentos
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            onClick={handleNewSimpleBudget}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md px-4 sm:px-6 text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
          <Button
            onClick={handleNewProposal}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 sm:px-6 text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Proposta
          </Button>
        </div>
      </div>

      {/* Budgets Grid */}
      {isLoading && results === undefined ? (
        <div className="flex items-center justify-center  p-4 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm p-4">
          <FileTextIcon className="h-16 w-16 text-brand mb-4 mx-auto" />
          <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? "Tente ajustar sua busca"
              : "Crie seu primeiro orçamento clicando no botão acima"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBudgets.map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
          </div>

          {/* Load More Button - only show when not filtering */}
          {!searchQuery && status === "CanLoadMore" && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => loadMore(3)}
                variant="outline"
                className="min-w-[150px]"
                disabled={status !== "CanLoadMore"}
              >
                Ver Mais
              </Button>
            </div>
          )}

          {!searchQuery && status === "LoadingMore" && (
            <div className="flex justify-center pt-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!searchQuery && status === "Exhausted" && budgets.length > 6 && (
            <div className="flex justify-center pt-4">
              <p className="text-sm text-muted-foreground">Todos os orçamentos foram carregados</p>
            </div>
          )}
        </>
      )}

      {/* Modal for Create/Edit Proposal (full budget with PDF) */}
      <BudgetFormModal
        isOpen={isProposalModalOpen}
        onClose={handleCloseProposalModal}
        initialData={selectedBudget || undefined}
        onSuccess={handleProposalFormSuccess}
      />

      {/* Modal for Simple Budget (no PDF) */}
      <SimpleBudgetModal
        isOpen={isSimpleBudgetModalOpen}
        onClose={handleCloseSimpleBudgetModal}
        onSuccess={handleSimpleBudgetSuccess}
      />

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
