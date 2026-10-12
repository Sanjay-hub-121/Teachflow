import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, c as Select, d as TextInput, i as Field, l as Status, n as Card, r as Empty, s as PageHeader, t as Button } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { t as fileToBase64 } from "./files-DzM_Lm-8.mjs";
import { a as categoryLabel, i as TEMPLATE_CATEGORIES } from "./categories-Cd43Z7G-.mjs";
import { c as listTemplates, f as uploadTemplate, t as createStarter } from "./library.functions-Bc66j6oO.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates-CdokJDfP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STARTERS = [
	["question-paper", "Question paper"],
	["lesson-plan", "Lesson plan"],
	["worksheet", "Worksheet"],
	["meeting", "Meeting agenda"],
	["report", "Report"]
];
var MAX_UPLOAD = 4e6;
function TemplatesPage() {
	const navigate = useNavigate();
	const [archived, setArchived] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("other");
	const [description, setDescription] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)("");
	const listed = useData(() => listTemplates({ data: { archived } }), [archived]);
	const go = async (id) => {
		await navigate({
			to: "/app/templates/$templateId",
			params: { templateId: id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Templates",
			lede: "Start from a blank school document, or upload one you already use. Approve the fields before you fill it again."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Starters"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "These are ready to fill. You can still change the fields."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: STARTERS.map(([kind, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy !== "",
						onClick: () => {
							setBusy(kind);
							attempt(() => createStarter({ data: { kind } })).then(async (created) => {
								setBusy("");
								if (created) await go(created.id);
							});
						},
						children: busy === kind ? "Creating…" : label
					}, kind))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Upload a file"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Word, Excel, PowerPoint, or PDF, up to 4 MB. Formulas in a spreadsheet are left alone."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					onSubmit: (event) => {
						event.preventDefault();
						if (!file) return;
						if (file.size > MAX_UPLOAD) return;
						setBusy("upload");
						fileToBase64(file).then((base64) => attempt(() => uploadTemplate({ data: {
							filename: file.name,
							base64,
							name: name || file.name.replace(/\.[^.]+$/, ""),
							category,
							description
						} }))).then(async (created) => {
							setBusy("");
							if (!created) return;
							setFile(null);
							setName("");
							setDescription("");
							await go(created.id);
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: name,
								onChange: (event) => setName(event.target.value),
								placeholder: "Optional"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: category,
								onChange: (event) => setCategory(event.target.value),
								children: TEMPLATE_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: item.label
								}, item.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "File",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "file",
								accept: ".docx,.xlsx,.pptx,.pdf",
								onChange: (event) => setFile(event.target.files?.[0] ?? null)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Note",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: description,
								onChange: (event) => setDescription(event.target.value)
							})
						}),
						file && file.size > MAX_UPLOAD ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger sm:col-span-2",
							children: "That file is over 4 MB."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !file || busy === "upload" || (file?.size ?? 0) > MAX_UPLOAD,
							children: busy === "upload" ? "Reading the file…" : "Upload"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => setArchived((value) => !value),
				children: archived ? "Show active templates" : "Show archived"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
			status: listed.status,
			error: listed.error,
			label: "Loading templates",
			children: listed.data && listed.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: archived ? "No archived templates" : "No templates yet",
				body: "Create a starter or upload a file you already trust."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: listed.data?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-lg border border-line bg-card p-4 text-left",
					onClick: () => void go(item.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: item.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								categoryLabel(item.category),
								item.format ? ` · ${item.format}` : "",
								item.version ? ` · version ${item.version}` : ""
							]
						}),
						item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: item.description
						}) : null
					]
				}, item.id))
			})
		})
	] });
}
//#endregion
export { TemplatesPage as component };
