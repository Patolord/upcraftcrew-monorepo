"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { TransactionCategory } from "@/types/finance";
import { FinanceHeader } from "./finance-header";
import { PaymentMethodCard } from "./payment-method-card";
import { FinanceInvoices } from "./finance-invoices";
import { FinanceBilling } from "./finance-billing";
import { FinanceTransactions } from "./finance-transactions";
import { PaymentMethodsSection } from "./payment-methods-section";
import { NewTransactionModal } from "./new-transaction-modal";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface FinancePageProps {
  preloadedTransactions: Preloaded<typeof api.finance.getTransactions>;
  preloadedSummary: Preloaded<typeof api.finance.getFinancialSummary>;
}

export function FinancePage({ preloadedTransactions, preloadedSummary }: FinancePageProps) {
  const transactions = usePreloadedQuery(preloadedTransactions);
  const financialSummary = usePreloadedQuery(preloadedSummary);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
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
      client: t.clientId,
    }));
  }, [transactions]);

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transformedTransactions;

    const query = searchQuery.toLowerCase();
    return transformedTransactions.filter((transaction) => {
      return (
        transaction.description?.toLowerCase().includes(query) ||
        transaction.category?.toLowerCase().includes(query) ||
        transaction.projectName?.toLowerCase().includes(query) ||
        transaction.type?.toLowerCase().includes(query)
      );
    });
  }, [transformedTransactions, searchQuery]);

  // Show loading state while data is being fetched
  if (!financialSummary) {
    return (
      <div className="p-6 space-y-6">
        <FinanceHeader
          onNewTransaction={() => setIsNewTransactionModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
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
    <div className="p-6 space-y-6 `bg-gradient-to-br` from-orange-50/30 to-pink-50/30 dark:from-orange-950/10 dark:to-pink-950/10 min-h-screen">
      {/* Header */}
      <FinanceHeader
        onNewTransaction={() => setIsNewTransactionModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />

      {/* Payment Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PaymentMethodCard
          name="Salary"
          type="salary"
          amount={2000}
          description="Belong Interactive"
        />
        <PaymentMethodCard
          name="Paypal"
          type="paypal"
          amount={4000}
          description="Freelance payment"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invoices and Billing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoices Table */}
          <FinanceInvoices />

          {/* Billing Information */}
          <FinanceBilling />
        </div>

        {/* Right Column - Transactions and Payment Methods */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <FinanceTransactions transactions={filteredTransactions} />

          {/* Payment Methods */}
          <PaymentMethodsSection />
        </div>
      </div>
    </div>
  );
}
