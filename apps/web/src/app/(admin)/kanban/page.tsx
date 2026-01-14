"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import type { Project, ProjectStatus } from "@/types/project";
import { KanbanBoard } from "./_components/kanban-board";
import { KanbanHeader } from "./_components/kanban-header";
import { AlertCircleIcon } from "lucide-react";

interface Column {
  id: ProjectStatus;
  title: string;
  projects: Project[];
}

export default function KanbanPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects);

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

  // Loading state
  if (convexProjects === undefined) {
    return (
      <div className="p-6 space-y-6">
        <KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (convexProjects === null) {
    return (
      <div className="p-6 space-y-6">
        <KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="alert alert-error">
          <AlertCircleIcon className="h-5 w-5" />
          <span>Failed to load projects. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <KanbanBoard columns={columns as unknown as Column[]} />
    </div>
  );
}
