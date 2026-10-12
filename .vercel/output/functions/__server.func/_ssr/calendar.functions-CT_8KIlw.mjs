import { l as wallClock, n as dayKeyInZone, t as addDays, u as zonedWallTimeToUtc } from "./time-DLu9ibbo.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as rethrowKnown, n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { s as isEventKind } from "./categories-Cd43Z7G-.mjs";
import { a as db, c as loadProfile, i as cleanTime, l as nid, m as syncReminder, n as asIso, r as cleanDate, t as asDay } from "./common-GdDXDCtZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar.functions-CT_8KIlw.js
function clock(minutes) {
	return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function advance(date, recurrence) {
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
function expandEvents(events, rangeStart, rangeEnd, timeZone) {
	const occurrences = [];
	for (const event of events) {
		const start = new Date(event.startsAt);
		if (Number.isNaN(start.getTime())) continue;
		const originDay = dayKeyInZone(start, timeZone);
		const minutes = wallClock(start, timeZone).minutes;
		const duration = event.endsAt ? new Date(event.endsAt).getTime() - start.getTime() : 36e5;
		let day = originDay;
		let guard = 0;
		while (day && day <= rangeEnd && guard < 400) {
			guard += 1;
			const until = event.recurrenceUntil;
			if (until && day > until) break;
			if (day >= rangeStart) {
				const startsAt = event.allDay ? zonedWallTimeToUtc(day, "00:00", timeZone).toISOString() : zonedWallTimeToUtc(day, clock(minutes), timeZone).toISOString();
				occurrences.push({
					eventId: event.id,
					title: event.title,
					kind: event.kind,
					day,
					startsAt,
					endsAt: event.allDay ? null : new Date(new Date(startsAt).getTime() + Math.max(duration, 0)).toISOString(),
					allDay: event.allDay,
					taskId: event.taskId
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
function eventInput(input) {
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
	const recurrence = [
		"none",
		"daily",
		"weekly",
		"monthly"
	].includes(String(input.recurrence)) ? String(input.recurrence) : "none";
	const recurrenceUntil = cleanDate(input.recurrenceUntil);
	if (recurrence !== "none" && recurrenceUntil && recurrenceUntil < startDate) throw new AppError("The repeat end date is before the event starts.");
	const taskId = input.taskId ? String(input.taskId) : null;
	const lead = input.reminderLeadMinutes == null || input.reminderLeadMinutes === "" ? null : Number(input.reminderLeadMinutes);
	if (lead != null && (!Number.isFinite(lead) || lead < 0 || lead > 10080)) throw new AppError("Reminder timing looks off.");
	return {
		title: title.slice(0, 160),
		description: String(input.description ?? "").slice(0, 4e3),
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
		version: Number(input.version ?? 0)
	};
}
async function bounds(data, timeZone) {
	const start = zonedWallTimeToUtc(data.startDate, data.startTime, timeZone);
	const end = zonedWallTimeToUtc(data.endDate, data.allDay ? "23:59" : data.endTime, timeZone);
	if (end.getTime() < start.getTime()) throw new AppError("The end is before the start.");
	return {
		start,
		end
	};
}
var getCalendar_createServerFn_handler = createServerRpc({
	id: "2e1a83d028aeaaf3bc04e9bdfb5e76645a34f02ab3cc159d9d63211eebc57ef6",
	name: "getCalendar",
	filename: "src/lib/teachflow/server/calendar.functions.ts"
}, (opts) => getCalendar.__executeServer(opts));
var getCalendar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const start = cleanDate(input.start);
	const end = cleanDate(input.end);
	if (!start || !end || end < start) throw new AppError("Choose a valid date range.");
	return {
		start,
		end
	};
}).handler(getCalendar_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const rangeStart = zonedWallTimeToUtc(data.start, "00:00", profile.timezone).toISOString();
		const rangeEnd = zonedWallTimeToUtc(data.end, "23:59", profile.timezone).toISOString();
		const events = (await sql`
        select id, title, description, kind, starts_at, ends_at, all_day, recurrence, recurrence_until,
               task_id, version, remind, reminder_lead_minutes
        from calendar_events
        where user_id = ${context.userId}
          and (
            (recurrence = 'none' and starts_at <= ${rangeEnd} and coalesce(ends_at, starts_at) >= ${rangeStart})
            or (recurrence <> 'none' and starts_at <= ${rangeEnd} and (recurrence_until is null or recurrence_until >= ${data.start}::date))
          )
        order by starts_at asc
        limit 300`).map((row) => ({
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
			reminderLeadMinutes: row.reminder_lead_minutes
		}));
		const tasks = await sql`
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
				priority: task.priority
			}))
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var createEvent_createServerFn_handler = createServerRpc({
	id: "7cc7c022623bba0db787eacdf0af2b8d58147d9715946e7278cf325710858fe7",
	name: "createEvent",
	filename: "src/lib/teachflow/server/calendar.functions.ts"
}, (opts) => createEvent.__executeServer(opts));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => eventInput(input)).handler(createEvent_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		if (data.taskId) {
			if (!(await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`).length) throw new AppError("That task was not found.");
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
		if (data.taskId) await sql`update tasks set calendar_event_id = ${eventId}, updated_at = now(), version = version + 1
          where id = ${data.taskId} and user_id = ${context.userId} and calendar_event_id is null`;
		await syncReminder(sql, context.userId, profile, {
			scope: "event",
			id: eventId,
			instantIso: start.toISOString(),
			remind: data.remind,
			leadMinutes: data.reminderLeadMinutes
		});
		return { id: eventId };
	} catch (error) {
		rethrowKnown(error);
	}
});
var updateEvent_createServerFn_handler = createServerRpc({
	id: "1bd26a0ba8a4423d614910c41053e4f66f32ad9dc2b22282b23b9a1eee977d57",
	name: "updateEvent",
	filename: "src/lib/teachflow/server/calendar.functions.ts"
}, (opts) => updateEvent.__executeServer(opts));
var updateEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That event was not found.");
	return {
		...eventInput(input),
		id
	};
}).handler(updateEvent_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const { start, end } = await bounds(data, profile.timezone);
		const rows = await sql`
        update calendar_events set
          title = ${data.title}, description = ${data.description}, kind = ${data.kind},
          starts_at = ${start.toISOString()}, ends_at = ${end.toISOString()}, all_day = ${data.allDay},
          recurrence = ${data.recurrence}, recurrence_until = ${data.recurrenceUntil},
          remind = ${data.remind}, reminder_lead_minutes = ${data.reminderLeadMinutes},
          version = version + 1, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and version = ${data.version}
        returning task_id`;
		if (!rows.length) throw new AppError("This was updated on another device. Reload it before saving.");
		if (rows[0].task_id) await sql`update tasks set title = ${data.title}, due_date = ${data.startDate}, due_time = ${data.allDay ? null : data.startTime},
            updated_at = now(), version = version + 1
          where id = ${rows[0].task_id} and user_id = ${context.userId}`;
		await syncReminder(sql, context.userId, profile, {
			scope: "event",
			id: data.id,
			instantIso: start.toISOString(),
			remind: data.remind,
			leadMinutes: data.reminderLeadMinutes
		});
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var deleteEvent_createServerFn_handler = createServerRpc({
	id: "7b75749e0d04c3738b4b23620ade49d3b4e8d6b8d82dc8e3487e530621524dcc",
	name: "deleteEvent",
	filename: "src/lib/teachflow/server/calendar.functions.ts"
}, (opts) => deleteEvent.__executeServer(opts));
var deleteEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That event was not found.");
	return { id };
}).handler(deleteEvent_createServerFn_handler, async ({ context, data }) => {
	try {
		if (!(await (await db())`delete from calendar_events where id = ${data.id} and user_id = ${context.userId} returning id`).length) throw new AppError("That event was not found.");
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
//#endregion
export { createEvent_createServerFn_handler, deleteEvent_createServerFn_handler, getCalendar_createServerFn_handler, updateEvent_createServerFn_handler };
