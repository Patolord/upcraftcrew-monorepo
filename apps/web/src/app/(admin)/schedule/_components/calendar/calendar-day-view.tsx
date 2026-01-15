"use client";

import { useMemo, useRef } from "react";
import type { ScheduleEvent } from "@/types/schedule";
import {
  formatDateISO,
  isToday,
  getHourLabels,
  getEventPosition,
  timeToMinutes,
  getWeekDays,
} from "./calendar-utils";
import { TimeGridEventBlock } from "./event-block";
import { cn } from "@/lib/utils";

interface CalendarDayViewProps {
  selectedDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
}

const HOUR_HEIGHT = 64; // pixels per hour
const START_HOUR = 6;

export function CalendarDayView({ selectedDate, events, onEventClick }: CalendarDayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hourLabels = getHourLabels();
  const weekDays = getWeekDays(selectedDate);

  // Get events for the selected day
  const dayEvents = useMemo(() => {
    const dateStr = formatDateISO(selectedDate);
    return events
      .filter((event) => event.startDate === dateStr && event.startTime)
      .sort((a, b) => timeToMinutes(a.startTime!) - timeToMinutes(b.startTime!));
  }, [selectedDate, events]);

  // Calculate overlapping events and assign columns
  const positionedEvents = useMemo(() => {
    const positioned: Array<{
      event: ScheduleEvent;
      top: number;
      height: number;
      columnIndex: number;
      totalColumns: number;
    }> = [];

    // Group overlapping events
    const groups: ScheduleEvent[][] = [];
    let currentGroup: ScheduleEvent[] = [];

    dayEvents.forEach((event) => {
      if (!event.startTime || !event.endTime) return;

      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);

      // Check if this event overlaps with current group
      const overlapsWithGroup = currentGroup.some((groupEvent) => {
        if (!groupEvent.startTime || !groupEvent.endTime) return false;
        const groupStart = timeToMinutes(groupEvent.startTime);
        const groupEnd = timeToMinutes(groupEvent.endTime);
        return eventStart < groupEnd && eventEnd > groupStart;
      });

      if (overlapsWithGroup || currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [event];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // Assign positions to events in each group
    groups.forEach((group) => {
      group.forEach((event, index) => {
        if (!event.startTime || !event.endTime) return;
        const { top, height } = getEventPosition(event.startTime, event.endTime, START_HOUR);
        positioned.push({
          event,
          top,
          height,
          columnIndex: index,
          totalColumns: group.length,
        });
      });
    });

    return positioned;
  }, [dayEvents]);

  // Current time indicator position
  const currentTimeTop = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < START_HOUR) return -1;
    return ((hours - START_HOUR) * 60 + minutes) * (HOUR_HEIGHT / 60);
  }, []);

  const isTodayDate = isToday(selectedDate);

  return (
    <div className="w-full">
      {/* Header with weekday names - shows context of the week */}
      <div className="flex border-b border-border sticky top-0 bg-card z-10">
        {/* Time column spacer */}
        <div className="w-16 flex-shrink-0" />

        {/* Day headers showing full week context */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((date, index) => {
            const isSelectedDay = formatDateISO(date) === formatDateISO(selectedDate);
            const isTodayInWeek = isToday(date);

            return (
              <div
                key={index}
                className={cn(
                  "py-3 text-center border-l border-border",
                  isSelectedDay && "bg-muted",
                )}
              >
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold mt-1",
                    isTodayInWeek
                      ? "w-8 h-8 mx-auto flex items-center justify-center bg-brand text-brand-foreground rounded-full"
                      : isSelectedDay
                        ? "text-foreground font-bold"
                        : "text-muted-foreground",
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid - single day */}
      <div ref={scrollRef} className="overflow-y-auto max-h-[calc(100vh-320px)] relative">
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {hourLabels.map(({ hour, label }) => (
              <div key={hour} className="h-16 flex items-start justify-end pr-3 -mt-2">
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Single day column */}
          <div
            className={cn("flex-1 relative border-l border-border", isTodayDate && "bg-brand/5")}
            style={{ height: `${hourLabels.length * HOUR_HEIGHT}px` }}
          >
            {/* Hour grid lines */}
            {hourLabels.map(({ hour }) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-border"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
              />
            ))}

            {/* Half hour lines */}
            {hourLabels.map(({ hour }) => (
              <div
                key={`half-${hour}`}
                className="absolute left-0 right-0 border-t border-border/50 border-dashed"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
              />
            ))}

            {/* Current time line */}
            {isTodayDate && currentTimeTop >= 0 && (
              <div
                className="absolute left-0 right-0 z-20 pointer-events-none"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                  <div className="flex-1 h-[2px] bg-red-500" />
                </div>
              </div>
            )}

            {/* Events */}
            {positionedEvents.map(({ event, top, height, columnIndex, totalColumns }) => (
              <TimeGridEventBlock
                key={event.id}
                event={event}
                top={top}
                height={height}
                columnIndex={columnIndex}
                totalColumns={totalColumns}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
