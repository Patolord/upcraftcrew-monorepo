import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";
import { colors } from "@/lib/colors";

type EventType = "meeting" | "deadline" | "task" | "reminder" | "milestone";
type EventPriority = "low" | "medium" | "high";

interface Event {
  _id: Id<"events">;
  title: string;
  description?: string;
  type: EventType;
  priority?: EventPriority;
  startTime: number;
  endTime: number;
  location?: string;
  attendees?: string[];
  project?: {
    _id: string;
    name: string;
  };
}

interface EventCardProps {
  event: Event;
  onPress?: () => void;
}

const eventTypeConfig: Record<
  EventType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }
> = {
  meeting: { icon: "people", color: colors.stats.blue, bgColor: "#eff6ff" },
  deadline: { icon: "flag", color: colors.stats.red, bgColor: "#fef2f2" },
  task: { icon: "checkmark-circle", color: colors.stats.green, bgColor: "#f0fdf4" },
  reminder: { icon: "alarm", color: colors.stats.yellow, bgColor: "#fefce8" },
  milestone: { icon: "trophy", color: colors.stats.purple, bgColor: "#faf5ff" },
};

const priorityConfig: Record<EventPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: colors.priority.low },
  medium: { label: "Média", color: colors.priority.medium },
  high: { label: "Alta", color: colors.priority.high },
};

export function EventCard({ event, onPress }: EventCardProps) {
  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.task;
  const priority = event.priority ? priorityConfig[event.priority] : null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const isPast = event.endTime < Date.now();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card className="rounded-xl bg-card shadow-sm border border-border mb-3">
        <CardContent className="p-3">
          {/* Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center gap-3 flex-1">
              {/* Type Icon */}
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: typeConfig.bgColor }}
              >
                <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
              </View>

              {/* Title and Project */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                  {event.title}
                </Text>
                {event.project && (
                  <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                    {event.project.name}
                  </Text>
                )}
              </View>
            </View>

            {/* Type Badge */}
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: typeConfig.bgColor }}
            >
              <Text className="text-xs font-medium capitalize" style={{ color: typeConfig.color }}>
                {event.type}
              </Text>
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <Text className="text-xs text-muted-foreground mb-2" numberOfLines={2}>
              {event.description}
            </Text>
          )}

          {/* Details */}
          <View className="space-y-1.5">
            {/* Date & Time */}
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
              <Text className="text-xs text-muted-foreground">
                {formatDate(event.startTime)} às {formatTime(event.startTime)}
              </Text>
            </View>

            {/* Location */}
            {event.location && (
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={14} color="#9ca3af" />
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <View className="flex-row items-center gap-2">
                <Ionicons name="people-outline" size={14} color="#9ca3af" />
                <Text className="text-xs text-muted-foreground">
                  {event.attendees.length} participante{event.attendees.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-border">
            {/* Priority */}
            {priority && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="flag" size={12} color={priority.color} />
                <Text className="text-xs font-medium" style={{ color: priority.color }}>
                  {priority.label}
                </Text>
              </View>
            )}

            {/* Past Event Badge */}
            {isPast && (
              <View className="flex-row items-center gap-1 bg-green-50 px-2 py-0.5 rounded">
                <Ionicons name="checkmark-circle" size={12} color={colors.stats.green} />
                <Text className="text-xs text-green-700">Concluído</Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
