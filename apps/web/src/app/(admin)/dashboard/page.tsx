"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { DashboardHeader } from "../../../components/dashboard/dashboard-header";
import { DashboardStats } from "../../../components/dashboard/dashboard-stats";
import { RecentActivities, type Activity } from "../../../components/dashboard/recent-activities";
import { UpcomingDeadlines, type Project } from "../../../components/dashboard/upcoming-deadlines";
import { ProjectsOverview } from "../../../components/dashboard/projects-overview";
import { ErrorState } from "../../../components/dashboard/error-state";
import { DashboardSkeleton } from "../../../components/ui/dashboard-skeleton";
import { ActiveTasks, type Task } from "../../../components/dashboard/active-tasks";
import { FinanceOverview } from "../../../components/dashboard/finance-overview";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function DashboardPage() {
  const [retryCount, setRetryCount] = useState(0);

  // Fetch data from Convex
  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const transactions = useQuery(api.finance.getTransactions);

  // Error handling
  const hasError =
    projects === undefined && teamMembers === undefined && transactions === undefined;

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    window.location.reload();
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
    const totalIncome = completedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = completedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const avgProjectProgress =
      projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

    return {
      activeProjects,
      activeMembers,
      totalRevenue: totalIncome,
      netProfit: totalIncome - totalExpenses,
      avgProgress: avgProjectProgress,
    };
  }, [projects, teamMembers, transactions]);

  // Recent activities
  const recentActivities: Activity[] = useMemo(() => {
    if (!teamMembers || !projects) return [];

    return teamMembers.slice(0, 4).map((user, index) => ({
      id: index + 1,
      user: {
        name: user.name,
        avatar: user.avatar || "",
      },
      action:
        index === 0
          ? "completed task in"
          : index === 1
            ? "added new member to"
            : index === 2
              ? "updated status of"
              : "created new task in",
      target: projects[index]?.name || `Project ${String.fromCharCode(65 + index)}`,
      time:
        index === 0
          ? "2 hours ago"
          : index === 1
            ? "4 hours ago"
            : index === 2
              ? "6 hours ago"
              : "1 day ago",
      type: (["success", "info", "warning", "primary"][index] || "primary") as
        | "success"
        | "info"
        | "warning"
        | "primary",
    }));
  }, [teamMembers, projects]);

  // Upcoming deadlines
  const upcomingDeadlines: Project[] = useMemo(() => {
    if (!projects) return [];

    return projects
      .filter((p) => p.endDate && p.status !== "completed")
      .sort((a, b) => a.endDate - b.endDate)
      .slice(0, 4)
      .map((p) => ({
        id: p._id,
        name: p.name,
        endDate: new Date(p.endDate).toISOString(),
      }));
  }, [projects]);

  // Loading state
  const isLoading = !projects || !teamMembers || !transactions;

  // Show error state if all queries failed after loading
  if (hasError && retryCount > 0) {
    return (
      <div className="p-6">
        <DashboardHeader />
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="p-6 space-y-6">
        <DashboardHeader />

        {isLoading ? (
          <DashboardSkeleton variant="stats" />
        ) : (
          <DashboardStats
            stats={stats}
            totalProjects={projects.length}
            totalMembers={teamMembers.length}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <DashboardSkeleton variant="activities" />
            ) : (
              <RecentActivities activities={recentActivities} />
            )}
          </div>

          <div>
            {isLoading ? (
              <DashboardSkeleton variant="deadlines" />
            ) : (
              <UpcomingDeadlines projects={upcomingDeadlines} />
            )}
          </div>
        </div>

        {isLoading ? (
          <DashboardSkeleton variant="projects" />
        ) : (
          <ProjectsOverview
            projects={projects.slice(0, 5).map((p) => ({
              id: p._id,
              name: p.name,
              status: p.status,
              progress: p.progress,
              team: p.team.map((m) => ({
                id: m._id,
                name: m.name,
                avatar: m.avatar || "",
              })),
            }))}
          />
        )}
      </div>
    </AuthWrapper>
  );
}
