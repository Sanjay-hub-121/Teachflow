import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { r as sanitizeFields } from "./fields-yzKHtmUG.mjs";
import { u as isTemplateCategory } from "./categories-Cd43Z7G-.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library.functions-Bc66j6oO.js
function meta(input) {
	const name = String(input.name ?? "").trim();
	if (!name) throw new AppError("Give the template a name.");
	const category = String(input.category ?? "other");
	if (!isTemplateCategory(category)) throw new AppError("Choose a category.");
	const manual = input.manualMinutes == null || input.manualMinutes === "" ? null : Number(input.manualMinutes);
	if (manual != null && (!Number.isFinite(manual) || manual < 0 || manual > 1e4)) throw new AppError("Minutes usually spent should be between 0 and 10000.");
	return {
		name: name.slice(0, 140),
		description: String(input.description ?? "").trim().slice(0, 800),
		category,
		subject: String(input.subject ?? "").trim().slice(0, 120),
		gradeLevel: String(input.gradeLevel ?? "").trim().slice(0, 80),
		manualMinutes: manual == null ? null : Math.round(manual)
	};
}
var listTemplates = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ archived: Boolean(input?.archived) })).handler(createSsrRpc("fc7fa82c4585ce54345a220bc3a41e36526aa6e6393833f9411966ef46cc8b13"));
var getTemplate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That template was not found.");
	return { id };
}).handler(createSsrRpc("3f3a27745807b4beae01abc9f4548a8edecf8769eedb21e79bde5c301bd1d770"));
var uploadTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	...meta({
		name: input.name || input.filename,
		category: input.category,
		description: input.description
	}),
	filename: String(input.filename ?? "template").slice(0, 180),
	base64: String(input.base64 ?? "")
})).handler(createSsrRpc("c6ca289333d5892716d642a5f7da4afd34b0204219a4d12e8b0aa1f78f9cbb7b"));
var createStarter = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const kind = String(input.kind ?? "");
	if (![
		"question-paper",
		"lesson-plan",
		"worksheet",
		"meeting",
		"report"
	].includes(kind)) throw new AppError("Choose a starter template.");
	return { kind };
}).handler(createSsrRpc("da8a02bfd36e992dd59e7187826873105bfae30861e05cdb7d29e7b89797fa79"));
var saveTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That template was not found.");
	const fields = sanitizeFields(input.fields);
	if (fields.length === 0) throw new AppError("Add at least one field before approving the template.");
	return {
		id,
		...meta(input),
		fields
	};
}).handler(createSsrRpc("94b3f6e29628794c002b0fe53b8d58e9f8fd791fdc5ee9f21ebd375f1e9e3fb2"));
var reanalyzeTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("9d780bc13ce9695a5f670b18c8cf2185b98220b369935ee6ad5f8367b30cb192"));
var setTemplateStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const status = input.status === "archived" ? "archived" : input.status === "ready" ? "ready" : "";
	if (!input.id || !status) throw new AppError("That template could not be updated.");
	return {
		id: String(input.id),
		status
	};
}).handler(createSsrRpc("9dcbfafec10e4620aa765920b435729aa1263ffb468041017661ed02c2074d01"));
var duplicateTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("db5e0d362bcc4699e5a4e53a8bd83ddeb12125352f07dccdaab7694814ee41a7"));
var generateDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	templateId: String(input.templateId ?? ""),
	taskId: input.taskId ? String(input.taskId) : null,
	documentId: input.documentId ? String(input.documentId) : null,
	data: input.data ?? {}
})).handler(createSsrRpc("0490f3a0149619ae36a5aa35c942df2bf7862d1b8a07736a9f7418078cffd89e"));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e7b02423cc58392cc83fc954c9a57e5b61d27829a6d80e10c722c029e7ed7516"));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("fd1a88a553a451f67975d42378fc3f50748ec4b40e218b4835550866b6168fd0"));
var downloadDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("e6042d6ca27e3c16d8ee37ccf7987e276096b2d5f6faa91891275cc3b76b3051"));
//#endregion
export { getDocument as a, listTemplates as c, setTemplateStatus as d, uploadTemplate as f, generateDocument as i, reanalyzeTemplate as l, downloadDocument as n, getTemplate as o, duplicateTemplate as r, listDocuments as s, createStarter as t, saveTemplate as u };
