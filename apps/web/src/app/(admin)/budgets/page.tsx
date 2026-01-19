import { requireAuthWithToken } from "@/lib/server-auth";
import { BudgetsPage } from "./_components/budgets-page";
import React from "react";

// Force dynamic rendering since we need auth at runtime
export const dynamic = "force-dynamic";

export default async function Page() {
  // Get authenticated user and token
  await requireAuthWithToken();

  return <BudgetsPage />;
}
