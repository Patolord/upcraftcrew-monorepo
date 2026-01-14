import type { ScheduleEvent } from "@/types/schedule";
import { eventTypeConfig } from "./event-type-config";
import Image from "next/image";
import { ClockIcon, MapPinIcon } from "lucide-react";
export function EventCard({ event }: { event: ScheduleEvent }) {
  const eventType = eventTypeConfig[event.type];

  return (
    <div
      className="card bg-base-100 border-l-4 border-base-300 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: event.color }}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`iconify ${eventType.icon} size-4`} style={{ color: event.color }} />
              <h3 className="font-semibold text-sm">{event.title}</h3>
            </div>
            {event.description && (
              <p className="text-xs text-base-content/60 line-clamp-2">{event.description}</p>
            )}
          </div>
          <span className={`badge ${eventType.color} badge-xs`}>{eventType.label}</span>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-base-content/60">
          {event.startTime && (
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="avatar-group -space-x-3">
              {event.attendees.slice(0, 3).map((attendee) => (
                <div key={attendee.imageUrl} className="avatar border-2 border-base-100">
                  <div className="w-6">
                    <Image src={attendee.imageUrl} alt={attendee.name} width={24} height={24} />
                  </div>
                </div>
              ))}
            </div>
            {event.attendees.length > 3 && (
              <span className="text-xs text-base-content/60">
                +{event.attendees.length - 3} more
              </span>
            )}
          </div>
        )}

        {event.projectName && (
          <div className="mt-2">
            <span className="badge badge-ghost badge-xs">{event.projectName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
