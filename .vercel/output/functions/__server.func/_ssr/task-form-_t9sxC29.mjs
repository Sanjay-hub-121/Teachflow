import { r as formatDay } from "./time-DLu9ibbo.mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Select, d as TextInput, i as Field, l as Status, t as Button, u as TextArea } from "./ui-NXfbhcwX.mjs";
import { a as categoryLabel, n as PRIORITIES, r as TASK_CATEGORIES, t as EVENT_KINDS } from "./categories-Cd43Z7G-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/task-form-_t9sxC29.js
var import_jsx_runtime = require_jsx_runtime();
function dueLabel(dueDate, dueTime, timeZone) {
	if (!dueDate) return "No due date";
	return dueTime ? `${formatDay(dueDate, timeZone)} at ${dueTime}` : formatDay(dueDate, timeZone);
}
function TaskSummary({ task, timeZone, busy, onToggle }) {
	const done = task.subtasks.filter((item) => item.done).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-wrap items-start justify-between gap-3 rounded-lg border border-line bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/tasks/$taskId",
				params: { taskId: task.id },
				className: "font-semibold text-ink hover:underline",
				children: task.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					categoryLabel(task.category),
					" · ",
					dueLabel(task.dueDate, task.dueTime, timeZone),
					task.subtasks.length ? ` · ${done} of ${task.subtasks.length} steps` : ""
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: task.status === "open" && task.priority === "high" ? "high" : task.status }), onToggle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				disabled: busy,
				onClick: () => onToggle(task),
				children: task.status === "completed" ? "Reopen" : "Mark done"
			}) : null]
		})]
	});
}
function TaskFields({ draft, onChange, templates, mode }) {
	const set = (patch) => onChange({
		...draft,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: draft.title,
					required: true,
					maxLength: 160,
					onChange: (event) => set({ title: event.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Category",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: draft.category,
					onChange: (event) => set({ category: event.target.value }),
					children: TASK_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.label
					}, item.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "What has to happen",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: draft.description,
						onChange: (event) => set({ description: event.target.value })
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Priority",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: draft.priority,
					onChange: (event) => set({ priority: event.target.value }),
					children: PRIORITIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.label
					}, item.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Linked template",
				hint: "Optional. Generating a document does not complete the task.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: draft.templateId,
					onChange: (event) => set({ templateId: event.target.value }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "None"
					}), templates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.name
					}, item.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Due date",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					type: "date",
					value: draft.dueDate,
					onChange: (event) => set({ dueDate: event.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Due time",
				hint: "Leave blank to use the end of your working day for reminders.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					type: "time",
					value: draft.dueTime,
					onChange: (event) => set({ dueTime: event.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Estimated minutes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "numeric",
					value: draft.estimatedMinutes,
					onChange: (event) => set({ estimatedMinutes: event.target.value })
				})
			}),
			mode === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Minutes it actually took",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "numeric",
					value: draft.actualMinutes,
					onChange: (event) => set({ actualMinutes: event.target.value })
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Add to calendar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-primary",
						checked: draft.addToCalendar,
						onChange: (event) => set({ addToCalendar: event.target.checked })
					}), "Put this due date on the calendar"]
				})
			}),
			mode === "create" && draft.addToCalendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Calendar type",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: draft.eventKind,
					onChange: (event) => set({ eventKind: event.target.value }),
					children: EVENT_KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.label
					}, item.id))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Reminder",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-primary",
						checked: draft.remind,
						onChange: (event) => set({ remind: event.target.checked })
					}), "Remind me before this is due"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Minutes before",
				hint: "Blank uses the default from Settings.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "numeric",
					value: draft.reminderLeadMinutes,
					onChange: (event) => set({ reminderLeadMinutes: event.target.value }),
					disabled: !draft.remind
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Private notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: draft.notes,
						onChange: (event) => set({ notes: event.target.value })
					})
				})
			})
		]
	});
}
//#endregion
export { TaskSummary as n, dueLabel as r, TaskFields as t };
