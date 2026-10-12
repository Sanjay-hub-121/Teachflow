import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as Navigate, T as require_jsx_runtime, w as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as GROK_PROVIDERS } from "./server-xOs0tlIa.mjs";
import { d as TextInput, f as Wordmark, i as Field, t as Button } from "./ui-NXfbhcwX.mjs";
import { n as rememberPreviewToken } from "./files-DzM_Lm-8.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DoSpR4EV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function passwordProblem(password) {
	if (password.length < 10) return "Use at least 10 characters.";
	if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
	return "";
}
function RegisterPage() {
	const { user, isPending } = useCurrentUserState();
	const router = useRouter();
	const [name, setName] = (0, import_react.useState)("");
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
						children: "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Your tasks and documents stay private to this account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 space-y-4",
						onSubmit: (event) => {
							event.preventDefault();
							const problem = passwordProblem(password);
							if (problem) {
								setError(problem);
								return;
							}
							setBusy(true);
							setError("");
							authClient.signUp.email({
								email: email.trim(),
								password,
								name: name.trim() || email.trim()
							}).then(async (result) => {
								if (result.error) {
									const blob = `${result.error.code ?? ""} ${result.error.message ?? ""}`.toLowerCase();
									setError(blob.includes("exist") ? "An account with this email already exists. Sign in instead." : "We couldn't create the account. Check the details and try again.");
									setBusy(false);
									return;
								}
								rememberPreviewToken(result.data?.token);
								await authClient.getSession();
								await router.invalidate();
								await router.navigate({ to: "/app" });
							}).catch(() => {
								setError("We couldn't create the account. Try again.");
								setBusy(false);
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									required: true,
									autoComplete: "name",
									value: name,
									onChange: (event) => setName(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "email",
									required: true,
									autoComplete: "email",
									value: email,
									onChange: (event) => setEmail(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Password",
								hint: "At least 10 characters, with a letter and a number.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: show ? "text" : "password",
										required: true,
										autoComplete: "new-password",
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
								children: busy ? "Creating account…" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: ["Already registered? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-semibold text-primary",
							children: "Sign in"
						})]
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
export { RegisterPage as component };
