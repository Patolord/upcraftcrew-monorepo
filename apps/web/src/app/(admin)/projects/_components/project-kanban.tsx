"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import type { ProjectStatus } from "@/types/project";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { AlertCircleIcon } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/convex-errors";

// Type for project with populated fields
interface ProjectWithDetails {
  _id: Id<"projects">;
  name: string;
  description: string;
  status: ProjectStatus;
  client: string;
  progress: number;
  manager?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface ProjectKanbanProps {
  projectId: Id<"projects">;
}

// Draggable Card Component
interface DraggableProjectCardProps {
  project: ProjectWithDetails;
  statusBadgeVariants: Record<
    ProjectStatus,
    "default" | "secondary" | "success" | "warning" | "destructive"
  >;
}

function DraggableProjectCard({ project, statusBadgeVariants }: DraggableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="border cursor-move hover:shadow-md transition-shadow">
        <CardContent className="p-4 pt-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{project.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
            {project.client && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Cliente:</span> {project.client}
              </p>
            )}
            {project.manager && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Responsável:</span> {project.manager.firstName}{" "}
                {project.manager.lastName}
              </p>
            )}
            <div className="flex items-center justify-between pt-2">
              <Badge variant={statusBadgeVariants[project.status]}>{project.status}</Badge>
              <span className="text-xs text-muted-foreground">{project.progress}% completo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable Column Component
interface DroppableColumnProps {
  column: {
    id: ProjectStatus;
    title: string;
    projects: ProjectWithDetails[];
  };
  statusColors: Record<ProjectStatus, string>;
  statusBadgeVariants: Record<
    ProjectStatus,
    "default" | "secondary" | "success" | "warning" | "destructive"
  >;
}

function DroppableColumn({ column, statusColors, statusBadgeVariants }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-w-[320px] max-w-[320px] rounded-lg border-t-4 p-0 transition-colors",
        statusColors[column.id],
        isOver && "ring-2 ring-primary ring-offset-2",
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
        <SortableContext
          items={column.projects.map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[200px]">
            {column.projects.length === 0 ? (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                <p className="text-xs">Este projeto não está neste status</p>
              </div>
            ) : (
              column.projects.map((project) => (
                <DraggableProjectCard
                  key={project._id}
                  project={project}
                  statusBadgeVariants={statusBadgeVariants}
                />
              ))
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function ProjectKanban({ projectId }: ProjectKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Fetch only this project
  const convexProject = useQuery(api.projects.getProjectById, { id: projectId });
  const updateProjectStatus = useMutation(api.projects.updateProjectStatus);

  // Transform to array for kanban board
  const projects = useMemo(() => {
    if (!convexProject) return [];
    return [convexProject];
  }, [convexProject]);

  // Group by status - for this single project, we show it in its current status column
  const columns = useMemo(() => {
    const statuses: ProjectStatus[] = ["planning", "in-progress", "completed"];

    return statuses.map((status) => ({
      id: status,
      title: status
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      projects: projects.filter((project) => project.status === status),
    }));
  }, [projects]);

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

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeProject = projects.find((p) => p._id === active.id);

    // Extract the column id from the droppable id
    let targetStatus: ProjectStatus | null = null;
    const overId = over.id.toString();

    // Check if dropped over a column
    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as ProjectStatus;
    } else {
      // Dropped over another card, find which column it belongs to
      const overProject = projects.find((p) => p._id === over.id);
      if (overProject) {
        targetStatus = overProject.status;
      }
    }

    if (activeProject && targetStatus && activeProject.status !== targetStatus) {
      try {
        await updateProjectStatus({
          id: activeProject._id,
          status: targetStatus,
        });
        toast.success("Status do projeto atualizado!");
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
      }
    }
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

  const activeProject = projects.find((p) => p._id === activeId);

  return (
    <div className="p-6 pl-12 pr-12 space-y-6">
      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={
                column as unknown as {
                  id: ProjectStatus;
                  title: string;
                  projects: ProjectWithDetails[];
                }
              }
              statusColors={statusColors}
              statusBadgeVariants={statusBadgeVariants}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId && activeProject ? (
            <Card className="border shadow-2xl cursor-move">
              <CardContent className="p-4 pt-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{activeProject.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activeProject.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
