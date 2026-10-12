import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as Navigate, T as require_jsx_runtime, _ as Outlet, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as hasGateSessionMarker } from "./server-xOs0tlIa.mjs";
import { a as Menu, c as LayoutDashboard, d as ChartColumn, f as CalendarDays, i as Settings, l as Files, o as ListChecks, p as Bell, r as Sparkles, s as Library, t as X } from "../_libs/lucide-react.mjs";
import { f as Wordmark } from "./ui-NXfbhcwX.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { d as syncInbox, n as ensureProfile } from "./account.functions-BKWvIVQx.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BmR6WcMY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		to: "/app",
		label: "Today",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/tasks",
		label: "Tasks",
		icon: ListChecks
	},
	{
		to: "/app/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/app/templates",
		label: "Templates",
		icon: Library
	},
	{
		to: "/app/documents",
		label: "Documents",
		icon: Files
	},
	{
		to: "/app/notifications",
		label: "Alerts",
		icon: Bell
	},
	{
		to: "/app/insights",
		label: "Insights",
		icon: ChartColumn
	},
	{
		to: "/app/assistant",
		label: "Assistant",
		icon: Sparkles
	},
	{
		to: "/app/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell() {
	const { user, isPending } = useCurrentUserState();
	const path = useRouterState({ select: (state) => state.location.pathname });
	const [unread, setUnread] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [recovery, setRecovery] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let stop = false;
		const run = () => {
			ensureProfile({ data: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } }).then((result) => {
				if (!stop && result.recoveryCode) setRecovery(result.recoveryCode);
				return syncInbox();
			}).then((inbox) => {
				if (!stop) setUnread(inbox.unread);
			}).catch(() => void 0);
		};
		run();
		const timer = window.setInterval(run, 6e4);
		return () => {
			stop = true;
			window.clearInterval(timer);
		};
	}, [user?.id]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-paper text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening your desk…" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const itemClass = (to, exact = false) => {
		return `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold ${(exact ? path === to : path === to || path.startsWith(`${to}/`)) ? "bg-primary text-primary-ink" : "text-ink-soft hover:bg-paper-deep"}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink md:grid md:grid-cols-[15.5rem_1fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden border-r border-line bg-card md:flex md:min-h-dvh md:flex-col md:justify-between md:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "mb-6 block px-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "space-y-1",
					"aria-label": "Primary",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: itemClass(item.to, "exact" in item),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: item.label
							}),
							item.to === "/app/notifications" && unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-clay px-2 text-xs text-primary-ink",
								children: unread
							}) : null
						]
					}, item.to))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-2 pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between border-b border-line bg-card px-4 py-3 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-11 w-11 place-items-center rounded-md border border-line",
							"aria-label": "Open menu",
							onClick: () => setOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-40 bg-ink/40 md:hidden",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-auto flex h-full w-72 flex-col gap-1 bg-card p-4",
							"aria-label": "Mobile",
							onClick: (event) => event.stopPropagation(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mb-2 ml-auto grid h-11 w-11 place-items-center",
									"aria-label": "Close menu",
									onClick: () => setOpen(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
								}),
								NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: itemClass(item.to, "exact" in item),
									onClick: () => setOpen(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
								}, item.to)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-auto pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
								})
							]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto w-full max-w-6xl px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card md:hidden",
						"aria-label": "Mobile primary",
						children: [NAV.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: "flex min-h-14 flex-col items-center justify-center text-xs font-semibold text-ink-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
						}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-14 flex-col items-center justify-center text-xs font-semibold text-ink-soft",
							onClick: () => setOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" }), "More"]
						})]
					})
				]
			}),
			recovery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-lg bg-card p-5 shadow-card",
					role: "dialog",
					"aria-labelledby": "recovery-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "recovery-title",
							className: "font-display text-2xl",
							children: "Save your recovery code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Email reset is not set up. This code is the way back in if you forget your password. It is shown only once."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 rounded-md bg-paper px-3 py-3 text-center font-mono text-lg tracking-wide text-ink",
							children: recovery
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 min-h-11 w-full rounded-md bg-primary font-semibold text-primary-ink",
							onClick: () => setRecovery(null),
							children: "I have saved this code"
						})
					]
				})
			}) : null
		]
	});
}
var SplitComponent = AppShell;
//#endregion
export { SplitComponent as component };
