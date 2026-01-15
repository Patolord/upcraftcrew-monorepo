"use client";

import Image from "next/image";
import type { ScheduleEvent } from "@/types/schedule";
import { formatTime } from "./calendar-utils";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BellIcon,
  CopyIcon,
  TrashIcon,
  PencilIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventDetailPanelProps {
  event: ScheduleEvent;
  onClose?: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const eventDate = new Date(event.startDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Get time range
  const timeRange =
    event.startTime && event.endTime
      ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
      : event.startTime
        ? formatTime(event.startTime)
        : "All day";

  return (
    <div className="h-full flex flex-col">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground truncate pr-2">{event.title}</h3>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-xs" className="rounded-lg h-6 w-6">
            <CopyIcon className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="rounded-lg h-6 w-6">
            <TrashIcon className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="rounded-lg h-6 w-6">
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Event details */}
      <div className="space-y-2.5 flex-1">
        {/* Date */}
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-2">
          <ClockIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <p className="text-xs text-foreground">{timeRange}</p>
        </div>

        {/* Reminder */}
        <div className="flex items-start gap-2">
          <BellIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <p className="text-xs text-foreground">10 min before</p>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-foreground">{event.location}</p>
          </div>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {event.attendees.length} guests
              </span>
              <span className="text-[10px] text-muted-foreground">
                {event.attendees.length} yes
              </span>
            </div>

            {/* Attendee avatars */}
            <div className="flex items-center -space-x-1.5">
              {event.attendees.slice(0, 4).map((attendee, index) => (
                <div
                  key={attendee.id}
                  className="relative"
                  style={{ zIndex: event.attendees!.length - index }}
                >
                  <Image
                    src={attendee.imageUrl}
                    alt={attendee.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-card object-cover"
                  />
                </div>
              ))}
              {event.attendees.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-[9px] font-medium text-muted-foreground">
                    +{event.attendees.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-medium text-foreground mb-1">About</h4>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
              {event.description}
            </p>
          </div>
        )}

        {/* Project badge */}
        {event.projectName && (
          <div className="pt-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground">
              {event.projectName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
