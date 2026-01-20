"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Id } from "@up-craft-crew-app/backend/convex/_generated/dataModel";

interface Event {
  _id: Id<"events">;
  title: string;
  description: string;
  type: string;
  startTime: number;
  endTime: number;
  location?: string;
  priority: "low" | "medium" | "high";
  project?: {
    _id: Id<"projects">;
    name: string;
  } | null;
}

interface ProfileEventsCardProps {
  events: Event[];
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-600" },
  medium: { color: "bg-blue-100 text-blue-600" },
  high: { color: "bg-orange-100 text-orange-600" },
};

function formatEventDate(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  // Otherwise, show full date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ProfileEventsCard({ events }: ProfileEventsCardProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No upcoming events</p>
        ) : (
          events.slice(0, 3).map((event) => (
            <Link
              key={event._id}
              href="/schedule"
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors group"
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-orange-100 text-orange-600">
                <Calendar className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-orange-600 transition-colors">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatEventDate(event.startTime)}</span>
                  {event.project && (
                    <>
                      <span>•</span>
                      <span className="truncate">{event.project.name}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs shrink-0 ${priorityConfig[event.priority].color}`}
              >
                {event.type}
              </Badge>
            </Link>
          ))
        )}

        {events.length > 0 && (
          <Link
            href="/schedule"
            className="block text-center text-sm text-orange-500 hover:text-orange-600 font-medium pt-2"
          >
            View schedule →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
