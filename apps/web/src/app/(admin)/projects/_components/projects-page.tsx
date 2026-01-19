"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./project-header";
import { ProjectsStats } from "./projects-stats";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import React from "react";
import { NewProjectModal } from "./new-project-modal";
import { useState } from "react";
import { ProjectCard } from "./project-card";

export function ProjectsPage() {
  // Query paginada para exibir os projetos na lista
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.projects.getProjectsPaginated,
    {},
    { initialNumItems: 3 },
  );

  // Query simples para calcular as estatísticas (precisa de todos os projetos)
  const allProjects = useQuery(api.projects.getProjects);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader />

      <ProjectsStats projects={(allProjects || []) as unknown as Project[]} />

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

      {/* Projects Grid */}
      {isLoading && results === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(results || []).map((project) => (
              <ProjectCard
                key={(project as unknown as Project)._id}
                project={project as unknown as Project}
              />
            ))}
          </div>

          {/* Load More Button */}
          {status === "CanLoadMore" && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => loadMore(3)}
                variant="outline"
                className="min-w-[150px]"
                disabled={status !== "CanLoadMore"}
              >
                Ver Mais
              </Button>
            </div>
          )}

          {status === "LoadingMore" && (
            <div className="flex justify-center pt-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {status === "Exhausted" && results && results.length > 3 && (
            <div className="flex justify-center pt-4">
              <p className="text-sm text-muted-foreground">Todos os projetos foram carregados</p>
            </div>
          )}
        </>
      )}

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
