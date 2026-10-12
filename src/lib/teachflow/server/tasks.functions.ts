import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { isPriority, isTaskCategory, isEventKind } from "../categories.ts";
import { AppError, rethrowKnown } from "../errors.ts";
import { zonedWallTimeToUtc } from "../time.ts";
import { asDay, asIso, cleanDate, cleanTime, db, likePattern, loadProfile, nid, processDue, syncReminder, todayFor } from "./common.ts";

type TaskRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  due_date: unknown;
  due_time: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  notes: string;
  calendar_event_id: string | null;
  template_id: string | null;
  template_name: string | null;
  remind: boolean;
  reminder_lead_minutes: number | null;
  version: number;
  completed_at: unknown;
  created_at: unknown;
  updated_at: unknown;
};

type SubtaskRow = { id: string; task_id: string; title: string; done: boolean; sort_order: number };

function mapTask(row: TaskRow, subtasks: SubtaskRow[] = []) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    dueDate: asDay(row.due_date),
    dueTime: row.due_time,
    estimatedMinutes: row.estimated_minutes,
    actualMinutes: row.actual_minutes,
    notes: row.notes,
    calendarEventId: row.calendar_event_id,
    templateId: row.template_id,
    templateName: row.template_name,
    remind: row.remind,
    reminderLeadMinutes: row.reminder_lead_minutes,
    version: row.version,
    completedAt: asIso(row.completed_at),
    createdAt: asIso(row.created_at) ?? "",
    updatedAt: asIso(row.updated_at) ?? "",
    subtasks: subtasks
      .filter((item) => item.task_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({ id: item.id, title: item.title, done: item.done, sortOrder: item.sort_order })),
  };
}

async function fetchTask(userId: string, taskId: string) {
  const sql = await db();
  const rows = await sql<TaskRow>`
    select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
           t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
           p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
           t.created_at, t.updated_at
    from tasks t
    left join templates p on p.id = t.template_id and p.user_id = t.user_id
    where t.id = ${taskId} and t.user_id = ${userId}`;
  if (!rows[0]) throw new AppError("That task was not found.");
  const subtasks = await sql<SubtaskRow>`
    select id, task_id, title, done, sort_order from subtasks
    where task_id = ${taskId} and user_id = ${userId} order by sort_order, created_at`;
  const documents = await sql<{ id: string; filename: string; format: string; status: string; created_at: unknown }>`
    select id, filename, format, status, created_at from generated_documents
    where task_id = ${taskId} and user_id = ${userId} order by created_at desc limit 12`;
  return {
    ...mapTask(rows[0], subtasks),
    documents: documents.map((doc) => ({
      id: doc.id,
      filename: doc.filename,
      format: doc.format,
      status: doc.status,
      createdAt: asIso(doc.created_at) ?? "",
    })),
  };
}

function taskInput(input: Record<string, unknown>, partial = false) {
  const title = String(input.title ?? "").trim();
  if (!partial && !title) throw new AppError("Give the task a title.");
  if (title.length > 160) throw new AppError("The title is too long.");
  const category = String(input.category ?? "other");
  const priority = String(input.priority ?? "normal");
  if (!isTaskCategory(category)) throw new AppError("Choose a category.");
  if (!isPriority(priority)) throw new AppError("Choose a priority.");
  const dueDate = cleanDate(input.dueDate);
  const dueTime = cleanTime(input.dueTime);
  if (dueTime && !dueDate) throw new AppError("Add a due date before a due time.");
  const estimated = input.estimatedMinutes == null || input.estimatedMinutes === "" ? null : Number(input.estimatedMinutes);
  if (estimated != null && (!Number.isFinite(estimated) || estimated < 0 || estimated > 10000)) {
    throw new AppError("Estimated minutes should be between 0 and 10000.");
  }
  const actual = input.actualMinutes == null || input.actualMinutes === "" ? null : Number(input.actualMinutes);
  if (actual != null && (!Number.isFinite(actual) || actual < 0 || actual > 10000)) {
    throw new AppError("Recorded minutes should be between 0 and 10000.");
  }
  const lead = input.reminderLeadMinutes == null || input.reminderLeadMinutes === "" ? null : Number(input.reminderLeadMinutes);
  if (lead != null && (!Number.isFinite(lead) || lead < 0 || lead > 10080)) throw new AppError("Reminder timing looks off.");
  return {
    title,
    description: String(input.description ?? "").slice(0, 4000),
    category,
    priority,
    dueDate,
    dueTime,
    estimatedMinutes: estimated == null ? null : Math.round(estimated),
    actualMinutes: actual == null ? null : Math.round(actual),
    notes: String(input.notes ?? "").slice(0, 8000),
    templateId: input.templateId ? String(input.templateId) : null,
    remind: input.remind !== false,
    reminderLeadMinutes: lead == null ? null : Math.round(lead),
    addToCalendar: Boolean(input.addToCalendar),
    eventKind: isEventKind(String(input.eventKind ?? "")) ? String(input.eventKind) : "academic",
    version: Number(input.version ?? 0),
  };
}

async function ownTemplate(userId: string, templateId: string | null) {
  if (!templateId) return;
  const sql = await db();
  const rows = await sql`select id from templates where id = ${templateId} and user_id = ${userId}`;
  if (!rows.length) throw new AppError("That template was not found in your library.");
}

export const listTasks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { view?: string; q?: string; category?: string; priority?: string; sort?: string } | undefined) => ({
    view: ["today", "upcoming", "overdue", "completed", "all"].includes(String(input?.view)) ? String(input?.view) : "all",
    q: String(input?.q ?? "").trim().slice(0, 80),
    category: String(input?.category ?? ""),
    priority: String(input?.priority ?? ""),
    sort: ["due", "priority", "updated", "title"].includes(String(input?.sort)) ? String(input?.sort) : "due",
  }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const today = await todayFor(sql, profile.timezone);
      const params: unknown[] = [context.userId];
      let where = "t.user_id = $1";
      if (data.view === "completed") where += " and t.status = 'completed'";
      if (data.view === "today") {
        params.push(today);
        where += ` and t.status = 'open' and t.due_date = $${params.length}::date`;
      }
      if (data.view === "upcoming") {
        params.push(today);
        where += ` and t.status = 'open' and t.due_date > $${params.length}::date`;
      }
      if (data.view === "overdue") {
        params.push(today);
        where += ` and t.status = 'open' and t.due_date < $${params.length}::date`;
      }
      if (data.category && isTaskCategory(data.category)) {
        params.push(data.category);
        where += ` and t.category = $${params.length}`;
      }
      if (data.priority && isPriority(data.priority)) {
        params.push(data.priority);
        where += ` and t.priority = $${params.length}`;
      }
      if (data.q) {
        params.push(likePattern(data.q));
        const slot = `$${params.length}`;
        where += ` and (t.title ilike ${slot} escape '\\' or t.description ilike ${slot} escape '\\' or t.notes ilike ${slot} escape '\\')`;
      }
      const order =
        data.sort === "title"
          ? "t.title asc"
          : data.sort === "updated"
            ? "t.updated_at desc"
            : data.sort === "priority"
              ? "case t.priority when 'high' then 0 when 'normal' then 1 else 2 end, t.due_date nulls last"
              : "t.due_date nulls last, t.due_time nulls last, t.updated_at desc";
      const rows = await sql.query<TaskRow>(
        `select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
                t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
                p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
                t.created_at, t.updated_at
         from tasks t
         left join templates p on p.id = t.template_id and p.user_id = t.user_id
         where ${where}
         order by ${order}
         limit 200`,
        params,
      );
      const ids = rows.map((row) => row.id);
      let subtasks: SubtaskRow[] = [];
      if (ids.length) {
        const placeholders = ids.map((_, index) => `$${index + 2}`).join(", ");
        subtasks = await sql.query<SubtaskRow>(
          `select id, task_id, title, done, sort_order from subtasks where user_id = $1 and task_id in (${placeholders})`,
          [context.userId, ...ids],
        );
      }
      return { today, timezone: profile.timezone, tasks: rows.map((row) => mapTask(row, subtasks)) };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const getTask = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That task was not found.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    try {
      return await fetchTask(context.userId, data.id);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const createTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => taskInput(input))
  .handler(async ({ context, data }) => {
    try {
      await ownTemplate(context.userId, data.templateId);
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const taskId = nid();
      await sql`insert into tasks (
          id, user_id, title, description, category, priority, due_date, due_time, estimated_minutes,
          notes, template_id, remind, reminder_lead_minutes
        ) values (
          ${taskId}, ${context.userId}, ${data.title}, ${data.description}, ${data.category}, ${data.priority},
          ${data.dueDate}, ${data.dueTime}, ${data.estimatedMinutes}, ${data.notes}, ${data.templateId},
          ${data.remind}, ${data.reminderLeadMinutes}
        )`;
      if (data.addToCalendar && data.dueDate) {
        const eventId = nid();
        const start = zonedWallTimeToUtc(data.dueDate, data.dueTime ?? profile.work_end, profile.timezone);
        const end = new Date(start.getTime() + (data.estimatedMinutes ?? 60) * 60_000);
        await sql`insert into calendar_events (id, user_id, title, kind, starts_at, ends_at, all_day, task_id, remind, reminder_lead_minutes)
          values (${eventId}, ${context.userId}, ${data.title}, ${data.eventKind}, ${start.toISOString()}, ${end.toISOString()}, ${!data.dueTime}, ${taskId}, false, null)`;
        await sql`update tasks set calendar_event_id = ${eventId} where id = ${taskId} and user_id = ${context.userId}`;
      }
      await syncReminder(sql, context.userId, profile, {
        scope: "task",
        id: taskId,
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        remind: data.remind,
        leadMinutes: data.reminderLeadMinutes,
      });
      return await fetchTask(context.userId, taskId);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const updateTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That task was not found.");
    const parsed = taskInput(input);
    if (!Number.isFinite(parsed.version)) throw new AppError("Reload this task and try again.");
    return { ...parsed, id };
  })
  .handler(async ({ context, data }) => {
    try {
      await ownTemplate(context.userId, data.templateId);
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const rows = await sql<{ calendar_event_id: string | null }>`
        update tasks set
          title = ${data.title}, description = ${data.description}, category = ${data.category},
          priority = ${data.priority}, due_date = ${data.dueDate}, due_time = ${data.dueTime},
          estimated_minutes = ${data.estimatedMinutes}, actual_minutes = ${data.actualMinutes},
          notes = ${data.notes}, template_id = ${data.templateId}, remind = ${data.remind},
          reminder_lead_minutes = ${data.reminderLeadMinutes}, version = version + 1, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and version = ${data.version}
        returning calendar_event_id`;
      if (!rows.length) throw new AppError("This was updated on another device. Reload it before saving.");
      if (rows[0].calendar_event_id && data.dueDate) {
        const start = zonedWallTimeToUtc(data.dueDate, data.dueTime ?? profile.work_end, profile.timezone);
        await sql`update calendar_events set title = ${data.title}, starts_at = ${start.toISOString()}, updated_at = now(), version = version + 1
          where id = ${rows[0].calendar_event_id} and user_id = ${context.userId}`;
      }
      await syncReminder(sql, context.userId, profile, {
        scope: "task",
        id: data.id,
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        remind: data.remind,
        leadMinutes: data.reminderLeadMinutes,
      });
      return await fetchTask(context.userId, data.id);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const setTaskStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; status?: string; version?: number; actualMinutes?: number | null }) => {
    const id = String(input.id ?? "");
    const status = input.status === "completed" ? "completed" : input.status === "open" ? "open" : "";
    if (!id || !status) throw new AppError("That task could not be updated.");
    return { id, status, version: Number(input.version ?? 0), actualMinutes: input.actualMinutes ?? null };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const actual = data.actualMinutes == null || data.actualMinutes === ("" as unknown) ? null : Number(data.actualMinutes);
      const rows = await sql<{ due_date: unknown; due_time: string | null; remind: boolean; reminder_lead_minutes: number | null }>`
        update tasks set
          status = ${data.status},
          completed_at = case when ${data.status} = 'completed' then now() else null end,
          actual_minutes = coalesce(${Number.isFinite(actual) ? actual : null}, actual_minutes),
          version = version + 1,
          updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and version = ${data.version}
        returning due_date, due_time, remind, reminder_lead_minutes`;
      if (!rows.length) throw new AppError("This was updated on another device. Reload it before saving.");
      await syncReminder(sql, context.userId, profile, {
        scope: "task",
        id: data.id,
        dueDate: asDay(rows[0].due_date),
        dueTime: rows[0].due_time,
        remind: data.status === "open" && rows[0].remind,
        leadMinutes: rows[0].reminder_lead_minutes,
      });
      return await fetchTask(context.userId, data.id);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That task was not found.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql`delete from tasks where id = ${data.id} and user_id = ${context.userId} returning id`;
      if (!rows.length) throw new AppError("That task was not found.");
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const addSubtask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { taskId?: string; title?: string }) => {
    const taskId = String(input.taskId ?? "");
    const title = String(input.title ?? "").trim();
    if (!taskId || !title) throw new AppError("Write a step before adding it.");
    return { taskId, title: title.slice(0, 200) };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const parent = await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`;
      if (!parent.length) throw new AppError("That task was not found.");
      const orderRows = await sql<{ next: number }>`select coalesce(max(sort_order), 0) + 1 as next from subtasks where task_id = ${data.taskId}`;
      await sql`insert into subtasks (id, task_id, user_id, title, sort_order) values (${nid()}, ${data.taskId}, ${context.userId}, ${data.title}, ${orderRows[0]?.next ?? 1})`;
      await sql`update tasks set version = version + 1, updated_at = now() where id = ${data.taskId} and user_id = ${context.userId}`;
      return await fetchTask(context.userId, data.taskId);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const addSubtasks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { taskId?: string; titles?: string[] }) => {
    const taskId = String(input.taskId ?? "");
    const titles = (input.titles ?? []).map((title) => String(title).trim()).filter(Boolean).slice(0, 8);
    if (!taskId || titles.length === 0) throw new AppError("There are no steps to add.");
    return { taskId, titles: titles.map((title) => title.slice(0, 200)) };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const parent = await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`;
      if (!parent.length) throw new AppError("That task was not found.");
      const orderRows = await sql<{ next: number }>`select coalesce(max(sort_order), 0) as next from subtasks where task_id = ${data.taskId}`;
      let order = orderRows[0]?.next ?? 0;
      for (const title of data.titles) {
        order += 1;
        await sql`insert into subtasks (id, task_id, user_id, title, sort_order) values (${nid()}, ${data.taskId}, ${context.userId}, ${title}, ${order})`;
      }
      await sql`update tasks set version = version + 1, updated_at = now() where id = ${data.taskId} and user_id = ${context.userId}`;
      return await fetchTask(context.userId, data.taskId);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const toggleSubtask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; done?: boolean }) => ({ id: String(input.id ?? ""), done: Boolean(input.done) }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{ task_id: string }>`
        update subtasks set done = ${data.done} where id = ${data.id} and user_id = ${context.userId} returning task_id`;
      if (!rows[0]) throw new AppError("That step was not found.");
      await sql`update tasks set version = version + 1, updated_at = now() where id = ${rows[0].task_id} and user_id = ${context.userId}`;
      return await fetchTask(context.userId, rows[0].task_id);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const deleteSubtask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{ task_id: string }>`
        delete from subtasks where id = ${data.id} and user_id = ${context.userId} returning task_id`;
      if (!rows[0]) throw new AppError("That step was not found.");
      await sql`update tasks set version = version + 1, updated_at = now() where id = ${rows[0].task_id} and user_id = ${context.userId}`;
      return await fetchTask(context.userId, rows[0].task_id);
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      await processDue(sql, context.userId, profile.timezone);
      const today = await todayFor(sql, profile.timezone);
      const tasks = await sql<TaskRow>`
        select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
               t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
               p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
               t.created_at, t.updated_at
        from tasks t
        left join templates p on p.id = t.template_id and p.user_id = t.user_id
        where t.user_id = ${context.userId}
        order by t.due_date nulls last, t.updated_at desc
        limit 300`;
      const mapped = tasks.map((row) => mapTask(row));
      const counts = await sql<{ done: number; open: number }>`
        select
          count(*) filter (where status = 'completed' and completed_at >= now() - interval '7 days')::int as done,
          count(*) filter (where status = 'open')::int as open
        from tasks where user_id = ${context.userId}`;
      const events = await sql<{ id: string; title: string; kind: string; starts_at: unknown }>`
        select id, title, kind, starts_at from calendar_events
        where user_id = ${context.userId} and starts_at >= now() - interval '1 day'
        order by starts_at asc limit 40`;
      const upcomingEvents = events
        .map((event) => ({ id: event.id, title: event.title, kind: event.kind, startsAt: asIso(event.starts_at) ?? "" }))
        .filter((event) => event.startsAt && new Date(event.startsAt).getTime() >= Date.now() - 60_000);
      const docs = await sql<{ id: string; filename: string; format: string; status: string; created_at: unknown }>`
        select id, filename, format, status, created_at from generated_documents
        where user_id = ${context.userId} order by created_at desc limit 5`;
      const templates = await sql<{ id: string; name: string; category: string; status: string }>`
        select id, name, category, status from templates
        where user_id = ${context.userId} and status <> 'archived'
        order by updated_at desc limit 5`;
      const unread = await sql<{ count: number }>`
        select count(*)::int as count from notifications where user_id = ${context.userId} and read_at is null`;
      const open = mapped.filter((task) => task.status === "open");
      return {
        timezone: profile.timezone,
        today,
        greetingName: profile.full_name,
        todayTasks: open.filter((task) => task.dueDate === today).slice(0, 8),
        overdue: open.filter((task) => task.dueDate && task.dueDate < today).slice(0, 8),
        upcoming: open.filter((task) => task.dueDate && task.dueDate > today).slice(0, 6),
        undated: open.filter((task) => !task.dueDate).slice(0, 6),
        highPriority: open.filter((task) => task.priority === "high").slice(0, 6),
        completed: mapped.filter((task) => task.status === "completed").slice(0, 5),
        progress: { done: counts[0]?.done ?? 0, open: counts[0]?.open ?? 0 },
        exams: upcomingEvents.filter((event) => event.kind === "exam").slice(0, 4),
        meetings: upcomingEvents.filter((event) => event.kind === "meeting").slice(0, 4),
        academic: upcomingEvents.filter((event) => event.kind === "academic" || event.kind === "institutional").slice(0, 4),
        documents: docs.map((doc) => ({
          id: doc.id,
          filename: doc.filename,
          format: doc.format,
          status: doc.status,
          createdAt: asIso(doc.created_at) ?? "",
        })),
        templates,
        unread: unread[0]?.count ?? 0,
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });
