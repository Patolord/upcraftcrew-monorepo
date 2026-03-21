"use client";

import { Calendar, Archive, ArrowUpRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
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

interface AssignedUser {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: TaskPriority;
  assignedUsers: AssignedUser[];
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

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

function extractUrls(...texts: (string | undefined)[]): string[] {
  const urls: string[] = [];
  for (const text of texts) {
    if (text) {
      const matches = text.match(URL_REGEX);
      if (matches) urls.push(...matches);
    }
  }
  return [...new Set(urls)];
}

function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    const label = parsed.hostname + path;
    return label.length > 40 ? label.slice(0, 37) + "..." : label;
  } catch {
    return url.length > 40 ? url.slice(0, 37) + "..." : url;
  }
}

export function TaskCard({ task, columnStatus, onClick }: TaskCardProps) {
  const archiveTask = useMutation(api.tasks.archiveTask);
  const comments = useQuery(api.taskComments.getCommentsByTask, { taskId: task._id });
  const subtasks = useQuery(api.subtasks.getSubtasksByTask, { taskId: task._id });
  const isDone = columnStatus === "done";
  const commentTexts = comments?.map((c) => c.content) ?? [];
  const subtaskTexts = subtasks?.map((s) => s.title) ?? [];
  const links = extractUrls(task.title, task.description, ...commentTexts, ...subtaskTexts);
  const linkCount = links.length;

  const handleSingleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (links.length === 1) {
      window.open(links[0], "_blank", "noopener,noreferrer");
    }
  };

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
          {task.assignedUsers.length > 0 ? (
            <div className="flex -space-x-1.5">
              {task.assignedUsers.slice(0, 3).map((user) => (
                <Avatar key={user._id} className="size-6 border-2 border-background">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback className="text-[10px] bg-linear-to-br from-orange-400 to-pink-500 text-white">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignedUsers.length > 3 && (
                <Avatar className="size-6 border-2 border-background">
                  <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                    +{task.assignedUsers.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5">
            {linkCount === 1 && (
              <button
                onClick={handleSingleLinkClick}
                className="flex items-center gap-0.5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                title="Visitar link"
              >
                <ArrowUpRight className="size-3.5" />
                <span className="text-[10px] font-medium">Visitar link</span>
              </button>
            )}

            {linkCount > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-0.5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                    title={`${linkCount} links`}
                  >
                    <ArrowUpRight className="size-3.5" />
                    <span className="text-[10px] font-medium">Visitar link +{linkCount - 1}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {links.map((url, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="size-3.5 shrink-0 text-blue-500" />
                      <span className="text-xs truncate">{formatUrl(url)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
        </div>
      </CardContent>
    </Card>
  );
}
