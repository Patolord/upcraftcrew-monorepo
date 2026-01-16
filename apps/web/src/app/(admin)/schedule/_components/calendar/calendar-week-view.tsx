"use client";

import { useMemo, useRef } from "react";
import type { ScheduleEvent } from "@/types/schedule";
import {
  getWeekDays,
  formatDateISO,
  isToday,
  getHourLabels,
  getEventPosition,
  timeToMinutes,
} from "./calendar-utils";
import { TimeGridEventBlock } from "./event-block";
import { cn } from "@/lib/utils";
import React from "react";

interface CalendarWeekViewProps {
  selectedDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
}

const HOUR_HEIGHT = 64; // pixels per hour
const START_HOUR = 6;

export function CalendarWeekView({ selectedDate, events, onEventClick }: CalendarWeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const weekDays = getWeekDays(selectedDate);
  const hourLabels = getHourLabels();

  // Get events for a specific day
  const getEventsForDay = (date: Date): ScheduleEvent[] => {
    const dateStr = formatDateISO(date);
    return events
      .filter((event) => event.startDate === dateStr && event.startTime)
      .sort((a, b) => timeToMinutes(a.startTime!) - timeToMinutes(b.startTime!));
  };

  // Calculate overlapping events and assign columns
  const getEventsWithPositions = (dayEvents: ScheduleEvent[]) => {
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
  };

  // Current time indicator position
  const currentTimeTop = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < START_HOUR) return -1;
    return ((hours - START_HOUR) * 60 + minutes) * (HOUR_HEIGHT / 60);
  }, []);

  const showCurrentTimeLine = useMemo(() => {
    return weekDays.some((day) => isToday(day));
  }, [weekDays]);

  return (
    <div className="w-full">
      {/* Header with weekday names */}
      <div className="flex border-b border-border sticky top-0 bg-card z-10">
        {/* Time column spacer */}
        <div className="w-16 flex-shrink-0" />

        {/* Day headers */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((date, index) => {
            const isTodayDate = isToday(date);
            return (
              <div
                key={index}
                className={cn(
                  "py-3 text-center border-l border-border",
                  isTodayDate && "bg-brand/5",
                )}
              >
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={cn(
                    "text-lg font-semibold mt-1",
                    isTodayDate
                      ? "w-8 h-8 mx-auto flex items-center justify-center bg-brand text-brand-foreground rounded-full"
                      : "text-foreground",
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
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

          {/* Day columns */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Hour grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hourLabels.map(({ hour }) => (
                <div
                  key={hour}
                  className="h-16 border-t border-border"
                  style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                />
              ))}
            </div>

            {/* Current time line */}
            {showCurrentTimeLine && currentTimeTop >= 0 && (
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

            {/* Day columns with events */}
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDay(date);
              const positionedEvents = getEventsWithPositions(dayEvents);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={dayIndex}
                  className={cn("relative border-l border-border", isTodayDate && "bg-brand/5")}
                  style={{ height: `${hourLabels.length * HOUR_HEIGHT}px` }}
                >
                  {/* Half hour lines */}
                  {hourLabels.map(({ hour }) => (
                    <div
                      key={`half-${hour}`}
                      className="absolute left-0 right-0 border-t border-border/50 border-dashed"
                      style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
                    />
                  ))}

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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
