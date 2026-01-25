"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { ProjectHeader } from "./project-header";
import { ProjectsStats } from "./projects-stats";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2, FolderOpenIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { NewProjectModal } from "./new-project-modal";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/ui/empty-state";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!results) return [];
    if (!searchQuery.trim()) return results as unknown as Project[];

    const query = searchQuery.toLowerCase();
    return (results as unknown as Project[]).filter((project) => {
      return (
        project.name?.toLowerCase().includes(query) ||
        project.client?.toLowerCase().includes(query) ||
        project.status?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });
  }, [results, searchQuery]);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      <ProjectHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <EmptyState
            icon={FolderOpenIcon}
            title="Nenhum projeto encontrado. Crie seu primeiro projeto clicando no botão acima."
            description={
              searchQuery
                ? "Tente ajustar sua busca"
                : "Crie seu primeiro projeto clicando no botão acima"
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          {/* Load More Button - only show when not filtering */}
          {!searchQuery && status === "CanLoadMore" && (
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

          {!searchQuery && status === "LoadingMore" && (
            <div className="flex justify-center pt-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!searchQuery && status === "Exhausted" && results && results.length > 3 && (
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
