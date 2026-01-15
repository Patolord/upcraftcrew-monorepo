"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./_components/project-header";
import { ProjectsStats } from "./_components/projects-stats";
import type { Project } from "@/types/project";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects);

  // Transform Convex data to Project type
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects;
  }, [convexProjects]);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader />

      <ProjectsStats projects={projects as unknown as Project[]} />
      <ProjectsList projects={projects as unknown as Project[]} viewMode="grid" />
    </div>
  );
}
