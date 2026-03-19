import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { NewTaskModal } from "@/components/modals/new-task-modal";

import { KanbanHeader } from "./_components/kanban-header";
import { KanbanTeamAvatars } from "./_components/kanban-team-avatars";
import { KanbanColumn } from "./_components/kanban-column";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

interface Column {
  id: TaskStatus;
  title: string;
  tasks: any[];
}

export default function KanbanPage() {
  const tasks = useQuery(api.tasks.getTasks);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [, setNewTaskDefaultStatus] = useState<TaskStatus>("todo");
  const [, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);

  // Transform tasks to match the expected interface
  const transformedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedUsers: (task.assignedUsers ?? []).map((u: any) => ({
        _id: u._id,
        name: u.name || "",
        imageUrl: u.imageUrl,
      })),
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
    }));
  }, [tasks]);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return transformedTasks;

    const query = searchQuery.toLowerCase();
    return transformedTasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name?.toLowerCase().includes(query) ||
        task.assignedUsers?.some((u: any) => u.name?.toLowerCase().includes(query)) ||
        task.priority?.toLowerCase().includes(query) ||
        task.status?.toLowerCase().includes(query)
      );
    });
  }, [transformedTasks, searchQuery]);

  // Group tasks by status into columns
  const columns = useMemo<Column[]>(() => {
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: "todo", title: "Para Fazer" },
      { id: "in-progress", title: "Em Progresso" },
      { id: "review", title: "Revisão" },
      { id: "done", title: "Concluído" },
    ];

    return statuses.map((status) => ({
      id: status.id,
      title: status.title,
      tasks: filteredTasks.filter((task) => task.status === status.id),
    }));
  }, [filteredTasks]);

  // Handlers
  const handleTaskClick = (taskId: Id<"tasks">) => {
    setSelectedTaskId(taskId);
    // Could open task detail modal here
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskDefaultStatus(status);
    setIsNewTaskModalOpen(true);
  };

  // Loading state
  if (tasks === undefined || teamMembers === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="space-y-4 pb-2">
            <View className="flex-row justify-between">
              <Skeleton className="h-8 w-24" />
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </View>
            </View>
            <Skeleton className="h-10 w-full rounded-full" />
          </View>

          {/* Team avatars skeleton */}
          <View className="flex-row items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <View className="flex-row -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </View>
          </View>

          {/* Columns skeleton */}
          <View className="flex-row">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="w-72 mr-4">
                <Skeleton className="h-12 rounded-t-xl" />
                <Skeleton className="h-64 rounded-b-xl" />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <View className="flex-1">
        {/* Fixed Header Section */}
        <View className="px-4 space-y-4 pb-4">
          <KanbanHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <KanbanTeamAvatars teamMembers={teamMembers} />
        </View>

        {/* Scrollable Kanban Board */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          ))}
        </ScrollView>
      </View>

      {/* New Task Modal */}
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} />
    </View>
  );
}
