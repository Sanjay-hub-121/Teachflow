import { o as __toESM } from "../_runtime.mjs";
import { i as formatWhen } from "./time-DLu9ibbo.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, l as Status, n as Card, r as Empty, s as PageHeader, t as Button } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { a as categoryLabel, o as eventKindLabel } from "./categories-Cd43Z7G-.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { l as setTaskStatus, o as getDashboard } from "./tasks.functions-D5VofiPi.mjs";
import { r as dueLabel } from "./task-form-_t9sxC29.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-hs0cQ1L0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function greeting(name) {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
	const first = name.trim().split(/\s+/)[0];
	return first ? `${hello}, ${first}` : hello;
}
function TodayPage() {
	const dash = useData(() => getDashboard(), []);
	const [busyId, setBusyId] = (0, import_react.useState)("");
	const toggle = async (task) => {
		setBusyId(task.id);
		const next = await attempt(() => setTaskStatus({ data: {
			id: task.id,
			version: task.version,
			status: task.status === "completed" ? "open" : "completed"
		} }));
		setBusyId("");
		if (next) dash.reload();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: dash.status,
		error: dash.error,
		label: "Loading today",
		children: dash.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: greeting(dash.data.greetingName),
				lede: `${dash.data.today} in your time zone. Marking something done only updates your own list.`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/tasks",
					className: "inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-ink",
					children: "New task"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Open"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: dash.data.progress.open
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Finished in 7 days"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: dash.data.progress.done
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Unread alerts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: dash.data.unread
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1.4fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Overdue",
							tasks: dash.data.overdue,
							timeZone: dash.data.timezone,
							busyId,
							onToggle: toggle,
							tone: "warn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Due today",
							tasks: dash.data.todayTasks,
							timeZone: dash.data.timezone,
							busyId,
							onToggle: toggle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Coming up",
							tasks: dash.data.upcoming,
							timeZone: dash.data.timezone,
							busyId,
							onToggle: toggle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "No date yet",
							tasks: dash.data.undated,
							timeZone: dash.data.timezone,
							busyId,
							onToggle: toggle
						}),
						dash.data.overdue.length + dash.data.todayTasks.length + dash.data.upcoming.length + dash.data.undated.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "Nothing dated is waiting",
							body: "Add a task with a due date when you want it on this desk. Undated work stays in Tasks.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/tasks",
								className: "font-semibold text-primary",
								children: "Open tasks"
							})
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, {
							title: "Examinations",
							items: dash.data.exams,
							timeZone: dash.data.timezone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, {
							title: "Meetings",
							items: dash.data.meetings,
							timeZone: dash.data.timezone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, {
							title: "Other dates",
							items: dash.data.academic,
							timeZone: dash.data.timezone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Templates"
						}), dash.data.templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "A question paper or lesson plan you approve can be filled again next term."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: dash.data.templates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/templates/$templateId",
								params: { templateId: item.id },
								className: "text-sm font-semibold text-primary",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: item.status })
							})] }, item.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Recent documents"
						}), dash.data.documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Generated files will show up here. Downloading one does not close a task."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: dash.data.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/documents/$documentId",
								params: { documentId: doc.id },
								className: "text-sm font-semibold text-primary",
								children: doc.filename
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: doc.status })
							})] }, doc.id))
						})] })
					]
				})]
			})
		] }) : null
	});
}
function TaskGroup({ title, tasks, timeZone, busyId, onToggle, tone }) {
	if (tasks.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-2 font-display text-2xl",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: `flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${tone === "warn" ? "border-clay bg-clay-soft" : "border-line bg-card"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/tasks/$taskId",
					params: { taskId: task.id },
					className: "font-semibold",
					children: task.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						categoryLabel(task.category),
						" · ",
						dueLabel(task.dueDate, task.dueTime, timeZone)
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				disabled: busyId === task.id,
				onClick: () => onToggle(task),
				children: "Mark done"
			})]
		}, task.id))
	})] });
}
function EventList({ title, items, timeZone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display text-2xl",
		children: title
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted",
		children: "None coming up."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 space-y-2 text-sm",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app/calendar",
			className: "font-semibold text-ink",
			children: item.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-muted",
			children: [
				eventKindLabel(item.kind),
				" · ",
				formatWhen(item.startsAt, timeZone)
			]
		})] }, item.id))
	})] });
}
//#endregion
export { TodayPage as component };
