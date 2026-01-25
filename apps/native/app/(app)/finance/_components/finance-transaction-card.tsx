import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { colors } from "@/lib/colors";

interface Transaction {
  _id: Id<"transactions">;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "completed" | "failed";
  date: number;
  projectId?: Id<"projects">;
  project?: {
    name: string;
  };
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  salary: "briefcase",
  freelance: "laptop",
  investment: "trending-up",
  sales: "cart",
  rent: "home",
  utilities: "bulb",
  supplies: "cube",
  marketing: "megaphone",
  travel: "airplane",
  food: "restaurant",
  other: "ellipsis-horizontal",
};

export function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isIncome = transaction.type === "income";
  const amountColor = isIncome ? colors.transaction.income : colors.transaction.expense;
  const prefix = isIncome ? "+" : "-";

  const statusConfig = {
    completed: { label: "Concluído", variant: "success" as const },
    pending: { label: "Pendente", variant: "warning" as const },
    failed: { label: "Falhou", variant: "destructive" as const },
  };

  const status = statusConfig[transaction.status];
  const iconName = categoryIcons[transaction.category] || categoryIcons.other;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card className="rounded-xl bg-card shadow-sm border border-border mb-3">
        <CardContent className="p-3">
          <View className="flex-row items-center gap-3">
            {/* Icon */}
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: isIncome ? `${amountColor}15` : `${amountColor}15` }}
            >
              <Ionicons name={iconName} size={20} color={amountColor} />
            </View>

            {/* Info */}
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                {transaction.description}
              </Text>
              <View className="flex-row items-center gap-2 mt-0.5">
                <Text className="text-xs text-muted-foreground capitalize">
                  {transaction.category.replace("-", " ")}
                </Text>
                {transaction.project && (
                  <>
                    <Text className="text-xs text-muted-foreground">•</Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {transaction.project.name}
                    </Text>
                  </>
                )}
              </View>
            </View>

            {/* Amount and Status */}
            <View className="items-end">
              <Text className="text-sm font-bold" style={{ color: amountColor }}>
                {prefix}${transaction.amount.toLocaleString()}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </Text>
                <Badge variant={status.variant} className="px-1.5 py-0">
                  <Text className="text-[10px]">{status.label}</Text>
                </Badge>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
