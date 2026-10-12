import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, c as Select, d as TextInput, i as Field, n as Card, r as Empty, s as PageHeader, t as Button } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { n as PRIORITIES, r as TASK_CATEGORIES } from "./categories-Cd43Z7G-.mjs";
import { c as listTemplates } from "./library.functions-Bc66j6oO.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { c as listTasks, l as setTaskStatus, r as createTask } from "./tasks.functions-D5VofiPi.mjs";
import { n as TaskSummary, t as TaskFields } from "./task-form-_t9sxC29.mjs";
import { r as payloadFromDraft, t as blankTask } from "./types-Dewvh23Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-BaRaRFx9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VIEWS = [
	["all", "Everything"],
	["today", "Today"],
	["upcoming", "Upcoming"],
	["overdue", "Overdue"],
	["completed", "Completed"]
];
function TasksPage() {
	const navigate = useNavigate();
	const [view, setView] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("due");
	const [draft, setDraft] = (0, import_react.useState)(blankTask());
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [busyId, setBusyId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => setQuery(q.trim()), 250);
		return () => window.clearTimeout(timer);
	}, [q]);
	const listed = useData(() => listTasks({ data: {
		view,
		q: query,
		category,
		priority,
		sort
	} }), [
		view,
		query,
		category,
		priority,
		sort
	]);
	const templates = useData(() => listTemplates({ data: { archived: false } }), []);
	const toggle = async (task) => {
		setBusyId(task.id);
		const next = await attempt(() => setTaskStatus({ data: {
			id: task.id,
			version: task.version,
			status: task.status === "completed" ? "open" : "completed"
		} }));
		setBusyId("");
		if (next) listed.reload();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tasks",
			lede: "Your own list. Search looks through titles, descriptions, and notes.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen((value) => !value),
				children: open ? "Close form" : "New task"
			})
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (event) => {
					event.preventDefault();
					setBusy(true);
					attempt(() => createTask({ data: payloadFromDraft(draft) }), "Task saved").then(async (created) => {
						setBusy(false);
						if (!created) return;
						setDraft(blankTask());
						setOpen(false);
						await navigate({
							to: "/app/tasks/$taskId",
							params: { taskId: created.id }
						});
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskFields, {
					draft,
					onChange: setDraft,
					mode: "create",
					templates: (templates.data ?? []).map((item) => ({
						id: item.id,
						name: item.name
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Saving…" : "Save task"
				})]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: VIEWS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `min-h-11 rounded-full px-3 text-sm font-semibold ${view === id ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`,
				onClick: () => setView(id),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Search",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: q,
						onChange: (event) => setQ(event.target.value),
						placeholder: "Title or note"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Category",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onChange: (event) => setCategory(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Any"
						}), TASK_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.label
						}, item.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Priority",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: priority,
						onChange: (event) => setPriority(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Any"
						}), PRIORITIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.label
						}, item.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Sort",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onChange: (event) => setSort(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "due",
								children: "Due date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "priority",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "updated",
								children: "Recently changed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "title",
								children: "Title"
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
			status: listed.status,
			error: listed.error,
			label: "Loading tasks",
			children: listed.data && listed.data.tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "No tasks in this view",
				body: "Change the filters, or add a task when you are ready. Nothing here is a sample."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: listed.data?.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskSummary, {
					task,
					timeZone: listed.data?.timezone ?? "UTC",
					busy: busyId === task.id,
					onToggle: toggle
				}, task.id))
			})
		})
	] });
}
//#endregion
export { TasksPage as component };
