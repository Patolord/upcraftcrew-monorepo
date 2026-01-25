import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface Event {
  type: "meeting" | "deadline" | "task" | "reminder" | "milestone";
}

interface ScheduleStatsProps {
  events: Event[];
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

export function ScheduleStats({ events }: ScheduleStatsProps) {
  const total = events.length;
  const meetings = events.filter((e) => e.type === "meeting").length;
  const deadlines = events.filter((e) => e.type === "deadline").length;
  const tasks = events.filter((e) => e.type === "task").length;

  const statCards: StatCardProps[] = [
    {
      label: "Total",
      value: total,
      change: 10,
      iconName: "calendar",
      iconBgColor: colors.stats.teal,
    },
    {
      label: "Reuniões",
      value: meetings,
      change: 15,
      iconName: "people",
      iconBgColor: colors.stats.blue,
    },
    {
      label: "Deadlines",
      value: deadlines,
      change: 5,
      iconName: "flag",
      iconBgColor: colors.stats.red,
    },
    {
      label: "Tarefas",
      value: tasks,
      change: 8,
      iconName: "checkmark-circle",
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
