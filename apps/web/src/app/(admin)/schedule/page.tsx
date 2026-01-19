import { CalendarContainer } from "./_components/calendar/calendar-container";
import { ScheduleHeader } from "./_components/schedule-header";
import React from "react";

// Force dynamic rendering for consistency with other admin pages
export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return (
    <div className="flex flex-col h-full">
      <ScheduleHeader />
      <div className="pr-6">
        <CalendarContainer />
      </div>
    </div>
  );
}
