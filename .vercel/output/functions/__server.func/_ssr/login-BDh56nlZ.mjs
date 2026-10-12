import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as Navigate, T as require_jsx_runtime, w as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as GROK_PROVIDERS } from "./server-xOs0tlIa.mjs";
import { d as TextInput, f as Wordmark, i as Field, t as Button } from "./ui-NXfbhcwX.mjs";
import { n as rememberPreviewToken } from "./files-DzM_Lm-8.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BDh56nlZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function safeAuthError(error) {
	const blob = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
	if (blob.includes("invalid") || blob.includes("unauthorized") || blob.includes("password") || blob.includes("credential")) return "Email or password is incorrect.";
	return "We couldn't sign you in. Check the details and try again.";
}
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const router = useRouter();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper text-muted",
		children: "Checking your session…"
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
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
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Use the same account on every device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 space-y-4",
						onSubmit: (event) => {
							event.preventDefault();
							setBusy(true);
							setError("");
							authClient.signIn.email({
								email: email.trim(),
								password
							}).then(async (result) => {
								if (result.error) {
									setError(safeAuthError(result.error));
									setBusy(false);
									return;
								}
								rememberPreviewToken(result.data?.token);
								await authClient.getSession();
								await router.invalidate();
								await router.navigate({ to: "/app" });
							}).catch(() => {
								setError("We couldn't sign you in. Try again.");
								setBusy(false);
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (event) => setEmail(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Password",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: show ? "text" : "password",
										autoComplete: "current-password",
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
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								role: "alert",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: busy ? "Signing in…" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/forgot",
								className: "font-semibold text-primary",
								children: "Forgot password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " · "
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "font-semibold text-primary",
								children: "Create an account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 h-px bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "w-full",
							onClick: () => void signIn(provider.providerId, { callbackURL: "/app" }),
							children: ["Continue with ", provider.label]
						}, provider.providerId))
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
