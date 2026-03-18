import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

import { ProfileHeader } from "./_components/profile-header";
import { ProfileUserCard } from "./_components/profile-user-card";
import { ProfileTasksCard } from "./_components/profile-tasks-card";
import { ProfileBudgetsCard } from "./_components/profile-budgets-card";
import { ProfileEventsCard } from "./_components/profile-events-card";
import { ProfileProjectsSection } from "./_components/profile-projects-section";

export default function ProfilePage() {
  const [refreshing, setRefreshing] = useState(false);

  const user = useQuery(api.users.current);
  const tasks = useQuery(api.users.getMyTasks);
  const budgets = useQuery(api.users.getMyBudgets);
  const events = useQuery(api.users.getMyUpcomingEvents);
  const projects = useQuery(api.users.getMyProjects);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const isLoading =
    user === undefined ||
    tasks === undefined ||
    budgets === undefined ||
    events === undefined ||
    projects === undefined;

  if (isLoading) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 gap-4">
          <View className="flex-row items-center justify-between py-4">
            <Skeleton className="h-8 w-24" />
            <View className="flex-row items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </View>
          </View>
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-admin-background pt-12 items-center justify-center">
        <Text className="text-muted-foreground">Nenhum dado disponível</Text>
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
        <View className="px-4 gap-4">
          <ProfileHeader />
          <ProfileUserCard user={user} />

          {/* Cards grid */}
          <ProfileTasksCard tasks={tasks ?? []} />
          <ProfileBudgetsCard budgets={budgets ?? []} />
          <ProfileEventsCard events={events ?? []} />

          {/* Projects */}
          <ProfileProjectsSection projects={projects ?? []} />
        </View>
      </ScrollView>
    </View>
  );
}
