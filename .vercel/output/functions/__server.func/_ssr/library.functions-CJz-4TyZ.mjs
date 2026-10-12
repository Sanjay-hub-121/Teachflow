import { r as createServerFn } from "./ssr.mjs";
import { i as rethrowKnown, n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { a as validateFormData, r as sanitizeFields } from "./fields-yzKHtmUG.mjs";
import { u as isTemplateCategory } from "./categories-Cd43Z7G-.mjs";
import { a as db, l as nid, n as asIso, u as notify } from "./common-GdDXDCtZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library.functions-CJz-4TyZ.js
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
async function insertVersion(userId, templateId, version, file, fields, analysis, status) {
	const { encodeBase64 } = await import("./engine-D5rSWMUN.mjs");
	const sql = await db();
	const versionId = nid();
	await sql`insert into template_versions (
      id, template_id, user_id, version, original_filename, format, byte_size, checksum, file_b64,
      schema_json, analysis_json, processing_status
    ) values (
      ${versionId}, ${templateId}, ${userId}, ${version}, ${file.filename}, ${file.format}, ${file.bytes.length},
      ${file.checksum}, ${encodeBase64(file.bytes)}, ${JSON.stringify(fields)}, ${JSON.stringify(analysis)}, ${status}
    )`;
	return versionId;
}
var listTemplates_createServerFn_handler = createServerRpc({
	id: "fc7fa82c4585ce54345a220bc3a41e36526aa6e6393833f9411966ef46cc8b13",
	name: "listTemplates",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => listTemplates.__executeServer(opts));
var listTemplates = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ archived: Boolean(input?.archived) })).handler(listTemplates_createServerFn_handler, async ({ context, data }) => {
	try {
		return (await (await db())`
        select t.id, t.name, t.description, t.category, t.subject, t.grade_level, t.status,
               v.format, v.version, t.updated_at
        from templates t
        left join template_versions v on v.id = t.current_version_id
        where t.user_id = ${context.userId}
          and ((${data.archived} = true and t.status = 'archived') or (${data.archived} = false and t.status <> 'archived'))
        order by t.updated_at desc
        limit 100`).map((row) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			category: row.category,
			subject: row.subject,
			gradeLevel: row.grade_level,
			status: row.status,
			format: row.format,
			version: row.version,
			updatedAt: asIso(row.updated_at) ?? ""
		}));
	} catch (error) {
		rethrowKnown(error);
	}
});
var getTemplate_createServerFn_handler = createServerRpc({
	id: "3f3a27745807b4beae01abc9f4548a8edecf8769eedb21e79bde5c301bd1d770",
	name: "getTemplate",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => getTemplate.__executeServer(opts));
var getTemplate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That template was not found.");
	return { id };
}).handler(getTemplate_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const rows = await sql`
        select id, name, description, category, subject, grade_level, status, manual_minutes, current_version_id
        from templates where id = ${data.id} and user_id = ${context.userId}`;
		if (!rows[0]) throw new AppError("That template was not found.");
		const version = rows[0].current_version_id ? await sql`
            select id, version, original_filename, format, schema_json, analysis_json, processing_status, checksum
            from template_versions where id = ${rows[0].current_version_id} and user_id = ${context.userId}` : [];
		const docs = await sql`
        select id, filename, status, created_at from generated_documents
        where template_id = ${data.id} and user_id = ${context.userId}
        order by created_at desc limit 8`;
		const current = version[0];
		return {
			...rows[0],
			gradeLevel: rows[0].grade_level,
			manualMinutes: rows[0].manual_minutes,
			version: current ? {
				id: current.id,
				version: current.version,
				filename: current.original_filename,
				format: current.format,
				checksum: current.checksum,
				status: current.processing_status,
				fields: sanitizeFields(JSON.parse(current.schema_json)),
				analysis: JSON.parse(current.analysis_json)
			} : null,
			documents: docs.map((doc) => ({
				id: doc.id,
				filename: doc.filename,
				status: doc.status,
				createdAt: asIso(doc.created_at) ?? ""
			}))
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var uploadTemplate_createServerFn_handler = createServerRpc({
	id: "c6ca289333d5892716d642a5f7da4afd34b0204219a4d12e8b0aa1f78f9cbb7b",
	name: "uploadTemplate",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => uploadTemplate.__executeServer(opts));
var uploadTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	...meta({
		name: input.name || input.filename,
		category: input.category,
		description: input.description
	}),
	filename: String(input.filename ?? "template").slice(0, 180),
	base64: String(input.base64 ?? "")
})).handler(uploadTemplate_createServerFn_handler, async ({ context, data }) => {
	try {
		const { analyzeFile, decodeBase64, sha256 } = await import("./engine-D5rSWMUN.mjs");
		const bytes = decodeBase64(data.base64);
		const analysis = await analyzeFile(data.filename, bytes);
		const sql = await db();
		const templateId = nid();
		await sql`insert into templates (id, user_id, name, description, category, status)
        values (${templateId}, ${context.userId}, ${data.name}, ${data.description}, ${data.category}, 'needs_review')`;
		await sql`update templates set current_version_id = ${await insertVersion(context.userId, templateId, 1, {
			filename: data.filename,
			format: analysis.format,
			bytes,
			checksum: sha256(bytes)
		}, analysis.suggested, analysis, "needs_review")} where id = ${templateId} and user_id = ${context.userId}`;
		return { id: templateId };
	} catch (error) {
		rethrowKnown(error);
	}
});
var createStarter_createServerFn_handler = createServerRpc({
	id: "da8a02bfd36e992dd59e7187826873105bfae30861e05cdb7d29e7b89797fa79",
	name: "createStarter",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => createStarter.__executeServer(opts));
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
}).handler(createStarter_createServerFn_handler, async ({ context, data }) => {
	try {
		const { buildStarter, sha256 } = await import("./engine-D5rSWMUN.mjs");
		const starter = await buildStarter(data.kind);
		const sql = await db();
		const templateId = nid();
		await sql`insert into templates (id, user_id, name, description, category, status)
        values (${templateId}, ${context.userId}, ${starter.name}, ${starter.description}, ${starter.category}, 'ready')`;
		await sql`update templates set current_version_id = ${await insertVersion(context.userId, templateId, 1, {
			filename: starter.filename,
			format: starter.format,
			bytes: starter.bytes,
			checksum: sha256(starter.bytes)
		}, starter.fields, {
			textPreview: starter.description,
			notes: [],
			suggested: starter.fields
		}, "ready")} where id = ${templateId} and user_id = ${context.userId}`;
		return { id: templateId };
	} catch (error) {
		rethrowKnown(error);
	}
});
var saveTemplate_createServerFn_handler = createServerRpc({
	id: "94b3f6e29628794c002b0fe53b8d58e9f8fd791fdc5ee9f21ebd375f1e9e3fb2",
	name: "saveTemplate",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => saveTemplate.__executeServer(opts));
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
}).handler(saveTemplate_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const templates = await sql`
        select current_version_id from templates where id = ${data.id} and user_id = ${context.userId}`;
		if (!templates[0]?.current_version_id) throw new AppError("That template was not found.");
		const current = (await sql`
        select id, version, original_filename, format, checksum, file_b64, schema_json, analysis_json, processing_status
        from template_versions where id = ${templates[0].current_version_id} and user_id = ${context.userId}`)[0];
		if (!current) throw new AppError("That template was not found.");
		const used = await sql`select id from generated_documents where template_version_id = ${current.id} and user_id = ${context.userId} limit 1`;
		const schemaChanged = current.schema_json !== JSON.stringify(data.fields);
		let versionId = current.id;
		if (schemaChanged && (used.length || current.processing_status === "ready")) {
			const { decodeBase64 } = await import("./engine-D5rSWMUN.mjs");
			versionId = await insertVersion(context.userId, data.id, current.version + 1, {
				filename: current.original_filename,
				format: current.format,
				bytes: decodeBase64(current.file_b64),
				checksum: current.checksum
			}, data.fields, JSON.parse(current.analysis_json), "ready");
		} else await sql`update template_versions set schema_json = ${JSON.stringify(data.fields)}, processing_status = 'ready'
          where id = ${current.id} and user_id = ${context.userId}`;
		await sql`update templates set
          name = ${data.name}, description = ${data.description}, category = ${data.category},
          subject = ${data.subject}, grade_level = ${data.gradeLevel}, manual_minutes = ${data.manualMinutes},
          status = 'ready', current_version_id = ${versionId}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var reanalyzeTemplate_createServerFn_handler = createServerRpc({
	id: "9d780bc13ce9695a5f670b18c8cf2185b98220b369935ee6ad5f8367b30cb192",
	name: "reanalyzeTemplate",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => reanalyzeTemplate.__executeServer(opts));
var reanalyzeTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(reanalyzeTemplate_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const rows = await sql`
        select v.id, v.file_b64, v.original_filename
        from templates t
        join template_versions v on v.id = t.current_version_id
        where t.id = ${data.id} and t.user_id = ${context.userId}`;
		if (!rows[0]) throw new AppError("That template was not found.");
		const { analyzeFile, decodeBase64 } = await import("./engine-D5rSWMUN.mjs");
		const analysis = await analyzeFile(rows[0].original_filename, decodeBase64(rows[0].file_b64));
		await sql`update template_versions set analysis_json = ${JSON.stringify(analysis)} where id = ${rows[0].id} and user_id = ${context.userId}`;
		return analysis;
	} catch (error) {
		rethrowKnown(error);
	}
});
var setTemplateStatus_createServerFn_handler = createServerRpc({
	id: "9dcbfafec10e4620aa765920b435729aa1263ffb468041017661ed02c2074d01",
	name: "setTemplateStatus",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => setTemplateStatus.__executeServer(opts));
var setTemplateStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const status = input.status === "archived" ? "archived" : input.status === "ready" ? "ready" : "";
	if (!input.id || !status) throw new AppError("That template could not be updated.");
	return {
		id: String(input.id),
		status
	};
}).handler(setTemplateStatus_createServerFn_handler, async ({ context, data }) => {
	try {
		if (!(await (await db())`update templates set status = ${data.status}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} returning id`).length) throw new AppError("That template was not found.");
		return { ok: true };
	} catch (error) {
		rethrowKnown(error);
	}
});
var duplicateTemplate_createServerFn_handler = createServerRpc({
	id: "db5e0d362bcc4699e5a4e53a8bd83ddeb12125352f07dccdaab7694814ee41a7",
	name: "duplicateTemplate",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => duplicateTemplate.__executeServer(opts));
var duplicateTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(duplicateTemplate_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const templates = await sql`select name, description, category, subject, grade_level, current_version_id from templates where id = ${data.id} and user_id = ${context.userId}`;
		if (!templates[0]?.current_version_id) throw new AppError("That template was not found.");
		const version = await sql`select original_filename, format, byte_size, checksum, file_b64, schema_json, analysis_json
         from template_versions where id = ${templates[0].current_version_id} and user_id = ${context.userId}`;
		if (!version[0]) throw new AppError("That template was not found.");
		const templateId = nid();
		const versionId = nid();
		await sql`insert into templates (id, user_id, name, description, category, subject, grade_level, status, current_version_id)
        values (${templateId}, ${context.userId}, ${`Copy of ${templates[0].name}`.slice(0, 140)}, ${templates[0].description},
          ${templates[0].category}, ${templates[0].subject}, ${templates[0].grade_level}, 'ready', ${versionId})`;
		await sql`insert into template_versions (
          id, template_id, user_id, version, original_filename, format, byte_size, checksum, file_b64, schema_json, analysis_json, processing_status
        ) values (
          ${versionId}, ${templateId}, ${context.userId}, 1, ${version[0].original_filename}, ${version[0].format},
          ${version[0].byte_size}, ${version[0].checksum}, ${version[0].file_b64}, ${version[0].schema_json},
          ${version[0].analysis_json}, 'ready'
        )`;
		return { id: templateId };
	} catch (error) {
		rethrowKnown(error);
	}
});
var generateDocument_createServerFn_handler = createServerRpc({
	id: "0490f3a0149619ae36a5aa35c942df2bf7862d1b8a07736a9f7418078cffd89e",
	name: "generateDocument",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => generateDocument.__executeServer(opts));
var generateDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	templateId: String(input.templateId ?? ""),
	taskId: input.taskId ? String(input.taskId) : null,
	documentId: input.documentId ? String(input.documentId) : null,
	data: input.data ?? {}
})).handler(generateDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const templates = await sql`
      select name, status, current_version_id from templates where id = ${data.templateId} and user_id = ${context.userId}`;
	if (!templates[0] || templates[0].status !== "ready" || !templates[0].current_version_id) throw new AppError("Approve the template before generating a document.");
	if (data.taskId) {
		if (!(await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`).length) throw new AppError("That task was not found.");
	}
	const version = (await sql`
      select id, format, original_filename, file_b64, schema_json from template_versions
      where id = ${templates[0].current_version_id} and user_id = ${context.userId}`)[0];
	if (!version) throw new AppError("That template was not found.");
	const fields = sanitizeFields(JSON.parse(version.schema_json));
	const validated = validateFormData(fields, data.data);
	if (!validated.ok) return {
		ok: false,
		errors: validated.errors,
		documentId: null
	};
	const docId = data.documentId ?? nid();
	const filenameBase = templates[0].name;
	if (data.documentId) {
		if (!(await sql`select id from generated_documents where id = ${data.documentId} and user_id = ${context.userId} and status = 'failed'`).length) throw new AppError("Only a failed document can be retried in place.");
		await sql`update generated_documents set status = 'pending', error = null, form_json = ${JSON.stringify(validated.value)}
        where id = ${docId} and user_id = ${context.userId}`;
	} else await sql`insert into generated_documents (
          id, user_id, template_id, template_version_id, task_id, filename, format, status, form_json
        ) values (
          ${docId}, ${context.userId}, ${data.templateId}, ${version.id}, ${data.taskId}, ${filenameBase},
          ${version.format}, 'pending', ${JSON.stringify(validated.value)}
        )`;
	try {
		const { decodeBase64, encodeBase64, fillFile, safeDownloadName } = await import("./engine-D5rSWMUN.mjs");
		const filled = await fillFile(version.format, decodeBase64(version.file_b64), fields, validated.value);
		const filename = safeDownloadName(filenameBase, version.format);
		const note = filled.notes.filter(Boolean).join(" ");
		await sql`update generated_documents set
          status = 'ready', filename = ${filename}, file_b64 = ${encodeBase64(filled.bytes)},
          validation_note = ${note}, error = null
        where id = ${docId} and user_id = ${context.userId}`;
		await notify(sql, context.userId, {
			kind: "document",
			title: `${templates[0].name} is ready`,
			body: "The document was generated. Downloading it does not complete a linked task.",
			href: `/app/documents/${docId}`,
			key: `doc:${docId}:ready`
		});
		return {
			ok: true,
			errors: null,
			documentId: docId
		};
	} catch (error) {
		const message = error instanceof Error ? error.message.slice(0, 280) : "The document could not be generated.";
		await sql`update generated_documents set status = 'failed', error = ${message} where id = ${docId} and user_id = ${context.userId}`;
		await notify(sql, context.userId, {
			kind: "document",
			title: `${templates[0].name} was not generated`,
			body: message,
			href: `/app/documents/${docId}`,
			key: `doc:${docId}:failed`
		});
		return {
			ok: false,
			errors: { form: message },
			documentId: docId
		};
	}
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "e7b02423cc58392cc83fc954c9a57e5b61d27829a6d80e10c722c029e7ed7516",
	name: "listDocuments",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDocuments_createServerFn_handler, async ({ context }) => {
	try {
		return (await (await db())`
        select d.id, d.filename, d.format, d.status, t.name as template_name, k.title as task_title, d.created_at
        from generated_documents d
        left join templates t on t.id = d.template_id and t.user_id = d.user_id
        left join tasks k on k.id = d.task_id and k.user_id = d.user_id
        where d.user_id = ${context.userId}
        order by d.created_at desc
        limit 100`).map((row) => ({
			id: row.id,
			filename: row.filename,
			format: row.format,
			status: row.status,
			templateName: row.template_name,
			taskTitle: row.task_title,
			createdAt: asIso(row.created_at) ?? ""
		}));
	} catch (error) {
		rethrowKnown(error);
	}
});
var getDocument_createServerFn_handler = createServerRpc({
	id: "fd1a88a553a451f67975d42378fc3f50748ec4b40e218b4835550866b6168fd0",
	name: "getDocument",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(getDocument_createServerFn_handler, async ({ context, data }) => {
	try {
		const rows = await (await db())`
        select d.id, d.filename, d.format, d.status, d.validation_note, d.form_json, d.error,
               d.template_id, t.name as template_name, d.task_id, k.title as task_title, d.created_at
        from generated_documents d
        left join templates t on t.id = d.template_id and t.user_id = d.user_id
        left join tasks k on k.id = d.task_id and k.user_id = d.user_id
        where d.id = ${data.id} and d.user_id = ${context.userId}`;
		if (!rows[0]) throw new AppError("That document was not found.");
		const row = rows[0];
		return {
			id: row.id,
			filename: row.filename,
			format: row.format,
			status: row.status,
			note: row.validation_note,
			error: row.error,
			form: JSON.parse(row.form_json),
			templateId: row.template_id,
			templateName: row.template_name,
			taskId: row.task_id,
			taskTitle: row.task_title,
			createdAt: asIso(row.created_at) ?? ""
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
var downloadDocument_createServerFn_handler = createServerRpc({
	id: "e6042d6ca27e3c16d8ee37ccf7987e276096b2d5f6faa91891275cc3b76b3051",
	name: "downloadDocument",
	filename: "src/lib/teachflow/server/library.functions.ts"
}, (opts) => downloadDocument.__executeServer(opts));
var downloadDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(downloadDocument_createServerFn_handler, async ({ context, data }) => {
	try {
		const rows = await (await db())`
        select filename, format, file_b64, status from generated_documents
        where id = ${data.id} and user_id = ${context.userId}`;
		if (!rows[0] || rows[0].status !== "ready" || !rows[0].file_b64) throw new AppError("That document is not ready to download.");
		const { mimeFor } = await import("./engine-D5rSWMUN.mjs");
		return {
			filename: rows[0].filename,
			mime: mimeFor(rows[0].format),
			base64: rows[0].file_b64
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
//#endregion
export { createStarter_createServerFn_handler, downloadDocument_createServerFn_handler, duplicateTemplate_createServerFn_handler, generateDocument_createServerFn_handler, getDocument_createServerFn_handler, getTemplate_createServerFn_handler, listDocuments_createServerFn_handler, listTemplates_createServerFn_handler, reanalyzeTemplate_createServerFn_handler, saveTemplate_createServerFn_handler, setTemplateStatus_createServerFn_handler, uploadTemplate_createServerFn_handler };
