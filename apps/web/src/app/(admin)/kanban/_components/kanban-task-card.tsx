import { MessageSquare, Paperclip, Calendar, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
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
  isPrivate?: boolean;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const isCompleted = task.status === "done";
  // Mock data for comments and attachments (you can extend the Task interface to include these)
  const commentCount = 3;
  const attachmentCount = 5;

  return (
    <Card className="kanban-card cursor-move hover:shadow-md transition-shadow rounded-lg">
      <CardContent className="p-4 space-y-3">
        {/* Badge */}
        <Badge variant="secondary" className="rounded-md">
          UI Design
        </Badge>

        {/* Title */}
        <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

        {/* Avatar Group - Show multiple team members */}
        <div className="flex -space-x-2">
          {task.assignedUser && (
            <Avatar className="size-6 border-2 border-background">
              <AvatarImage src={task.assignedUser.imageUrl} alt={task.assignedUser.name} />
              <AvatarFallback className="text-xs">
                {task.assignedUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          {/* Additional mock avatars for demonstration */}
          <Avatar className="size-6 border-2 border-background">
            <AvatarFallback className="bg-blue-500 text-white text-xs">A</AvatarFallback>
          </Avatar>
          <Avatar className="size-6 border-2 border-background">
            <AvatarFallback className="bg-green-500 text-white text-xs">B</AvatarFallback>
          </Avatar>
          <Avatar className="size-6 border-2 border-background">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">+2</AvatarFallback>
          </Avatar>
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-muted-foreground">
            {/* Comment Count */}
            <div className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              <span className="text-xs">{commentCount}</span>
            </div>

            {/* Attachment Count */}
            <div className="flex items-center gap-1">
              <Paperclip className="size-3.5" />
              <span className="text-xs">{attachmentCount}</span>
            </div>
          </div>

          {/* Right side - Due date or completion indicator */}
          <div className="flex items-center gap-2">
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

            {/* Show thumbs up for completed tasks */}
            {isCompleted && (
              <div className="text-amber-500">
                <ThumbsUp className="size-3.5 fill-current" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
