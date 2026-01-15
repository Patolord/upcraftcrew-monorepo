import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { ProfilePage } from "./_components/profile-page";
import React from "react";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload current user data
  const preloadedUser = await preloadQuery(api.users.current, {}, { token });

  return <ProfilePage preloadedUser={preloadedUser} />;
}
