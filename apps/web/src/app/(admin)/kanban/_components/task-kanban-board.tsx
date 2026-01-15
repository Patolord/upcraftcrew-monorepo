"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import Sortable from "sortablejs";
import { TaskCard } from "./task-card";
import { toast } from "sonner";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/convex-errors";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    imageUrl?: string;
  } | null;
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
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
            const message = getErrorMessage(error);
            toast.error(message);
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

  return (
    <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-4">
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
                {column.tasks.length}
              </Badge>
            </div>
          </CardHeader>

          {/* Column Content - Droppable area */}
          <CardContent className="flex-1 p-4">
            <div
              className="kanban-column-content space-y-3 min-h-[200px]"
              data-column-id={column.id}
            >
              {column.tasks.map((task) => (
                <div key={task._id} data-task-id={task._id}>
                  <TaskCard task={task} />
                </div>
              ))}
              {column.tasks.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                  <p className="text-xs">No tasks</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
