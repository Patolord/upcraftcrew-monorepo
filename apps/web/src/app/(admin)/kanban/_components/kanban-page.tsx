"use client";

import { useMemo, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { type Doc, Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { TaskKanbanBoard, type Task, type TaskStatus, type Column } from "./kanban-task-board";
import { TaskDetailModal } from "./task-detail-modal";
import { NewTaskModal } from "./new-task-modal";
import { KanbanHeader } from "./kanban-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface TaskLabel {
  _id: Id<"taskLabels">;
  name: string;
  color: string;
}

type TaskWithDetails = Doc<"tasks"> & {
  assignedUser: {
    _id: Id<"users">;
    name: string;
    imageUrl?: string;
  } | null;
  project: Doc<"projects"> | null;
  labels?: TaskLabel[];
  subtaskStats?: {
    total: number;
    completed: number;
  };
  commentCount?: number;
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

  // Modal states
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState<TaskStatus>("todo");

  // Transform tasks to match the expected interface
  const tasks = useMemo<Task[]>(() => {
    return tasksWithDetails.map(
      (task): Task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedUser: task.assignedUser
          ? {
              _id: task.assignedUser._id,
              name: task.assignedUser.name,
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
        labels: task.labels,
        subtaskStats: task.subtaskStats,
        commentCount: task.commentCount,
      }),
    );
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
        task.status?.toLowerCase().includes(query) ||
        task.labels?.some((label) => label.name.toLowerCase().includes(query))
      );
    });
  }, [tasks, searchQuery]);

  // Group tasks by status
  const columns = useMemo<Column[]>(() => {
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: "todo", title: "Para Fazer" },
      { id: "in-progress", title: "Em Progresso" },
      { id: "review", title: "Revisão" },
      { id: "done", title: "Concluído" },
    ];

    return statuses.map(
      (status): Column => ({
        id: status.id,
        title: status.title,
        tasks: filteredTasks.filter((task) => task.status === status.id),
      }),
    );
  }, [filteredTasks]);

  // Handlers
  const handleTaskClick = (taskId: Id<"tasks">) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskDefaultStatus(status);
    setIsNewTaskOpen(true);
  };

  const handleNewTaskOpenChange = (open: boolean) => {
    setIsNewTaskOpen(open);
    if (!open) {
      setNewTaskDefaultStatus("todo");
    }
  };

  const handleTaskDetailOpenChange = (open: boolean) => {
    setIsTaskDetailOpen(open);
    if (!open) {
      setSelectedTaskId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header Section */}
      <div className="shrink-0 p-4 md:p-6 pb-4 space-y-4 md:space-y-6">
        <KanbanHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Team Members Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-base md:text-lg font-semibold">Membros da Equipe</h2>
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
                    className="size-8 md:size-10 border-2 border-background ring-2 ring-pink-300"
                  >
                    <AvatarImage src={member.imageUrl} alt={fullName} />
                    <AvatarFallback className="bg-linear-to-br from-orange-400 to-pink-500 text-white text-[10px] md:text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {teamMembers.length > 5 && (
                <Avatar className="size-8 md:size-10 border-2 border-background">
                  <AvatarFallback className="bg-muted text-muted-foreground text-[10px] md:text-xs">
                    +{teamMembers.length - 5}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Kanban Board */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto px-4 md:px-6 pb-6">
        <TaskKanbanBoard
          columns={columns}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        open={isTaskDetailOpen}
        onOpenChange={handleTaskDetailOpenChange}
      />

      {/* New Task Modal */}
      <NewTaskModal
        open={isNewTaskOpen}
        onOpenChange={handleNewTaskOpenChange}
        defaultStatus={newTaskDefaultStatus}
      />
    </div>
  );
}
