import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAdminWithToken } from "@/lib/server-auth";
import { DashboardPage } from "./_components/dashboard-page";

export default async function Dashboard() {
  // Verify admin access and get token for preloadQuery
  const { token } = await requireAdminWithToken();

  // Preload data with authentication - parallel execution
  const [preloadedTasks, preloadedTransactions, preloadedTeam, preloadedProjects] =
    await Promise.all([
      preloadQuery(api.tasks.getTasks, {}, { token }),
      preloadQuery(api.finance.getTransactions, {}, { token }),
      preloadQuery(api.team.getTeamMembers, {}, { token }),
      preloadQuery(api.projects.getProjects, {}, { token }),
    ]);

  return (
    <DashboardPage
      preloadedProjects={preloadedProjects}
      preloadedTeam={preloadedTeam}
      preloadedTransactions={preloadedTransactions}
      preloadedTasks={preloadedTasks}
    />
  );
}
