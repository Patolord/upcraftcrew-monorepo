import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { AssistantPage } from "./_components/assistant-page";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { token } = await requireAuthWithToken();

  const preloadedAccounts = await preloadQuery(
    api.emailAccounts.getMyAccounts,
    {},
    { token },
  );

  return <AssistantPage preloadedAccounts={preloadedAccounts} />;
}
