import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { ProfilePage } from "./_components/profile-page";
import React from "react";

// Force dynamic rendering since we need auth at runtime
export const dynamic = "force-dynamic";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload all profile page data
  const [preloadedUser, preloadedTasks, preloadedBudgets, preloadedEvents, preloadedProjects] =
    await Promise.all([
      preloadQuery(api.users.current, {}, { token }),
      preloadQuery(api.users.getMyTasks, {}, { token }),
      preloadQuery(api.users.getMyBudgets, {}, { token }),
      preloadQuery(api.users.getMyUpcomingEvents, {}, { token }),
      preloadQuery(api.users.getMyProjects, {}, { token }),
    ]);

  return (
    <ProfilePage
      preloadedUser={preloadedUser}
      preloadedTasks={preloadedTasks}
      preloadedBudgets={preloadedBudgets}
      preloadedEvents={preloadedEvents}
      preloadedProjects={preloadedProjects}
    />
  );
}
