"use client";

import type { ScheduleEvent } from "@/types/schedule";
import { MiniCalendar } from "./mini-calendar";
import { EventDetailPanel } from "./event-detail-panel";
import { EventBlock } from "./event-block";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { formatDateISO } from "./calendar-utils";

interface CalendarSidebarProps {
  selectedDate: Date;
  selectedEvent: ScheduleEvent | null;
  selectedDayEvents: ScheduleEvent[];
  events: ScheduleEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: ScheduleEvent) => void;
  onClose: () => void;
}

export function CalendarSidebar({
  selectedDate,
  selectedEvent,
  selectedDayEvents,
  events,
  onDateSelect,
  onEventClick,
  onClose,
}: CalendarSidebarProps) {
  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col">
      {/* Close button for mobile */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">Details</span>
        <Button variant="ghost" size="icon-xs" onClick={onClose} className="rounded-lg">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mini Calendar */}
        <div className="p-3 border-b border-border">
          <MiniCalendar selectedDate={selectedDate} events={events} onDateSelect={onDateSelect} />
        </div>

        {/* Event Detail or Day Events List */}
        <div className="p-3">
          {selectedEvent ? (
            <EventDetailPanel event={selectedEvent} onClose={onClose} />
          ) : selectedDayEvents.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2">
                {formattedSelectedDate}
              </h3>
              <div className="space-y-1.5">
                {selectedDayEvents.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    variant="compact"
                    onClick={onEventClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">No events selected</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Click on an event or day to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
