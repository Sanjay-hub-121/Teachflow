import { o as __toESM } from "./_runtime.mjs";
import { i as formatWhen } from "./_ssr/time-DLu9ibbo.mjs";
import { Q as require_react, T as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as Route$4 } from "./_ssr/router-Bv8hvj3R.mjs";
import { a as LoadGate, l as Status, n as Card, o as Notice, s as PageHeader, t as Button } from "./_ssr/ui-NXfbhcwX.mjs";
import { t as useData } from "./_ssr/use-data-cRERLfU6.mjs";
import { r as saveFile } from "./_ssr/files-DzM_Lm-8.mjs";
import { t as FieldFillForm } from "./_ssr/fields-ui-DMaWq6_0.mjs";
import { a as getDocument, i as generateDocument, n as downloadDocument, o as getTemplate } from "./_ssr/library.functions-Bc66j6oO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_documentId-DZAPx8tQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fieldLabel(fields, key) {
	return fields.find((field) => field.key === key)?.label ?? key.replaceAll("_", " ");
}
function formatEntered(fields, key, value) {
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (!Array.isArray(value)) return String(value ?? "");
	const children = fields.find((field) => field.key === key)?.itemFields ?? [];
	return value.map((row) => {
		return (children.length ? children.map((child) => [child.label, row[child.key] ?? ""]) : Object.entries(row).map(([child, text]) => [child.replaceAll("_", " "), text])).map(([label, text]) => `${label}: ${text}`).join(" · ");
	}).join("\n");
}
function DocumentPage() {
	const { documentId } = Route$4.useParams();
	const loaded = useData(() => getDocument({ data: { id: documentId } }), [documentId]);
	const templateId = loaded.data?.templateId ?? "";
	const template = useData(() => templateId ? getTemplate({ data: { id: templateId } }) : Promise.resolve(null), [templateId]);
	const [form, setForm] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [seen, setSeen] = (0, import_react.useState)("");
	const stamp = loaded.data ? `${loaded.data.id}:${loaded.data.status}` : "";
	if (loaded.data && seen !== stamp) {
		setSeen(stamp);
		setForm(loaded.data.form);
	}
	const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (!loaded.data || !form) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: loaded.status === "ready" ? "loading" : loaded.status,
		error: loaded.error,
		label: "Loading document",
		children: null
	});
	const doc = loaded.data;
	const fields = template.data?.version?.fields ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: doc.filename,
			lede: formatWhen(doc.createdAt, zone),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: doc.status })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 space-y-1 text-sm text-muted",
			children: [doc.templateId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Template:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/templates/$templateId",
					params: { templateId: doc.templateId },
					className: "font-semibold text-primary",
					children: doc.templateName ?? "Open template"
				})
			] }) : null, doc.taskId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Task:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/tasks/$taskId",
					params: { taskId: doc.taskId },
					className: "font-semibold text-primary",
					children: doc.taskTitle ?? "Open task"
				})
			] }) : null]
		}),
		doc.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-ink-soft",
			children: doc.note
		}) : null,
		doc.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: doc.error })
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [doc.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: busy,
			onClick: () => {
				setBusy(true);
				downloadDocument({ data: { id: doc.id } }).then((file) => saveFile(file.filename, file.mime, file.base64)).catch(() => setErrors({ form: "That document is not ready to download." })).finally(() => setBusy(false));
			},
			children: busy ? "Preparing…" : "Download"
		}) : null, doc.status === "failed" && fields.length && doc.templateId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 space-y-4",
			onSubmit: (event) => {
				event.preventDefault();
				setBusy(true);
				setErrors({});
				generateDocument({ data: {
					templateId: doc.templateId,
					documentId: doc.id,
					taskId: doc.taskId,
					data: form
				} }).then((result) => {
					if (!result.ok) {
						setErrors(result.errors ?? { form: "It still could not be generated." });
						return;
					}
					loaded.reload();
				}).catch(() => setErrors({ form: "It still could not be generated." })).finally(() => setBusy(false));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Try again"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldFillForm, {
					fields,
					value: form,
					errors,
					onChange: setForm
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Generating…" : "Generate again"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mt-4 space-y-3 text-sm",
			children: Object.entries(doc.form).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "font-semibold text-ink-soft",
				children: fieldLabel(fields, key)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "whitespace-pre-wrap text-ink",
				children: formatEntered(fields, key, value)
			})] }, key))
		})] })
	] });
}
//#endregion
export { DocumentPage as component };
