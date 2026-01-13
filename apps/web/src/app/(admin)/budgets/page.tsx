import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { BudgetsPage } from "./_components/budgets-page";

export default async function Page() {
  const preloadedBudgets = await preloadQuery(api.budgets.getBudgets);
  const preloadedStats = await preloadQuery(api.budgets.getBudgetStats);

  return <BudgetsPage preloadedBudgets={preloadedBudgets} preloadedStats={preloadedStats} />;
}
