import type { ScheduleEvent } from "@/types/schedule";

export function CalendarDay({
  date,
  events,
  isCurrentMonth,
  isToday,
}: {
  date: Date;
  events: ScheduleEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}) {
  const dayEvents = events.filter((event) => event.startDate === date.toISOString().split("T")[0]);

  return (
    <div
      className={`min-h-24 border border-base-300 p-2 ${
        !isCurrentMonth ? "bg-base-200/50" : "bg-base-100"
      } ${isToday ? "ring-2 ring-primary" : ""}`}
    >
      <div
        className={`text-sm font-medium mb-1 ${
          isToday ? "badge badge-primary badge-sm" : !isCurrentMonth ? "text-base-content/40" : ""
        }`}
      >
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {dayEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
            style={{ backgroundColor: event.color + "20", color: event.color }}
          >
            {event.startTime && <span className="font-medium">{event.startTime} </span>}
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-base-content/60 pl-1">+{dayEvents.length - 3} more</div>
        )}
      </div>
    </div>
  );
}
