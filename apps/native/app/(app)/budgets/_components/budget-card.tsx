import { View, Text } from "react-native";
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
import { Button } from "@/components/ui/button";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

type BudgetStatus = "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client: string;
  description: string;
  status: BudgetStatus;
  totalAmount?: number;
  validUntil?: number;
  createdAt: number;
  project?: {
    _id: string;
    name: string;
  } | null;
}

interface BudgetCardProps {
  budget: Budget;
  onPress?: () => void;
}

const statusConfig: Record<
  BudgetStatus,
  { label: string; variant: "default" | "success" | "destructive" | "warning" | "secondary" }
> = {
  draft: { label: "Rascunho", variant: "secondary" },
  sent: { label: "Enviado", variant: "default" },
  approved: { label: "Aprovado", variant: "success" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "secondary" },
  expired: { label: "Expirado", variant: "warning" },
};

export function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const status = statusConfig[budget.status] || statusConfig.draft;

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="rounded-xl bg-card shadow-sm border border-border">
      <CardHeader className="pb-2">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <CardTitle className="text-base" numberOfLines={1}>
              {budget.title}
            </CardTitle>
            <CardDescription className="mt-0.5">{budget.client}</CardDescription>
          </View>
          <Badge variant={status.variant}>{status.label}</Badge>
        </View>
      </CardHeader>

      <CardContent className="py-2">
        {/* Description */}
        {budget.description && (
          <Text className="text-xs text-muted-foreground mb-3" numberOfLines={2}>
            {budget.description}
          </Text>
        )}

        {/* Budget Amount */}
        {budget.totalAmount && (
          <View className="bg-muted/50 p-3 rounded-lg mb-3">
            <Text className="text-xs text-muted-foreground mb-0.5">Valor Total</Text>
            <Text className="text-lg font-bold text-foreground">
              {formatCurrency(budget.totalAmount)}
            </Text>
          </View>
        )}

        {/* Project */}
        {budget.project && (
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="folder-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {budget.project.name}
            </Text>
          </View>
        )}

        {/* Dates */}
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
          <Text className="text-xs text-muted-foreground">
            Criado em {formatDate(budget.createdAt)}
          </Text>
        </View>

        {/* Valid Until */}
        {budget.validUntil && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-muted-foreground">
              Válido até {formatDate(budget.validUntil)}
            </Text>
          </View>
        )}
      </CardContent>

      <CardFooter className="justify-end pt-2">
        <Button variant="default" size="sm" onPress={onPress} className="bg-brand">
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={14} color="#ffffff" />
            <Text className="text-white text-xs font-medium">Detalhes</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
}
