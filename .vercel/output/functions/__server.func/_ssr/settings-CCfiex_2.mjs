import { o as __toESM } from "../_runtime.mjs";
import { i as formatWhen } from "./time-DLu9ibbo.mjs";
import { Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, c as Select, d as TextInput, i as Field, n as Card, o as Notice, s as PageHeader, t as Button, u as TextArea } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { a as listSessions, c as revokeSession, f as updateAccount, l as rotateRecoveryCode, r as getAccount, t as deleteAccount } from "./account.functions-BKWvIVQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CCfiex_2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZONES = [
	"UTC",
	"Asia/Kolkata",
	"Asia/Singapore",
	"Asia/Dubai",
	"Europe/London",
	"Europe/Paris",
	"America/New_York",
	"America/Chicago",
	"America/Los_Angeles",
	"Australia/Sydney",
	"Africa/Johannesburg",
	"Pacific/Auckland"
];
function SettingsPage() {
	const loaded = useData(() => getAccount(), []);
	const sessions = useData(() => listSessions(), []);
	const [form, setForm] = (0, import_react.useState)(null);
	const [seen, setSeen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)(null);
	const [emailConfirm, setEmailConfirm] = (0, import_react.useState)("");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	if (loaded.data && !seen) {
		setForm(loaded.data);
		setSeen(true);
	}
	if (!form) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: loaded.status === "ready" ? "loading" : loaded.status,
		error: loaded.error,
		label: "Loading settings",
		children: null
	});
	const zones = form.timezone && !ZONES.includes(form.timezone) ? [form.timezone, ...ZONES] : ZONES;
	const set = (patch) => setForm({
		...form,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			lede: "Your profile, quiet hours, and the devices signed in to this account."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					setBusy(true);
					const data = {
						...form,
						workStart: form.workStart.slice(0, 5),
						workEnd: form.workEnd.slice(0, 5),
						quietStart: form.quietStart.slice(0, 5),
						quietEnd: form.quietEnd.slice(0, 5)
					};
					attempt(() => updateAccount({ data }), "Saved").then(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.fullName,
							onChange: (event) => set({ fullName: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.email,
							readOnly: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Institution",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.institution,
							onChange: (event) => set({ institution: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: form.department,
									onChange: (event) => set({ department: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Role",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: form.designation,
									onChange: (event) => set({ designation: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subjects",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: form.subjects,
									onChange: (event) => set({ subjects: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Classes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: form.grades,
									onChange: (event) => set({ grades: event.target.value })
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Time zone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: form.timezone,
							onChange: (event) => set({ timezone: event.target.value }),
							children: zones.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: zone,
								children: zone
							}, zone))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Work starts",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "time",
									value: form.workStart,
									onChange: (event) => set({ workStart: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Work ends",
								hint: "Used when a task has a date but no clock time.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "time",
									value: form.workEnd,
									onChange: (event) => set({ workEnd: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Quiet from",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "time",
									value: form.quietStart,
									onChange: (event) => set({ quietStart: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Quiet until",
								hint: "A reminder that lands here waits until quiet hours end.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "time",
									value: form.quietEnd,
									onChange: (event) => set({ quietEnd: event.target.value })
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default reminder, in minutes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: String(form.reminderLeadMinutes),
							onChange: (event) => set({ reminderLeadMinutes: Number(event.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4 accent-primary",
							checked: form.remindersEnabled,
							onChange: (event) => set({ remindersEnabled: event.target.checked })
						}), "Reminders on"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "A note for yourself",
						hint: "Saved on your profile. It is not inserted into generated files.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: form.docNote,
							onChange: (event) => set({ docNote: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Saving…" : "Save settings"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Devices"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LoadGate, {
						status: sessions.status,
						error: sessions.error,
						label: "Loading devices",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: (sessions.data ?? []).map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: session.current ? "This device" : "Other device"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted",
										children: session.userAgent
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted",
										children: ["Signed in ", formatWhen(session.createdAt, form.timezone)]
									}),
									session.current ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "quiet",
										onClick: () => {
											attempt(() => revokeSession({ data: { id: session.id } })).then((next) => {
												if (next) sessions.reload();
											});
										},
										children: "Sign that device out"
									})
								]
							}, session.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "secondary",
							onClick: () => {
								attempt(() => revokeSession({ data: { others: true } }), "Other devices were signed out").then((next) => {
									if (next) sessions.reload();
								});
							},
							children: "Sign out other devices"
						})]
					})] }),
					form.hasPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Recovery code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Email reset is not set up. A new code replaces the old one, and it is shown only once."
						}),
						code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 rounded-md bg-paper px-3 py-3 text-center font-mono text-lg",
							children: code
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "secondary",
							onClick: () => {
								attempt(() => rotateRecoveryCode()).then((next) => {
									if (next) setCode(next.recoveryCode);
								});
							},
							children: "Make a new recovery code"
						})
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Delete account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "This removes your tasks, templates, documents, and sign-in. It cannot be undone."
						}),
						confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 space-y-3",
							onSubmit: (event) => {
								event.preventDefault();
								attempt(() => deleteAccount({ data: { email: emailConfirm } })).then(async (next) => {
									if (!next) return;
									try {
										await signOut("/");
									} catch {
										window.location.href = "/";
									}
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Type your email to confirm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "email",
									value: emailConfirm,
									onChange: (event) => setEmailConfirm(event.target.value)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									variant: "danger",
									children: "Delete account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => setConfirmDelete(false),
									children: "Cancel"
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "quiet",
							onClick: () => setConfirmDelete(true),
							children: "Delete account"
						})
					] })
				]
			})]
		}),
		loaded.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: loaded.error })
		}) : null
	] });
}
//#endregion
export { SettingsPage as component };
