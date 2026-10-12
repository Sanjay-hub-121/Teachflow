import { a as isHHMM, o as isValidTimeZone } from "./time-DLu9ibbo.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as hashPassword$1 } from "./password-VlpK0Xix.mjs";
import { i as rethrowKnown, n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { a as db, c as loadProfile, d as processDue, f as recoveryCode, o as hashRecovery, p as sameHash } from "./common-GdDXDCtZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.functions-CM6zPPae.js
var RECOVERY_ERROR = "Those details were not accepted, or there were too many tries. Wait a few minutes and try again.";
function passwordProblem(password) {
	if (password.length < 10) return "Use at least 10 characters.";
	if (password.length > 128) return "That password is too long.";
	if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
	return null;
}
var ensureProfile_createServerFn_handler = createServerRpc({
	id: "db6619fb033386d368e91945b7c68cdaeedd1c9557f4a935a084535ddda9f189",
	name: "ensureProfile",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => ensureProfile.__executeServer(opts));
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	return { timezone: input?.timezone && isValidTimeZone(input.timezone) ? input.timezone : "UTC" };
}).handler(ensureProfile_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const users = await sql`
        select "name" as name, "email" as email from "user" where "id" = ${context.userId}`;
		const code = (await sql`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`).some((row) => row.provider_id === "credential") ? recoveryCode() : null;
		if ((await sql`
        insert into profiles (user_id, full_name, timezone, recovery_code_hash)
        values (${context.userId}, ${users[0]?.name ?? ""}, ${data.timezone}, ${code ? hashRecovery(code) : null})
        on conflict (user_id) do nothing
        returning user_id`).length) return {
			recoveryCode: code,
			email: users[0]?.email ?? ""
		};
		if (code) {
			if ((await sql`
          update profiles set recovery_code_hash = ${hashRecovery(code)}, updated_at = now()
          where user_id = ${context.userId} and recovery_code_hash is null
          returning user_id`).length) return {
				recoveryCode: code,
				email: users[0]?.email ?? ""
			};
		}
		return {
			recoveryCode: null,
			email: users[0]?.email ?? ""
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var getAccount_createServerFn_handler = createServerRpc({
	id: "c1478eee86daf9214a322848c041c0674c359d891919bab1ee1abac7349bcada",
	name: "getAccount",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => getAccount.__executeServer(opts));
var getAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAccount_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const users = await sql`
        select "email" as email, "name" as name from "user" where "id" = ${context.userId}`;
		const accounts = await sql`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`;
		return {
			email: users[0]?.email ?? "",
			hasPassword: accounts.some((row) => row.provider_id === "credential"),
			fullName: profile.full_name || users[0]?.name || "",
			institution: profile.institution,
			department: profile.department,
			designation: profile.designation,
			subjects: profile.subjects,
			grades: profile.grades,
			timezone: profile.timezone,
			workStart: profile.work_start,
			workEnd: profile.work_end,
			quietStart: profile.quiet_start,
			quietEnd: profile.quiet_end,
			reminderLeadMinutes: profile.reminder_lead_minutes,
			remindersEnabled: profile.reminders_enabled,
			docNote: profile.doc_note
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var updateAccount_createServerFn_handler = createServerRpc({
	id: "a76cb6abb61e29fe3150467f9b46341c01129659d3122f04c2a9194c6106b7e2",
	name: "updateAccount",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => updateAccount.__executeServer(opts));
var updateAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const timezone = String(input.timezone ?? "UTC");
	if (!isValidTimeZone(timezone)) throw new AppError("Choose a valid time zone.");
	for (const value of [
		input.workStart,
		input.workEnd,
		input.quietStart,
		input.quietEnd
	]) if (value && !isHHMM(value)) throw new AppError("Working hours and quiet hours use 24-hour HH:MM times.");
	const lead = Number(input.reminderLeadMinutes ?? 60);
	if (!Number.isFinite(lead) || lead < 0 || lead > 10080) throw new AppError("Reminder lead time looks off.");
	const clip = (value, max) => String(value ?? "").trim().slice(0, max);
	return {
		fullName: clip(input.fullName, 120),
		institution: clip(input.institution, 160),
		department: clip(input.department, 120),
		designation: clip(input.designation, 120),
		subjects: clip(input.subjects, 240),
		grades: clip(input.grades, 160),
		timezone,
		workStart: input.workStart && isHHMM(input.workStart) ? input.workStart : "08:00",
		workEnd: input.workEnd && isHHMM(input.workEnd) ? input.workEnd : "16:00",
		quietStart: input.quietStart && isHHMM(input.quietStart) ? input.quietStart : "21:00",
		quietEnd: input.quietEnd && isHHMM(input.quietEnd) ? input.quietEnd : "07:00",
		reminderLeadMinutes: Math.round(lead),
		remindersEnabled: input.remindersEnabled !== false,
		docNote: clip(input.docNote, 400)
	};
}).handler(updateAccount_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		if (!(await sql`
        update profiles set
          full_name = ${data.fullName},
          institution = ${data.institution},
          department = ${data.department},
          designation = ${data.designation},
          subjects = ${data.subjects},
          grades = ${data.grades},
          timezone = ${data.timezone},
          work_start = ${data.workStart},
          work_end = ${data.workEnd},
          quiet_start = ${data.quietStart},
          quiet_end = ${data.quietEnd},
          reminder_lead_minutes = ${data.reminderLeadMinutes},
          reminders_enabled = ${data.remindersEnabled},
          doc_note = ${data.docNote},
          updated_at = now()
        where user_id = ${context.userId}
        returning user_id`).length) throw new AppError("Your profile is not ready yet. Refresh the page.");
		if (data.fullName) await sql`update "user" set "name" = ${data.fullName}, "updatedAt" = now() where "id" = ${context.userId}`;
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var listSessions_createServerFn_handler = createServerRpc({
	id: "28b2949fa0c43649f188cdfea4f17fdb0eec7057acf686ddb997a08cdd9b44f6",
	name: "listSessions",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => listSessions.__executeServer(opts));
var listSessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSessions_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		const { auth } = await import("./server-xOs0tlIa.mjs").then((n) => n.r);
		const { getRequest } = await import("./ssr.mjs").then((n) => n.c).then((n) => n.t);
		const request = getRequest();
		let currentId = null;
		if (request) currentId = (await auth.api.getSession({ headers: request.headers }))?.session?.id ?? null;
		return (await sql`
        select "id" as id, "userAgent" as user_agent, "createdAt" as created_at, "expiresAt" as expires_at
        from "session" where "userId" = ${context.userId}
        order by "createdAt" desc`).map((row) => ({
			id: row.id,
			userAgent: row.user_agent ?? "Unknown device",
			createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
			expiresAt: row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at),
			current: row.id === currentId
		}));
	} catch (error) {
		rethrowKnown(error);
	}
});
var revokeSession_createServerFn_handler = createServerRpc({
	id: "a52ae00918100ebee6370a59702e7a1bfd8151db3bffd4414386081781ba4b1b",
	name: "revokeSession",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => revokeSession.__executeServer(opts));
var revokeSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	others: Boolean(input.others)
})).handler(revokeSession_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		if (data.others) {
			const { auth } = await import("./server-xOs0tlIa.mjs").then((n) => n.r);
			const { getRequest } = await import("./ssr.mjs").then((n) => n.c).then((n) => n.t);
			const request = getRequest();
			const currentId = (request ? await auth.api.getSession({ headers: request.headers }) : null)?.session?.id ?? "";
			await sql`delete from "session" where "userId" = ${context.userId} and "id" <> ${currentId}`;
			return { ok: true };
		}
		if (!data.id) throw new AppError("Choose a session to sign out.");
		await sql`delete from "session" where "id" = ${data.id} and "userId" = ${context.userId}`;
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var rotateRecoveryCode_createServerFn_handler = createServerRpc({
	id: "929e7fa7b93415f82bb9da9db4c117e047a7e70a7a8b4b797c03e600be426490",
	name: "rotateRecoveryCode",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => rotateRecoveryCode.__executeServer(opts));
var rotateRecoveryCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(rotateRecoveryCode_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		if (!(await sql`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`).some((row) => row.provider_id === "credential")) throw new AppError("Recovery codes are for email and password accounts.");
		const code = recoveryCode();
		await sql`update profiles set recovery_code_hash = ${hashRecovery(code)}, updated_at = now() where user_id = ${context.userId}`;
		return { recoveryCode: code };
	} catch (error) {
		rethrowKnown(error);
	}
});
var deleteAccount_createServerFn_handler = createServerRpc({
	id: "fe4d0eec1e76617368481f6666cd9d46de58ddfc6e4d7fbdb15b992bf25a5d8e",
	name: "deleteAccount",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => deleteAccount.__executeServer(opts));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ email: String(input.email ?? "").trim().toLowerCase() })).handler(deleteAccount_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const users = await sql`select "email" as email from "user" where "id" = ${context.userId}`;
		if (!users[0] || users[0].email.toLowerCase() !== data.email) throw new AppError("Type the email on this account to confirm deletion.");
		await sql`delete from "user" where "id" = ${context.userId}`;
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var resetWithRecoveryCode_createServerFn_handler = createServerRpc({
	id: "caaa6a86c7b362d182b29bc4ff4fc70b3255c451a3d23f92ec3eeaf517a022cc",
	name: "resetWithRecoveryCode",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => resetWithRecoveryCode.__executeServer(opts));
var resetWithRecoveryCode = createServerFn({ method: "POST" }).validator((input) => {
	const email = String(input.email ?? "").trim().toLowerCase();
	const code = String(input.code ?? "").trim();
	const password = String(input.password ?? "");
	if (!email || !code || !password) throw new AppError("Email, recovery code, and a new password are required.");
	const problem = passwordProblem(password);
	if (problem) throw new AppError(problem);
	return {
		email,
		code,
		password
	};
}).handler(resetWithRecoveryCode_createServerFn_handler, async ({ data }) => {
	try {
		const sql = await db();
		const attempts = await sql`
        select fails, locked_until from recovery_attempts where email = ${data.email}`;
		const lockedUntil = attempts[0]?.locked_until ? new Date(String(attempts[0].locked_until)) : null;
		if (lockedUntil && lockedUntil.getTime() > Date.now()) return {
			ok: false,
			error: RECOVERY_ERROR
		};
		const baseFails = lockedUntil && lockedUntil.getTime() <= Date.now() ? 0 : attempts[0]?.fails ?? 0;
		const users = await sql`select "id" as id from "user" where lower("email") = ${data.email}`;
		const profiles = users[0] ? await sql`
            select recovery_code_hash from profiles where user_id = ${users[0].id}` : [];
		const actual = profiles[0]?.recovery_code_hash ?? hashRecovery("missing-code");
		if (!Boolean(users[0] && profiles[0]?.recovery_code_hash && sameHash(actual, hashRecovery(data.code)))) {
			const fails = baseFails + 1;
			const lock = fails >= 8 ? new Date(Date.now() + 9e5).toISOString() : null;
			await sql`insert into recovery_attempts (email, fails, locked_until) values (${data.email}, ${fails}, ${lock})
          on conflict (email) do update set fails = ${fails}, locked_until = ${lock}`;
			return {
				ok: false,
				error: RECOVERY_ERROR
			};
		}
		if (!(await sql`
        update "account" set "password" = ${await hashPassword$1(data.password)}, "updatedAt" = now()
        where "userId" = ${users[0].id} and "providerId" = 'credential'
        returning "id"`).length) return {
			ok: false,
			error: RECOVERY_ERROR
		};
		await sql`delete from "session" where "userId" = ${users[0].id}`;
		await sql`delete from recovery_attempts where email = ${data.email}`;
		return {
			ok: true,
			error: null
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var syncInbox_createServerFn_handler = createServerRpc({
	id: "cadc2ab3080e3f9e4fd5c28f6d91aabb4546d5f3e59f3efc5f8f4a87e8cac8f2",
	name: "syncInbox",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => syncInbox.__executeServer(opts));
var syncInbox = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(syncInbox_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		await processDue(sql, context.userId, profile.timezone);
		return {
			unread: (await sql`
        select count(*)::int as count from notifications where user_id = ${context.userId} and read_at is null`)[0]?.count ?? 0,
			timezone: profile.timezone
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "f93358daa4421c19a198a0714a89430405a1cae4ad37f0f7ddae036f80a81965",
	name: "listNotifications",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		await processDue(sql, context.userId, profile.timezone);
		return (await sql`
        select id, kind, title, body, href, reminder_id, read_at, created_at
        from notifications where user_id = ${context.userId}
        order by created_at desc limit 80`).map((row) => ({
			id: row.id,
			kind: row.kind,
			title: row.title,
			body: row.body,
			href: row.href,
			reminderId: row.reminder_id,
			readAt: row.read_at instanceof Date ? row.read_at.toISOString() : row.read_at ? String(row.read_at) : null,
			createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
		}));
	} catch (error) {
		rethrowKnown(error);
	}
});
var markNotifications_createServerFn_handler = createServerRpc({
	id: "2c9282c3dcf3562ca14691f6638b8755ee316491df89ad1c84f41a2fce379ac0",
	name: "markNotifications",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => markNotifications.__executeServer(opts));
var markNotifications = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	all: Boolean(input.all)
})).handler(markNotifications_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		if (data.all) await sql`update notifications set read_at = now() where user_id = ${context.userId} and read_at is null`;
		else if (data.id) await sql`update notifications set read_at = now() where id = ${data.id} and user_id = ${context.userId} and read_at is null`;
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var snoozeReminder_createServerFn_handler = createServerRpc({
	id: "1a9897a9ee1c54efc6a1eb060ba938f0a53af0b4bb8e2a011692e0eaac95f683",
	name: "snoozeReminder",
	filename: "src/lib/teachflow/server/account.functions.ts"
}, (opts) => snoozeReminder.__executeServer(opts));
var snoozeReminder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const minutes = [
		15,
		60,
		180,
		1440
	].includes(Number(input.minutes)) ? Number(input.minutes) : 60;
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That reminder could not be found.");
	return {
		id,
		minutes
	};
}).handler(snoozeReminder_createServerFn_handler, async ({ context, data }) => {
	try {
		if (!(await (await db())`
        update reminders set status = 'scheduled', fire_at = ${new Date(Date.now() + data.minutes * 6e4).toISOString()}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and status in ('scheduled', 'delivered', 'snoozed')
        returning id`).length) throw new AppError("That reminder could not be found.");
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
//#endregion
export { deleteAccount_createServerFn_handler, ensureProfile_createServerFn_handler, getAccount_createServerFn_handler, listNotifications_createServerFn_handler, listSessions_createServerFn_handler, markNotifications_createServerFn_handler, resetWithRecoveryCode_createServerFn_handler, revokeSession_createServerFn_handler, rotateRecoveryCode_createServerFn_handler, snoozeReminder_createServerFn_handler, syncInbox_createServerFn_handler, updateAccount_createServerFn_handler };
