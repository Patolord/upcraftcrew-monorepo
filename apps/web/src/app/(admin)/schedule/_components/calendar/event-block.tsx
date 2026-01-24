"use client";

import type { ScheduleEvent, SourceType } from "@/types/schedule";
import {
  formatTime,
  getSourceTypeBgColor,
  getSourceTypeTextColor,
  getSourceTypeIconColor,
} from "./calendar-utils";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  FolderIcon,
  FileTextIcon,
  CheckSquareIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import React from "react";

// Get icon component based on source type
function getSourceTypeIcon(sourceType: SourceType, transactionType?: "income" | "expense") {
  const iconClass = "h-3 w-3 flex-shrink-0";

  switch (sourceType) {
    case "event":
      return <CalendarIcon className={iconClass} />;
    case "project":
      return <FolderIcon className={iconClass} />;
    case "budget":
      return <FileTextIcon className={iconClass} />;
    case "transaction":
      return transactionType === "expense" ? (
        <TrendingDownIcon className={iconClass} />
      ) : (
        <TrendingUpIcon className={iconClass} />
      );
    case "task":
      return <CheckSquareIcon className={iconClass} />;
    default:
      return <CalendarIcon className={iconClass} />;
  }
}

interface EventBlockProps {
  event: ScheduleEvent;
  onClick?: (event: ScheduleEvent) => void;
  variant?: "pill" | "block" | "compact";
  showTime?: boolean;
}

export function EventBlock({ event, onClick, variant = "pill", showTime = true }: EventBlockProps) {
  const bgColor = getSourceTypeBgColor(event.sourceType, event.transactionType);
  const textColor = getSourceTypeTextColor(event.sourceType, event.transactionType);
  const iconColor = getSourceTypeIconColor(event.sourceType, event.transactionType);
  const Icon = getSourceTypeIcon(event.sourceType, event.transactionType);

  if (variant === "compact") {
    return (
      <button
        onClick={() => onClick?.(event)}
        className={cn(
          "w-full text-left text-xs truncate px-2 py-1 rounded border-l-2 transition-opacity hover:opacity-80 flex items-center gap-1.5",
          bgColor,
          textColor,
        )}
        style={{ borderLeftColor: event.color }}
      >
        <span className={iconColor}>{Icon}</span>
        {showTime && event.startTime && event.sourceType === "event" && (
          <span className="font-medium">{formatTime(event.startTime)}</span>
        )}
        <span className="truncate">{event.title}</span>
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
        <span className={cn("flex-shrink-0", iconColor)}>{Icon}</span>
        {showTime && event.startTime && event.sourceType === "event" && (
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
      <div className="flex items-center gap-1.5">
        <span className={cn("flex-shrink-0", iconColor)}>{Icon}</span>
        <div className={cn("text-sm font-medium truncate", textColor)}>{event.title}</div>
      </div>
      {showTime && event.startTime && event.sourceType === "event" && (
        <div className={cn("text-xs mt-0.5 opacity-80 ml-4.5", textColor)}>
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
  const bgColor = getSourceTypeBgColor(event.sourceType, event.transactionType);
  const textColor = getSourceTypeTextColor(event.sourceType, event.transactionType);
  const iconColor = getSourceTypeIconColor(event.sourceType, event.transactionType);
  const Icon = getSourceTypeIcon(event.sourceType, event.transactionType);

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
        <div className="flex items-center gap-1">
          <span className={cn("flex-shrink-0", iconColor)}>{Icon}</span>
          <div className={cn("text-xs font-medium truncate", textColor)}>{event.title}</div>
        </div>
        {height > 40 && event.startTime && event.sourceType === "event" && (
          <div className={cn("text-[10px] mt-0.5 opacity-75 ml-4", textColor)}>
            {formatTime(event.startTime)}
          </div>
        )}
        {/* Show responsible person for projects and tasks */}
        {height > 60 && event.responsible && (
          <div className={cn("text-[10px] mt-0.5 opacity-75 truncate", textColor)}>
            {event.responsible.name}
          </div>
        )}
        {/* Show amount for transactions */}
        {height > 50 &&
          event.sourceType === "transaction" &&
          event.transactionAmount !== undefined && (
            <div
              className={cn(
                "text-[10px] mt-0.5 font-medium",
                event.transactionType === "income" ? "text-emerald-600" : "text-red-600",
              )}
            >
              {event.transactionType === "income" ? "+" : "-"}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                event.transactionAmount,
              )}
            </div>
          )}
      </div>
    </button>
  );
}
