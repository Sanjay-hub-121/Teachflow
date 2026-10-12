import { addDays, dayKeyInZone, wallClock, zonedWallTimeToUtc } from "./time.ts";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  kind: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  recurrence: string;
  recurrenceUntil: string | null;
  taskId: string | null;
  version: number;
  remind: boolean;
  reminderLeadMinutes: number | null;
};

export type Occurrence = {
  eventId: string;
  title: string;
  kind: string;
  day: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  taskId: string | null;
};

function clock(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function advance(date: string, recurrence: string): string | null {
  if (recurrence === "daily") return addDays(date, 1);
  if (recurrence === "weekly") return addDays(date, 7);
  if (recurrence === "monthly") {
    const [year, month, day] = date.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const last = new Date(Date.UTC(nextYear, nextMonth, 0)).getUTCDate();
    return `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
  }
  return null;
}

export function expandEvents(events: CalendarEvent[], rangeStart: string, rangeEnd: string, timeZone: string): Occurrence[] {
  const occurrences: Occurrence[] = [];
  for (const event of events) {
    const start = new Date(event.startsAt);
    if (Number.isNaN(start.getTime())) continue;
    const originDay = dayKeyInZone(start, timeZone);
    const minutes = wallClock(start, timeZone).minutes;
    const duration = event.endsAt ? new Date(event.endsAt).getTime() - start.getTime() : 60 * 60_000;
    let day = originDay;
    let guard = 0;
    while (day && day <= rangeEnd && guard < 400) {
      guard += 1;
      const until = event.recurrenceUntil;
      if (until && day > until) break;
      if (day >= rangeStart) {
        const startsAt = event.allDay
          ? zonedWallTimeToUtc(day, "00:00", timeZone).toISOString()
          : zonedWallTimeToUtc(day, clock(minutes), timeZone).toISOString();
        occurrences.push({
          eventId: event.id,
          title: event.title,
          kind: event.kind,
          day,
          startsAt,
          endsAt: event.allDay ? null : new Date(new Date(startsAt).getTime() + Math.max(duration, 0)).toISOString(),
          allDay: event.allDay,
          taskId: event.taskId,
        });
      }
      if (event.recurrence === "none") break;
      const next = advance(day, event.recurrence);
      if (!next || next === day) break;
      day = next;
    }
  }
  return occurrences;
}
