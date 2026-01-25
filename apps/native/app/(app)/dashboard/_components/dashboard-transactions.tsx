import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
}

interface DashboardTransactionsProps {
  transactions: Transaction[];
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const amountColor = isIncome ? colors.transaction.income : colors.transaction.expense;
  const iconName = isIncome ? "arrow-down" : "arrow-up";
  const prefix = isIncome ? "+" : "-";

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <View className="flex-row items-center py-3 border-b border-border last:border-b-0">
      {/* Icon */}
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: isIncome ? `${amountColor}15` : `${amountColor}15` }}
      >
        <Ionicons name={iconName} size={16} color={amountColor} />
      </View>

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text className="text-xs text-muted-foreground capitalize">
          {transaction.category.replace("-", " ")}
        </Text>
      </View>

      {/* Amount and Date */}
      <View className="items-end">
        <Text className="text-sm font-semibold" style={{ color: amountColor }}>
          {prefix}${transaction.amount.toLocaleString()}
        </Text>
        <Text className="text-xs text-muted-foreground">{formatDate(transaction.date)}</Text>
      </View>
    </View>
  );
}

export function DashboardTransactions({ transactions }: DashboardTransactionsProps) {
  const recentTransactions = transactions.filter((t) => t.status === "completed").slice(0, 5);

  return (
    <Card className="rounded-xl bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionRow key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <View className="py-8 items-center">
            <Text className="text-sm text-muted-foreground">Nenhuma transação encontrada</Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}
