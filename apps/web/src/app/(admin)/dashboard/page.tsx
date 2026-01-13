import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { DashboardPage } from "./_components/dashboard-page";

export default async function Page() {
  // Get authentication token from Clerk
  const { getToken } = await auth();

  const token = await getToken({ template: "convex" });

  if (!token) {
    throw new Error(
      "Failed to get Convex authentication token. " +
        "The Clerk JWT template 'convex' may not be configured. " +
        "Please check CLERK_CONVEX_SETUP.md for setup instructions, " +
        "or visit /api/debug-auth for diagnostics.",
    );
  }

  // Pass the token to preloadQuery for authentication
  const preloadedProjects = await preloadQuery(api.projects.getProjects, {}, { token });
  const preloadedTeam = await preloadQuery(api.team.getTeamMembers, {}, { token });
  const preloadedTransactions = await preloadQuery(api.finance.getTransactions, {}, { token });
  const preloadedTasks = await preloadQuery(api.tasks.getTasks, {}, { token });

  return (
    <DashboardPage
      preloadedProjects={preloadedProjects}
      preloadedTeam={preloadedTeam}
      preloadedTransactions={preloadedTransactions}
      preloadedTasks={preloadedTasks}
    />
  );
}
