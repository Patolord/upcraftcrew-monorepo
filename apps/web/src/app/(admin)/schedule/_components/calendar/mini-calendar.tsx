"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScheduleEvent } from "@/types/schedule";
import { getMonthDays, formatDateISO, isToday, isSameDay, getWeekdayNames } from "./calendar-utils";
import { cn } from "@/lib/utils";
import React from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  events: ScheduleEvent[];
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, events, onDateSelect }: MiniCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(new Date(selectedDate));

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const days = getMonthDays(year, month);
  const weekdays = getWeekdayNames("en-US", "narrow");

  const handlePrevMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(month - 1);
    setDisplayMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(month + 1);
    setDisplayMonth(newDate);
  };

  // Check if a date has events
  const hasEvents = (date: Date): boolean => {
    const dateStr = formatDateISO(date);
    return events.some((event) => event.startDate === dateStr);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handlePrevMonth}
          className="rounded-lg h-6 w-6"
        >
          <ChevronLeftIcon className="h-3 w-3" />
        </Button>
        <h3 className="text-xs font-medium text-foreground">
          {displayMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleNextMonth}
          className="rounded-lg h-6 w-6"
        >
          <ChevronRightIcon className="h-3 w-3" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="text-center text-[10px] font-medium text-muted-foreground py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const hasEventsOnDay = hasEvents(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "relative flex flex-col items-center justify-center w-7 h-7 text-[10px] rounded-full transition-colors",
                !isCurrentMonth && "text-muted-foreground/50",
                isCurrentMonth && !isSelected && "text-foreground hover:bg-muted",
                isSelected && "bg-brand text-brand-foreground",
                isTodayDate && !isSelected && "ring-1 ring-brand text-brand font-semibold",
              )}
            >
              {date.getDate()}
              {/* Event indicator dot */}
              {hasEventsOnDay && (
                <span
                  className={cn(
                    "absolute bottom-0.5 w-0.5 h-0.5 rounded-full",
                    isSelected ? "bg-brand-foreground" : "bg-brand",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
