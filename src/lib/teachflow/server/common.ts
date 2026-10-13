import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import { AppError } from "../errors.ts";
import { planDeadlineReminder, reconcileDecision } from "../reminders.ts";
import { isHHMM } from "../time.ts";
import { sendPushToUser } from "./push.server.ts";

export type ProfileRow = {
  full_name: string;
  institution: string;
  department: string;
  designation: string;
  subjects: string;
  grades: string;
  timezone: string;
  work_start: string;
  work_end: string;
  quiet_start: string;
  quiet_end: string;
  reminder_lead_minutes: number;
  reminders_enabled: boolean;
  doc_note: string;
};

export function nid(): string {
  return crypto.randomUUID();
}

export async function db(): Promise<Sql> {
  return getSql();
}

export function asIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

export function asDay(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return null;
}

export function cleanDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  const text = String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new AppError("Enter a valid date.");
  return text;
}

export function cleanTime(value: unknown): string | null {
  if (value == null || value === "") return null;
  const text = String(value);
  if (!isHHMM(text)) throw new AppError("Enter a time as HH:MM.");
  return text;
}

export function likePattern(value: string): string {
  return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

export async function loadProfile(sql: Sql, userId: string): Promise<ProfileRow> {
  const rows = await sql<ProfileRow>`
    select full_name, institution, department, designation, subjects, grades, timezone,
           work_start, work_end, quiet_start, quiet_end, reminder_lead_minutes,
           reminders_enabled, doc_note
    from profiles where user_id = ${userId}`;
  if (!rows[0]) throw new AppError("Your profile is not ready yet. Refresh the page.");
  return rows[0];
}

export async function todayFor(sql: Sql, timeZone: string): Promise<string> {
  const rows = await sql<{ today: string }>`select (now() at time zone ${timeZone})::date::text as today`;
  return rows[0]?.today ?? new Date().toISOString().slice(0, 10);
}

export function recoveryCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  const chars = [...bytes].map((byte) => alphabet[byte % alphabet.length]);
  return [0, 4, 8, 12].map((start) => chars.slice(start, start + 4).join("")).join("-");
}

export function hashRecovery(code: string): string {
  const normalized = code.replace(/-/g, "").trim().toUpperCase();
  return createHash("sha256").update(normalized).digest("hex");
}

export function sameHash(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function syncReminder(
  sql: Sql,
  userId: string,
  profile: ProfileRow,
  target: {
    scope: "task" | "event";
    id: string;
    dueDate?: string | null;
    dueTime?: string | null;
    instantIso?: string | null;
    remind: boolean;
    leadMinutes: number | null;
  },
) {
  const plan = planDeadlineReminder({
    scope: target.scope,
    id: target.id,
    dueDate: target.dueDate ?? null,
    dueTime: target.dueTime ?? null,
    instantIso: target.instantIso ?? null,
    remind: target.remind && profile.reminders_enabled,
    leadMinutes: target.leadMinutes ?? profile.reminder_lead_minutes,
    timeZone: profile.timezone,
    quietStart: profile.quiet_start,
    quietEnd: profile.quiet_end,
    fallbackTime: isHHMM(profile.work_end) ? profile.work_end : "16:00",
  });
  const existing = await sql.query<{ idempotency_key: string; status: string }>(
    `select idempotency_key, status from reminders where user_id = $1 and ${target.scope === "task" ? "task_id" : "event_id"} = $2`,
    [userId, target.id],
  );
  const decision = reconcileDecision(
    existing.map((row) => ({ idempotencyKey: row.idempotency_key, status: row.status })),
    plan,
  );
  for (const key of decision.cancelKeys) {
    await sql`update reminders set status = 'cancelled', updated_at = now()
      where user_id = ${userId} and idempotency_key = ${key} and status in ('scheduled', 'snoozed')`;
  }
  if (!decision.insert) return;
  await sql`insert into reminders (
      id, user_id, task_id, event_id, fire_at, status, lead_minutes, idempotency_key
    ) values (
      ${nid()}, ${userId},
      ${target.scope === "task" ? target.id : null},
      ${target.scope === "event" ? target.id : null},
      ${decision.insert.fireAtIso}, 'scheduled', ${decision.insert.leadMinutes}, ${decision.insert.idempotencyKey}
    ) on conflict (user_id, idempotency_key) do nothing`;
}

export async function processDue(sql: Sql, userId: string, timeZone: string) {
  const due = await sql<{
    id: string;
    fire_at: unknown;
    task_id: string | null;
    task_title: string | null;
    task_status: string | null;
    event_title: string | null;
  }>`
    select r.id, r.fire_at, r.task_id, t.title as task_title, t.status as task_status, e.title as event_title
    from reminders r
    left join tasks t on t.id = r.task_id and t.user_id = r.user_id
    left join calendar_events e on e.id = r.event_id and e.user_id = r.user_id
    where r.user_id = ${userId} and r.status in ('scheduled', 'snoozed') and r.fire_at <= now()
    limit 40`;

  for (const row of due) {
    if (row.task_status === "completed") {
      await sql`update reminders set status = 'cancelled', updated_at = now() where id = ${row.id} and user_id = ${userId}`;
      continue;
    }
    const fireIso = asIso(row.fire_at) ?? new Date().toISOString();
    const title = row.task_title || row.event_title || "Upcoming item";
    const href = row.task_id ? `/app/tasks/${row.task_id}` : "/app/calendar";
    const key = `rem:${row.id}:${fireIso}`;
    try {
      await sql`insert into notifications (id, user_id, kind, title, body, href, reminder_id, idempotency_key)
        values (
          ${nid()}, ${userId}, 'reminder', ${title},
          ${"A reminder you set is ready. Open it when you have a moment."},
          ${href}, ${row.id}, ${key}
        ) on conflict (user_id, idempotency_key) do nothing`;
      await sql`update reminders set status = 'delivered', delivered_at = now(), updated_at = now(), attempt_count = attempt_count + 1, last_error = null
        where id = ${row.id} and user_id = ${userId}`;
      await sendPushToUser(sql, userId, { title, body: "A reminder you set is ready. Open it when you have a moment.", href });
    } catch (error) {
      console.error("[teachflow] reminder delivery failed");
      await sql`update reminders set attempt_count = attempt_count + 1, last_error = 'delivery failed', updated_at = now()
        where id = ${row.id} and user_id = ${userId} and attempt_count < 5`;
      void error;
    }
  }

  const today = await todayFor(sql, timeZone);
  const overdue = await sql<{ id: string; title: string; due_date: string }>`
    select id, title, due_date::text as due_date from tasks
    where user_id = ${userId} and status = 'open' and due_date is not null and due_date < ${today}::date
    limit 30`;
  for (const task of overdue) {
    await sql`insert into notifications (id, user_id, kind, title, body, href, idempotency_key)
      values (
        ${nid()}, ${userId}, 'overdue', ${task.title},
        ${`This is still open. It was due ${task.due_date}.`},
        ${`/app/tasks/${task.id}`}, ${`overdue:${task.id}:${today}`}
      ) on conflict (user_id, idempotency_key) do nothing`;
  }
}

export async function notify(
  sql: Sql,
  userId: string,
  input: { kind: string; title: string; body: string; href?: string | null; key: string },
) {
  await sql`insert into notifications (id, user_id, kind, title, body, href, idempotency_key)
    values (${nid()}, ${userId}, ${input.kind}, ${input.title}, ${input.body}, ${input.href ?? null}, ${input.key})
    on conflict (user_id, idempotency_key) do nothing`;
}
