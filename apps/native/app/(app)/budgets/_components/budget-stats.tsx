import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface BudgetStatistics {
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  cancelled: number;
  totalValue: number;
  approvedValue: number;
  conversionRate: number;
}

interface BudgetStatsProps {
  statistics: BudgetStatistics;
}

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
}

function StatCard({ label, value, change, iconName, iconBgColor }: StatCardProps) {
  const isPositive = change >= 0;

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
            <Text
              className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
};

export function BudgetStats({ statistics }: BudgetStatsProps) {
  const statCards: StatCardProps[] = [
    {
      label: "Total",
      value: statistics.total.toString(),
      change: 10,
      iconName: "document-text",
      iconBgColor: colors.stats.teal,
    },
    {
      label: "Aprovados",
      value: statistics.approved.toString(),
      change: 15,
      iconName: "checkmark-circle",
      iconBgColor: colors.stats.green,
    },
    {
      label: "Valor Total",
      value: formatCurrency(statistics.totalValue),
      change: 8,
      iconName: "wallet",
      iconBgColor: colors.stats.blue,
    },
    {
      label: "Conversão",
      value: `${Math.round(statistics.conversionRate)}%`,
      change: 5,
      iconName: "trending-up",
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
