"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { DashboardHeader } from "./_components/dashboard-header";
import { ErrorState } from "./_components/error-state";

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
      return {};
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
}
