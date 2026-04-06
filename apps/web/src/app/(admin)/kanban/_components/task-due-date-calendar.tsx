"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo } from "react";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface TaskDueDateCalendarProps {
  viewMonth: Date;
  onViewMonthChange: (d: Date) => void;
  selectedDueDate?: number;
  onSelectDay: (startOfDayMs: number) => void;
}

export function TaskDueDateCalendar({
  viewMonth,
  onViewMonthChange,
  selectedDueDate,
  onSelectDay,
}: TaskDueDateCalendarProps) {
  const today = new Date();
  const selectedDate = selectedDueDate !== undefined ? new Date(selectedDueDate) : null;

  const { year, month, cells } = useMemo(() => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();

    const list: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) list.push(null);
    for (let d = 1; d <= lastDate; d++) list.push(d);

    return { year: y, month: m, cells: list };
  }, [viewMonth]);

  return (
    <div className="w-72 rounded-xl border-2 border-orange-400 bg-card p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-lg hover:bg-orange-100"
          onClick={() => onViewMonthChange(new Date(year, month - 1, 1))}
        >
          <ChevronLeft className="size-4 text-orange-600" />
        </Button>
        <span className="text-sm font-semibold">
          {MONTHS[month]} {year}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-lg hover:bg-orange-100"
          onClick={() => onViewMonthChange(new Date(year, month + 1, 1))}
        >
          <ChevronRight className="size-4 text-orange-600" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-8 text-xs font-semibold text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="h-9" />;

          const cellDate = new Date(year, month, day);
          const isToday = sameDay(cellDate, today);
          const isSelected = selectedDate !== null && sameDay(cellDate, selectedDate);

          let cls =
            "flex items-center justify-center h-9 w-full rounded-lg text-sm cursor-pointer transition-colors";

          if (isSelected) {
            cls += " bg-orange-600 text-white font-semibold ring-2 ring-orange-300 ring-offset-1 ring-offset-background";
          } else if (isToday) {
            cls += " bg-orange-500 text-white font-semibold";
          } else {
            cls += " text-foreground hover:bg-orange-50";
          }

          return (
            <button
              key={day}
              type="button"
              className={cls}
              onClick={() => onSelectDay(new Date(year, month, day, 12).getTime())}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
