import { o as __toESM } from "./_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./_ssr/router-Bv8hvj3R.mjs";
import { a as LoadGate, c as Select, d as TextInput, i as Field, l as Status, n as Card, o as Notice, s as PageHeader, t as Button } from "./_ssr/ui-NXfbhcwX.mjs";
import { t as useData } from "./_ssr/use-data-cRERLfU6.mjs";
import { n as emptyForm } from "./_ssr/fields-yzKHtmUG.mjs";
import { n as FieldSchemaEditor, t as FieldFillForm } from "./_ssr/fields-ui-DMaWq6_0.mjs";
import { i as TEMPLATE_CATEGORIES } from "./_ssr/categories-Cd43Z7G-.mjs";
import { d as setTemplateStatus, i as generateDocument, l as reanalyzeTemplate, o as getTemplate, r as duplicateTemplate, u as saveTemplate } from "./_ssr/library.functions-Bc66j6oO.mjs";
import { t as attempt } from "./_ssr/actions-Dhl2mSHk.mjs";
import { c as listTasks } from "./_ssr/tasks.functions-D5VofiPi.mjs";
import { r as suggestTemplateFields } from "./_ssr/insights.functions-ZU57X0ru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_templateId-Bz61j4om.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TemplatePage() {
	const { templateId } = Route.useParams();
	const navigate = useNavigate();
	const loaded = useData(() => getTemplate({ data: { id: templateId } }), [templateId]);
	const tasks = useData(() => listTasks({ data: { view: "all" } }), []);
	const [seen, setSeen] = (0, import_react.useState)("");
	const [meta, setMeta] = (0, import_react.useState)(null);
	const [fields, setFields] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [taskId, setTaskId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)("");
	const [suggestion, setSuggestion] = (0, import_react.useState)(null);
	const [suggestionNote, setSuggestionNote] = (0, import_react.useState)("");
	const stamp = loaded.data ? `${loaded.data.id}:${loaded.data.version?.id ?? ""}:${loaded.data.status}` : "";
	if (loaded.data && seen !== stamp) {
		setSeen(stamp);
		setMeta({
			name: loaded.data.name,
			description: loaded.data.description,
			category: loaded.data.category,
			subject: loaded.data.subject,
			gradeLevel: loaded.data.gradeLevel,
			manualMinutes: loaded.data.manualMinutes == null ? "" : String(loaded.data.manualMinutes)
		});
		const nextFields = loaded.data.version?.fields ?? [];
		setFields(nextFields);
		setForm(emptyForm(nextFields));
		setSuggestion(null);
	}
	if (!loaded.data || !meta) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: loaded.status === "ready" ? "loading" : loaded.status,
		error: loaded.error,
		label: "Loading template",
		children: null
	});
	const template = loaded.data;
	const ready = template.status === "ready";
	const notes = template.version?.analysis?.notes ?? [];
	const save = (event) => {
		event.preventDefault();
		setBusy("save");
		attempt(() => saveTemplate({ data: {
			id: template.id,
			...meta,
			manualMinutes: meta.manualMinutes === "" ? null : Number(meta.manualMinutes),
			fields: fields.map((field) => ({
				...field,
				options: field.options?.map((option) => option.trim()).filter(Boolean)
			}))
		} }), "Template approved").then((next) => {
			setBusy("");
			if (next) loaded.reload();
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: template.name,
			lede: "Check every field before you approve it. Generating a file does not mark a task done.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: template.status })
		}),
		template.version ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted",
			children: [
				template.version.filename,
				" · ",
				template.version.format,
				" · version ",
				template.version.version
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: "This template has no file yet." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-[1.15fr_0.85fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: save,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										required: true,
										value: meta.name,
										onChange: (event) => setMeta({
											...meta,
											name: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Category",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										value: meta.category,
										onChange: (event) => setMeta({
											...meta,
											category: event.target.value
										}),
										children: TEMPLATE_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: item.id,
											children: item.label
										}, item.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Subject",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: meta.subject,
										onChange: (event) => setMeta({
											...meta,
											subject: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Class",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: meta.gradeLevel,
										onChange: (event) => setMeta({
											...meta,
											gradeLevel: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Minutes this usually takes",
									hint: "Used only as your own estimate on Insights. Leave blank if you don't know.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										inputMode: "numeric",
										value: meta.manualMinutes,
										onChange: (event) => setMeta({
											...meta,
											manualMinutes: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Description",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: meta.description,
										onChange: (event) => setMeta({
											...meta,
											description: event.target.value
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Fields"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldSchemaEditor, {
							fields,
							onChange: setFields
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy === "save",
								children: busy === "save" ? "Saving…" : ready ? "Save a new version" : "Approve template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								disabled: busy !== "",
								onClick: () => {
									setBusy("read");
									attempt(() => reanalyzeTemplate({ data: { id: template.id } })).then((next) => {
										setBusy("");
										if (next) loaded.reload();
									});
								},
								children: "Read the file again"
							})]
						})
					]
				}),
				notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 list-disc space-y-1 pl-5 text-sm text-muted",
					children: notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
				}) : null,
				template.version?.analysis?.textPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "min-h-11 cursor-pointer text-sm font-semibold",
						children: "Text found in the file"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-paper p-3 text-sm text-ink-soft",
						children: template.version.analysis.textPreview.slice(0, 4e3)
					})]
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Suggestions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Detected fields come from the file. The assistant only suggests — it does not approve anything."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: !template.version?.analysis?.suggested?.length,
								onClick: () => {
									setSuggestion(template.version?.analysis?.suggested ?? []);
									setSuggestionNote("Taken from the file. Check them before you approve.");
								},
								children: "Use detected fields"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: busy === "ai",
								onClick: () => {
									setBusy("ai");
									suggestTemplateFields({ data: { id: template.id } }).then((result) => {
										if (!result.ok) {
											setSuggestionNote(result.error);
											setSuggestion(null);
											return;
										}
										setSuggestion(result.fields);
										setSuggestionNote(result.note);
									}).catch(() => setSuggestionNote("The assistant could not answer just now.")).finally(() => setBusy(""));
								},
								children: busy === "ai" ? "Asking…" : "Ask the assistant"
							})]
						}),
						suggestionNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: suggestionNote
						}) : null,
						suggestion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "text-sm",
								children: suggestion.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									field.label,
									" · ",
									field.type,
									field.required ? " · required" : ""
								] }, field.key))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setFields(suggestion);
									setForm(emptyForm(suggestion));
									setSuggestion(null);
								},
								children: "Replace current fields"
							})]
						}) : null
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Fill a copy"
					}), ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-4",
						onSubmit: (event) => {
							event.preventDefault();
							setBusy("fill");
							setErrors({});
							generateDocument({ data: {
								templateId: template.id,
								taskId: taskId || null,
								data: form
							} }).then(async (result) => {
								if (!result.ok) {
									setErrors(result.errors ?? { form: "The document was not generated." });
									return;
								}
								if (result.documentId) await navigate({
									to: "/app/documents/$documentId",
									params: { documentId: result.documentId }
								});
							}).catch(() => setErrors({ form: "The document was not generated." })).finally(() => setBusy(""));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Attach to a task",
								hint: "Optional. The task stays open until you mark it done.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: taskId,
									onChange: (event) => setTaskId(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "None"
									}), (tasks.data?.tasks ?? []).filter((task) => task.status === "open").map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: task.id,
										children: task.title
									}, task.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldFillForm, {
								fields: template.version?.fields ?? fields,
								value: form,
								errors,
								onChange: setForm
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy === "fill",
								children: busy === "fill" ? "Generating…" : "Generate document"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Approve the fields first. Nothing is generated from a template you have not checked."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								attempt(() => duplicateTemplate({ data: { id: template.id } })).then(async (copy) => {
									if (copy) await navigate({
										to: "/app/templates/$templateId",
										params: { templateId: copy.id }
									});
								});
							},
							children: "Duplicate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								const status = template.status === "archived" ? "ready" : "archived";
								attempt(() => setTemplateStatus({ data: {
									id: template.id,
									status
								} })).then((next) => {
									if (next) loaded.reload();
								});
							},
							children: template.status === "archived" ? "Restore" : "Archive"
						})]
					}), (template.documents ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: template.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/documents/$documentId",
							params: { documentId: doc.id },
							className: "font-semibold text-primary",
							children: doc.filename
						}) }, doc.id))
					}) : null] })
				]
			})]
		})
	] });
}
//#endregion
export { TemplatePage as component };
