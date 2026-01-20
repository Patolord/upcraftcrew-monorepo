"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { type Doc } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { TaskKanbanBoard, type Task, type TaskStatus, type Column } from "./kanban-task-board";
import { KanbanHeader } from "./kanban-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ZapIcon, StarIcon, Share2Icon } from "lucide-react";
import React from "react";

type TaskWithDetails = Doc<"tasks"> & {
  assignedUser: Doc<"users"> | null;
  project: Doc<"projects"> | null;
};

type TeamMember = Doc<"users">;

interface KanbanPageProps {
  preloadedTasks: Preloaded<typeof api.tasks.getTasks>;
  preloadedTeamMembers: Preloaded<typeof api.team.getTeamMembers>;
}

export function KanbanPage({ preloadedTasks, preloadedTeamMembers }: KanbanPageProps) {
  const tasksWithDetails = usePreloadedQuery(preloadedTasks) as TaskWithDetails[];
  const teamMembers = usePreloadedQuery(preloadedTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");

  // Transform tasks to match the expected interface
  const tasks = useMemo<Task[]>(() => {
    return tasksWithDetails.map((task) => {
      const transformed: Task = {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedUser: task.assignedUser
          ? {
              _id: task.assignedUser._id,
              name: `${task.assignedUser.firstName} ${task.assignedUser.lastName}`.trim(),
              imageUrl: task.assignedUser.imageUrl,
            }
          : null,
        project: task.project
          ? {
              _id: task.project._id,
              name: task.project.name,
            }
          : null,
        dueDate: task.dueDate,
      };
      return transformed;
    });
  }, [tasksWithDetails]);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name?.toLowerCase().includes(query) ||
        task.assignedUser?.name?.toLowerCase().includes(query) ||
        task.priority?.toLowerCase().includes(query) ||
        task.status?.toLowerCase().includes(query)
      );
    });
  }, [tasks, searchQuery]);

  // Group tasks by status
  const columns = useMemo<Column[]>(() => {
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: "todo", title: "TODO" },
      { id: "in-progress", title: "IN WORK" },
      { id: "review", title: "QA" },
      { id: "done", title: "COMPLETED" },
    ];

    return statuses.map(
      (status): Column => ({
        id: status.id,
        title: status.title,
        tasks: filteredTasks.filter((task) => task.status === status.id),
      }),
    );
  }, [filteredTasks]);

  return (
    <div className="p-6 space-y-6">
      <KanbanHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Team Members Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map((member: TeamMember) => {
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
            <ZapIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <StarIcon className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Share2Icon className="size-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <TaskKanbanBoard columns={columns} />
    </div>
  );
}
