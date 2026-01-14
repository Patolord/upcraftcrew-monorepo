"use client";

import { useMemo } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

import { DashboardHeader } from "./dashboard-header";
import { DashboardStats } from "./dashboard-stats";
import { DashboardStatisticsChart } from "./dashboard-statistics-chart";
import { DashboardTransactions } from "./dashboard-transactions";
import { DashboardRecentProjectsTable } from "./dashboard-recent-projects-table";
import { DashboardGrowth } from "./dashboard-growth";

interface Project {
  _id: Id<"projects">;
  name: string;
  client: string;
  description: string;
  status: "planning" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  startDate: number;
  endDate: number;
  progress: number;
  budget: number;
  teamIds: Id<"users">[];
  team?: Array<{
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  }>;
}

interface TeamMember {
  _id: Id<"users">;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  role: "admin" | "member" | "viewer";
  department?: string;
  status: "online" | "offline" | "away" | "busy";
  skills?: string[];
  joinedAt: number;
  lastActive: number;
  projectIds: Id<"projects">[];
}

interface Transaction {
  _id: Id<"transactions">;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "completed" | "failed";
  date: number;
  projectId?: Id<"projects">;
}

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: Id<"users">;
  projectId?: Id<"projects">;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  assignedUser?: TeamMember | null;
  project?: Project | null;
}

interface DashboardPageProps {
  preloadedProjects: Preloaded<typeof api.projects.getProjects>;
  preloadedTeam: Preloaded<typeof api.team.getTeamMembers>;
  preloadedTransactions: Preloaded<typeof api.finance.getTransactions>;
  preloadedTasks: Preloaded<typeof api.tasks.getTasks>;
}

export function DashboardPage({
  preloadedProjects,
  preloadedTeam,
  preloadedTransactions,
  preloadedTasks,
}: DashboardPageProps) {
  const projects = usePreloadedQuery(preloadedProjects) as Project[];
  const teamMembers = usePreloadedQuery(preloadedTeam) as TeamMember[];
  const transactions = usePreloadedQuery(preloadedTransactions) as Transaction[];

  // Calculate overview stats
  const stats = useMemo(() => {
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

  // Error handling
  const hasError = !projects && !teamMembers && !transactions;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and User */}
      <DashboardHeader />

      {/* Stats Cards */}
      <DashboardStats
        stats={stats}
        totalProjects={projects.length}
        totalMembers={teamMembers.length}
      />

      {/* Statistics Chart + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardStatisticsChart transactions={transactions} />
        </div>
        <div>
          <DashboardTransactions transactions={transactions} />
        </div>
      </div>

      {/* Recent Projects Table + Growth  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRecentProjectsTable projects={projects} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <DashboardGrowth />
        </div>
      </div>
    </div>
  );
}
