import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAdminWithToken } from "@/lib/server-auth";
import { DashboardPage } from "./_components/dashboard-page";
import React from "react";

// Force dynamic rendering since we need auth at runtime
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Verify admin access and get token for preloadQuery
  const { token } = await requireAdminWithToken();

  // Preload data with authentication - parallel execution
  const [preloadedTransactions, preloadedTeam, preloadedProjects, preloadedBudgets] =
    await Promise.all([
      preloadQuery(api.finance.getTransactions, {}, { token }),
      preloadQuery(api.team.getTeamMembers, {}, { token }),
      preloadQuery(api.projects.getProjects, {}, { token }),
      preloadQuery(api.budgets.getBudgets, {}, { token }),
    ]);

  return (
    <DashboardPage
      preloadedProjects={preloadedProjects}
      preloadedTeam={preloadedTeam}
      preloadedTransactions={preloadedTransactions}
      preloadedBudgets={preloadedBudgets}
    />
  );
}
