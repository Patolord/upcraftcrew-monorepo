import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

interface AssistantHeaderProps {
  hasAccounts: boolean;
  loading: boolean;
  onRefresh: () => void;
  onConnect: () => void;
}

export function AssistantHeader({ hasAccounts, loading, onRefresh, onConnect }: AssistantHeaderProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-foreground">Assistente</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            Todas as suas caixas de e-mail em um só lugar
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2 justify-end">
        {hasAccounts && (
          <Button
            variant="outline"
            size="sm"
            onPress={onRefresh}
            disabled={loading}
          >
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="refresh-outline" size={14} color="#737373" />
              <Text className="text-xs text-foreground font-medium">Atualizar</Text>
            </View>
          </Button>
        )}
        <Button
          onPress={onConnect}
          className="bg-brand"
          size="sm"
        >
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="add" size={16} color="#fff" />
            <Text className="text-xs text-white font-medium">Conectar Conta</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
