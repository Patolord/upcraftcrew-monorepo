"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { ProjectStatus } from "@/types/project";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectsFilters } from "./_components/projects-filters";
import { ProjectsHeader } from "./_components/projects-header";
import { ProjectsList } from "./_components/projects-list";
import { ProjectsStats } from "./_components/projects-stats";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects);

  // Transform Convex data to Project type
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects;
  }, [convexProjects]);

  // Filter projects client-side
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Loading state
  if (convexProjects === undefined) {
    return (
      <div className="p-6 space-y-6">
        <ProjectsHeader onNewProject={() => {}} />
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  // Error state (empty array means no error, just no data)
  if (convexProjects === null) {
    return (
      <div className="p-6 space-y-6">
        <ProjectsHeader onNewProject={() => {}} />
        <div className="alert alert-error">
          <span className="iconify lucide--alert-circle size-5" />
          <span>Failed to load projects. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ProjectsHeader onNewProject={() => {}} />
      <ProjectsStats projects={projects as unknown as Project[]} />
      <ProjectsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <ProjectsList projects={filteredProjects as unknown as Project[]} viewMode={viewMode} />
    </div>
  );
}
