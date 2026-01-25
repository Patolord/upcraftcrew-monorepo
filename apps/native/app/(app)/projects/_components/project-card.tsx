import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { colors } from "@/lib/colors";

interface TeamMember {
  _id?: string;
  name?: string;
  imageUrl?: string;
}

interface Project {
  _id: Id<"projects">;
  name: string;
  client?: string;
  description?: string;
  status: "planning" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  startDate: number;
  endDate?: number;
  progress: number;
  budget?: number;
  team?: TeamMember[];
  manager?: {
    name?: string;
    imageUrl?: string;
  };
}

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
}

const statusConfig = {
  planning: {
    label: "Planejamento",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "default" as const,
  },
  completed: {
    label: "Concluído",
    variant: "success" as const,
  },
};

const priorityConfig = {
  low: {
    label: "Baixa",
    color: colors.priority.low,
  },
  medium: {
    label: "Média",
    color: colors.priority.medium,
  },
  high: {
    label: "Alta",
    color: colors.priority.high,
  },
  urgent: {
    label: "Urgente",
    color: colors.priority.urgent,
  },
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="rounded-xl bg-card shadow-sm border border-border">
      <CardHeader className="pb-2">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <CardTitle className="text-base" numberOfLines={1}>
              {project.name}
            </CardTitle>
            {project.client && (
              <CardDescription className="mt-0.5">{project.client}</CardDescription>
            )}
          </View>
          <Badge variant={status.variant}>{status.label}</Badge>
        </View>
      </CardHeader>

      <CardContent className="py-2">
        {/* Description */}
        {project.description && (
          <Text className="text-xs text-muted-foreground mb-3" numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {/* Manager */}
        {project.manager?.name && (
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-xs text-muted-foreground">Manager:</Text>
            <Avatar size="sm">
              <AvatarImage src={project.manager.imageUrl} alt={project.manager.name} />
              <AvatarFallback>
                <Text className="text-xs text-muted-foreground">
                  {project.manager.name.charAt(0).toUpperCase()}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text className="text-xs font-medium text-foreground">{project.manager.name}</Text>
          </View>
        )}

        {/* Progress */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs text-muted-foreground">Progresso</Text>
            <Text className="text-xs font-medium text-foreground">{project.progress}%</Text>
          </View>
          <Progress value={project.progress} className="h-1.5" />
        </View>

        {/* Budget & Schedule */}
        <View className="flex-row gap-4 mb-3">
          {project.budget && (
            <View className="flex-1">
              <Text className="text-xs text-muted-foreground mb-0.5">Orçamento</Text>
              <Text className="text-sm font-medium text-foreground">
                ${project.budget.toLocaleString()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">Cronograma</Text>
            <Text className="text-sm font-medium text-foreground">
              {formatDate(project.startDate)}
              {project.endDate && ` - ${formatDate(project.endDate)}`}
            </Text>
          </View>
        </View>

        {/* Team Avatars & Priority */}
        <View className="flex-row items-center justify-between">
          {/* Team */}
          {project.team && project.team.length > 0 && (
            <View className="flex-row -space-x-2">
              {project.team.slice(0, 4).map((member, index) => (
                <Avatar key={member._id || index} size="sm" className="border-2 border-card">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback>
                    <Text className="text-xs text-muted-foreground">
                      {member.name?.charAt(0)?.toUpperCase() || "?"}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.team.length > 4 && (
                <Avatar size="sm" className="border-2 border-card">
                  <AvatarFallback className="bg-muted">
                    <Text className="text-xs text-muted-foreground">
                      +{project.team.length - 4}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              )}
            </View>
          )}

          {/* Priority */}
          <View className="flex-row items-center gap-1">
            <Ionicons name="flag" size={12} color={priority.color} />
            <Text className="text-xs font-medium" style={{ color: priority.color }}>
              {priority.label}
            </Text>
          </View>
        </View>
      </CardContent>

      <CardFooter className="justify-end pt-2">
        <Button variant="default" size="sm" onPress={onPress} className="bg-brand">
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={14} color="#ffffff" />
            <Text className="text-white text-xs font-medium">Visualizar</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
}
