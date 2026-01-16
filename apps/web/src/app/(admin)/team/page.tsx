import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { TeamPage } from "./_components/team-page";
import React from "react";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload data with authentication
  const preloadedTeam = await preloadQuery(api.team.getTeamMembers, {}, { token });

  return <TeamPage preloadedTeam={preloadedTeam} />;
}
