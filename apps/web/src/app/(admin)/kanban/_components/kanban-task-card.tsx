"use client";

import { Calendar, Archive, ArrowUpRight, ExternalLink, CheckSquare, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  createdAt: number;
  clientName?: string | null;
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

function extractUrlsFromText(...texts: (string | undefined)[]): string[] {
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

function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

const priorityDisplay: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "#84cc16" },
  medium: { label: "Média", color: "#f59e0b" },
  high: { label: "Alta", color: "#f97316" },
  urgent: { label: "Urgente", color: "#ef4444" },
};

export function TaskCard({ task, columnStatus, onClick }: TaskCardProps) {
  const archiveTask = useMutation(api.tasks.archiveTask);
  const isDone = columnStatus === "done";
  const links = extractUrlsFromText(task.title, task.description);
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

  const hasSubtasks = task.subtaskStats && task.subtaskStats.total > 0;

  return (
    <Card
      className="kanban-card cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border bg-card"
      onClick={onClick}
    >
      <CardContent className="px-3 pt-3 pb-1 space-y-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="font-semibold text-sm line-clamp-1 text-foreground min-w-0 flex-1">
            {task.title}
          </h4>
          <Badge
            className="shrink-0 text-[10px] px-1.5 py-0 font-medium border-0 text-white"
            style={{ backgroundColor: priorityDisplay[task.priority].color }}
          >
            {priorityDisplay[task.priority].label}
          </Badge>
        </div>

        {task.description && task.description !== "Sem descrição" && (
          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
        )}

        {/* Client tag */}
        {task.clientName && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1 font-normal">
            <User className="size-2.5" />
            {task.clientName}
          </Badge>
        )}

        {/* Middle row: avatars + checklist + links */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            {task.assignedUsers.length > 0 && (
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
            )}

            {hasSubtasks && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckSquare className="size-3.5" />
                <span className="text-[10px] font-medium">
                  {task.subtaskStats!.completed}/{task.subtaskStats!.total}
                </span>
              </div>
            )}
          </div>

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

            {isDone && (
              <button
                onClick={handleArchive}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Arquivar tarefa"
              >
                <Archive className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer: created date (left) + delivery date (right) */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground">
            Criado {formatShortDate(task.createdAt)}
          </span>

          {task.dueDate ? (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-3" />
              <span className="text-[10px]">{formatShortDate(task.dueDate)}</span>
            </div>
          ) : (
            <span />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
