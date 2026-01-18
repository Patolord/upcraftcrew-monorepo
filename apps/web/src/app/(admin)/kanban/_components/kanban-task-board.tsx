"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { TaskCard } from "./kanban-task-card";
import { toast } from "sonner";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/convex-errors";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
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

export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

export interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignedUser: {
    _id: string;
    name: string;
    imageUrl?: string;
  } | null;
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface TaskKanbanBoardProps {
  columns: Column[];
}

// Draggable Task Card Component
interface DraggableTaskCardProps {
  task: Task;
}

function DraggableTaskCard({ task }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

// Droppable Column Component
interface DroppableColumnProps {
  column: Column;
  statusColors: Record<TaskStatus, string>;
  statusBadgeVariants: Record<
    TaskStatus,
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
            {column.tasks.length}
          </Badge>
        </div>
      </CardHeader>

      {/* Column Content - Droppable area */}
      <CardContent className="flex-1 p-4">
        <SortableContext
          items={column.tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[200px]">
            {column.tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                <p className="text-xs">No tasks</p>
              </div>
            ) : (
              column.tasks.map((task) => <DraggableTaskCard key={task._id} task={task} />)
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function TaskKanbanBoard({ columns }: TaskKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  const statusColors: Record<TaskStatus, string> = {
    todo: "border-t-blue-500",
    "in-progress": "border-t-cyan-500",
    review: "border-t-purple-500",
    done: "border-t-green-500",
    blocked: "border-t-red-500",
  };

  const statusBadgeVariants: Record<
    TaskStatus,
    "default" | "secondary" | "success" | "warning" | "destructive"
  > = {
    todo: "default",
    "in-progress": "secondary",
    review: "warning",
    done: "success",
    blocked: "destructive",
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

    // Find the active task
    const activeTask = columns.flatMap((col) => col.tasks).find((task) => task._id === active.id);

    // Extract the column id from the droppable id
    let targetStatus: TaskStatus | null = null;
    const overId = over.id.toString();

    // Check if dropped over a column
    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as TaskStatus;
    } else {
      // Dropped over another task, find which column it belongs to
      const overTask = columns.flatMap((col) => col.tasks).find((task) => task._id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (activeTask && targetStatus && activeTask.status !== targetStatus) {
      try {
        await updateTaskStatus({
          id: activeTask._id,
          status: targetStatus,
        });
        toast.success("Task atualizada!");
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
      }
    }
  };

  // Find active task for drag overlay
  const activeTask = columns.flatMap((col) => col.tasks).find((task) => task._id === activeId);

  return (
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
            column={column}
            statusColors={statusColors}
            statusBadgeVariants={statusBadgeVariants}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <div className="cursor-move">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
