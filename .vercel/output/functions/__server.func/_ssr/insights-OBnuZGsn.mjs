import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, n as Card, s as PageHeader } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { n as getInsights } from "./insights.functions-ZU57X0ru.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-OBnuZGsn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hours(minutes) {
	if (minutes < 60) return `${minutes} min`;
	const whole = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return rest ? `${whole} h ${rest} min` : `${whole} h`;
}
function InsightsPage() {
	const [days, setDays] = (0, import_react.useState)(30);
	const stats = useData(() => getInsights({ data: { days } }), [days]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Insights",
			lede: "Counts from your own tasks and documents. Estimates appear only when you recorded the minutes yourself."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex gap-2",
			children: [
				7,
				30,
				90
			].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `min-h-11 rounded-full px-3 text-sm font-semibold ${days === value ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`,
				onClick: () => setDays(value),
				children: [value, " days"]
			}, value))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
			status: stats.status,
			error: stats.error,
			label: "Loading insights",
			children: stats.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Completed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: stats.data.completed
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Still overdue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: stats.data.overdue
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Due in this window"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: stats.data.upcoming
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Documents generated"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: stats.data.documents
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: [
							"Open tasks with an estimate: ",
							hours(stats.data.estimatedMinutes),
							" across ",
							stats.data.estimatedTasks,
							" tasks."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: [
							"Recorded on finished tasks: ",
							hours(stats.data.recordedMinutes),
							" across ",
							stats.data.recordedTasks,
							" tasks."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: stats.data.savedMinutes == null ? "Add “minutes this usually takes” on a template if you want an estimate of time saved. We will not invent one." : `About ${hours(stats.data.savedMinutes)} saved, using the minutes you stored on each template times how often you generated it. That is your estimate, not a timesheet.`
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Templates used"
				}), stats.data.templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No documents were generated in this window."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: stats.data.templates,
							layout: "vertical",
							margin: {
								left: 8,
								right: 8,
								top: 8,
								bottom: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									allowDecimals: false,
									stroke: "var(--color-muted)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									width: 120,
									stroke: "var(--color-muted)",
									tickFormatter: (value) => value.length > 16 ? `${value.slice(0, 15)}…` : value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "var(--color-paper-deep)" },
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-line)",
										borderRadius: 8
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									name: "Documents",
									fill: "var(--color-primary)",
									radius: 4
								})
							]
						})
					})
				})] })]
			})] }) : null
		})
	] });
}
//#endregion
export { InsightsPage as component };
