"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import type { ProjectStatus } from "@/types/project";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { AlertCircleIcon, InfoIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectKanbanProps {
  projectId: Id<"projects">;
}

export function ProjectKanban({ projectId }: ProjectKanbanProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch only this project
  const convexProject = useQuery(api.projects.getProjectById, { id: projectId });

  // Transform to array for kanban board
  const projects = useMemo(() => {
    if (!convexProject) return [];
    return [convexProject];
  }, [convexProject]);

  // Filter based on search
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [projects, searchQuery]);

  // Group by status - for this single project, we show it in its current status column
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

  const statusColors: Record<ProjectStatus, string> = {
    planning: "border-t-blue-500",
    "in-progress": "border-t-orange-500",
    completed: "border-t-green-500",
  };

  const statusBadgeVariants: Record<
    ProjectStatus,
    "default" | "secondary" | "success" | "warning" | "destructive"
  > = {
    planning: "default",
    "in-progress": "secondary",
    completed: "success",
  };

  // Loading state
  if (convexProject === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // Error state
  if (convexProject === null) {
    return (
      <div className="alert alert-error">
        <AlertCircleIcon className="h-5 w-5" />
        <span>Failed to load project. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <label className="input input-bordered flex items-center gap-2 flex-1">
          <SearchIcon className="h-4 w-4 text-base-content/60" />
          <input
            type="text"
            className="grow"
            placeholder="Buscar no projeto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      {/* Info Alert */}
      <div className="alert alert-info">
        <InfoIcon className="h-5 w-5" />
        <div>
          <h3 className="font-bold">Kanban do Projeto</h3>
          <p className="text-sm">
            Visualize o status do projeto. Para alterar, use a aba &quot;Informações&quot;.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Card
            key={column.id}
            className={cn(
              "flex flex-col min-w-[320px] max-w-[320px] rounded-lg border-t-4 p-0",
              statusColors[column.id],
            )}
          >
            {/* Column Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant={statusBadgeVariants[column.id]} className="rounded-full">
                  {column.projects.length}
                </Badge>
              </div>
            </CardHeader>

            {/* Column Content */}
            <CardContent className="flex-1 p-4">
              <div className="space-y-3 min-h-[200px]">
                {column.projects.length === 0 ? (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                    <p className="text-xs">Este projeto não está neste status</p>
                  </div>
                ) : (
                  column.projects.map((project) => (
                    <Card key={project._id} className="border">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          {project.client && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Cliente:</span> {project.client}
                            </p>
                          )}
                          {project.manager && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Responsável:</span>{" "}
                              {project.manager.firstName} {project.manager.lastName}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant={statusBadgeVariants[project.status]}>
                              {project.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {project.progress}% completo
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
