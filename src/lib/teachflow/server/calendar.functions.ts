import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { expandEvents, type CalendarEvent } from "../calendar.ts";
import { isEventKind } from "../categories.ts";
import { AppError, rethrowKnown } from "../errors.ts";
import { zonedWallTimeToUtc } from "../time.ts";
import { asDay, asIso, cleanDate, cleanTime, db, loadProfile, nid, syncReminder } from "./common.ts";

function eventInput(input: Record<string, unknown>) {
  const title = String(input.title ?? "").trim();
  if (!title) throw new AppError("Give the event a title.");
  const kind = String(input.kind ?? "academic");
  if (!isEventKind(kind)) throw new AppError("Choose an event type.");
  const startDate = cleanDate(input.startDate);
  if (!startDate) throw new AppError("Choose a start date.");
  const endDate = cleanDate(input.endDate) ?? startDate;
  const allDay = Boolean(input.allDay);
  const startTime = allDay ? "00:00" : cleanTime(input.startTime) ?? "09:00";
  const endTime = allDay ? "23:59" : cleanTime(input.endTime) ?? "10:00";
  const recurrence = ["none", "daily", "weekly", "monthly"].includes(String(input.recurrence))
    ? String(input.recurrence)
    : "none";
  const recurrenceUntil = cleanDate(input.recurrenceUntil);
  if (recurrence !== "none" && recurrenceUntil && recurrenceUntil < startDate) {
    throw new AppError("The repeat end date is before the event starts.");
  }
  const taskId = input.taskId ? String(input.taskId) : null;
  const lead = input.reminderLeadMinutes == null || input.reminderLeadMinutes === "" ? null : Number(input.reminderLeadMinutes);
  if (lead != null && (!Number.isFinite(lead) || lead < 0 || lead > 10080)) throw new AppError("Reminder timing looks off.");
  return {
    title: title.slice(0, 160),
    description: String(input.description ?? "").slice(0, 4000),
    kind,
    startDate,
    endDate,
    allDay,
    startTime,
    endTime,
    recurrence,
    recurrenceUntil,
    taskId,
    remind: Boolean(input.remind),
    reminderLeadMinutes: lead == null ? null : Math.round(lead),
    version: Number(input.version ?? 0),
  };
}

async function bounds(data: ReturnType<typeof eventInput>, timeZone: string) {
  const start = zonedWallTimeToUtc(data.startDate, data.startTime, timeZone);
  const end = zonedWallTimeToUtc(data.endDate, data.allDay ? "23:59" : data.endTime, timeZone);
  if (end.getTime() < start.getTime()) throw new AppError("The end is before the start.");
  return { start, end };
}

export const getCalendar = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { start?: string; end?: string }) => {
    const start = cleanDate(input.start);
    const end = cleanDate(input.end);
    if (!start || !end || end < start) throw new AppError("Choose a valid date range.");
    return { start, end };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const rangeStart = zonedWallTimeToUtc(data.start, "00:00", profile.timezone).toISOString();
      const rangeEnd = zonedWallTimeToUtc(data.end, "23:59", profile.timezone).toISOString();
      const rows = await sql<{
        id: string;
        title: string;
        description: string;
        kind: string;
        starts_at: unknown;
        ends_at: unknown;
        all_day: boolean;
        recurrence: string;
        recurrence_until: unknown;
        task_id: string | null;
        version: number;
        remind: boolean;
        reminder_lead_minutes: number | null;
      }>`
        select id, title, description, kind, starts_at, ends_at, all_day, recurrence, recurrence_until,
               task_id, version, remind, reminder_lead_minutes
        from calendar_events
        where user_id = ${context.userId}
          and (
            (recurrence = 'none' and starts_at <= ${rangeEnd} and coalesce(ends_at, starts_at) >= ${rangeStart})
            or (recurrence <> 'none' and starts_at <= ${rangeEnd} and (recurrence_until is null or recurrence_until >= ${data.start}::date))
          )
        order by starts_at asc
        limit 300`;
      const events: CalendarEvent[] = rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        kind: row.kind,
        startsAt: asIso(row.starts_at) ?? "",
        endsAt: asIso(row.ends_at),
        allDay: row.all_day,
        recurrence: row.recurrence,
        recurrenceUntil: asDay(row.recurrence_until),
        taskId: row.task_id,
        version: row.version,
        remind: row.remind,
        reminderLeadMinutes: row.reminder_lead_minutes,
      }));
      const tasks = await sql<{ id: string; title: string; due_date: string; due_time: string | null; priority: string }>`
        select id, title, due_date::text as due_date, due_time, priority from tasks
        where user_id = ${context.userId} and status = 'open' and calendar_event_id is null
          and due_date is not null and due_date >= ${data.start}::date and due_date <= ${data.end}::date
        order by due_date, due_time nulls last
        limit 200`;
      return {
        timezone: profile.timezone,
        events,
        occurrences: expandEvents(events, data.start, data.end, profile.timezone),
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          dueDate: task.due_date,
          dueTime: task.due_time,
          priority: task.priority,
        })),
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const createEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => eventInput(input))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      if (data.taskId) {
        const owned = await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`;
        if (!owned.length) throw new AppError("That task was not found.");
      }
      const { start, end } = await bounds(data, profile.timezone);
      const eventId = nid();
      await sql`insert into calendar_events (
          id, user_id, title, description, kind, starts_at, ends_at, all_day, recurrence, recurrence_until,
          task_id, remind, reminder_lead_minutes
        ) values (
          ${eventId}, ${context.userId}, ${data.title}, ${data.description}, ${data.kind},
          ${start.toISOString()}, ${end.toISOString()}, ${data.allDay}, ${data.recurrence}, ${data.recurrenceUntil},
          ${data.taskId}, ${data.remind}, ${data.reminderLeadMinutes}
        )`;
      if (data.taskId) {
        await sql`update tasks set calendar_event_id = ${eventId}, updated_at = now(), version = version + 1
          where id = ${data.taskId} and user_id = ${context.userId} and calendar_event_id is null`;
      }
      await syncReminder(sql, context.userId, profile, {
        scope: "event",
        id: eventId,
        instantIso: start.toISOString(),
        remind: data.remind,
        leadMinutes: data.reminderLeadMinutes,
      });
      return { id: eventId };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const updateEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That event was not found.");
    return { ...eventInput(input), id };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const { start, end } = await bounds(data, profile.timezone);
      const rows = await sql<{ task_id: string | null }>`
        update calendar_events set
          title = ${data.title}, description = ${data.description}, kind = ${data.kind},
          starts_at = ${start.toISOString()}, ends_at = ${end.toISOString()}, all_day = ${data.allDay},
          recurrence = ${data.recurrence}, recurrence_until = ${data.recurrenceUntil},
          remind = ${data.remind}, reminder_lead_minutes = ${data.reminderLeadMinutes},
          version = version + 1, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and version = ${data.version}
        returning task_id`;
      if (!rows.length) throw new AppError("This was updated on another device. Reload it before saving.");
      if (rows[0].task_id) {
        await sql`update tasks set title = ${data.title}, due_date = ${data.startDate}, due_time = ${data.allDay ? null : data.startTime},
            updated_at = now(), version = version + 1
          where id = ${rows[0].task_id} and user_id = ${context.userId}`;
      }
      await syncReminder(sql, context.userId, profile, {
        scope: "event",
        id: data.id,
        instantIso: start.toISOString(),
        remind: data.remind,
        leadMinutes: data.reminderLeadMinutes,
      });
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That event was not found.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql`delete from calendar_events where id = ${data.id} and user_id = ${context.userId} returning id`;
      if (!rows.length) throw new AppError("That event was not found.");
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });
