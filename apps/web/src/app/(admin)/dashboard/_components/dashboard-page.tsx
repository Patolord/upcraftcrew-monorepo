"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import type { CurrencyCode } from "@/components/ui/currency-switch";
import React from "react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardStats } from "./dashboard-stats";
import { DashboardStatisticsChart } from "./dashboard-statistics-chart";
import { DashboardTransactions } from "./dashboard-transactions";
import { DashboardRecentProjectsTable } from "./dashboard-recent-projects-table";
import { DashboardFollowUp } from "./dashboard-follow-up";

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
  currency?: string;
  date: number;
  projectId?: Id<"projects">;
}

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  createdAt: number;
}

interface DashboardPageProps {
  preloadedProjects: Preloaded<typeof api.projects.getProjects>;
  preloadedTeam: Preloaded<typeof api.team.getTeamMembers>;
  preloadedTransactions: Preloaded<typeof api.finance.getTransactions>;
  preloadedBudgets: Preloaded<typeof api.budgets.getBudgets>;
}

export function DashboardPage({
  preloadedProjects,
  preloadedTeam,
  preloadedTransactions,
  preloadedBudgets,
}: DashboardPageProps) {
  const projects = usePreloadedQuery(preloadedProjects) as Project[];
  const teamMembers = usePreloadedQuery(preloadedTeam) as TeamMember[];
  const transactions = usePreloadedQuery(preloadedTransactions) as Transaction[];
  const budgets = usePreloadedQuery(preloadedBudgets) as Budget[];

  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("BRL");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => (t.currency || "BRL") === currency);
  }, [transactions, currency]);

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "in-progress").length;
    const activeMembers = teamMembers.filter((m) => m.status === "online").length;

    const completedTransactions = filteredTransactions.filter((t) => t.status === "completed");
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
  }, [projects, teamMembers, filteredTransactions]);

  return (
    <div className="p-4 md:p-6 pb-2 space-y-4 md:space-y-6">
      {/* Header with Search and User */}
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Stats Cards */}
      <DashboardStats
        stats={stats}
        totalProjects={projects.length}
        totalMembers={teamMembers.length}
        currency={currency}
      />

      {/* Statistics Chart + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <DashboardStatisticsChart transactions={filteredTransactions} currency={currency} />
        </div>
        <div>
          <DashboardTransactions transactions={filteredTransactions} currency={currency} />
        </div>
      </div>

      {/* Recent Projects Table + Follow Up */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <div className="lg:col-span-2">
          <DashboardRecentProjectsTable projects={projects} />
        </div>
        <div className="h-full">
          <DashboardFollowUp budgets={budgets} />
        </div>
      </div>
    </div>
  );
}
