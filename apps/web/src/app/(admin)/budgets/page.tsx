import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { BudgetsPage } from "./_components/budgets-page";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload data with authentication
  const preloadedBudgets = await preloadQuery(api.budgets.getBudgets, {}, { token });
  const preloadedStats = await preloadQuery(api.budgets.getBudgetStats, {}, { token });

  return <BudgetsPage preloadedBudgets={preloadedBudgets} preloadedStats={preloadedStats} />;
}
