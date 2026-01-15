import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { KanbanPage } from "./_components/kanban-page";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload data with authentication
  const preloadedTasks = await preloadQuery(api.tasks.getTasks, {}, { token });
  const preloadedTeamMembers = await preloadQuery(api.team.getTeamMembers, {}, { token });

  return <KanbanPage preloadedTasks={preloadedTasks} preloadedTeamMembers={preloadedTeamMembers} />;
}
