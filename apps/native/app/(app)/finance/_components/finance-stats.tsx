import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/colors";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingIncome: number;
  pendingExpenses: number;
}

interface FinanceStatsProps {
  summary: FinancialSummary;
  totalTransactions: number;
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

export function FinanceStats({ summary, totalTransactions }: FinanceStatsProps) {
  const statCards: StatCardProps[] = [
    {
      label: "Total",
      value: formatCurrency(summary.totalIncome),
      change: 12,
      iconName: "trending-up",
      iconBgColor: colors.stats.green,
    },
    {
      label: "Despesas",
      value: formatCurrency(summary.totalExpenses),
      change: -8,
      iconName: "trending-down",
      iconBgColor: colors.stats.red,
    },
    {
      label: "Lucro",
      value: formatCurrency(summary.netProfit),
      change: 25,
      iconName: "wallet",
      iconBgColor: colors.stats.blue,
    },
    {
      label: "Transações",
      value: totalTransactions.toString(),
      change: 15,
      iconName: "receipt",
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
