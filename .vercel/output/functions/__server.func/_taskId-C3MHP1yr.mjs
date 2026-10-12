import { o as __toESM } from "./_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$2 } from "./_ssr/router-Bv8hvj3R.mjs";
import { a as LoadGate, d as TextInput, i as Field, l as Status, n as Card, o as Notice, s as PageHeader, t as Button } from "./_ssr/ui-NXfbhcwX.mjs";
import { t as useData } from "./_ssr/use-data-cRERLfU6.mjs";
import { c as listTemplates } from "./_ssr/library.functions-Bc66j6oO.mjs";
import { t as attempt } from "./_ssr/actions-Dhl2mSHk.mjs";
import { a as deleteTask, d as updateTask, i as deleteSubtask, l as setTaskStatus, s as getTask, t as addSubtask, u as toggleSubtask } from "./_ssr/tasks.functions-D5VofiPi.mjs";
import { t as TaskFields } from "./_ssr/task-form-_t9sxC29.mjs";
import { n as draftFromTask, r as payloadFromDraft } from "./_ssr/types-Dewvh23Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_taskId-C3MHP1yr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TaskPage() {
	const { taskId } = Route$2.useParams();
	const navigate = useNavigate();
	const loaded = useData(() => getTask({ data: { id: taskId } }), [taskId]);
	const templates = useData(() => listTemplates({ data: { archived: false } }), []);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [step, setStep] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [seen, setSeen] = (0, import_react.useState)("");
	const version = loaded.data ? `${loaded.data.id}:${loaded.data.version}` : "";
	if (loaded.data && seen !== version) {
		setDraft(draftFromTask(loaded.data));
		setSeen(version);
	}
	if (!draft && loaded.status !== "ready") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: loaded.status,
		error: loaded.error,
		label: "Loading task",
		children: null
	});
	if (!loaded.data || !draft) return loaded.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: loaded.error }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: "loading",
		error: "",
		label: "Loading task",
		children: null
	});
	const task = loaded.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: task.title,
		lede: "Edits are saved when you press Save. A document made from the linked template stays separate from done.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: task.status })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[1.3fr_0.7fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (event) => {
				event.preventDefault();
				setBusy(true);
				attempt(() => updateTask({ data: payloadFromDraft(draft, {
					id: task.id,
					version: task.version
				}) }), "Saved").then((next) => {
					setBusy(false);
					if (next) loaded.reload();
				});
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskFields, {
				draft,
				onChange: setDraft,
				mode: "edit",
				templates: (templates.data ?? []).map((item) => ({
					id: item.id,
					name: item.name
				}))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Saving…" : "Save changes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: busy,
					onClick: () => {
						setBusy(true);
						attempt(() => setTaskStatus({ data: {
							id: task.id,
							version: task.version,
							status: task.status === "completed" ? "open" : "completed",
							actualMinutes: draft.actualMinutes === "" ? null : Number(draft.actualMinutes)
						} })).then((next) => {
							setBusy(false);
							if (next) loaded.reload();
						});
					},
					children: task.status === "completed" ? "Reopen" : "Mark done"
				})]
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Steps"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: task.subtasks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 flex-1 items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: item.done,
									onChange: () => {
										attempt(() => toggleSubtask({ data: {
											id: item.id,
											done: !item.done
										} })).then((next) => {
											if (next) loaded.reload();
										});
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: item.done ? "text-muted line-through" : "",
									children: item.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "quiet",
								onClick: () => {
									attempt(() => deleteSubtask({ data: { id: item.id } })).then((next) => {
										if (next) loaded.reload();
									});
								},
								children: "Remove"
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-2",
						onSubmit: (event) => {
							event.preventDefault();
							const title = step.trim();
							if (!title) return;
							attempt(() => addSubtask({ data: {
								taskId: task.id,
								title
							} })).then((next) => {
								if (!next) return;
								setStep("");
								loaded.reload();
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Add a step",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: step,
								onChange: (event) => setStep(event.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Add"
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Documents"
					}),
					task.templateId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/templates/$templateId",
							params: { templateId: task.templateId },
							className: "font-semibold text-primary",
							children: task.templateName ?? "Open the linked template"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No template is linked."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: (task.documents ?? []).map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/documents/$documentId",
							params: { documentId: doc.id },
							className: "font-semibold text-primary",
							children: doc.filename
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: doc.status })
						})] }, doc.id))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Delete “",
							task.title,
							"”? Linked reminders go with it. Documents stay in your library."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								attempt(() => deleteTask({ data: { id: task.id } })).then(async (next) => {
									if (next) await navigate({ to: "/app/tasks" });
								});
							},
							children: "Delete task"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setConfirmDelete(false),
							children: "Keep it"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setConfirmDelete(true),
					children: "Delete task"
				}) })
			]
		})]
	})] });
}
//#endregion
export { TaskPage as component };
