import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface Project {
  status: "planning" | "in-progress" | "completed";
}

interface ProjectsStatsProps {
  projects: Project[];
}

interface StatCardProps {
  label: string;
  value: number;
  change: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
}

function StatCard({ label, value, change, iconName, iconBgColor }: StatCardProps) {
  return (
    <Card className="flex-1 min-w-[45%] rounded-xl bg-card shadow-sm">
      <CardContent className="flex-row items-center gap-3 p-3">
        {/* Icon */}
        <View className="p-2.5 rounded-xl" style={{ backgroundColor: iconBgColor }}>
          <Ionicons name={iconName} size={22} color="#ffffff" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-xs text-muted-foreground">{label}</Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-xl font-bold text-foreground">{value}</Text>
            <Text className="text-xs text-green-500 font-medium">+{change}%</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

export function ProjectsStats({ projects }: ProjectsStatsProps) {
  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === "in-progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const planning = projects.filter((p) => p.status === "planning").length;

  const statCards: StatCardProps[] = [
    {
      label: "Total",
      value: totalProjects,
      change: 55,
      iconName: "folder-open",
      iconBgColor: colors.stats.teal,
    },
    {
      label: "Em Progresso",
      value: inProgress,
      change: 12,
      iconName: "play-circle",
      iconBgColor: colors.stats.blue,
    },
    {
      label: "Concluído",
      value: completed,
      change: 8,
      iconName: "checkmark-circle",
      iconBgColor: colors.stats.green,
    },
    {
      label: "Planejando",
      value: planning,
      change: 15,
      iconName: "clipboard",
      iconBgColor: colors.stats.orangeLight,
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-3">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </View>
  );
}
