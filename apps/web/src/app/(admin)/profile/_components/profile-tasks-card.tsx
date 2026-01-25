"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, AlertCircle, Ban } from "lucide-react";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: number;
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface ProfileTasksCardProps {
  tasks: Task[];
}

const statusConfig = {
  todo: {
    label: "To Do",
    icon: Circle,
    color: "bg-gray-100 text-gray-700",
  },
  "in-progress": {
    label: "Em Progresso",
    icon: Clock,
    color: "bg-blue-100 text-blue-700",
  },
  review: {
    label: "Revisão",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-700",
  },
  done: {
    label: "Concluído",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
  },
  blocked: {
    label: "Bloqueado",
    icon: Ban,
    color: "bg-red-100 text-red-700",
  },
};

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-600" },
  medium: { color: "bg-blue-100 text-blue-600" },
  high: { color: "bg-orange-100 text-orange-600" },
  urgent: { color: "bg-red-100 text-red-600" },
};

export function ProfileTasksCard({ tasks }: ProfileTasksCardProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No pending tasks assigned to you
          </p>
        ) : (
          tasks.map((task) => {
            const statusInfo = statusConfig[task.status];
            const StatusIcon = statusInfo.icon;

            return (
              <Link
                key={task._id}
                href="/kanban"
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors group"
              >
                <div
                  className={`flex items-center justify-center size-8 rounded-full ${statusInfo.color}`}
                >
                  <StatusIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-orange-600 transition-colors">
                    {task.title}
                  </p>
                  {task.project && (
                    <p className="text-xs text-muted-foreground truncate">{task.project.name}</p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs shrink-0 ${priorityConfig[task.priority].color}`}
                >
                  {task.priority}
                </Badge>
              </Link>
            );
          })
        )}

        {tasks.length > 0 && (
          <Link
            href="/kanban"
            className="block text-center text-sm text-orange-500 hover:text-orange-600 font-medium pt-2"
          >
            View all tasks →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
