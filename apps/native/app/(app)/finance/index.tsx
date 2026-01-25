import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewTransactionModal } from "@/components/modals/new-transaction-modal";

import { FinanceHeader } from "./_components/finance-header";
import { FinanceStats } from "./_components/finance-stats";
import { TransactionCard } from "./_components/finance-transaction-card";

export default function FinancePage() {
  const transactions = useQuery(api.finance.getTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    if (!transactions) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        pendingIncome: 0,
        pendingExpenses: 0,
      };
    }

    const completed = transactions.filter((t) => t.status === "completed");
    const pending = transactions.filter((t) => t.status === "pending");

    const totalIncome = completed
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = completed
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = pending
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpenses = pending
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      pendingIncome,
      pendingExpenses,
    };
  }, [transactions]);

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!searchQuery.trim()) return transactions;

    const query = searchQuery.toLowerCase();
    return transactions.filter((transaction) => {
      return (
        transaction.description?.toLowerCase().includes(query) ||
        transaction.category?.toLowerCase().includes(query) ||
        transaction.type?.toLowerCase().includes(query) ||
        transaction.status?.toLowerCase().includes(query)
      );
    });
  }, [transactions, searchQuery]);

  // Loading state
  if (transactions === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="space-y-4 pb-2">
            <View className="flex-row justify-between">
              <Skeleton className="h-8 w-24" />
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </View>
            </View>
            <Skeleton className="h-10 w-full rounded-full" />
          </View>

          {/* Stats skeleton */}
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-1 min-w-[45%]">
                <Skeleton className="h-20 rounded-xl" />
              </View>
            ))}
          </View>

          {/* Transactions skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 space-y-4">
          {/* Header */}
          <FinanceHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Stats */}
          <FinanceStats summary={financialSummary} totalTransactions={transactions.length} />

          {/* Section Header */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-lg font-semibold text-foreground">Transações</Text>
            <Button
              variant="default"
              size="sm"
              onPress={() => setIsNewTransactionModalOpen(true)}
              className="bg-brand"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-medium">Nova</Text>
              </View>
            </Button>
          </View>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon="cash-outline"
              title="Nenhuma transação encontrada"
              description={
                searchQuery ? "Tente ajustar sua busca" : "Adicione sua primeira transação"
              }
            />
          ) : (
            <View>
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  transaction={{
                    ...transaction,
                    project:
                      "project" in transaction ? (transaction.project ?? undefined) : undefined,
                  }}
                  onPress={() => {
                    // Open transaction detail
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />
    </View>
  );
}
