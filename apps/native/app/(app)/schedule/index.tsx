import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewEventModal } from "@/components/modals/new-event-modal";

import { ScheduleHeader } from "./_components/schedule-header";
import { ScheduleStats } from "./_components/schedule-stats";
import { MonthNavigator } from "./_components/schedule-month-nav";
import { EventCard } from "./_components/schedule-event-card";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // Get month range for query
  const monthRange = useMemo(() => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return {
      startDate: start.getTime(),
      endDate: end.getTime(),
    };
  }, [selectedDate]);

  const events = useQuery(api.schedule.getEventsByMonth, monthRange);

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.type?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      );
    });
  }, [events, searchQuery]);

  // Sort events by date (upcoming first)
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.startTime - b.startTime);
  }, [filteredEvents]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, typeof sortedEvents> = {};
    sortedEvents.forEach((event) => {
      const dateKey = new Date(event.startTime).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    return groups;
  }, [sortedEvents]);

  // Loading state
  if (events === undefined) {
    return (
      <View className="flex-1 bg-admin-background pt-12">
        <View className="px-4 space-y-4">
          {/* Header skeleton */}
          <View className="space-y-4 pb-2">
            <View className="flex-row justify-between">
              <Skeleton className="h-8 w-24" />
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </View>
            </View>
            <Skeleton className="h-10 w-full rounded-full" />
          </View>

          {/* Stats skeleton */}
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-1 min-w-[45%]">
                <Skeleton className="h-20 rounded-xl" />
              </View>
            ))}
          </View>

          {/* Month nav skeleton */}
          <Skeleton className="h-24 rounded-xl" />

          {/* Events skeleton */}
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin-background pt-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 space-y-4">
          {/* Header */}
          <ScheduleHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Stats */}
          <ScheduleStats events={events} />

          {/* Month Navigator */}
          <MonthNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

          {/* Section Header */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-lg font-semibold text-foreground">Próximos Eventos</Text>
            <Button
              variant="default"
              size="sm"
              onPress={() => setIsNewEventModalOpen(true)}
              className="bg-brand"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-medium">Novo</Text>
              </View>
            </Button>
          </View>

          {/* Events List */}
          {sortedEvents.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="Nenhum evento encontrado"
              description={searchQuery ? "Tente ajustar sua busca" : "Adicione seu primeiro evento"}
            />
          ) : (
            <View>
              {Object.entries(eventsByDate).map(([date, dateEvents]) => (
                <View key={date} className="mb-4">
                  {/* Date Header */}
                  <Text className="text-sm font-semibold text-muted-foreground mb-2 capitalize">
                    {date}
                  </Text>

                  {/* Events */}
                  {dateEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onPress={() => {
                        // Open event detail
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NewEventModal isOpen={isNewEventModalOpen} onClose={() => setIsNewEventModalOpen(false)} />
    </View>
  );
}
