"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./project-header";
import { ProjectsStats } from "./projects-stats";
import type { Project } from "@/types/project";
import { ProjectsList } from "./projects-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";
import { NewProjectModal } from "./new-project-modal";
import { useState } from "react";

interface ProjectsPageProps {
  preloadedProjects: Preloaded<typeof api.projects.getProjects>;
}

export function ProjectsPage({ preloadedProjects }: ProjectsPageProps) {
  const projects = usePreloadedQuery(preloadedProjects);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader />

      <ProjectsStats projects={projects as unknown as Project[]} />

      {/* Our Projects Section Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-2">Our projects</h2>
        </div>
        <Button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-6"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <ProjectsList projects={projects as unknown as Project[]} viewMode="grid" />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
