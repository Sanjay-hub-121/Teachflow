import { isHHMM, shiftOutOfQuiet, zonedWallTimeToUtc } from "./time.ts";

export type ReminderPlan = {
  idempotencyKey: string;
  fireAtIso: string;
  leadMinutes: number;
};

export function planDeadlineReminder(input: {
  scope: "task" | "event";
  id: string;
  dueDate: string | null;
  dueTime: string | null;
  remind: boolean;
  leadMinutes: number;
  timeZone: string;
  quietStart: string;
  quietEnd: string;
  fallbackTime: string;
  instantIso?: string | null;
}): ReminderPlan | null {
  if (!input.remind) return null;
  const lead = clampLead(input.leadMinutes);
  let due: Date | null = null;
  let stamp = "";
  if (input.instantIso) {
    const parsed = new Date(input.instantIso);
    if (Number.isNaN(parsed.getTime())) return null;
    due = parsed;
    stamp = parsed.toISOString();
  } else if (input.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
    const time = input.dueTime && isHHMM(input.dueTime) ? input.dueTime : input.fallbackTime;
    due = zonedWallTimeToUtc(input.dueDate, isHHMM(time) ? time : "16:00", input.timeZone);
    stamp = `${input.dueDate}T${time}`;
  }
  if (!due) return null;
  const fired = new Date(due.getTime() - lead * 60_000);
  const shifted = shiftOutOfQuiet(fired, input.timeZone, input.quietStart, input.quietEnd);
  return {
    idempotencyKey: `${input.scope}:${input.id}:at:${stamp}:lead:${lead}`,
    fireAtIso: shifted.toISOString(),
    leadMinutes: lead,
  };
}

export function clampLead(minutes: number): number {
  if (!Number.isFinite(minutes)) return 60;
  return Math.max(0, Math.min(7 * 24 * 60, Math.round(minutes)));
}

export type ExistingReminder = {
  idempotencyKey: string;
  status: string;
};

/** Which scheduled reminders to cancel, and whether a new row is required. */
export function reconcileDecision(
  existing: ExistingReminder[],
  plan: ReminderPlan | null,
): { cancelKeys: string[]; insert: ReminderPlan | null } {
  const scheduled = existing.filter((row) => row.status === "scheduled" || row.status === "snoozed");
  if (!plan) {
    return { cancelKeys: scheduled.map((row) => row.idempotencyKey), insert: null };
  }
  const kept = existing.some((row) => row.idempotencyKey === plan.idempotencyKey);
  return {
    cancelKeys: scheduled
      .filter((row) => row.idempotencyKey !== plan.idempotencyKey)
      .map((row) => row.idempotencyKey),
    insert: kept ? null : plan,
  };
}
