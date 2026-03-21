import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

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

const statusConfig: Record<
  string,
  { label: string; icon: keyof typeof Ionicons.glyphMap; bgColor: string; iconColor: string }
> = {
  todo: { label: "To Do", icon: "ellipse-outline", bgColor: "bg-gray-100", iconColor: "#6b7280" },
  "in-progress": {
    label: "Em Progresso",
    icon: "time-outline",
    bgColor: "bg-blue-100",
    iconColor: "#3b82f6",
  },
  review: {
    label: "Revisão",
    icon: "alert-circle-outline",
    bgColor: "bg-yellow-100",
    iconColor: "#eab308",
  },
  done: {
    label: "Concluído",
    icon: "checkmark-circle-outline",
    bgColor: "bg-green-100",
    iconColor: "#22c55e",
  },
  blocked: { label: "Bloqueado", icon: "ban-outline", bgColor: "bg-red-100", iconColor: "#ef4444" },
};

const priorityConfig: Record<string, string> = {
  low: "bg-gray-100",
  medium: "bg-blue-100",
  high: "bg-orange-100",
  urgent: "bg-red-100",
};

export function ProfileTasksCard({ tasks }: ProfileTasksCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Minhas Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {tasks.length === 0 ? (
          <Text className="text-sm text-muted-foreground text-center py-4">
            Nenhuma tarefa pendente
          </Text>
        ) : (
          tasks.map((task) => {
            const config = statusConfig[task.status] || statusConfig.todo;
            return (
              <TouchableOpacity
                key={task._id}
                onPress={() => router.push("/(app)/kanban" as any)}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 p-2 rounded-xl"
              >
                <View
                  className={`h-8 w-8 rounded-full items-center justify-center ${config.bgColor}`}
                >
                  <Ionicons name={config.icon} size={16} color={config.iconColor} />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                    {task.title}
                  </Text>
                  {task.project && (
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {task.project.name}
                    </Text>
                  )}
                </View>
                <Badge variant="secondary" className={priorityConfig[task.priority]}>
                  <Text className="text-xs font-medium text-foreground">{task.priority}</Text>
                </Badge>
              </TouchableOpacity>
            );
          })
        )}

        {tasks.length > 0 && (
          <TouchableOpacity onPress={() => router.push("/(app)/kanban" as any)} className="pt-2">
            <Text className="text-sm text-brand font-medium text-center">
              Ver todas as tarefas →
            </Text>
          </TouchableOpacity>
        )}
      </CardContent>
    </Card>
  );
}
