import { u as zonedWallTimeToUtc } from "./time-DLu9ibbo.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as rethrowKnown, n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { c as isPriority, l as isTaskCategory, s as isEventKind } from "./categories-Cd43Z7G-.mjs";
import { a as db, c as loadProfile, d as processDue, h as todayFor, i as cleanTime, l as nid, m as syncReminder, n as asIso, r as cleanDate, s as likePattern, t as asDay } from "./common-GdDXDCtZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks.functions-Baf6PJRq.js
function mapTask(row, subtasks = []) {
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
		subtasks: subtasks.filter((item) => item.task_id === row.id).sort((a, b) => a.sort_order - b.sort_order).map((item) => ({
			id: item.id,
			title: item.title,
			done: item.done,
			sortOrder: item.sort_order
		}))
	};
}
async function fetchTask(userId, taskId) {
	const sql = await db();
	const rows = await sql`
    select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
           t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
           p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
           t.created_at, t.updated_at
    from tasks t
    left join templates p on p.id = t.template_id and p.user_id = t.user_id
    where t.id = ${taskId} and t.user_id = ${userId}`;
	if (!rows[0]) throw new AppError("That task was not found.");
	const subtasks = await sql`
    select id, task_id, title, done, sort_order from subtasks
    where task_id = ${taskId} and user_id = ${userId} order by sort_order, created_at`;
	const documents = await sql`
    select id, filename, format, status, created_at from generated_documents
    where task_id = ${taskId} and user_id = ${userId} order by created_at desc limit 12`;
	return {
		...mapTask(rows[0], subtasks),
		documents: documents.map((doc) => ({
			id: doc.id,
			filename: doc.filename,
			format: doc.format,
			status: doc.status,
			createdAt: asIso(doc.created_at) ?? ""
		}))
	};
}
function taskInput(input, partial = false) {
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
	if (estimated != null && (!Number.isFinite(estimated) || estimated < 0 || estimated > 1e4)) throw new AppError("Estimated minutes should be between 0 and 10000.");
	const actual = input.actualMinutes == null || input.actualMinutes === "" ? null : Number(input.actualMinutes);
	if (actual != null && (!Number.isFinite(actual) || actual < 0 || actual > 1e4)) throw new AppError("Recorded minutes should be between 0 and 10000.");
	const lead = input.reminderLeadMinutes == null || input.reminderLeadMinutes === "" ? null : Number(input.reminderLeadMinutes);
	if (lead != null && (!Number.isFinite(lead) || lead < 0 || lead > 10080)) throw new AppError("Reminder timing looks off.");
	return {
		title,
		description: String(input.description ?? "").slice(0, 4e3),
		category,
		priority,
		dueDate,
		dueTime,
		estimatedMinutes: estimated == null ? null : Math.round(estimated),
		actualMinutes: actual == null ? null : Math.round(actual),
		notes: String(input.notes ?? "").slice(0, 8e3),
		templateId: input.templateId ? String(input.templateId) : null,
		remind: input.remind !== false,
		reminderLeadMinutes: lead == null ? null : Math.round(lead),
		addToCalendar: Boolean(input.addToCalendar),
		eventKind: isEventKind(String(input.eventKind ?? "")) ? String(input.eventKind) : "academic",
		version: Number(input.version ?? 0)
	};
}
async function ownTemplate(userId, templateId) {
	if (!templateId) return;
	if (!(await (await db())`select id from templates where id = ${templateId} and user_id = ${userId}`).length) throw new AppError("That template was not found in your library.");
}
var listTasks_createServerFn_handler = createServerRpc({
	id: "9af0d3301399eb31b8f5a4a27c7deafc2ddd4b2085ef142c1c1714fb1a1988ff",
	name: "listTasks",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => listTasks.__executeServer(opts));
var listTasks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	view: [
		"today",
		"upcoming",
		"overdue",
		"completed",
		"all"
	].includes(String(input?.view)) ? String(input?.view) : "all",
	q: String(input?.q ?? "").trim().slice(0, 80),
	category: String(input?.category ?? ""),
	priority: String(input?.priority ?? ""),
	sort: [
		"due",
		"priority",
		"updated",
		"title"
	].includes(String(input?.sort)) ? String(input?.sort) : "due"
})).handler(listTasks_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const today = await todayFor(sql, profile.timezone);
		const params = [context.userId];
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
		const order = data.sort === "title" ? "t.title asc" : data.sort === "updated" ? "t.updated_at desc" : data.sort === "priority" ? "case t.priority when 'high' then 0 when 'normal' then 1 else 2 end, t.due_date nulls last" : "t.due_date nulls last, t.due_time nulls last, t.updated_at desc";
		const rows = await sql.query(`select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
                t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
                p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
                t.created_at, t.updated_at
         from tasks t
         left join templates p on p.id = t.template_id and p.user_id = t.user_id
         where ${where}
         order by ${order}
         limit 200`, params);
		const ids = rows.map((row) => row.id);
		let subtasks = [];
		if (ids.length) {
			const placeholders = ids.map((_, index) => `$${index + 2}`).join(", ");
			subtasks = await sql.query(`select id, task_id, title, done, sort_order from subtasks where user_id = $1 and task_id in (${placeholders})`, [context.userId, ...ids]);
		}
		return {
			today,
			timezone: profile.timezone,
			tasks: rows.map((row) => mapTask(row, subtasks))
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var getTask_createServerFn_handler = createServerRpc({
	id: "381c3ee28c9963a8d529603b81199158182b4a5f006957a410d04327fb1698d3",
	name: "getTask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => getTask.__executeServer(opts));
var getTask = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	return { id };
}).handler(getTask_createServerFn_handler, async ({ context, data }) => {
	try {
		return await fetchTask(context.userId, data.id);
	} catch (error) {
		rethrowKnown(error);
	}
});
var createTask_createServerFn_handler = createServerRpc({
	id: "9dab16e8ef668d66eb0f8f21cf4917299823e5a7a8b9d591e0fb2cefa617a976",
	name: "createTask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => createTask.__executeServer(opts));
var createTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => taskInput(input)).handler(createTask_createServerFn_handler, async ({ context, data }) => {
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
			const end = new Date(start.getTime() + (data.estimatedMinutes ?? 60) * 6e4);
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
			leadMinutes: data.reminderLeadMinutes
		});
		return await fetchTask(context.userId, taskId);
	} catch (error) {
		rethrowKnown(error);
	}
});
var updateTask_createServerFn_handler = createServerRpc({
	id: "1f7bedf6e04e538a6e7eebcab5f2c554f167761c4941ad765bbdf88b29cdec17",
	name: "updateTask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => updateTask.__executeServer(opts));
var updateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	const parsed = taskInput(input);
	if (!Number.isFinite(parsed.version)) throw new AppError("Reload this task and try again.");
	return {
		...parsed,
		id
	};
}).handler(updateTask_createServerFn_handler, async ({ context, data }) => {
	try {
		await ownTemplate(context.userId, data.templateId);
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const rows = await sql`
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
			leadMinutes: data.reminderLeadMinutes
		});
		return await fetchTask(context.userId, data.id);
	} catch (error) {
		rethrowKnown(error);
	}
});
var setTaskStatus_createServerFn_handler = createServerRpc({
	id: "6fb882e0c8357c159fd689bd52fd5b6efeec80f587b6bf8515c974a3fa3cf370",
	name: "setTaskStatus",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => setTaskStatus.__executeServer(opts));
var setTaskStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	const status = input.status === "completed" ? "completed" : input.status === "open" ? "open" : "";
	if (!id || !status) throw new AppError("That task could not be updated.");
	return {
		id,
		status,
		version: Number(input.version ?? 0),
		actualMinutes: input.actualMinutes ?? null
	};
}).handler(setTaskStatus_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const actual = data.actualMinutes == null || data.actualMinutes === "" ? null : Number(data.actualMinutes);
		const rows = await sql`
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
			leadMinutes: rows[0].reminder_lead_minutes
		});
		return await fetchTask(context.userId, data.id);
	} catch (error) {
		rethrowKnown(error);
	}
});
var deleteTask_createServerFn_handler = createServerRpc({
	id: "88dbb7947cd8b76395fd637aacc540289821e81a6d589d9d6103189db71bd278",
	name: "deleteTask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => deleteTask.__executeServer(opts));
var deleteTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	return { id };
}).handler(deleteTask_createServerFn_handler, async ({ context, data }) => {
	try {
		if (!(await (await db())`delete from tasks where id = ${data.id} and user_id = ${context.userId} returning id`).length) throw new AppError("That task was not found.");
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var addSubtask_createServerFn_handler = createServerRpc({
	id: "845f40bad25eb2769d6057471721adc19d059e18a6e2e5ff0ea2a289714d4343",
	name: "addSubtask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => addSubtask.__executeServer(opts));
var addSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const taskId = String(input.taskId ?? "");
	const title = String(input.title ?? "").trim();
	if (!taskId || !title) throw new AppError("Write a step before adding it.");
	return {
		taskId,
		title: title.slice(0, 200)
	};
}).handler(addSubtask_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		if (!(await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`).length) throw new AppError("That task was not found.");
		const orderRows = await sql`select coalesce(max(sort_order), 0) + 1 as next from subtasks where task_id = ${data.taskId}`;
		await sql`insert into subtasks (id, task_id, user_id, title, sort_order) values (${nid()}, ${data.taskId}, ${context.userId}, ${data.title}, ${orderRows[0]?.next ?? 1})`;
		await sql`update tasks set version = version + 1, updated_at = now() where id = ${data.taskId} and user_id = ${context.userId}`;
		return await fetchTask(context.userId, data.taskId);
	} catch (error) {
		rethrowKnown(error);
	}
});
var addSubtasks_createServerFn_handler = createServerRpc({
	id: "d5e140ac0f7e9bbe01886d1b2774ec1166f450f76e6b96abc3a659a429b0b353",
	name: "addSubtasks",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => addSubtasks.__executeServer(opts));
var addSubtasks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const taskId = String(input.taskId ?? "");
	const titles = (input.titles ?? []).map((title) => String(title).trim()).filter(Boolean).slice(0, 8);
	if (!taskId || titles.length === 0) throw new AppError("There are no steps to add.");
	return {
		taskId,
		titles: titles.map((title) => title.slice(0, 200))
	};
}).handler(addSubtasks_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		if (!(await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`).length) throw new AppError("That task was not found.");
		let order = (await sql`select coalesce(max(sort_order), 0) as next from subtasks where task_id = ${data.taskId}`)[0]?.next ?? 0;
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
var toggleSubtask_createServerFn_handler = createServerRpc({
	id: "a485e04c1c2c88db08b3bfba7fe70c027b56299b5c0efee862fee0f21750f53c",
	name: "toggleSubtask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => toggleSubtask.__executeServer(opts));
var toggleSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	done: Boolean(input.done)
})).handler(toggleSubtask_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const rows = await sql`
        update subtasks set done = ${data.done} where id = ${data.id} and user_id = ${context.userId} returning task_id`;
		if (!rows[0]) throw new AppError("That step was not found.");
		await sql`update tasks set version = version + 1, updated_at = now() where id = ${rows[0].task_id} and user_id = ${context.userId}`;
		return await fetchTask(context.userId, rows[0].task_id);
	} catch (error) {
		rethrowKnown(error);
	}
});
var deleteSubtask_createServerFn_handler = createServerRpc({
	id: "eaac9f67288954b4e60f3a722a1ef18cc0dadb3fb67b7f7a3a9282bcac7f63d4",
	name: "deleteSubtask",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => deleteSubtask.__executeServer(opts));
var deleteSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(deleteSubtask_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const rows = await sql`
        delete from subtasks where id = ${data.id} and user_id = ${context.userId} returning task_id`;
		if (!rows[0]) throw new AppError("That step was not found.");
		await sql`update tasks set version = version + 1, updated_at = now() where id = ${rows[0].task_id} and user_id = ${context.userId}`;
		return await fetchTask(context.userId, rows[0].task_id);
	} catch (error) {
		rethrowKnown(error);
	}
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "07f5bbf7902b55c2132d195ab0182fca2e427e5efd4f86f88cbb78140d4e8297",
	name: "getDashboard",
	filename: "src/lib/teachflow/server/tasks.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		await processDue(sql, context.userId, profile.timezone);
		const today = await todayFor(sql, profile.timezone);
		const mapped = (await sql`
        select t.id, t.title, t.description, t.category, t.priority, t.status, t.due_date, t.due_time,
               t.estimated_minutes, t.actual_minutes, t.notes, t.calendar_event_id, t.template_id,
               p.name as template_name, t.remind, t.reminder_lead_minutes, t.version, t.completed_at,
               t.created_at, t.updated_at
        from tasks t
        left join templates p on p.id = t.template_id and p.user_id = t.user_id
        where t.user_id = ${context.userId}
        order by t.due_date nulls last, t.updated_at desc
        limit 300`).map((row) => mapTask(row));
		const counts = await sql`
        select
          count(*) filter (where status = 'completed' and completed_at >= now() - interval '7 days')::int as done,
          count(*) filter (where status = 'open')::int as open
        from tasks where user_id = ${context.userId}`;
		const upcomingEvents = (await sql`
        select id, title, kind, starts_at from calendar_events
        where user_id = ${context.userId} and starts_at >= now() - interval '1 day'
        order by starts_at asc limit 40`).map((event) => ({
			id: event.id,
			title: event.title,
			kind: event.kind,
			startsAt: asIso(event.starts_at) ?? ""
		})).filter((event) => event.startsAt && new Date(event.startsAt).getTime() >= Date.now() - 6e4);
		const docs = await sql`
        select id, filename, format, status, created_at from generated_documents
        where user_id = ${context.userId} order by created_at desc limit 5`;
		const templates = await sql`
        select id, name, category, status from templates
        where user_id = ${context.userId} and status <> 'archived'
        order by updated_at desc limit 5`;
		const unread = await sql`
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
			progress: {
				done: counts[0]?.done ?? 0,
				open: counts[0]?.open ?? 0
			},
			exams: upcomingEvents.filter((event) => event.kind === "exam").slice(0, 4),
			meetings: upcomingEvents.filter((event) => event.kind === "meeting").slice(0, 4),
			academic: upcomingEvents.filter((event) => event.kind === "academic" || event.kind === "institutional").slice(0, 4),
			documents: docs.map((doc) => ({
				id: doc.id,
				filename: doc.filename,
				format: doc.format,
				status: doc.status,
				createdAt: asIso(doc.created_at) ?? ""
			})),
			templates,
			unread: unread[0]?.count ?? 0
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
//#endregion
export { addSubtask_createServerFn_handler, addSubtasks_createServerFn_handler, createTask_createServerFn_handler, deleteSubtask_createServerFn_handler, deleteTask_createServerFn_handler, getDashboard_createServerFn_handler, getTask_createServerFn_handler, listTasks_createServerFn_handler, setTaskStatus_createServerFn_handler, toggleSubtask_createServerFn_handler, updateTask_createServerFn_handler };
