"use client";

import { useState, useMemo } from "react";
import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import type { EventType, ScheduleEvent, SourceType } from "@/types/schedule";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarHeader } from "./calendar-header";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";
import { CalendarSidebar } from "./calendar-sidebar";
import { NewEventModal } from "./new-event-modal";
import { getSourceTypeColor, getTransactionColor } from "./calendar-utils";
import { useEnsureCurrentUser } from "@/hooks/use-ensure-current-user";
import React from "react";

export type ViewMode = "month" | "week" | "day";

export function CalendarContainer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDayForSidebar, setSelectedDayForSidebar] = useState<Date | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // Check authentication and ensure user exists
  const { isSignedIn, isLoaded } = useEnsureCurrentUser();

  // Get current month/year for API
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Fetch all schedule items for the selected month - only if signed in
  const scheduleItems = useQuery(
    api.schedule.getAllScheduleItemsByMonth,
    isSignedIn
      ? {
          year,
          month: month + 1, // API expects 1-12, JS Date uses 0-11
        }
      : "skip",
  );

  // Show loading only while auth is loading or items are loading (when signed in)
  const isLoading = !isLoaded || (isSignedIn && scheduleItems === undefined);

  // Transform Convex schedule items to match ScheduleEvent type
  const transformedEvents = useMemo(() => {
    if (!scheduleItems) return [];

    return scheduleItems.map((item) => {
      // Get the color based on source type and transaction type
      let color = getSourceTypeColor(item.sourceType as SourceType);
      if (item.sourceType === "transaction" && item.transactionType) {
        color = getTransactionColor(item.transactionType as "income" | "expense");
      }

      const baseEvent: ScheduleEvent = {
        id: item.sourceId,
        sourceId: item.sourceId,
        sourceType: item.sourceType as SourceType,
        title: item.title,
        description: item.description,
        type: item.type as EventType,
        priority: item.priority as "low" | "medium" | "high",
        startDate: new Date(item.date).toISOString().split("T")[0],
        endDate: new Date(item.endDate).toISOString().split("T")[0],
        startTime: new Date(item.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        endTime: new Date(item.endDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        projectId: item.projectId,
        projectName: item.project?.name,
        color,
        client: item.client,
      };

      // Add source-specific fields based on sourceType
      if (item.sourceType === "event") {
        return {
          ...baseEvent,
          location: item.location,
          attendees: item.attendees?.map(
            (attendee: { _id: string; name: string; imageUrl?: string }) => ({
              id: attendee._id,
              name: attendee.name,
              imageUrl: attendee.imageUrl,
            }),
          ),
        };
      }

      if (item.sourceType === "project") {
        return {
          ...baseEvent,
          responsible: item.responsible
            ? {
                id: item.responsible._id,
                name: item.responsible.name,
                imageUrl: item.responsible.imageUrl,
              }
            : undefined,
          team: item.team?.map((member: { _id: string; name: string; imageUrl?: string }) => ({
            id: member._id,
            name: member.name,
            imageUrl: member.imageUrl,
          })),
          projectStatus: item.projectStatus,
          projectProgress: item.projectProgress,
        };
      }

      if (item.sourceType === "budget") {
        return {
          ...baseEvent,
          budgetStatus: item.budgetStatus,
          budgetAmount: item.budgetAmount,
          budgetCurrency: item.budgetCurrency,
        };
      }

      if (item.sourceType === "transaction") {
        return {
          ...baseEvent,
          transactionType: item.transactionType,
          transactionAmount: item.transactionAmount,
          transactionCategory: item.transactionCategory,
          transactionStatus: item.transactionStatus,
        };
      }

      if (item.sourceType === "task") {
        return {
          ...baseEvent,
          responsible: item.responsible
            ? {
                id: item.responsible._id,
                name: item.responsible.name,
                imageUrl: item.responsible.imageUrl,
              }
            : undefined,
          taskStatus: item.taskStatus,
        };
      }

      return baseEvent;
    }) as ScheduleEvent[];
  }, [scheduleItems]);

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
            onAddEvent={() => setIsNewEventModalOpen(true)}
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

      {/* New Event Modal */}
      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        preSelectedDate={selectedDayForSidebar || selectedDate}
      />
    </div>
  );
}
