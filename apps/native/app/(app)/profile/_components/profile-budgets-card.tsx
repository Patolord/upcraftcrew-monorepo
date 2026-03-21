import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Budget {
  _id: Id<"budgets">;
  title: string;
  client?: string;
  status: "draft" | "sent" | "approved" | "rejected" | "cancelled" | "expired";
  totalAmount: number;
  currency: string;
  validUntil: number;
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface ProfileBudgetsCardProps {
  budgets: Budget[];
}

const statusConfig: Record<
  string,
  { label: string; icon: keyof typeof Ionicons.glyphMap; bgColor: string; iconColor: string }
> = {
  draft: {
    label: "Rascunho",
    icon: "document-text-outline",
    bgColor: "bg-gray-100",
    iconColor: "#6b7280",
  },
  sent: { label: "Enviado", icon: "send-outline", bgColor: "bg-blue-100", iconColor: "#3b82f6" },
  approved: {
    label: "Aprovado",
    icon: "checkmark-circle-outline",
    bgColor: "bg-green-100",
    iconColor: "#22c55e",
  },
  rejected: {
    label: "Rejeitado",
    icon: "close-circle-outline",
    bgColor: "bg-red-100",
    iconColor: "#ef4444",
  },
  expired: {
    label: "Expirado",
    icon: "warning-outline",
    bgColor: "bg-yellow-100",
    iconColor: "#eab308",
  },
  cancelled: {
    label: "Cancelado",
    icon: "warning-outline",
    bgColor: "bg-gray-100",
    iconColor: "#9ca3af",
  },
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function ProfileBudgetsCard({ budgets }: ProfileBudgetsCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Meus Orçamentos</CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {budgets.length === 0 ? (
          <Text className="text-sm text-muted-foreground text-center py-4">
            Nenhum orçamento pendente
          </Text>
        ) : (
          budgets.slice(0, 3).map((budget) => {
            const config = statusConfig[budget.status] || statusConfig.draft;
            return (
              <TouchableOpacity
                key={budget._id}
                onPress={() => router.push("/(app)/budgets" as any)}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 p-2 rounded-xl"
              >
                <View
                  className={`h-8 w-8 rounded-full items-center justify-center ${config.bgColor}`}
                >
                  <Ionicons name={config.icon} size={16} color={config.iconColor} />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                    {budget.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {budget.client}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-semibold text-brand">
                    {formatCurrency(budget.totalAmount, budget.currency)}
                  </Text>
                  <Badge variant="secondary" className={`mt-0.5 ${config.bgColor}`}>
                    <Text className="text-[10px] font-medium text-foreground">{config.label}</Text>
                  </Badge>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {budgets.length > 0 && (
          <TouchableOpacity onPress={() => router.push("/(app)/budgets" as any)} className="pt-2">
            <Text className="text-sm text-brand font-medium text-center">
              Ver todos os orçamentos →
            </Text>
          </TouchableOpacity>
        )}
      </CardContent>
    </Card>
  );
}
