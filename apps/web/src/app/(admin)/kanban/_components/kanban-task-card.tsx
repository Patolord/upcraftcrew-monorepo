"use client";

import { MessageSquare, CheckSquare, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
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
  onClick?: () => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low Priority", color: "#65a30d", bgColor: "#ecfccb" },
  medium: { label: "Medium", color: "#d97706", bgColor: "#fef3c7" },
  high: { label: "High Priority", color: "#ea580c", bgColor: "#ffedd5" },
  urgent: { label: "Urgent", color: "#dc2626", bgColor: "#fee2e2" },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityStyle = priorityConfig[task.priority];
  const hasSubtasks = task.subtaskStats && task.subtaskStats.total > 0;
  const commentCount = task.commentCount ?? 0;

  return (
    <Card
      className="kanban-card cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Labels Row */}
        <div className="flex flex-wrap gap-1">
          {/* Priority Badge */}
          <Badge
            className="text-[10px] px-2 py-0.5 font-medium border-0 rounded-md"
            style={{
              backgroundColor: priorityStyle.bgColor,
              color: priorityStyle.color,
            }}
          >
            {priorityStyle.label}
          </Badge>

          {/* Custom Labels */}
          {task.labels?.slice(0, 2).map((label) => (
            <Badge
              key={label._id}
              className="text-[10px] px-2 py-0.5 font-medium border-0 rounded-md text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </Badge>
          ))}
          {task.labels && task.labels.length > 2 && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md">
              +{task.labels.length - 2}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-sm line-clamp-2 text-foreground">{task.title}</h4>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        {/* Avatar Group */}
        {task.assignedUser && (
          <div className="flex -space-x-2">
            <Avatar className="size-7 border-2 border-background ring-1 ring-background">
              <AvatarImage src={task.assignedUser.imageUrl} alt={task.assignedUser.name} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-orange-400 to-pink-500 text-white">
                {task.assignedUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-muted-foreground">
            {/* Comment Count */}
            {commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="size-3.5" />
                <span className="text-xs">{commentCount}</span>
              </div>
            )}

            {/* Subtask Count */}
            {hasSubtasks && (
              <div className="flex items-center gap-1">
                <CheckSquare className="size-3.5" />
                <span className="text-xs">
                  {task.subtaskStats!.completed}/{task.subtaskStats!.total}
                </span>
              </div>
            )}
          </div>

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-3.5" />
              <span className="text-xs">
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
