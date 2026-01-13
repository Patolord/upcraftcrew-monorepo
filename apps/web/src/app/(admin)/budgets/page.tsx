import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { BudgetsPage } from "./_components/budgets-page";

export default async function Page() {
  // Get authentication token from Clerk
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });

  // Pass the token to preloadQuery for authentication
  const preloadedBudgets = await preloadQuery(
    api.budgets.getBudgets,
    {},
    { token: token ?? undefined },
  );
  const preloadedStats = await preloadQuery(
    api.budgets.getBudgetStats,
    {},
    { token: token ?? undefined },
  );

  return <BudgetsPage preloadedBudgets={preloadedBudgets} preloadedStats={preloadedStats} />;
}
