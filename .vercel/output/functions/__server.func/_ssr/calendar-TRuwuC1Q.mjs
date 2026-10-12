import { o as __toESM } from "../_runtime.mjs";
import { l as wallClock, n as dayKeyInZone, r as formatDay, s as monthBounds, t as addDays } from "./time-DLu9ibbo.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as LoadGate, c as Select, d as TextInput, i as Field, n as Card, o as Notice, s as PageHeader, t as Button, u as TextArea } from "./ui-NXfbhcwX.mjs";
import { n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { o as eventKindLabel, s as isEventKind, t as EVENT_KINDS } from "./categories-Cd43Z7G-.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { i as cleanTime, r as cleanDate } from "./common-GdDXDCtZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-TRuwuC1Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var getCalendar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const start = cleanDate(input.start);
	const end = cleanDate(input.end);
	if (!start || !end || end < start) throw new AppError("Choose a valid date range.");
	return {
		start,
		end
	};
}).handler(createSsrRpc("2e1a83d028aeaaf3bc04e9bdfb5e76645a34f02ab3cc159d9d63211eebc57ef6"));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => eventInput(input)).handler(createSsrRpc("7cc7c022623bba0db787eacdf0af2b8d58147d9715946e7278cf325710858fe7"));
var updateEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That event was not found.");
	return {
		...eventInput(input),
		id
	};
}).handler(createSsrRpc("1bd26a0ba8a4423d614910c41053e4f66f32ad9dc2b22282b23b9a1eee977d57"));
var deleteEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That event was not found.");
	return { id };
}).handler(createSsrRpc("7b75749e0d04c3738b4b23620ade49d3b4e8d6b8d82dc8e3487e530621524dcc"));
function blank(day) {
	return {
		title: "",
		description: "",
		kind: "academic",
		startDate: day,
		endDate: day,
		allDay: false,
		startTime: "09:00",
		endTime: "10:00",
		recurrence: "none",
		recurrenceUntil: "",
		remind: false,
		reminderLeadMinutes: ""
	};
}
function localDay() {
	const date = /* @__PURE__ */ new Date();
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function weeksOf(year, month) {
	const { start, end } = monthBounds(year, month);
	const first = (/* @__PURE__ */ new Date(`${start}T12:00:00Z`)).getUTCDay();
	let day = addDays(start, -((first + 6) % 7));
	const weeks = [];
	while (weeks.length < 6) {
		const week = [];
		for (let index = 0; index < 7; index += 1) {
			week.push(day);
			day = addDays(day, 1);
		}
		weeks.push(week);
		if (week[6] >= end && weeks.length >= 4) break;
	}
	return weeks;
}
function splitInstant(iso, timeZone) {
	const wall = wallClock(new Date(iso), timeZone);
	const hh = String(Math.floor(wall.minutes / 60)).padStart(2, "0");
	const mm = String(wall.minutes % 60).padStart(2, "0");
	return {
		date: wall.date,
		time: `${hh}:${mm}`
	};
}
function CalendarPage() {
	const startDay = localDay();
	const [cursor, setCursor] = (0, import_react.useState)(() => {
		const [year, month] = startDay.split("-").map(Number);
		return {
			year,
			month: month - 1
		};
	});
	const [selected, setSelected] = (0, import_react.useState)(startDay);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const weeks = (0, import_react.useMemo)(() => weeksOf(cursor.year, cursor.month), [cursor]);
	const rangeStart = weeks[0][0];
	const rangeEnd = weeks[weeks.length - 1][6];
	const cal = useData(() => getCalendar({ data: {
		start: rangeStart,
		end: rangeEnd
	} }), [rangeStart, rangeEnd]);
	const today = cal.data ? dayKeyInZone(/* @__PURE__ */ new Date(), cal.data.timezone) : startDay;
	const monthLabel = new Intl.DateTimeFormat("en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(cursor.year, cursor.month, 1)));
	const shift = (delta) => {
		const next = new Date(Date.UTC(cursor.year, cursor.month + delta, 1));
		setCursor({
			year: next.getUTCFullYear(),
			month: next.getUTCMonth()
		});
	};
	const eventsByDay = /* @__PURE__ */ new Map();
	for (const item of cal.data?.occurrences ?? []) {
		const list = eventsByDay.get(item.day) ?? [];
		list.push({
			id: item.eventId,
			title: item.title,
			kind: item.kind
		});
		eventsByDay.set(item.day, list);
	}
	const tasksByDay = /* @__PURE__ */ new Map();
	for (const task of cal.data?.tasks ?? []) {
		const list = tasksByDay.get(task.dueDate) ?? [];
		list.push(task);
		tasksByDay.set(task.dueDate, list);
	}
	const dayEvents = (cal.data?.occurrences ?? []).filter((item) => item.day === selected);
	const dayTasks = (cal.data?.tasks ?? []).filter((task) => task.dueDate === selected);
	const openEvent = (eventId) => {
		const event = cal.data?.events.find((item) => item.id === eventId);
		if (!event || !cal.data) return;
		const start = splitInstant(event.startsAt, cal.data.timezone);
		const end = event.endsAt ? splitInstant(event.endsAt, cal.data.timezone) : start;
		setDraft({
			id: event.id,
			version: event.version,
			title: event.title,
			description: event.description,
			kind: event.kind,
			startDate: start.date,
			endDate: end.date,
			allDay: event.allDay,
			startTime: event.allDay ? "09:00" : start.time,
			endTime: event.allDay ? "10:00" : end.time,
			recurrence: event.recurrence,
			recurrenceUntil: event.recurrenceUntil ?? "",
			remind: event.remind,
			reminderLeadMinutes: event.reminderLeadMinutes == null ? "" : String(event.reminderLeadMinutes)
		});
		setSelected(start.date);
		setConfirmDelete(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Calendar",
			lede: "Exams, meetings, and deadlines in your time zone. Tasks with a due date appear even if they are not events.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setDraft(blank(selected)),
				children: "Add a date"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: monthLabel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => shift(-1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const [year, month, day] = today.split("-").map(Number);
							setCursor({
								year,
								month: month - 1
							});
							setSelected(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
						},
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => shift(1),
						children: "Next"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LoadGate, {
			status: cal.status,
			error: cal.error,
			label: "Loading the calendar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted",
					children: [
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat",
						"Sun"
					].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-1",
						children: label
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1",
					children: weeks.flat().map((day) => {
						const inMonth = Number(day.slice(5, 7)) === cursor.month + 1;
						const count = (eventsByDay.get(day)?.length ?? 0) + (tasksByDay.get(day)?.length ?? 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelected(day),
							className: `min-h-16 rounded-md border px-1 py-1 text-left ${selected === day ? "border-primary bg-primary-soft" : "border-line bg-card"} ${inMonth ? "" : "opacity-50"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-sm font-semibold ${day === today ? "text-primary" : "text-ink"}`,
									children: Number(day.slice(8))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 hidden truncate text-xs text-ink-soft md:block",
									children: eventsByDay.get(day)?.[0]?.title
								}),
								count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs text-muted md:hidden",
									children: count
								}) : null
							]
						}, day);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: formatDay(selected, cal.data?.timezone ?? "UTC")
						}),
						dayEvents.length === 0 && dayTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Nothing on this day."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2",
							children: [dayEvents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-h-11 text-left",
								onClick: () => openEvent(item.eventId),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: [eventKindLabel(item.kind), item.allDay ? " · all day" : ""]
								})]
							}) }, `${item.eventId}-${item.startsAt}`)), dayTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/tasks/$taskId",
								params: { taskId: task.id },
								className: "block min-h-11",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: ["Due: ", task.title]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm text-muted",
									children: [task.dueTime ? `At ${task.dueTime}` : "No clock time", task.priority === "high" ? " · high priority" : ""]
								})]
							}) }, task.id))]
						})
					] }), draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: draft.id ? "Edit date" : "New date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-3",
						onSubmit: (event) => {
							event.preventDefault();
							setBusy(true);
							const data = {
								id: draft.id,
								version: draft.version,
								title: draft.title,
								description: draft.description,
								kind: draft.kind,
								startDate: draft.startDate,
								endDate: draft.endDate || draft.startDate,
								allDay: draft.allDay,
								startTime: draft.startTime.slice(0, 5),
								endTime: draft.endTime.slice(0, 5),
								recurrence: draft.recurrence,
								recurrenceUntil: draft.recurrenceUntil || null,
								remind: draft.remind,
								reminderLeadMinutes: draft.reminderLeadMinutes === "" ? null : Number(draft.reminderLeadMinutes)
							};
							attempt(async () => {
								if (draft.id) return updateEvent({ data });
								return createEvent({ data });
							}).then((saved) => {
								setBusy(false);
								if (!saved) return;
								setDraft(null);
								cal.reload();
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									required: true,
									value: draft.title,
									onChange: (event) => setDraft({
										...draft,
										title: event.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Type",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: draft.kind,
									onChange: (event) => setDraft({
										...draft,
										kind: event.target.value
									}),
									children: EVENT_KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.label
									}, item.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Starts",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "date",
										required: true,
										value: draft.startDate,
										onChange: (event) => setDraft({
											...draft,
											startDate: event.target.value
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Ends",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "date",
										value: draft.endDate,
										onChange: (event) => setDraft({
											...draft,
											endDate: event.target.value
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: draft.allDay,
									onChange: (event) => setDraft({
										...draft,
										allDay: event.target.checked
									})
								}), "All day"]
							}),
							draft.allDay ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Start time",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "time",
										value: draft.startTime,
										onChange: (event) => setDraft({
											...draft,
											startTime: event.target.value
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "End time",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "time",
										value: draft.endTime,
										onChange: (event) => setDraft({
											...draft,
											endTime: event.target.value
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Repeats",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.recurrence,
									onChange: (event) => setDraft({
										...draft,
										recurrence: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "none",
											children: "Does not repeat"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "daily",
											children: "Daily"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "weekly",
											children: "Weekly"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "monthly",
											children: "Monthly"
										})
									]
								})
							}),
							draft.recurrence !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Repeat until",
								hint: "Leave blank to keep showing it in the months you open.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "date",
									value: draft.recurrenceUntil,
									onChange: (event) => setDraft({
										...draft,
										recurrenceUntil: event.target.value
									})
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
									value: draft.description,
									onChange: (event) => setDraft({
										...draft,
										description: event.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: draft.remind,
									onChange: (event) => setDraft({
										...draft,
										remind: event.target.checked
									})
								}), "Remind me"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									children: busy ? "Saving…" : "Save date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => setDraft(null),
									children: "Cancel"
								})]
							}),
							draft.id ? confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "Delete this date? A linked task stays on your list." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "danger",
									onClick: () => {
										attempt(() => deleteEvent({ data: { id: draft.id } })).then((next) => {
											if (!next) return;
											setDraft(null);
											cal.reload();
										});
									},
									children: "Delete date"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "quiet",
								onClick: () => setConfirmDelete(true),
								children: "Delete date"
							}) : null
						]
					})] }) : null]
				})
			]
		})
	] });
}
//#endregion
export { CalendarPage as component };
