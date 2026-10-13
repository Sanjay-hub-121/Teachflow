import { formatDay } from "@/lib/teachflow/time";

export function dueLabel(dueDate: string | null, dueTime: string | null, timeZone: string) {
  if (!dueDate) return "No due date";
  return dueTime ? `${formatDay(dueDate, timeZone)} at ${dueTime}` : formatDay(dueDate, timeZone);
}
