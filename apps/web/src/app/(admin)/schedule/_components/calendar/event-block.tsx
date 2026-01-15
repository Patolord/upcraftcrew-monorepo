"use client";

import type { ScheduleEvent } from "@/types/schedule";
import { formatTime, getEventBgColor, getEventTextColor } from "./calendar-utils";
import { cn } from "@/lib/utils";

interface EventBlockProps {
  event: ScheduleEvent;
  onClick?: (event: ScheduleEvent) => void;
  variant?: "pill" | "block" | "compact";
  showTime?: boolean;
}

export function EventBlock({ event, onClick, variant = "pill", showTime = true }: EventBlockProps) {
  const bgColor = getEventBgColor(event.type);
  const textColor = getEventTextColor(event.type);

  if (variant === "compact") {
    return (
      <button
        onClick={() => onClick?.(event)}
        className={cn(
          "w-full text-left text-xs truncate px-2 py-1 rounded border-l-2 transition-opacity hover:opacity-80",
          bgColor,
          textColor,
        )}
        style={{ borderLeftColor: event.color }}
      >
        {showTime && event.startTime && (
          <span className="font-medium mr-1">{formatTime(event.startTime)}</span>
        )}
        <span>{event.title}</span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={() => onClick?.(event)}
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-opacity hover:opacity-80 truncate w-full text-left",
          bgColor,
          textColor,
        )}
      >
        {showTime && event.startTime && (
          <span className="font-semibold whitespace-nowrap">{formatTime(event.startTime)}</span>
        )}
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  // Block variant (for week/day views)
  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "absolute inset-x-1 rounded-lg border p-2 text-left transition-opacity hover:opacity-90 overflow-hidden",
        bgColor,
      )}
      style={{
        borderLeftColor: event.color,
        borderLeftWidth: "3px",
      }}
    >
      <div className={cn("text-sm font-medium truncate", textColor)}>{event.title}</div>
      {showTime && event.startTime && (
        <div className={cn("text-xs mt-0.5 opacity-80", textColor)}>
          {formatTime(event.startTime)}
        </div>
      )}
    </button>
  );
}

// Event block specifically for time grid (week/day view)
interface TimeGridEventBlockProps {
  event: ScheduleEvent;
  top: number;
  height: number;
  onClick?: (event: ScheduleEvent) => void;
  columnIndex?: number;
  totalColumns?: number;
}

export function TimeGridEventBlock({
  event,
  top,
  height,
  onClick,
  columnIndex = 0,
  totalColumns = 1,
}: TimeGridEventBlockProps) {
  const bgColor = getEventBgColor(event.type);
  const textColor = getEventTextColor(event.type);

  // Calculate width and left position for overlapping events
  const width = totalColumns > 1 ? `${100 / totalColumns}%` : "calc(100% - 8px)";
  const left = totalColumns > 1 ? `${(columnIndex * 100) / totalColumns}%` : "4px";

  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "absolute rounded-lg border overflow-hidden text-left transition-all hover:opacity-90 hover:shadow-md",
        bgColor,
      )}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 28)}px`,
        width,
        left,
        right: totalColumns === 1 ? "4px" : undefined,
        borderLeftColor: event.color,
        borderLeftWidth: "3px",
      }}
    >
      <div className="p-1.5 h-full flex flex-col">
        <div className={cn("text-xs font-medium truncate", textColor)}>{event.title}</div>
        {height > 40 && event.startTime && (
          <div className={cn("text-[10px] mt-0.5 opacity-75", textColor)}>
            {formatTime(event.startTime)}
          </div>
        )}
      </div>
    </button>
  );
}
