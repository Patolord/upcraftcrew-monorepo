"use client";

import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryBreakdown } from "./_components/category-breakdown";
import { FinancialSummaryCards } from "./_components/financial-summary-cards";
import { QuickStats } from "./_components/quick-stats";
import { TransactionFilters } from "./_components/transaction-filters";
import { TransactionRow } from "./_components/transaction-row";
import {
  TransactionType,
  TransactionCategory,
  Transaction,
  FinancialSummary,
} from "@/types/finance";
import { AlertCircleIcon, DownloadIcon, PlusIcon } from "lucide-react";
import { FinanceHeader } from "./_components/finance-header";

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

  // Show loading state while data is being fetched
  if (!summary || !financialSummary) {
    return (
      <div className="p-6 space-y-6">
        <FinanceHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4 text-base-content/60">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <FinanceHeader />

      {/* Financial Summary Cards */}
      <FinancialSummaryCards
        summary={summary}
        totalTransactions={financialSummary.transactionCount || 0}
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
          <div className="bg-base-100 rounded-box border border-base-300">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Client/Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <span className="text-base-content/60">No transactions found</span>
                    </TableCell>
                  </TableRow>
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
              </TableBody>
            </Table>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-base-100 p-6 rounded-lg max-w-2xl w-full mx-4 pointer-events-auto">
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
