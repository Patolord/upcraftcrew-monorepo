import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NewEventModal } from "@/components/modals/NewEventModal";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("list");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  const currentMonth = selectedDate.getMonth() + 1;
  const currentYear = selectedDate.getFullYear();

  const events = useQuery(api.schedule.getEventsByMonth, {
    month: currentMonth,
    year: currentYear,
  });

  const stats = useMemo(() => {
    if (!events) return { total: 0, meetings: 0, deadlines: 0, tasks: 0 };

    return {
      total: events.length,
      meetings: events.filter((e) => e.type === "meeting").length,
      deadlines: events.filter((e) => e.type === "deadline").length,
      tasks: events.filter((e) => e.type === "task").length,
    };
  }, [events]);

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = Date.now();
    return events.filter((e) => e.startTime >= now).sort((a, b) => a.startTime - b.startTime);
  }, [events]);

  if (events === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading schedule...</Text>
      </View>
    );
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: "people" };
      case "deadline":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: "flag" };
      case "task":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          icon: "checkmark-circle",
        };
      case "reminder":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: "alarm" };
      case "milestone":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: "trophy" };
      default:
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          icon: "calendar",
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const monthName = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View className="flex-1 pt-16 ">
      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-3xl text-orange-500">Schedule</Text>
            <TouchableOpacity
              onPress={() => setIsNewEventModalOpen(true)}
              className="rounded-lg bg-orange-500 px-4 py-2"
            >
              <Text className="font-semibold text-white">+ New Event</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Total Events</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.total}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Meetings</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.meetings}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Deadlines</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.deadlines}</Text>
            </View>
            <View className="min-w-[45%] flex-1 rounded-lg border border-orange-500 bg-white p-3">
              <Text className="text-gray-500 text-xs">Tasks</Text>
              <Text className="mt-1 font-bold text-2xl text-orange-500">{stats.tasks}</Text>
            </View>
          </View>

          {/* Month Navigation */}
          <View className="rounded-lg border border-orange-500 bg-white p-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={24} color="#FF5722" />
              </TouchableOpacity>

              <Text className="font-semibold text-gray-800 text-lg">{monthName}</Text>

              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-2"
              >
                <Ionicons name="chevron-forward" size={24} color="#FF5722" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedDate(new Date())}
              className="mt-3 rounded-lg bg-orange-500 py-2"
            >
              <Text className="text-center font-medium text-white">Today</Text>
            </TouchableOpacity>
          </View>

          {/* Events List */}
          <View>
            <Text className="mb-3 font-semibold text-lg text-orange-500">Upcoming Events</Text>
            <View className="gap-4">
              {upcomingEvents.map((event) => {
                const typeColor = getEventTypeColor(event.type);
                return (
                  <View
                    key={event._id}
                    className="rounded-lg border border-orange-500 bg-white p-4"
                  >
                    {/* Header */}
                    <View className="mb-2 flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-lg text-orange-500">{event.title}</Text>
                        {event.project && (
                          <Text className="mt-1 text-gray-500 text-sm">{event.project.name}</Text>
                        )}
                      </View>
                      <View className={`rounded-full px-3 py-1 ${typeColor.bg}`}>
                        <Text className={`font-medium text-xs ${typeColor.text}`}>
                          {event.type}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    {event.description && (
                      <Text className="mb-3 text-gray-600 text-sm" numberOfLines={2}>
                        {event.description}
                      </Text>
                    )}

                    {/* Details */}
                    <View className="space-y-2">
                      {/* Date & Time */}
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                        <Text className="ml-2 text-gray-600 text-sm">
                          {formatDate(event.startTime)} at {formatTime(event.startTime)}
                        </Text>
                      </View>

                      {/* Location */}
                      {event.location && (
                        <View className="flex-row items-center">
                          <Ionicons name="location-outline" size={16} color="#9ca3af" />
                          <Text className="ml-2 text-gray-600 text-sm">{event.location}</Text>
                        </View>
                      )}

                      {/* Attendees */}
                      {event.attendees && event.attendees.length > 0 && (
                        <View className="flex-row items-center">
                          <Ionicons name="people-outline" size={16} color="#9ca3af" />
                          <Text className="ml-2 text-gray-600 text-sm">
                            {event.attendees.length} attendee
                            {event.attendees.length > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}

                      {/* Priority */}
                      {event.priority && (
                        <View className="flex-row items-center">
                          <Ionicons name="flag-outline" size={16} color="#9ca3af" />
                          <Text
                            className={`ml-2 font-medium text-sm ${getPriorityColor(event.priority)}`}
                          >
                            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}{" "}
                            priority
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Status */}
                    {event.endTime < Date.now() && (
                      <View className="mt-3 flex-row items-center rounded-lg bg-green-50 px-3 py-2">
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text className="ml-2 font-medium text-green-700 text-sm">Past Event</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {upcomingEvents.length === 0 && (
              <View className="items-center rounded-lg border border-orange-500 bg-white p-8">
                <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                <Text className="mt-4 text-gray-500">No upcoming events</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <NewEventModal isOpen={isNewEventModalOpen} onClose={() => setIsNewEventModalOpen(false)} />
    </View>
  );
}
