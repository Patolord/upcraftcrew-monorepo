"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import Sortable from "sortablejs";
import { TaskCard } from "./task-card";
import { toast } from "sonner";
import type { Id } from "@workspace/backend/_generated/dataModel";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignedUser: {
    _id: string;
    name: string;
    avatar?: string;
  } | null;
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
  tags: string[];
}

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface TaskKanbanBoardProps {
  columns: Column[];
}

export function TaskKanbanBoard({ columns }: TaskKanbanBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  useEffect(() => {
    if (!boardRef.current) return;

    // Initialize drag and drop for columns
    const columnElements = boardRef.current.querySelectorAll(".kanban-column-content");
    const sortables: Sortable[] = [];

    columnElements.forEach((columnElement) => {
      const sortable = Sortable.create(columnElement as HTMLElement, {
        group: "kanban-tasks",
        animation: 150,
        ghostClass: "opacity-30",
        dragClass: "rotate-2",
        chosenClass: "shadow-lg",
        handle: ".kanban-card",
        onEnd: async (evt) => {
          const taskId = evt.item.dataset.taskId as Id<"tasks">;
          const newStatus = evt.to.dataset.columnId as TaskStatus;
          const oldStatus = evt.from.dataset.columnId as TaskStatus;

          // Don't update if dropped in same column
          if (oldStatus === newStatus) return;

          if (!taskId || !newStatus) return;

          try {
            await updateTaskStatus({
              id: taskId,
              status: newStatus,
            });
            toast.success("Task atualizada!");
          } catch (error) {
            console.error("Failed to update task status:", error);
            toast.error("Falha ao atualizar task");
            // Force page reload on error instead of DOM manipulation
            window.location.reload();
          }
        },
      });
      sortables.push(sortable);
    });

    return () => {
      sortables.forEach((s) => {
        s.destroy();
      });
    };
  }, [updateTaskStatus]);

  const statusColors: Record<TaskStatus, string> = {
    todo: "border-info",
    "in-progress": "border-primary",
    review: "border-warning",
    done: "border-success",
    blocked: "border-error",
  };

  const statusBadgeColors: Record<TaskStatus, string> = {
    todo: "badge-info",
    "in-progress": "badge-primary",
    review: "badge-warning",
    done: "badge-success",
    blocked: "badge-error",
  };

  return (
    <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex flex-col min-w-[320px] max-w-[320px] bg-base-200 rounded-lg border-t-4 ${statusColors[column.id]}`}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <span className={`badge ${statusBadgeColors[column.id]} badge-sm`}>
                {column.tasks.length}
              </span>
            </div>
          </div>

          {/* Column Content - Droppable area */}
          <div
            className="kanban-column-content flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px]"
            data-column-id={column.id}
          >
            {column.tasks.map((task) => (
              <div key={task._id} data-task-id={task._id}>
                <TaskCard task={task} />
              </div>
            ))}
            {column.tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-base-300 rounded-lg text-base-content/40">
                <p className="text-sm">No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
