//#region node_modules/.nitro/vite/services/ssr/assets/time-DLu9ibbo.js
var HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
function isValidTimeZone(timeZone) {
	try {
		Intl.DateTimeFormat("en-US", { timeZone });
		return true;
	} catch {
		return false;
	}
}
function isHHMM(value) {
	return HHMM.test(value);
}
function minutesOfDay(hhmm) {
	const match = HHMM.exec(hhmm);
	if (!match) return 0;
	return Number(match[1]) * 60 + Number(match[2]);
}
/** Minutes to add to UTC to get the wall clock in `timeZone` at this instant. */
function offsetMinutes(instant, timeZone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).formatToParts(instant);
	const pick = (type) => Number(parts.find((part) => part.type === type)?.value);
	const hour = pick("hour") === 24 ? 0 : pick("hour");
	const asUtc = Date.UTC(pick("year"), pick("month") - 1, pick("day"), hour, pick("minute"), pick("second"));
	return Math.round((asUtc - instant.getTime()) / 6e4);
}
/** Interpret a calendar date and clock time as wall time in `timeZone`. */
function zonedWallTimeToUtc(date, time, timeZone) {
	const [year, month, day] = date.split("-").map(Number);
	const [hour, minute] = time.split(":").map(Number);
	const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
	const first = offsetMinutes(new Date(utcGuess), timeZone);
	let utc = utcGuess - first * 6e4;
	const second = offsetMinutes(new Date(utc), timeZone);
	if (second !== first) utc = utcGuess - second * 6e4;
	return new Date(utc);
}
function dayKeyInZone(instant, timeZone) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(instant);
}
function wallClock(instant, timeZone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).formatToParts(instant);
	const pick = (type) => parts.find((part) => part.type === type)?.value ?? "";
	const hour = pick("hour") === "24" ? "00" : pick("hour");
	return {
		date: `${pick("year")}-${pick("month")}-${pick("day")}`,
		minutes: Number(hour) * 60 + Number(pick("minute"))
	};
}
function inQuietWindow(minutes, quietStart, quietEnd) {
	const start = minutesOfDay(quietStart);
	const end = minutesOfDay(quietEnd);
	if (start === end) return false;
	if (start < end) return minutes >= start && minutes < end;
	return minutes >= start || minutes < end;
}
/**
* If a reminder would fire during quiet hours, move it to the end of that
* quiet window (the teacher's morning, when quiet hours cross midnight).
*/
function shiftOutOfQuiet(fireUtc, timeZone, quietStart, quietEnd) {
	if (!isHHMM(quietStart) || !isHHMM(quietEnd)) return fireUtc;
	const wall = wallClock(fireUtc, timeZone);
	if (!inQuietWindow(wall.minutes, quietStart, quietEnd)) return fireUtc;
	const endMin = minutesOfDay(quietEnd);
	const startMin = minutesOfDay(quietStart);
	let date = wall.date;
	if (startMin > endMin && wall.minutes >= startMin) date = addDays(wall.date, 1);
	const hh = String(Math.floor(endMin / 60)).padStart(2, "0");
	const mm = String(endMin % 60).padStart(2, "0");
	return zonedWallTimeToUtc(date, `${hh}:${mm}`, timeZone);
}
function formatWhen(iso, timeZone, withTime = true) {
	if (!iso) return "No date";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat("en-GB", {
		timeZone,
		day: "numeric",
		month: "short",
		year: "numeric",
		...withTime ? {
			hour: "2-digit",
			minute: "2-digit"
		} : {}
	}).format(date);
}
function formatDay(date, timeZone = "UTC") {
	const instant = zonedWallTimeToUtc(date, "12:00", timeZone);
	return new Intl.DateTimeFormat("en-GB", {
		timeZone,
		weekday: "short",
		day: "numeric",
		month: "short"
	}).format(instant);
}
function addDays(date, days) {
	const [year, month, day] = date.split("-").map(Number);
	const utc = new Date(Date.UTC(year, month - 1, day));
	utc.setUTCDate(utc.getUTCDate() + days);
	return utc.toISOString().slice(0, 10);
}
function monthBounds(year, monthIndex) {
	return {
		start: new Date(Date.UTC(year, monthIndex, 1)).toISOString().slice(0, 10),
		end: new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().slice(0, 10)
	};
}
//#endregion
export { isHHMM as a, shiftOutOfQuiet as c, formatWhen as i, wallClock as l, dayKeyInZone as n, isValidTimeZone as o, formatDay as r, monthBounds as s, addDays as t, zonedWallTimeToUtc as u };
