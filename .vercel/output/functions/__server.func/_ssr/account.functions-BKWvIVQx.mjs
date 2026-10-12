import { a as isHHMM, o as isValidTimeZone } from "./time-DLu9ibbo.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.functions-BKWvIVQx.js
function passwordProblem(password) {
	if (password.length < 10) return "Use at least 10 characters.";
	if (password.length > 128) return "That password is too long.";
	if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
	return null;
}
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	return { timezone: input?.timezone && isValidTimeZone(input.timezone) ? input.timezone : "UTC" };
}).handler(createSsrRpc("db6619fb033386d368e91945b7c68cdaeedd1c9557f4a935a084535ddda9f189"));
var getAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c1478eee86daf9214a322848c041c0674c359d891919bab1ee1abac7349bcada"));
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
}).handler(createSsrRpc("a76cb6abb61e29fe3150467f9b46341c01129659d3122f04c2a9194c6106b7e2"));
var listSessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("28b2949fa0c43649f188cdfea4f17fdb0eec7057acf686ddb997a08cdd9b44f6"));
var revokeSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	others: Boolean(input.others)
})).handler(createSsrRpc("a52ae00918100ebee6370a59702e7a1bfd8151db3bffd4414386081781ba4b1b"));
var rotateRecoveryCode = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("929e7fa7b93415f82bb9da9db4c117e047a7e70a7a8b4b797c03e600be426490"));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ email: String(input.email ?? "").trim().toLowerCase() })).handler(createSsrRpc("fe4d0eec1e76617368481f6666cd9d46de58ddfc6e4d7fbdb15b992bf25a5d8e"));
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
}).handler(createSsrRpc("caaa6a86c7b362d182b29bc4ff4fc70b3255c451a3d23f92ec3eeaf517a022cc"));
var syncInbox = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cadc2ab3080e3f9e4fd5c28f6d91aabb4546d5f3e59f3efc5f8f4a87e8cac8f2"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f93358daa4421c19a198a0714a89430405a1cae4ad37f0f7ddae036f80a81965"));
var markNotifications = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	all: Boolean(input.all)
})).handler(createSsrRpc("2c9282c3dcf3562ca14691f6638b8755ee316491df89ad1c84f41a2fce379ac0"));
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
}).handler(createSsrRpc("1a9897a9ee1c54efc6a1eb060ba938f0a53af0b4bb8e2a011692e0eaac95f683"));
//#endregion
export { listSessions as a, revokeSession as c, syncInbox as d, updateAccount as f, listNotifications as i, rotateRecoveryCode as l, ensureProfile as n, markNotifications as o, getAccount as r, resetWithRecoveryCode as s, deleteAccount as t, snoozeReminder as u };
