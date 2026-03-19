import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { AssistantPage } from "./_components/assistant-page";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { token } = await requireAuthWithToken();

  const [preloadedAccounts, preloadedFavorites] = await Promise.all([
    preloadQuery(api.emailAccounts.getMyAccounts, {}, { token }),
    preloadQuery(api.emailAccounts.getMyFavorites, {}, { token }),
  ]);

  return (
    <AssistantPage
      preloadedAccounts={preloadedAccounts}
      preloadedFavorites={preloadedFavorites}
    />
  );
}
