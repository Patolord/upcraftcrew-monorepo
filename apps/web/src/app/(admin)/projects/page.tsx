"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { ProjectStatus } from "@/types/project";
import { adaptConvexProject } from "@/lib/utils/project-adapter";
import { ProjectsHeader } from "../../../components/projects/ProjectsHeader";
import { ProjectsStats } from "../../../components/projects/ProjectsStats";
import { ProjectsFilters } from "../../../components/projects/ProjectsFilters";
import { ProjectsList } from "../../../components/projects/ProjectsList";
import { NewProjectModal } from "../../../components/projects/NewProjectModal";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects);

  // Transform Convex data to Project type
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects.map(adaptConvexProject);
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
        <ProjectsHeader onNewProject={() => setIsModalOpen(true)} />
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  // Error state (empty array means no error, just no data)
  if (convexProjects === null) {
    return (
      <div className="p-6 space-y-6">
        <ProjectsHeader onNewProject={() => setIsModalOpen(true)} />
        <div className="alert alert-error">
          <span className="iconify lucide--alert-circle size-5" />
          <span>Failed to load projects. Please try again later.</span>
        </div>
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="p-6 space-y-6">
        <ProjectsHeader onNewProject={() => setIsModalOpen(true)} />
        <ProjectsStats projects={projects} />
        <ProjectsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <ProjectsList projects={filteredProjects} viewMode={viewMode} />
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </AuthWrapper>
  );
}
