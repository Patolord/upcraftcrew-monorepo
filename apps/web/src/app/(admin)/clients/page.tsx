import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { ClientsPage } from "./_components/clients-page";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { token } = await requireAuthWithToken();

  const preloadedClients = await preloadQuery(api.clients.getClients, {}, { token });

  return <ClientsPage preloadedClients={preloadedClients} />;
}
