import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";

interface Client {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card">
      <CardContent className="p-4">
        <View className="flex-row items-start gap-3">
          <View className="h-12 w-12 rounded-full bg-orange-100 items-center justify-center">
            <Ionicons name="business-outline" size={24} color="#ff8e29" />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
              {client.name}
            </Text>
            <Text className="text-sm text-muted-foreground mt-0.5" numberOfLines={1}>
              {client.company || "Sem empresa"}
            </Text>
          </View>
        </View>

        <View className="mt-3 gap-1.5">
          {client.email && (
            <View className="flex-row items-center gap-2">
              <Ionicons name="mail-outline" size={14} color="#737373" />
              <Text className="text-sm text-muted-foreground flex-1" numberOfLines={1}>
                {client.email}
              </Text>
            </View>
          )}
          {client.phone && (
            <View className="flex-row items-center gap-2">
              <Ionicons name="call-outline" size={14} color="#737373" />
              <Text className="text-sm text-muted-foreground">{client.phone}</Text>
            </View>
          )}
          {!client.email && !client.phone && (
            <Text className="text-sm text-muted-foreground">Sem informações de contato</Text>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
