"use client";

import { EventType, ScheduleEvent } from "@/types/schedule";
import { Button } from "@base-ui/react/button";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState, useMemo } from "react";
import { CalendarDay } from "./_components/calendar-day";
import { EventCard } from "./_components/event-card";

// Helper function to get event color based on type
function getEventColor(type: EventType): string {
  const colorMap: Record<EventType, string> = {
    meeting: "#3b82f6", // blue
    deadline: "#ef4444", // red
    task: "#10b981", // green
    reminder: "#f59e0b", // amber
    milestone: "#8b5cf6", // purple
  };
  return colorMap[type];
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current month calendar
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const calendarDays: Date[] = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch events for the selected month
  const events = useQuery(api.schedule.getEventsByMonth, {
    year,
    month: month + 1, // API expects 1-12, JS Date uses 0-11
  });

  const isLoading = events === undefined;

  // Transform Convex events to match ScheduleEvent type
  const transformedEvents = useMemo(() => {
    if (!events) return [];

    return events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      type: event.type as EventType,
      priority: event.priority,
      startDate: new Date(event.startTime).toISOString().split("T")[0],
      endDate: new Date(event.endTime).toISOString().split("T")[0],
      startTime: new Date(event.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: new Date(event.endTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      location: event.location,
      attendees: event.attendees?.map((attendee) => ({
        id: attendee._id,
        name: attendee.name,
        imageUrl: attendee.imageUrl || "/default-avatar.png",
      })),
      projectId: event.projectId,
      projectName: event.project?.name,
      color: getEventColor(event.type as EventType),
    })) as ScheduleEvent[];
  }, [events]);

  // Filter events
  const filteredEvents = transformedEvents.filter((event) => {
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesType;
  });

  // Get upcoming events
  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.startDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10);

  const previousMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage your events, meetings, and deadlines
          </p>
        </div>
        <Button className="btn btn-primary gap-2" onClick={() => setIsModalOpen(true)}>
          <span className="iconify lucide--plus size-5" />
          New Event
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="stats shadow border border-base-300">
              <div className="stat py-4">
                <div className="stat-title text-xs">Total Events</div>
                <div className="stat-value text-2xl">{transformedEvents.length}</div>
              </div>
            </div>
            <div className="stats shadow border border-base-300">
              <div className="stat py-4">
                <div className="stat-title text-xs">Meetings</div>
                <div className="stat-value text-2xl text-primary">
                  {transformedEvents.filter((e) => e.type === "meeting").length}
                </div>
              </div>
            </div>
            <div className="stats shadow border border-base-300">
              <div className="stat py-4">
                <div className="stat-title text-xs">Deadlines</div>
                <div className="stat-value text-2xl text-error">
                  {transformedEvents.filter((e) => e.type === "deadline").length}
                </div>
              </div>
            </div>
            <div className="stats shadow border border-base-300">
              <div className="stat py-4">
                <div className="stat-title text-xs">Tasks</div>
                <div className="stat-value text-2xl text-success">
                  {transformedEvents.filter((e) => e.type === "task").length}
                </div>
              </div>
            </div>
            <div className="stats shadow border border-base-300">
              <div className="stat py-4">
                <div className="stat-title text-xs">Upcoming</div>
                <div className="stat-value text-2xl">{upcomingEvents.length}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button className="btn btn-sm" onClick={previousMonth}>
                <span className="iconify lucide--chevron-left size-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-48 text-center">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button className="btn btn-sm" onClick={nextMonth}>
                <span className="iconify lucide--chevron-right size-4" />
              </Button>
              <Button className="btn btn-sm btn-ghost" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="select select-bordered select-sm w-36"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as EventType | "all")}
              >
                <option value="all">All Types</option>
                <option value="meeting">Meetings</option>
                <option value="deadline">Deadlines</option>
                <option value="task">Tasks</option>
                <option value="reminder">Reminders</option>
                <option value="milestone">Milestones</option>
              </select>

              <div className="join">
                <Button
                  className={`btn btn-sm join-item ${viewMode === "month" ? "btn-active" : ""}`}
                  onClick={() => setViewMode("month")}
                >
                  <span className="iconify lucide--calendar size-4" />
                  Month
                </Button>
                <Button
                  className={`btn btn-sm join-item ${viewMode === "list" ? "btn-active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <span className="iconify lucide--list size-4" />
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar or List View */}
          {viewMode === "month" ? (
            <div className="bg-base-100 rounded-box border border-base-300 overflow-hidden">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 bg-base-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium p-2 border-r border-base-300 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date) => {
                  const isToday =
                    date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
                  const isCurrentMonth = date.getMonth() === month;

                  return (
                    <CalendarDay
                      key={date.toISOString()}
                      date={date}
                      events={filteredEvents}
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold">Upcoming Events</h3>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <span className="iconify lucide--calendar-x size-16 text-base-content/20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                  <p className="text-base-content/60 text-sm">
                    Try adjusting your filters or add new events
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* New Event Modal */}
      <NewEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedDate={selectedDate}
      />
    </div>
  );
}
