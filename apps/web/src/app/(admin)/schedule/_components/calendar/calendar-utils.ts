import type { EventType } from "@/types/schedule";

// Get the week number for a given date
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Get all days in a month grid (including days from prev/next months to fill the grid)
export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: Date[] = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
}

// Get all days in a week starting from the given date
export function getWeekDays(date: Date): Date[] {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
}

// Format date as ISO string (YYYY-MM-DD)
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateISO(date1) === formatDateISO(date2);
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

// Get the start and end of a week
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}

// Get the start and end of a month
export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
}

// Format date for display (e.g., "January 2026")
export function formatMonthYear(date: Date, locale = "en-US"): string {
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

// Format date range for display
export function formatDateRange(start: Date, end: Date, locale = "en-US"): string {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${start.toLocaleDateString(locale, options)} – ${end.toLocaleDateString(locale, options)}`;
}

// Get weekday names
export function getWeekdayNames(
  locale = "en-US",
  format: "long" | "short" | "narrow" = "short",
): string[] {
  const days: string[] = [];
  const date = new Date(2024, 0, 7); // A Sunday
  for (let i = 0; i < 7; i++) {
    days.push(date.toLocaleDateString(locale, { weekday: format }));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Get month name
export function getMonthName(
  month: number,
  locale = "en-US",
  format: "long" | "short" = "short",
): string {
  const date = new Date(2024, month, 1);
  return date.toLocaleDateString(locale, { month: format });
}

// Convert time string (HH:MM) to minutes from midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert minutes from midnight to time string (HH:MM)
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Format time for display (e.g., "9:00 AM")
export function formatTime(time: string, locale = "en-US"): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

// Get hour labels for time grid (6 AM to 11 PM)
export function getHourLabels(): { hour: number; label: string }[] {
  const labels: { hour: number; label: string }[] = [];
  for (let hour = 6; hour <= 23; hour++) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    labels.push({
      hour,
      label: date.toLocaleTimeString("en-US", { hour: "numeric" }),
    });
  }
  return labels;
}

// Calculate event position and height in time grid
export function getEventPosition(
  startTime: string,
  endTime: string,
  startHour = 6,
): { top: number; height: number } {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const gridStartMinutes = startHour * 60;

  const top = ((startMinutes - gridStartMinutes) / 60) * 64; // 64px per hour
  const height = ((endMinutes - startMinutes) / 60) * 64;

  return { top: Math.max(0, top), height: Math.max(32, height) };
}

// Event color mapping
export function getEventColor(type: EventType): string {
  const colorMap: Record<EventType, string> = {
    meeting: "#3b82f6", // blue
    deadline: "#ef4444", // red
    task: "#10b981", // green
    reminder: "#f59e0b", // amber
    milestone: "#8b5cf6", // purple
  };
  return colorMap[type];
}

// Get background color with opacity
export function getEventBgColor(type: EventType): string {
  const colorMap: Record<EventType, string> = {
    meeting: "bg-blue-50 border-blue-200",
    deadline: "bg-red-50 border-red-200",
    task: "bg-emerald-50 border-emerald-200",
    reminder: "bg-amber-50 border-amber-200",
    milestone: "bg-purple-50 border-purple-200",
  };
  return colorMap[type];
}

// Get text color class
export function getEventTextColor(type: EventType): string {
  const colorMap: Record<EventType, string> = {
    meeting: "text-blue-700",
    deadline: "text-red-700",
    task: "text-emerald-700",
    reminder: "text-amber-700",
    milestone: "text-purple-700",
  };
  return colorMap[type];
}

// Navigate to previous/next period based on view mode
export function navigatePeriod(
  date: Date,
  direction: "prev" | "next",
  viewMode: "month" | "week" | "day",
): Date {
  const newDate = new Date(date);

  switch (viewMode) {
    case "month":
      newDate.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
      break;
    case "week":
      newDate.setDate(date.getDate() + (direction === "next" ? 7 : -7));
      break;
    case "day":
      newDate.setDate(date.getDate() + (direction === "next" ? 1 : -1));
      break;
  }

  return newDate;
}

// Get the day of week label
export function getDayOfWeekLabel(date: Date, locale = "en-US"): string {
  return date.toLocaleDateString(locale, { weekday: "long" });
}
