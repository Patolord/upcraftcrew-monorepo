"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import type { ViewMode } from "./calendar-container";
import {
  formatMonthYear,
  formatDateRange,
  getWeekNumber,
  getWeekRange,
  getMonthRange,
  navigatePeriod,
  getDayOfWeekLabel,
  getMonthName,
} from "./calendar-utils";
import React from "react";

interface CalendarHeaderProps {
  selectedDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDateChange: (date: Date) => void;
}

export function CalendarHeader({
  selectedDate,
  viewMode,
  onViewModeChange,
  onDateChange,
}: CalendarHeaderProps) {
  const weekNumber = getWeekNumber(selectedDate);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const getDateRangeText = () => {
    switch (viewMode) {
      case "month": {
        const { start, end } = getMonthRange(year, month);
        return formatDateRange(start, end);
      }
      case "week": {
        const { start, end } = getWeekRange(selectedDate);
        return formatDateRange(start, end);
      }
      case "day":
        return getDayOfWeekLabel(selectedDate);
    }
  };

  const handlePrevious = () => {
    onDateChange(navigatePeriod(selectedDate, "prev", viewMode));
  };

  const handleNext = () => {
    onDateChange(navigatePeriod(selectedDate, "next", viewMode));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-muted rounded-lg">
          <span className="text-[10px] font-semibold uppercase text-brand">
            {getMonthName(month).toUpperCase().slice(0, 3)}
          </span>
          <span className="text-xl font-bold text-foreground leading-none">
            {selectedDate.getDate()}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {formatMonthYear(selectedDate)}
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Week {weekNumber}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{getDateRangeText()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={handlePrevious} className="rounded-lg">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handleNext} className="rounded-lg">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday} className="rounded-lg">
          Today
        </Button>
        <Select value={viewMode} onValueChange={(value) => onViewModeChange(value as ViewMode)}>
          <SelectTrigger className="w-[130px] rounded-lg h-8">
            <SelectValue placeholder="Select view">
              {viewMode === "month" ? "Month view" : viewMode === "week" ? "Week view" : "Day view"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month view</SelectItem>
            <SelectItem value="week">Week view</SelectItem>
            <SelectItem value="day">Day view</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="rounded-lg bg-brand hover:bg-brand/90 text-brand-foreground">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add event
        </Button>
      </div>
    </div>
  );
}
