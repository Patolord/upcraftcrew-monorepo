import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewBudgetModal } from "@/components/modals/new-budget-modal";

import { BudgetHeader } from "./_components/budget-header";
import { BudgetStats } from "./_components/budget-stats";
import { BudgetCard } from "./_components/budget-card";

export default function BudgetsPage() {
  const budgets = useQuery(api.budgets.getBudgets);
  const statistics = useQuery(api.budgets.getBudgetStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

  // Filter budgets based on search query
  const filteredBudgets = useMemo(() => {
    if (!budgets) return [];
    if (!searchQuery.trim()) return budgets;

    const query = searchQuery.toLowerCase();
    return budgets.filter((budget) => {
      const title = "title" in budget ? budget.title : "";
      return (
        title?.toLowerCase().includes(query) ||
        budget.description?.toLowerCase().includes(query) ||
        budget.status?.toLowerCase().includes(query)
      );
    });
  }, [budgets, searchQuery]);

  // Default statistics
  const defaultStatistics = {
    total: 0,
    draft: 0,
    sent: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    totalValue: 0,
    approvedValue: 0,
    conversionRate: 0,
  };

  // Loading state
  if (budgets === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="space-y-4 pb-2">
            <View className="flex-row justify-between">
              <Skeleton className="h-8 w-28" />
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

          {/* Budget cards skeleton */}
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
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
          <BudgetHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Stats */}
          <BudgetStats statistics={statistics || defaultStatistics} />

          {/* Section Header */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-lg font-semibold text-foreground">Seus Orçamentos</Text>
            <Button
              variant="default"
              size="sm"
              onPress={() => setIsNewBudgetModalOpen(true)}
              className="bg-brand"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-medium">Novo</Text>
              </View>
            </Button>
          </View>

          {/* Budgets List */}
          {filteredBudgets.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="Nenhum orçamento encontrado"
              description={searchQuery ? "Tente ajustar sua busca" : "Crie seu primeiro orçamento"}
            />
          ) : (
            <View className="gap-4">
              {filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget._id}
                  budget={{
                    _id: budget._id,
                    title: budget.title,
                    client: budget.client,
                    description: budget.description,
                    status: budget.status,
                    totalAmount: budget.totalAmount,
                    validUntil: budget.validUntil,
                    createdAt: budget.createdAt,
                    project: "project" in budget ? budget.project : undefined,
                  }}
                  onPress={() => {
                    // Open budget detail
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
      />
    </View>
  );
}
