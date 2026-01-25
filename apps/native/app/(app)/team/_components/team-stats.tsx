import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface Project {
  _id?: string;
}

interface TeamMember {
  status: "online" | "offline" | "away" | "busy";
  projects?: (Project | null)[];
}

interface TeamStatsProps {
  teamMembers: TeamMember[];
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

export function TeamStats({ teamMembers }: TeamStatsProps) {
  const totalMembers = teamMembers.length;
  const onlineCount = teamMembers.filter((m) => m.status === "online").length;
  const busyCount = teamMembers.filter((m) => m.status === "busy").length;

  // Count unique active projects across all members
  const activeProjectIds = new Set<string>();
  teamMembers.forEach((member) => {
    member.projects?.forEach((project) => {
      if (project && project._id) {
        activeProjectIds.add(project._id);
      }
    });
  });
  const activeProjects = activeProjectIds.size;

  const statCards: StatCardProps[] = [
    {
      label: "Total",
      value: totalMembers,
      change: 8,
      iconName: "people",
      iconBgColor: colors.stats.teal,
    },
    {
      label: "Online",
      value: onlineCount,
      change: 12,
      iconName: "radio-button-on",
      iconBgColor: colors.stats.green,
    },
    {
      label: "Projetos",
      value: activeProjects,
      change: 15,
      iconName: "folder-open",
      iconBgColor: colors.stats.orangeLight,
    },
    {
      label: "Ocupado",
      value: busyCount,
      change: 5,
      iconName: "time",
      iconBgColor: colors.stats.red,
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
