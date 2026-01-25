import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface DashboardStatsProps {
  stats: {
    activeProjects: number;
    activeMembers: number;
    totalRevenue: number;
    netProfit: number;
    avgProgress: number;
  };
  totalProjects: number;
  totalMembers: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  iconName: string;
  iconType: "ionicons" | "material";
  iconBgColor: string;
}

function StatCard({ label, value, change, iconName, iconType, iconBgColor }: StatCardProps) {
  const Icon = iconType === "ionicons" ? Ionicons : MaterialCommunityIcons;

  return (
    <Card className="flex-1 min-w-[45%] rounded-xl bg-card shadow-sm">
      <CardContent className="flex-row items-center gap-3 p-3">
        {/* Icon */}
        <View className="p-2.5 rounded-xl" style={{ backgroundColor: iconBgColor }}>
          <Icon name={iconName as any} size={22} color="#ffffff" />
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

export function DashboardStats({ stats, totalProjects, totalMembers }: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  const statCards = [
    {
      label: "Projetos",
      value: totalProjects,
      change: 55,
      iconName: "folder-open",
      iconType: "ionicons" as const,
      iconBgColor: colors.stats.teal,
    },
    {
      label: "Membros",
      value: totalMembers,
      change: 8,
      iconName: "people",
      iconType: "ionicons" as const,
      iconBgColor: colors.stats.blue,
    },
    {
      label: "Receitas",
      value: formatCurrency(stats.totalRevenue),
      change: 2,
      iconName: "trending-up",
      iconType: "ionicons" as const,
      iconBgColor: colors.stats.orangeLight,
    },
    {
      label: "Lucro",
      value: formatCurrency(stats.netProfit),
      change: stats.totalRevenue > 0 ? Math.round((stats.netProfit / stats.totalRevenue) * 100) : 0,
      iconName: "cash",
      iconType: "ionicons" as const,
      iconBgColor: colors.stats.orange,
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
