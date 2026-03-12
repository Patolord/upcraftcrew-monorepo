"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { TaskCard } from "./kanban-task-card";
import { toast } from "sonner";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/convex-errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
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

interface TaskLabel {
  _id: Id<"taskLabels">;
  name: string;
  color: string;
}

export interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  ownerId?: string;
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
  labels?: TaskLabel[];
  subtaskStats?: {
    total: number;
    completed: number;
  };
  commentCount?: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface TaskKanbanBoardProps {
  columns: Column[];
  onTaskClick?: (taskId: Id<"tasks">) => void;
  onAddTask?: (status: TaskStatus) => void;
}

interface DraggableTaskCardProps {
  task: Task;
  columnStatus: TaskStatus;
  onClick?: () => void;
}

function DraggableTaskCard({ task, columnStatus, onClick }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick();
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick}>
      <TaskCard task={task} columnStatus={columnStatus} />
    </div>
  );
}

// Column header colors based on status
const columnStyles: Record<TaskStatus, { bg: string; text: string; badge: string }> = {
  todo: {
    bg: "bg-blue-500",
    text: "text-white",
    badge: "bg-blue-600/30 text-white",
  },
  "in-progress": {
    bg: "bg-violet-500",
    text: "text-white",
    badge: "bg-violet-600/30 text-white",
  },
  review: {
    bg: "bg-orange-500",
    text: "text-white",
    badge: "bg-orange-600/30 text-white",
  },
  done: {
    bg: "bg-emerald-500",
    text: "text-white",
    badge: "bg-emerald-600/30 text-white",
  },
  blocked: {
    bg: "bg-red-500",
    text: "text-white",
    badge: "bg-red-600/30 text-white",
  },
};

// Droppable Column Component
interface DroppableColumnProps {
  column: Column;
  onTaskClick?: (taskId: Id<"tasks">) => void;
  onAddTask?: () => void;
}

function DroppableColumn({ column, onTaskClick, onAddTask }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const style = columnStyles[column.id];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl transition-all duration-200",
        isOver && "ring-2 ring-primary ring-offset-2",
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-2xl",
          style.bg,
          style.text,
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center size-6 text-xs font-bold rounded-full",
              style.badge,
            )}
          >
            {column.tasks.length}
          </span>
          <h3 className="font-semibold text-sm">{column.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white/80 hover:text-white hover:bg-white/20"
          onClick={onAddTask}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      {/* Column Content - Droppable area */}
      <div className="pt-4 pb-2 flex flex-col">
        <SortableContext
          items={column.tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {column.tasks.length === 0 ? (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/20 rounded-xl text-muted-foreground mx-1">
                <p className="text-xs">No tasks yet</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <DraggableTaskCard
                  key={task._id}
                  task={task}
                  columnStatus={column.id}
                  onClick={() => onTaskClick?.(task._id)}
                />
              ))
            )}
          </div>
        </SortableContext>

        {/* Add Task Button at bottom */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 shrink-0 text-muted-foreground hover:text-foreground justify-start"
          onClick={onAddTask}
        >
          <PlusIcon className="size-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
}

export function TaskKanbanBoard({ columns, onTaskClick, onAddTask }: TaskKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

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
        toast.success("Task updated!");
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
      <div className="grid grid-cols-4 gap-4 h-full">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask?.(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <div className="cursor-move rotate-3 scale-105">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
