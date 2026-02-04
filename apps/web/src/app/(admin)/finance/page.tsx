import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { FinancePage } from "./_components/finance-page";
import React from "react";

// Force dynamic rendering since we need auth at runtime
export const dynamic = "force-dynamic";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload data with authentication - parallel execution
  const [preloadedTransactions, preloadedSummary, preloadedYearlyExpenses] = await Promise.all([
    preloadQuery(api.finance.getTransactions, {}, { token }),
    preloadQuery(api.finance.getFinancialSummary, {}, { token }),
    preloadQuery(api.finance.getYearlyExpensesByMonth, {}, { token }),
  ]);

  return (
    <FinancePage
      preloadedTransactions={preloadedTransactions}
      preloadedSummary={preloadedSummary}
      preloadedYearlyExpenses={preloadedYearlyExpenses}
    />
  );
}
