import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-NXfbhcwX.js
var import_jsx_runtime = require_jsx_runtime();
function Wordmark({ light = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-2 font-display text-xl font-semibold ${light ? "text-primary-ink" : "text-ink"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `grid h-8 w-8 place-items-center rounded-md text-sm ${light ? "bg-primary-ink text-primary" : "bg-primary text-primary-ink"}`,
			"aria-hidden": "true",
			children: "T"
		}), "TeachFlow"]
	});
}
function Button({ variant = "primary", className = "", ...props }) {
	const styles = {
		primary: "bg-primary text-primary-ink hover:opacity-90",
		secondary: "border border-line-strong bg-card text-ink hover:bg-paper",
		quiet: "text-primary hover:bg-primary-soft",
		danger: "bg-danger text-primary-ink hover:opacity-90"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...props,
		className: `inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`
	});
}
function TextInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: `min-h-11 w-full rounded-md border border-line-strong bg-card px-3 text-ink outline-none placeholder:text-muted ${props.className ?? ""}`
	});
}
function TextArea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: `min-h-28 w-full rounded-md border border-line-strong bg-card px-3 py-2 text-ink outline-none placeholder:text-muted ${props.className ?? ""}`
	});
}
function Select(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: `min-h-11 w-full rounded-md border border-line-strong bg-card px-3 text-ink ${props.className ?? ""}`
	});
}
function Field({ label, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-ink-soft",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-danger",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-muted",
				children: hint
			}) : null
		]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `rounded-lg border border-line bg-card p-4 shadow-card ${className}`,
		children
	});
}
function PageHeader({ title, lede, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: title
			}), lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-muted",
				children: lede
			}) : null]
		}), action]
	});
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-dashed border-line-strong bg-card px-5 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-muted",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			}) : null
		]
	});
}
function Status({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${status === "ready" || status === "completed" ? "bg-primary-soft text-primary" : status === "failed" || status === "overdue" || status === "high" ? "bg-clay-soft text-clay" : "bg-paper-deep text-ink-soft"}`,
		children: status.replaceAll("_", " ")
	});
}
function Notice({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-md bg-clay-soft px-3 py-2 text-sm text-clay",
		children
	});
}
function LoadGate({ status, error, label, children }) {
	if (status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { label });
	if (status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: error });
	return children;
}
function Spinner({ label = "Loading" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [label, "…"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-lg bg-paper-deep" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-lg bg-paper-deep" })
		]
	});
}
//#endregion
export { LoadGate as a, Select as c, TextInput as d, Wordmark as f, Field as i, Status as l, Card as n, Notice as o, Empty as r, PageHeader as s, Button as t, TextArea as u };
