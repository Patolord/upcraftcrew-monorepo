import { requireAuthWithToken } from "@/lib/server-auth";
import { ClientProfile } from "./_components/client-profile";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import React from "react";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuthWithToken();
  const { id } = await params;

  return <ClientProfile clientId={id as Id<"clients">} />;
}
