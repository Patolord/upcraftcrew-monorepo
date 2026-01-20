"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProfileHeader } from "./profile-header";
import { ProfileUserCard } from "./profile-user-card";
import { ProfileTasksCard } from "./profile-tasks-card";
import { ProfileBudgetsCard } from "./profile-budgets-card";
import { ProfileEventsCard } from "./profile-events-card";
import { ProfileProjectsSection } from "./profile-projects-section";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface ProfilePageProps {
  preloadedUser: Preloaded<typeof api.users.current>;
  preloadedTasks: Preloaded<typeof api.users.getMyTasks>;
  preloadedBudgets: Preloaded<typeof api.users.getMyBudgets>;
  preloadedEvents: Preloaded<typeof api.users.getMyUpcomingEvents>;
  preloadedProjects: Preloaded<typeof api.users.getMyProjects>;
}

export function ProfilePage({
  preloadedUser,
  preloadedTasks,
  preloadedBudgets,
  preloadedEvents,
  preloadedProjects,
}: ProfilePageProps) {
  const user = usePreloadedQuery(preloadedUser);
  const tasks = usePreloadedQuery(preloadedTasks);
  const budgets = usePreloadedQuery(preloadedBudgets);
  const events = usePreloadedQuery(preloadedEvents);
  const projects = usePreloadedQuery(preloadedProjects);

  if (!user) {
    return (
      <div className="p-6 space-y-6 bg-orange-50/30 min-h-screen">
        <ProfileHeader />
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">No user data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-orange-50/30 min-h-screen">
      <ProfileHeader />

      {/* User Profile Card */}
      <ProfileUserCard user={user} />

      {/* Three Cards Grid: Tasks, Budgets, Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProfileTasksCard tasks={tasks} />
        <ProfileBudgetsCard budgets={budgets} />
        <ProfileEventsCard events={events} />
      </div>

      {/* Projects Section */}
      <ProfileProjectsSection projects={projects} />
    </div>
  );
}
