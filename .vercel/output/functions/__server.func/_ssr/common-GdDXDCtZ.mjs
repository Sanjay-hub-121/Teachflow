import { a as isHHMM, c as shiftOutOfQuiet, u as zonedWallTimeToUtc } from "./time-DLu9ibbo.mjs";
import { r as getSql } from "./db-DBqeKbCw.mjs";
import { t as AppError } from "./errors-DaMHwKbb.mjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/common-GdDXDCtZ.js
function planDeadlineReminder(input) {
	if (!input.remind) return null;
	const lead = clampLead(input.leadMinutes);
	let due = null;
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
	const fired = /* @__PURE__ */ new Date(due.getTime() - lead * 6e4);
	const shifted = shiftOutOfQuiet(fired, input.timeZone, input.quietStart, input.quietEnd);
	return {
		idempotencyKey: `${input.scope}:${input.id}:at:${stamp}:lead:${lead}`,
		fireAtIso: shifted.toISOString(),
		leadMinutes: lead
	};
}
function clampLead(minutes) {
	if (!Number.isFinite(minutes)) return 60;
	return Math.max(0, Math.min(10080, Math.round(minutes)));
}
/** Which scheduled reminders to cancel, and whether a new row is required. */
function reconcileDecision(existing, plan) {
	const scheduled = existing.filter((row) => row.status === "scheduled" || row.status === "snoozed");
	if (!plan) return {
		cancelKeys: scheduled.map((row) => row.idempotencyKey),
		insert: null
	};
	const kept = existing.some((row) => row.idempotencyKey === plan.idempotencyKey);
	return {
		cancelKeys: scheduled.filter((row) => row.idempotencyKey !== plan.idempotencyKey).map((row) => row.idempotencyKey),
		insert: kept ? null : plan
	};
}
function nid() {
	return crypto.randomUUID();
}
async function db() {
	return getSql();
}
function asIso(value) {
	if (value == null) return null;
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") {
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
	}
	return null;
}
function asDay(value) {
	if (value == null) return null;
	if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return null;
}
function cleanDate(value) {
	if (value == null || value === "") return null;
	const text = String(value);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new AppError("Enter a valid date.");
	return text;
}
function cleanTime(value) {
	if (value == null || value === "") return null;
	const text = String(value);
	if (!isHHMM(text)) throw new AppError("Enter a time as HH:MM.");
	return text;
}
function likePattern(value) {
	return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}
async function loadProfile(sql, userId) {
	const rows = await sql`
    select full_name, institution, department, designation, subjects, grades, timezone,
           work_start, work_end, quiet_start, quiet_end, reminder_lead_minutes,
           reminders_enabled, doc_note
    from profiles where user_id = ${userId}`;
	if (!rows[0]) throw new AppError("Your profile is not ready yet. Refresh the page.");
	return rows[0];
}
async function todayFor(sql, timeZone) {
	return (await sql`select (now() at time zone ${timeZone})::date::text as today`)[0]?.today ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function recoveryCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const chars = [...randomBytes(16)].map((byte) => alphabet[byte % 32]);
	return [
		0,
		4,
		8,
		12
	].map((start) => chars.slice(start, start + 4).join("")).join("-");
}
function hashRecovery(code) {
	const normalized = code.replace(/-/g, "").trim().toUpperCase();
	return createHash("sha256").update(normalized).digest("hex");
}
function sameHash(left, right) {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
async function syncReminder(sql, userId, profile, target) {
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
		fallbackTime: isHHMM(profile.work_end) ? profile.work_end : "16:00"
	});
	const decision = reconcileDecision((await sql.query(`select idempotency_key, status from reminders where user_id = $1 and ${target.scope === "task" ? "task_id" : "event_id"} = $2`, [userId, target.id])).map((row) => ({
		idempotencyKey: row.idempotency_key,
		status: row.status
	})), plan);
	for (const key of decision.cancelKeys) await sql`update reminders set status = 'cancelled', updated_at = now()
      where user_id = ${userId} and idempotency_key = ${key} and status in ('scheduled', 'snoozed')`;
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
async function processDue(sql, userId, timeZone) {
	const due = await sql`
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
		const fireIso = asIso(row.fire_at) ?? (/* @__PURE__ */ new Date()).toISOString();
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
		} catch (error) {
			console.error("[teachflow] reminder delivery failed");
			await sql`update reminders set attempt_count = attempt_count + 1, last_error = 'delivery failed', updated_at = now()
        where id = ${row.id} and user_id = ${userId} and attempt_count < 5`;
		}
	}
	const today = await todayFor(sql, timeZone);
	const overdue = await sql`
    select id, title, due_date::text as due_date from tasks
    where user_id = ${userId} and status = 'open' and due_date is not null and due_date < ${today}::date
    limit 30`;
	for (const task of overdue) await sql`insert into notifications (id, user_id, kind, title, body, href, idempotency_key)
      values (
        ${nid()}, ${userId}, 'overdue', ${task.title},
        ${`This is still open. It was due ${task.due_date}.`},
        ${`/app/tasks/${task.id}`}, ${`overdue:${task.id}:${today}`}
      ) on conflict (user_id, idempotency_key) do nothing`;
}
async function notify(sql, userId, input) {
	await sql`insert into notifications (id, user_id, kind, title, body, href, idempotency_key)
    values (${nid()}, ${userId}, ${input.kind}, ${input.title}, ${input.body}, ${input.href ?? null}, ${input.key})
    on conflict (user_id, idempotency_key) do nothing`;
}
//#endregion
export { db as a, loadProfile as c, processDue as d, recoveryCode as f, todayFor as h, cleanTime as i, nid as l, syncReminder as m, asIso as n, hashRecovery as o, sameHash as p, cleanDate as r, likePattern as s, asDay as t, notify as u };
