import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as TextInput, f as Wordmark, i as Field, t as Button } from "./ui-NXfbhcwX.mjs";
import { s as resetWithRecoveryCode } from "./account.functions-BKWvIVQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-DGZ9nwpV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mb-6 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-line bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl",
						children: "Reset password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Email delivery is not configured, so TeachFlow does not pretend to send a reset message. Use the recovery code saved when you created the account. This signs you out of other devices."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 space-y-4",
						onSubmit: (event) => {
							event.preventDefault();
							setBusy(true);
							setMessage("");
							resetWithRecoveryCode({ data: {
								email,
								code,
								password
							} }).then((result) => {
								if (!result?.ok) {
									setMessage(result?.error ?? "Those details were not accepted.");
									return;
								}
								setOk(true);
								setMessage("Password updated. Sign in with the new one.");
							}).catch((error) => setMessage(error instanceof Error ? error.message : "Could not reset the password.")).finally(() => setBusy(false));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "email",
									required: true,
									value: email,
									onChange: (event) => setEmail(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Recovery code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									required: true,
									autoComplete: "off",
									value: code,
									onChange: (event) => setCode(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "New password",
								hint: "At least 10 characters, with a letter and a number.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: show ? "text" : "password",
										required: true,
										value: password,
										onChange: (event) => setPassword(event.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 shrink-0 rounded-md border border-line-strong px-3 text-sm",
										"aria-pressed": show,
										onClick: () => setShow((value) => !value),
										children: show ? "Hide" : "Show"
									})]
								})
							}),
							message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm ${ok ? "text-primary" : "text-danger"}`,
								role: "status",
								children: message
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: busy ? "Updating…" : "Update password"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-semibold text-primary",
							children: "Back to sign in"
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { ForgotPage as component };
