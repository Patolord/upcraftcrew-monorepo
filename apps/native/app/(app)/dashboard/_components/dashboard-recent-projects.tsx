import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  client: string;
  budget: number;
  progress: number;
  status: "planning" | "in-progress" | "completed";
}

interface DashboardRecentProjectsProps {
  projects: Project[];
}

const statusConfig = {
  planning: {
    label: "Planejando",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "warning" as const,
  },
  completed: {
    label: "Concluído",
    variant: "success" as const,
  },
};

function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const status = statusConfig[project.status];

  const handlePress = () => {
    // Navigation to project detail would go here
    // router.push(`/projects/${project._id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="py-3 border-b border-border last:border-b-0"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {project.name}
          </Text>
          <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
            {project.client}
          </Text>
        </View>
        <Badge variant={status.variant}>{status.label}</Badge>
      </View>

      {/* Progress */}
      <View className="mt-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs text-muted-foreground">Progresso</Text>
          <Text className="text-xs font-medium text-brand">{project.progress}%</Text>
        </View>
        <Progress value={project.progress} className="h-1.5" />
      </View>

      {/* Budget */}
      {project.budget > 0 && (
        <Text className="text-xs text-muted-foreground mt-2">
          Orçamento:{" "}
          <Text className="font-medium text-foreground">${project.budget.toLocaleString()}</Text>
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function DashboardRecentProjects({ projects }: DashboardRecentProjectsProps) {
  const recentProjects = projects.slice(0, 5);

  return (
    <Card className="rounded-xl bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Projetos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentProjects.length > 0 ? (
          recentProjects.map((project) => <ProjectRow key={project._id} project={project} />)
        ) : (
          <View className="py-8 items-center">
            <Text className="text-sm text-muted-foreground">Nenhum projeto encontrado</Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}
