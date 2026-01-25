import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskLabel {
  _id: Id<"taskLabels">;
  name: string;
  color: string;
}

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
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
  low: { label: "Baixa", color: "#65a30d", bgColor: "#ecfccb" },
  medium: { label: "Média", color: "#d97706", bgColor: "#fef3c7" },
  high: { label: "Alta", color: "#ea580c", bgColor: "#ffedd5" },
  urgent: { label: "Urgente", color: "#dc2626", bgColor: "#fee2e2" },
};

export function KanbanTaskCard({ task, onClick }: TaskCardProps) {
  const priorityStyle = priorityConfig[task.priority];
  const hasSubtasks = task.subtaskStats && task.subtaskStats.total > 0;
  const commentCount = task.commentCount ?? 0;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onClick}>
      <Card className="rounded-xl bg-card border border-border shadow-sm mb-3">
        <CardContent className="p-3 space-y-2">
          {/* Labels Row */}
          <View className="flex-row flex-wrap gap-1">
            {/* Priority Badge */}
            <View
              className="px-2 py-0.5 rounded-md"
              style={{ backgroundColor: priorityStyle.bgColor }}
            >
              <Text className="text-[10px] font-medium" style={{ color: priorityStyle.color }}>
                {priorityStyle.label}
              </Text>
            </View>

            {/* Custom Labels */}
            {task.labels?.slice(0, 2).map((label) => (
              <View
                key={label._id}
                className="px-2 py-0.5 rounded-md"
                style={{ backgroundColor: label.color }}
              >
                <Text className="text-[10px] font-medium text-white">{label.name}</Text>
              </View>
            ))}
            {task.labels && task.labels.length > 2 && (
              <Badge variant="secondary" className="px-2 py-0.5">
                <Text className="text-[10px]">+{task.labels.length - 2}</Text>
              </Badge>
            )}
          </View>

          {/* Title */}
          <Text className="font-semibold text-sm text-foreground" numberOfLines={2}>
            {task.title}
          </Text>

          {/* Description */}
          {task.description && (
            <Text className="text-xs text-muted-foreground" numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {/* Assigned User Avatar */}
          {task.assignedUser && (
            <View className="flex-row">
              <Avatar size="sm" className="border-2 border-card">
                <AvatarImage src={task.assignedUser.imageUrl} alt={task.assignedUser.name} />
                <AvatarFallback className="bg-brand">
                  <Text className="text-xs text-white font-medium">
                    {task.assignedUser.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </AvatarFallback>
              </Avatar>
            </View>
          )}

          {/* Footer with metadata */}
          <View className="flex-row items-center justify-between pt-2 border-t border-border/50">
            <View className="flex-row items-center gap-3">
              {/* Comment Count */}
              {commentCount > 0 && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="chatbubble-outline" size={12} color="#9ca3af" />
                  <Text className="text-xs text-muted-foreground">{commentCount}</Text>
                </View>
              )}

              {/* Subtask Count */}
              {hasSubtasks && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkbox-outline" size={12} color="#9ca3af" />
                  <Text className="text-xs text-muted-foreground">
                    {task.subtaskStats!.completed}/{task.subtaskStats!.total}
                  </Text>
                </View>
              )}
            </View>

            {/* Due date */}
            {task.dueDate && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                <Text className="text-xs text-muted-foreground">
                  {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
