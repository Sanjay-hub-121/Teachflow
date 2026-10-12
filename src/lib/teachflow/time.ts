const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function isHHMM(value: string): boolean {
  return HHMM.test(value);
}

export function minutesOfDay(hhmm: string): number {
  const match = HHMM.exec(hhmm);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Minutes to add to UTC to get the wall clock in `timeZone` at this instant. */
export function offsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const hour = pick("hour") === 24 ? 0 : pick("hour");
  const asUtc = Date.UTC(pick("year"), pick("month") - 1, pick("day"), hour, pick("minute"), pick("second"));
  return Math.round((asUtc - instant.getTime()) / 60000);
}

/** Interpret a calendar date and clock time as wall time in `timeZone`. */
export function zonedWallTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const first = offsetMinutes(new Date(utcGuess), timeZone);
  let utc = utcGuess - first * 60_000;
  const second = offsetMinutes(new Date(utc), timeZone);
  if (second !== first) utc = utcGuess - second * 60_000;
  return new Date(utc);
}

export function dayKeyInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

export function wallClock(instant: Date, timeZone: string): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = pick("hour") === "24" ? "00" : pick("hour");
  const date = `${pick("year")}-${pick("month")}-${pick("day")}`;
  return { date, minutes: Number(hour) * 60 + Number(pick("minute")) };
}

export function inQuietWindow(minutes: number, quietStart: string, quietEnd: string): boolean {
  const start = minutesOfDay(quietStart);
  const end = minutesOfDay(quietEnd);
  if (start === end) return false;
  if (start < end) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
}

/**
 * If a reminder would fire during quiet hours, move it to the end of that
 * quiet window (the teacher's morning, when quiet hours cross midnight).
 */
export function shiftOutOfQuiet(
  fireUtc: Date,
  timeZone: string,
  quietStart: string,
  quietEnd: string,
): Date {
  if (!isHHMM(quietStart) || !isHHMM(quietEnd)) return fireUtc;
  const wall = wallClock(fireUtc, timeZone);
  if (!inQuietWindow(wall.minutes, quietStart, quietEnd)) return fireUtc;
  const endMin = minutesOfDay(quietEnd);
  const startMin = minutesOfDay(quietStart);
  let date = wall.date;
  if (startMin > endMin && wall.minutes >= startMin) {
    date = addDays(wall.date, 1);
  }
  const hh = String(Math.floor(endMin / 60)).padStart(2, "0");
  const mm = String(endMin % 60).padStart(2, "0");
  return zonedWallTimeToUtc(date, `${hh}:${mm}`, timeZone);
}

export function formatWhen(iso: string | null, timeZone: string, withTime = true): string {
  if (!iso) return "No date";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatDay(date: string, timeZone = "UTC"): string {
  const instant = zonedWallTimeToUtc(date, "12:00", timeZone);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(instant);
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function monthBounds(year: number, monthIndex: number): { start: string; end: string } {
  const start = new Date(Date.UTC(year, monthIndex, 1)).toISOString().slice(0, 10);
  const end = new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().slice(0, 10);
  return { start, end };
}
