import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View, Text } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { DashboardRecentProjects } from "./_components/dashboard-recent-projects";
import { DashboardTeamOverview } from "./_components/dashboard-team-overview";
import { DashboardTransactions } from "./_components/dashboard-transactions";

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const transactions = useQuery(api.finance.getTransactions);

  const onRefresh = async () => {
    setRefreshing(true);
    // Convex will auto-refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate overview stats
  const stats = useMemo(() => {
    if (!projects || !teamMembers || !transactions) {
      return {
        activeProjects: 0,
        activeMembers: 0,
        totalRevenue: 0,
        netProfit: 0,
        avgProgress: 0,
      };
    }

    const activeProjects = projects.filter((p) => p.status === "in-progress").length;
    const activeMembers = teamMembers.filter((m) => m.status === "online").length;

    const completedTransactions = transactions.filter((t) => t.status === "completed");
    const totalRevenue = completedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = completedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const avgProgress =
      projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

    return {
      activeProjects,
      activeMembers,
      totalRevenue,
      netProfit: totalRevenue - totalExpenses,
      avgProgress,
    };
  }, [projects, teamMembers, transactions]);

  // Loading state
  if (projects === undefined || teamMembers === undefined || transactions === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="flex-row items-center justify-between py-4">
            <Skeleton className="h-8 w-32" />
            <View className="flex-row items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </View>
          </View>

          {/* Stats skeleton */}
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-1 min-w-[45%]">
                <Skeleton className="h-20 rounded-xl" />
              </View>
            ))}
          </View>

          {/* Content skeleton */}
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff8e29" />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 space-y-4">
          {/* Header */}
          <DashboardHeader />

          {/* Stats Cards */}
          <DashboardStats
            stats={stats}
            totalProjects={projects.length}
            totalMembers={teamMembers.length}
          />

          {/* Recent Projects */}
          <DashboardRecentProjects projects={projects} />

          {/* Transactions */}
          <DashboardTransactions transactions={transactions} />

          {/* Team Overview */}
          <DashboardTeamOverview teamMembers={teamMembers} />
        </View>
      </ScrollView>
    </View>
  );
}
