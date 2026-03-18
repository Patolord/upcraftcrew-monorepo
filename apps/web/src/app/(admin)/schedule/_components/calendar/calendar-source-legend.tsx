"use client";

import type { SourceType } from "@/types/schedule";
import { getSourceTypeColor, getSourceTypeLabel } from "./calendar-utils";
import { cn } from "@/lib/utils";
import React from "react";

interface SourceEntry {
  key: string;
  sourceType: SourceType;
  accountEmail?: string;
}

interface CalendarSourceLegendProps {
  sources: SourceEntry[];
  hiddenSources: Set<string>;
  onToggle: (key: string) => void;
}

export function CalendarSourceLegend({
  sources,
  hiddenSources,
  onToggle,
}: CalendarSourceLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 md:px-4 py-2 border-b border-border">
      {sources.map((source) => {
        const isHidden = hiddenSources.has(source.key);
        const color = getSourceTypeColor(source.sourceType);
        const label =
          source.sourceType === "google-calendar" || source.sourceType === "outlook-calendar"
            ? source.accountEmail || getSourceTypeLabel(source.sourceType)
            : getSourceTypeLabel(source.sourceType);

        return (
          <button
            key={source.key}
            onClick={() => onToggle(source.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium transition-all border",
              isHidden
                ? "opacity-40 bg-muted border-border text-muted-foreground line-through"
                : "bg-card border-border text-foreground hover:bg-muted/50",
            )}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: isHidden ? undefined : color }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
