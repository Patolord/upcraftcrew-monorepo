import { preloadQuery } from "convex/nextjs";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { requireAuthWithToken } from "@/lib/server-auth";
import { ProjectsPage } from "./_components/projects-page";

export default async function Page() {
  // Get authenticated user and token
  const { token } = await requireAuthWithToken();

  // Preload data with authentication
  const preloadedProjects = await preloadQuery(api.projects.getProjects, {}, { token });

  return <ProjectsPage preloadedProjects={preloadedProjects} />;
}
