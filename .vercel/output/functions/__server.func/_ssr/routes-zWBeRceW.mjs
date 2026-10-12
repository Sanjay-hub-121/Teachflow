import { S as Navigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as CalendarDays, o as ListChecks, p as Bell, u as FileStack } from "../_libs/lucide-react.mjs";
import { f as Wordmark } from "./ui-NXfbhcwX.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-zWBeRceW.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-primary",
					children: "Sign in"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-5xl gap-10 px-4 pb-16 pt-6 md:grid-cols-[1.2fr_0.8fr] md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tracking-wide text-primary",
						children: "For teachers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-5xl leading-tight text-ink",
						children: "Less work stress. More time for teaching."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-lg text-ink-soft",
						children: "Keep tasks, dates, and academic documents in one account. Sign in on a laptop, then open the same work on your phone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-ink",
							children: "Create an account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex min-h-11 items-center rounded-md border border-line-strong bg-card px-4 text-sm font-semibold",
							children: "I already have one"
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line bg-card p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-muted",
						children: "A quieter desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-4",
						children: [
							["Today’s tasks and overdue items come from your account, not a sample list.", ListChecks],
							["Reminders stay on the server, so closing the browser does not erase them.", Bell],
							["Reuse a question paper or lesson plan instead of starting from a blank file.", FileStack]
						].map(([text, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm text-ink-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text })]
						}, String(text)))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid max-w-5xl gap-4 px-4 pb-20 md:grid-cols-3",
				children: [
					[
						CalendarDays,
						"Dates in one calendar",
						"Exams, meetings, and assignment deadlines, shown in your time zone."
					],
					[
						FileStack,
						"Templates you approve",
						"Upload a document, check the fields, then fill it again next term."
					],
					[
						Bell,
						"Alerts without nagging",
						"In-app reminders respect quiet hours. No guilt streaks."
					]
				].map(([Icon, title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-line bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: body
						})
					]
				}, String(title)))
			})
		]
	});
}
//#endregion
export { Home as component };
