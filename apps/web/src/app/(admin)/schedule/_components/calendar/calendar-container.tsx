"use client";

import { useState, useMemo } from "react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import type { EventType, ScheduleEvent } from "@/types/schedule";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarHeader } from "./calendar-header";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";
import { CalendarSidebar } from "./calendar-sidebar";
import { getEventColor } from "./calendar-utils";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";

export type ViewMode = "month" | "week" | "day";

export function CalendarContainer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDayForSidebar, setSelectedDayForSidebar] = useState<Date | null>(null);

  // Check authentication and ensure user exists
  const { isSignedIn, isLoaded } = useEnsureCurrentUser();

  // Get current month/year for API
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Fetch events for the selected month - only if signed in
  const events = useQuery(
    api.schedule.getEventsByMonth,
    isSignedIn
      ? {
          year,
          month: month + 1, // API expects 1-12, JS Date uses 0-11
        }
      : "skip",
  );

  // Show loading only while auth is loading or events are loading (when signed in)
  const isLoading = !isLoaded || (isSignedIn && events === undefined);

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
        name: `${attendee.firstName} ${attendee.lastName}`,
        imageUrl: attendee.imageUrl || "/default-avatar.png",
      })),
      projectId: event.projectId,
      projectName: event.project?.name,
      color: getEventColor(event.type as EventType),
    })) as ScheduleEvent[];
  }, [events]);

  // Handle date selection from mini calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedDayForSidebar(date);
  };

  // Handle event click
  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
  };

  // Handle day click in month view
  const handleDayClick = (date: Date) => {
    setSelectedDayForSidebar(date);
    // Find first event on that day
    const dayEvents = transformedEvents.filter(
      (e) => e.startDate === date.toISOString().split("T")[0],
    );
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
    } else {
      setSelectedEvent(null);
    }
  };

  // Get events for selected day (for sidebar)
  const selectedDayEvents = useMemo(() => {
    if (!selectedDayForSidebar) return [];
    const dateStr = selectedDayForSidebar.toISOString().split("T")[0];
    return transformedEvents.filter((e) => e.startDate === dateStr);
  }, [selectedDayForSidebar, transformedEvents]);

  return (
    <div
      className="bg-card p-4 rounded-xl border border-border shadow-sm overflow-hidden"
      suppressHydrationWarning
    >
      <div className="flex flex-col lg:flex-row" suppressHydrationWarning>
        {/* Main calendar area */}
        <div className="flex-1 min-w-0">
          {/* Calendar header */}
          <CalendarHeader
            selectedDate={selectedDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDateChange={setSelectedDate}
          />

          {/* Calendar content */}
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
              </div>
            ) : (
              <>
                {viewMode === "month" && (
                  <CalendarMonthView
                    selectedDate={selectedDate}
                    events={transformedEvents}
                    onDayClick={handleDayClick}
                    onEventClick={handleEventClick}
                  />
                )}
                {viewMode === "week" && (
                  <CalendarWeekView
                    selectedDate={selectedDate}
                    events={transformedEvents}
                    onEventClick={handleEventClick}
                  />
                )}
                {viewMode === "day" && (
                  <CalendarDayView
                    selectedDate={selectedDate}
                    events={transformedEvents}
                    onEventClick={handleEventClick}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar - shows on day view or when event is selected */}
        {(viewMode === "day" || selectedEvent || selectedDayForSidebar) && (
          <CalendarSidebar
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            selectedDayEvents={selectedDayEvents}
            events={transformedEvents}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            onClose={() => {
              setSelectedEvent(null);
              setSelectedDayForSidebar(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
