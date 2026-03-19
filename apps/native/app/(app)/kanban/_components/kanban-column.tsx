import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KanbanTaskCard } from "./kanban-task-card";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignedUsers: {
    _id: string;
    name: string;
    imageUrl?: string;
  }[];
  project: {
    _id: string;
    name: string;
  } | null;
  dueDate?: number;
  labels?: Array<{
    _id: Id<"taskLabels">;
    name: string;
    color: string;
  }>;
  subtaskStats?: {
    total: number;
    completed: number;
  };
  commentCount?: number;
}

interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface KanbanColumnProps {
  column: Column;
  onTaskClick?: (taskId: Id<"tasks">) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columnColors: Record<TaskStatus, string> = {
  todo: "#f3f4f6",
  "in-progress": "#fef3c7",
  review: "#e0e7ff",
  done: "#dcfce7",
  blocked: "#fee2e2",
};

export function KanbanColumn({ column, onTaskClick, onAddTask }: KanbanColumnProps) {
  return (
    <View className="w-72 mr-4">
      {/* Column Header */}
      <View
        className="rounded-t-xl p-3 flex-row items-center justify-between"
        style={{ backgroundColor: columnColors[column.id] }}
      >
        <Text className="font-semibold text-sm text-foreground">{column.title}</Text>
        <View className="flex-row items-center gap-2">
          <View className="bg-card px-2 py-0.5 rounded">
            <Text className="text-xs font-medium text-muted-foreground">{column.tasks.length}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onAddTask?.(column.id)}
            className="p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Column Content */}
      <ScrollView
        className="bg-card rounded-b-xl p-3 max-h-[500px]"
        showsVerticalScrollIndicator={false}
      >
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <KanbanTaskCard key={task._id} task={task} onClick={() => onTaskClick?.(task._id)} />
          ))
        ) : (
          <View className="items-center py-8">
            <Ionicons name="folder-open-outline" size={32} color="#d1d5db" />
            <Text className="mt-2 text-sm text-muted-foreground">Sem tarefas</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
