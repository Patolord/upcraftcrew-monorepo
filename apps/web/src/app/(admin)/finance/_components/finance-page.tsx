"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { TransactionCategory } from "@/types/finance";
import { FinanceHeader } from "./finance-header";
import { FinanceStats } from "./finance-stats";
import { FinanceBalanceCard } from "./finance-balance-card";
import { FinanceTransfersCard } from "./finance-transfers-card";
import { FinanceCreditCard } from "./finance-credit-card";
import { FinanceSpentCard } from "./finance-spent-card";
import { NewTransactionModal } from "./new-transaction-modal";
import { TransactionsListModal } from "./transactions-list-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

interface FinancePageProps {
  preloadedTransactions: Preloaded<typeof api.finance.getTransactions>;
  preloadedSummary: Preloaded<typeof api.finance.getFinancialSummary>;
  preloadedYearlyExpenses: Preloaded<typeof api.finance.getYearlyExpensesByMonth>;
}

export function FinancePage({
  preloadedTransactions,
  preloadedSummary,
  preloadedYearlyExpenses,
}: FinancePageProps) {
  const transactions = usePreloadedQuery(preloadedTransactions);
  const financialSummary = usePreloadedQuery(preloadedSummary);
  const yearlyExpenses = usePreloadedQuery(preloadedYearlyExpenses);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isTransactionsListModalOpen, setIsTransactionsListModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      client: "client" in t ? t.client : t.clientId,
    }));
  }, [transactions]);

  // Show loading state while data is being fetched
  if (!financialSummary) {
    return (
      <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
        <FinanceHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 md:pl-12 md:pr-12 space-y-4 md:space-y-6">
      {/* Header */}
      <FinanceHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Stats Section */}
      <FinanceStats
        summary={{
          totalIncome: financialSummary.totalIncome,
          totalExpenses: financialSummary.totalExpense,
          netProfit: financialSummary.balance,
          pendingIncome: financialSummary.pendingIncome,
          pendingExpenses: financialSummary.pendingExpense,
        }}
        totalTransactions={transformedTransactions.length}
      />

      {/* Add Transaction Button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-3">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            All transactions
          </h2>
        </div>
        <Button
          onClick={() => setIsNewTransactionModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 sm:px-6 text-sm w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Dashboard Cards Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Balance Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          <FinanceBalanceCard
            totalIncome={financialSummary.totalIncome}
            netProfit={financialSummary.balance}
          />
        </div>
        {/* Transfers Card */}
        <div className="lg:col-span-1">
          <FinanceTransfersCard
            transactions={transactions}
            onViewAll={() => setIsTransactionsListModalOpen(true)}
          />
        </div>
        {/* Credit Balance Card */}
        <div className="lg:col-span-1">
          <FinanceCreditCard transactions={transactions} />
        </div>
        {/* Total Spent Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          <FinanceSpentCard
            totalSpent={financialSummary.totalExpense}
            monthlyData={yearlyExpenses?.monthlyData}
            averageMonthly={yearlyExpenses?.averageMonthly}
          />
        </div>
      </div>

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />

      {/* Transactions List Modal */}
      <TransactionsListModal
        isOpen={isTransactionsListModalOpen}
        onClose={() => setIsTransactionsListModalOpen(false)}
        transactions={transactions}
      />
    </div>
  );
}
