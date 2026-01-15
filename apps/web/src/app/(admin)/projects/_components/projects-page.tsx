"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./project-header";
import { ProjectsStats } from "./projects-stats";
import type { Project } from "@/types/project";
import { ProjectsList } from "./projects-list";

interface ProjectsPageProps {
  preloadedProjects: Preloaded<typeof api.projects.getProjects>;
}

export function ProjectsPage({ preloadedProjects }: ProjectsPageProps) {
  const projects = usePreloadedQuery(preloadedProjects);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader />

      <ProjectsStats projects={projects as unknown as Project[]} />
      <ProjectsList projects={projects as unknown as Project[]} viewMode="grid" />
    </div>
  );
}
