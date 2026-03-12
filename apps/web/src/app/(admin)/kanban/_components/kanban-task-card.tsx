"use client";

import { Calendar, Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/convex-errors";
import React from "react";

type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskLabel {
  _id: Id<"taskLabels">;
  name: string;
  color: string;
}

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: TaskPriority;
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

interface TaskCardProps {
  task: Task;
  columnStatus?: string;
  onClick?: () => void;
}

export function TaskCard({ task, columnStatus, onClick }: TaskCardProps) {
  const archiveTask = useMutation(api.tasks.archiveTask);
  const isDone = columnStatus === "done";

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await archiveTask({ id: task._id });
      toast.success("Tarefa arquivada!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card
      className="kanban-card cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border bg-card"
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-1.5">
        <h4 className="font-semibold text-sm line-clamp-1 text-foreground">{task.title}</h4>

        {task.description && task.description !== "Sem descrição" && (
          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          {task.assignedUser ? (
            <Avatar className="size-6 border-2 border-background">
              <AvatarImage src={task.assignedUser.imageUrl} alt={task.assignedUser.name} />
              <AvatarFallback className="text-[10px] bg-linear-to-br from-orange-400 to-pink-500 text-white">
                {task.assignedUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span />
          )}

          {isDone ? (
            <button
              onClick={handleArchive}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Arquivar tarefa"
            >
              <Archive className="size-3.5" />
            </button>
          ) : (
            task.dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span className="text-xs">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
