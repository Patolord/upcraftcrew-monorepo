import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Event {
  _id: Id<"events">;
  title: string;
  description: string;
  type: string;
  startTime: number;
  endTime: number;
  location?: string;
  priority: "low" | "medium" | "high";
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface ProfileEventsCardProps {
  events: Event[];
}

const priorityConfig: Record<string, string> = {
  low: "bg-gray-100",
  medium: "bg-blue-100",
  high: "bg-orange-100",
};

function formatEventDate(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Amanhã, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProfileEventsCard({ events }: ProfileEventsCardProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {events.length === 0 ? (
          <Text className="text-sm text-muted-foreground text-center py-4">
            Nenhum evento próximo
          </Text>
        ) : (
          events.slice(0, 3).map((event) => (
            <TouchableOpacity
              key={event._id}
              onPress={() => router.push("/(app)/schedule" as any)}
              activeOpacity={0.7}
              className="flex-row items-start gap-3 p-2 rounded-xl"
            >
              <View className="h-8 w-8 rounded-full items-center justify-center bg-orange-100">
                <Ionicons name="calendar-outline" size={16} color="#f97316" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                  {event.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-muted-foreground">
                    {formatEventDate(event.startTime)}
                  </Text>
                  {event.project && (
                    <>
                      <Text className="text-xs text-muted-foreground">•</Text>
                      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                        {event.project.name}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <Badge variant="secondary" className={priorityConfig[event.priority]}>
                <Text className="text-xs font-medium text-foreground">{event.type}</Text>
              </Badge>
            </TouchableOpacity>
          ))
        )}

        {events.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/(app)/schedule" as any)}
            className="pt-2"
          >
            <Text className="text-sm text-brand font-medium text-center">
              Ver agenda →
            </Text>
          </TouchableOpacity>
        )}
      </CardContent>
    </Card>
  );
}
