"use client";

import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState, useMemo, useEffect } from "react";
import { CategoryBreakdown } from "./_components/category-breakdown";
import { FinancialSummaryCards } from "./_components/financial-summary-cards";
import { QuickStats } from "./_components/quick-stats";
import { TransactionFilters } from "./_components/transaction-filters";
import { TransactionRow } from "./_components/transaction-row";
import { TransactionType, TransactionCategory, Transaction } from "@/types/finance";
import { AlertCircleIcon, DownloadIcon, PlusIcon } from "lucide-react";

export default function FinancePage() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Ensure user exists in Convex before making queries
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  useEffect(() => {
    ensureCurrentUser().catch((error) => {
      // Silently handle errors - user might already exist or not be authenticated
      console.error("Failed to ensure user exists:", error);
    });
  }, [ensureCurrentUser]);

  // Fetch data from Convex
  const transactions = useQuery(api.finance.getTransactions);
  const financialSummary = useQuery(api.finance.getFinancialSummary);

  // Calculate financial summary for the UI format
  const summary = useMemo(() => {
    if (!financialSummary) return null;

    return {
      totalIncome: financialSummary.totalIncome,
      totalExpenses: financialSummary.totalExpense,
      netProfit: financialSummary.balance,
      pendingIncome: financialSummary.pendingIncome,
      pendingExpenses: financialSummary.pendingExpense,
    };
  }, [financialSummary]);

  // Transform transactions from Convex format to UI format
  const transformedTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.map((t) => ({
      id: t._id,
      title: t.description,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category as TransactionCategory,
      status: t.status as "pending" | "completed",
      date: new Date(t.date).toISOString(),
      projectId: t.projectId,
      projectName: "project" in t ? t.project?.name : undefined,
      client: t.clientId,
    }));
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transformedTransactions.filter((transaction) => {
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

      return matchesType && matchesCategory && matchesStatus;
    });
  }, [transformedTransactions, typeFilter, categoryFilter, statusFilter]);

  // Loading state
  if (transactions === undefined || financialSummary === undefined) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-base-content/60 text-sm mt-1">
              Track income, expenses, and financial performance
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (!transactions || !summary) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-base-content/60 text-sm mt-1">
              Track income, expenses, and financial performance
            </p>
          </div>
        </div>
        <div className="alert alert-error">
          <AlertCircleIcon className="h-5 w-5" />
          <span>Failed to load financial data. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Track income, expenses, and financial performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="btn btn-ghost gap-2">
            <DownloadIcon className="h-5 w-5" />
            Export
          </Button>
          <Button
            className="btn btn-primary gap-2"
            onClick={() => {
              setSelectedTransaction(null);
              setIsFormOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <FinancialSummaryCards
        summary={summary}
        totalTransactions={financialSummary.transactionCount}
        pendingTransactions={transformedTransactions.filter((t) => t.status === "pending").length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transactions Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <TransactionFilters
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onTypeFilterChange={setTypeFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Transactions Table */}
          <div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Client/Project</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <span className="text-base-content/60">No transactions found</span>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onEdit={(t) => {
                        setSelectedTransaction(t);
                        setIsFormOpen(true);
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category Breakdown */}
          <CategoryBreakdown transactions={transformedTransactions} />

          {/* Quick Stats */}
          <QuickStats transactions={transformedTransactions} />
        </div>
      </div>

      {/* Transaction Form Modal */}
      {/* TODO: Implement TransactionForm component */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedTransaction ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-base-content/60 mb-4">
              Transaction form component not yet implemented
            </p>
            <button className="btn btn-primary" onClick={() => setIsFormOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
