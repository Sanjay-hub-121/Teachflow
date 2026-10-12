import { i as formatWhen } from "./time-DLu9ibbo.mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, n as Card, r as Empty, s as PageHeader, t as Button } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { i as listNotifications, o as markNotifications, u as snoozeReminder } from "./account.functions-BKWvIVQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-Crmj2WxQ.js
var import_jsx_runtime = require_jsx_runtime();
function AlertLink({ href, children }) {
	if (href.startsWith("/app/tasks/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/app/tasks/$taskId",
		params: { taskId: href.slice(11) },
		className: "font-semibold",
		children
	});
	if (href.startsWith("/app/documents/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/app/documents/$documentId",
		params: { documentId: href.slice(15) },
		className: "font-semibold",
		children
	});
	if (href === "/app/calendar") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/app/calendar",
		className: "font-semibold",
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-semibold",
		children
	});
}
function AlertsPage() {
	const listed = useData(() => listNotifications(), []);
	const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const items = listed.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Alerts",
		lede: "Reminders stay on your account. Quiet hours can delay them until morning. Nothing here is emailed.",
		action: items.some((item) => !item.readAt) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			onClick: () => {
				attempt(() => markNotifications({ data: { all: true } })).then((next) => {
					if (next) listed.reload();
				});
			},
			children: "Mark all read"
		}) : null
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: listed.status,
		error: listed.error,
		label: "Loading alerts",
		children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No alerts",
			body: "When a reminder is due, or a document finishes, it will be listed here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: item.readAt ? "opacity-70" : "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						item.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertLink, {
							href: item.href,
							children: item.title
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: item.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: formatWhen(item.createdAt, zone)
						})
					] }), !item.readAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: () => {
							attempt(() => markNotifications({ data: { id: item.id } })).then((next) => {
								if (next) listed.reload();
							});
						},
						children: "Mark read"
					}) : null]
				}), item.reminderId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						[15, "15 min"],
						[60, "1 hour"],
						[180, "3 hours"],
						[1440, "Tomorrow"]
					].map(([minutes, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							attempt(() => snoozeReminder({ data: {
								id: item.reminderId,
								minutes: Number(minutes)
							} }), "Snoozed").then((next) => {
								if (next) listed.reload();
							});
						},
						children: label
					}, minutes))
				}) : null]
			}, item.id))
		})
	})] });
}
//#endregion
export { AlertsPage as component };
