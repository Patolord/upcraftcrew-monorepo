"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Project, ProjectStatus } from "@/types/project";
import { KanbanBoard } from "./kanban-board";
import { KanbanHeader } from "./kanban-header";

interface Column {
  id: ProjectStatus;
  title: string;
  projects: Project[];
}

interface KanbanPageProps {
  preloadedProjects: Preloaded<typeof api.projects.getProjects>;
}

export function KanbanPage({ preloadedProjects }: KanbanPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const convexProjects = usePreloadedQuery(preloadedProjects);

  // Transform Convex data to Project type
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects;
  }, [convexProjects]);

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [projects, searchQuery]);

  // Group projects by status
  const columns = useMemo(() => {
    const statuses: ProjectStatus[] = ["planning", "in-progress", "completed"];

    return statuses.map((status) => ({
      id: status,
      title: status
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      projects: filteredProjects.filter((p) => p.status === status),
    }));
  }, [filteredProjects]);

  return (
    <div className="p-6 space-y-6">
      <KanbanHeader />
      <KanbanBoard columns={columns as unknown as Column[]} />
    </div>
  );
}
