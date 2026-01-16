"use client";

import type { ScheduleEvent } from "@/types/schedule";
import { getMonthDays, formatDateISO, isToday, getWeekdayNames } from "./calendar-utils";
import { EventBlock } from "./event-block";
import { cn } from "@/lib/utils";
import React from "react";

interface CalendarMonthViewProps {
  selectedDate: Date;
  events: ScheduleEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: ScheduleEvent) => void;
}

export function CalendarMonthView({
  selectedDate,
  events,
  onDayClick,
  onEventClick,
}: CalendarMonthViewProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const days = getMonthDays(year, month);
  const weekdays = getWeekdayNames("en-US", "short");

  // Get events for a specific day
  const getEventsForDay = (date: Date): ScheduleEvent[] => {
    const dateStr = formatDateISO(date);
    return events.filter((event) => event.startDate === dateStr);
  };

  // Group days into weeks for rendering
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="border-l border-border">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((date, dayIndex) => {
              const isCurrentMonth = date.getMonth() === month;
              const isTodayDate = isToday(date);
              const dayEvents = getEventsForDay(date);
              const maxVisibleEvents = 2;
              const moreCount = dayEvents.length - maxVisibleEvents;

              return (
                <div
                  key={dayIndex}
                  onClick={() => onDayClick(date)}
                  className={cn(
                    "min-h-[108px] border-r border-b border-border p-1.5 cursor-pointer transition-colors hover:bg-muted/50",
                    !isCurrentMonth && "bg-muted/30",
                  )}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-start mb-0.5">
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 text-xs",
                        isTodayDate && "bg-brand text-brand-foreground rounded-full font-semibold",
                        !isTodayDate && !isCurrentMonth && "text-muted-foreground/50",
                        !isTodayDate && isCurrentMonth && "text-foreground",
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-0.5" onClick={(e) => e.stopPropagation()}>
                    {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                      <EventBlock
                        key={event.id}
                        event={event}
                        variant="pill"
                        onClick={onEventClick}
                      />
                    ))}
                    {moreCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDayClick(date);
                        }}
                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors pl-1"
                      >
                        +{moreCount} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
