import { i as formatWhen } from "./time-DLu9ibbo.mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoadGate, l as Status, r as Empty, s as PageHeader } from "./ui-NXfbhcwX.mjs";
import { t as useData } from "./use-data-cRERLfU6.mjs";
import { s as listDocuments } from "./library.functions-Bc66j6oO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-BiApPDep.js
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const listed = useData(() => listDocuments(), []);
	const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Documents",
		lede: "Files you generated from templates. A download does not close the task it was attached to."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, {
		status: listed.status,
		error: listed.error,
		label: "Loading documents",
		children: listed.data && listed.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No documents yet",
			body: "Approve a template, then fill a copy. The original file stays in Templates."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: listed.data?.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg border border-line bg-card px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/documents/$documentId",
						params: { documentId: doc.id },
						className: "font-semibold",
						children: doc.filename
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { status: doc.status })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						doc.format,
						doc.templateName ? ` · ${doc.templateName}` : "",
						doc.taskTitle ? ` · ${doc.taskTitle}` : "",
						doc.createdAt ? ` · ${formatWhen(doc.createdAt, zone)}` : ""
					]
				})]
			}, doc.id))
		})
	})] });
}
//#endregion
export { DocumentsPage as component };
