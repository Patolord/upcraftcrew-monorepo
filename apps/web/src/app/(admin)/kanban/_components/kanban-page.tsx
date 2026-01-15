"use client";

import { useMemo } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { TaskKanbanBoard } from "./task-kanban-board";
import { KanbanHeader } from "./kanban-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Zap, Star, Share2 } from "lucide-react";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

interface Column {
  id: TaskStatus;
  title: string;
  tasks: any[];
}

interface KanbanPageProps {
  preloadedTasks: Preloaded<typeof api.tasks.getTasks>;
  preloadedTeamMembers: Preloaded<typeof api.team.getTeamMembers>;
}

export function KanbanPage({ preloadedTasks, preloadedTeamMembers }: KanbanPageProps) {
  const tasks = usePreloadedQuery(preloadedTasks);
  const teamMembers = usePreloadedQuery(preloadedTeamMembers);

  // Group tasks by status
  const columns = useMemo(() => {
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: "todo", title: "TODO" },
      { id: "in-progress", title: "IN WORK" },
      { id: "review", title: "QA" },
      { id: "done", title: "COMPLETED" },
    ];

    return statuses.map((status) => ({
      id: status.id,
      title: status.title,
      tasks: tasks.filter((task: any) => task.status === status.id),
    }));
  }, [tasks]);

  return (
    <div className="p-6 space-y-6">
      <KanbanHeader />

      {/* Team Members Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map((member: any) => {
              const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim();
              const initials = fullName
                ? fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U";

              return (
                <Avatar
                  key={member._id}
                  className="size-10 border-2 border-background ring-2 ring-pink-300"
                >
                  <AvatarImage src={member.imageUrl} alt={fullName} />
                  <AvatarFallback className="bg-pink-400 text-white text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {teamMembers.length > 5 && (
              <Avatar className="size-10 border-2 border-background">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  +{teamMembers.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Zap className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Star className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Share2 className="size-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <TaskKanbanBoard columns={columns as Column[]} />
    </div>
  );
}
