import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { isTemplateCategory } from "../categories.ts";
import { sanitizeFields, validateFormData, type FieldDef } from "../fields.ts";
import { AppError, rethrowKnown } from "../errors.ts";
import { asIso, db, nid, notify } from "./common.ts";

function meta(input: Record<string, unknown>) {
  const name = String(input.name ?? "").trim();
  if (!name) throw new AppError("Give the template a name.");
  const category = String(input.category ?? "other");
  if (!isTemplateCategory(category)) throw new AppError("Choose a category.");
  const manual = input.manualMinutes == null || input.manualMinutes === "" ? null : Number(input.manualMinutes);
  if (manual != null && (!Number.isFinite(manual) || manual < 0 || manual > 10000)) {
    throw new AppError("Minutes usually spent should be between 0 and 10000.");
  }
  return {
    name: name.slice(0, 140),
    description: String(input.description ?? "").trim().slice(0, 800),
    category,
    subject: String(input.subject ?? "").trim().slice(0, 120),
    gradeLevel: String(input.gradeLevel ?? "").trim().slice(0, 80),
    manualMinutes: manual == null ? null : Math.round(manual),
  };
}

async function insertVersion(
  userId: string,
  templateId: string,
  version: number,
  file: { filename: string; format: string; bytes: Uint8Array; checksum: string },
  fields: FieldDef[],
  analysis: unknown,
  status: string,
) {
  const { encodeBase64 } = await import("../docs/engine.ts");
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

export const listTemplates = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { archived?: boolean } | undefined) => ({ archived: Boolean(input?.archived) }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{
        id: string;
        name: string;
        description: string;
        category: string;
        subject: string;
        grade_level: string;
        status: string;
        format: string | null;
        version: number | null;
        updated_at: unknown;
      }>`
        select t.id, t.name, t.description, t.category, t.subject, t.grade_level, t.status,
               v.format, v.version, t.updated_at
        from templates t
        left join template_versions v on v.id = t.current_version_id
        where t.user_id = ${context.userId}
          and ((${data.archived} = true and t.status = 'archived') or (${data.archived} = false and t.status <> 'archived'))
        order by t.updated_at desc
        limit 100`;
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        subject: row.subject,
        gradeLevel: row.grade_level,
        status: row.status,
        format: row.format,
        version: row.version,
        updatedAt: asIso(row.updated_at) ?? "",
      }));
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const getTemplate = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That template was not found.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{
        id: string;
        name: string;
        description: string;
        category: string;
        subject: string;
        grade_level: string;
        status: string;
        manual_minutes: number | null;
        current_version_id: string | null;
      }>`
        select id, name, description, category, subject, grade_level, status, manual_minutes, current_version_id
        from templates where id = ${data.id} and user_id = ${context.userId}`;
      if (!rows[0]) throw new AppError("That template was not found.");
      const version = rows[0].current_version_id
        ? await sql<{
            id: string;
            version: number;
            original_filename: string;
            format: string;
            schema_json: string;
            analysis_json: string;
            processing_status: string;
            checksum: string;
          }>`
            select id, version, original_filename, format, schema_json, analysis_json, processing_status, checksum
            from template_versions where id = ${rows[0].current_version_id} and user_id = ${context.userId}`
        : [];
      const docs = await sql<{ id: string; filename: string; status: string; created_at: unknown }>`
        select id, filename, status, created_at from generated_documents
        where template_id = ${data.id} and user_id = ${context.userId}
        order by created_at desc limit 8`;
      const current = version[0];
      return {
        ...rows[0],
        gradeLevel: rows[0].grade_level,
        manualMinutes: rows[0].manual_minutes,
        version: current
          ? {
              id: current.id,
              version: current.version,
              filename: current.original_filename,
              format: current.format,
              checksum: current.checksum,
              status: current.processing_status,
              fields: sanitizeFields(JSON.parse(current.schema_json)),
              analysis: JSON.parse(current.analysis_json) as { textPreview?: string; notes?: string[]; suggested?: FieldDef[] },
            }
          : null,
        documents: docs.map((doc) => ({
          id: doc.id,
          filename: doc.filename,
          status: doc.status,
          createdAt: asIso(doc.created_at) ?? "",
        })),
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const uploadTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { filename?: string; base64?: string; name?: string; category?: string; description?: string }) => ({
    ...meta({ name: input.name || input.filename, category: input.category, description: input.description }),
    filename: String(input.filename ?? "template").slice(0, 180),
    base64: String(input.base64 ?? ""),
  }))
  .handler(async ({ context, data }) => {
    try {
      const { analyzeFile, decodeBase64, sha256 } = await import("../docs/engine.ts");
      const bytes = decodeBase64(data.base64);
      const analysis = await analyzeFile(data.filename, bytes);
      const sql = await db();
      const templateId = nid();
      await sql`insert into templates (id, user_id, name, description, category, status)
        values (${templateId}, ${context.userId}, ${data.name}, ${data.description}, ${data.category}, 'needs_review')`;
      const versionId = await insertVersion(
        context.userId,
        templateId,
        1,
        { filename: data.filename, format: analysis.format, bytes, checksum: sha256(bytes) },
        analysis.suggested,
        analysis,
        "needs_review",
      );
      await sql`update templates set current_version_id = ${versionId} where id = ${templateId} and user_id = ${context.userId}`;
      return { id: templateId };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const createStarter = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind?: string }) => {
    const kind = String(input.kind ?? "");
    if (!["question-paper", "lesson-plan", "worksheet", "meeting", "report"].includes(kind)) {
      throw new AppError("Choose a starter template.");
    }
    return { kind: kind as "question-paper" | "lesson-plan" | "worksheet" | "meeting" | "report" };
  })
  .handler(async ({ context, data }) => {
    try {
      const { buildStarter, sha256 } = await import("../docs/engine.ts");
      const starter = await buildStarter(data.kind);
      const sql = await db();
      const templateId = nid();
      await sql`insert into templates (id, user_id, name, description, category, status)
        values (${templateId}, ${context.userId}, ${starter.name}, ${starter.description}, ${starter.category}, 'ready')`;
      const versionId = await insertVersion(
        context.userId,
        templateId,
        1,
        { filename: starter.filename, format: starter.format, bytes: starter.bytes, checksum: sha256(starter.bytes) },
        starter.fields,
        { textPreview: starter.description, notes: [], suggested: starter.fields },
        "ready",
      );
      await sql`update templates set current_version_id = ${versionId} where id = ${templateId} and user_id = ${context.userId}`;
      return { id: templateId };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const saveTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => {
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That template was not found.");
    const fields = sanitizeFields(input.fields);
    if (fields.length === 0) throw new AppError("Add at least one field before approving the template.");
    return { id, ...meta(input), fields };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const templates = await sql<{ current_version_id: string | null }>`
        select current_version_id from templates where id = ${data.id} and user_id = ${context.userId}`;
      if (!templates[0]?.current_version_id) throw new AppError("That template was not found.");
      const versions = await sql<{
        id: string;
        version: number;
        original_filename: string;
        format: string;
        checksum: string;
        file_b64: string;
        schema_json: string;
        analysis_json: string;
        processing_status: string;
      }>`
        select id, version, original_filename, format, checksum, file_b64, schema_json, analysis_json, processing_status
        from template_versions where id = ${templates[0].current_version_id} and user_id = ${context.userId}`;
      const current = versions[0];
      if (!current) throw new AppError("That template was not found.");
      const used = await sql`select id from generated_documents where template_version_id = ${current.id} and user_id = ${context.userId} limit 1`;
      const schemaChanged = current.schema_json !== JSON.stringify(data.fields);
      let versionId = current.id;
      if (schemaChanged && (used.length || current.processing_status === "ready")) {
        const { decodeBase64 } = await import("../docs/engine.ts");
        versionId = await insertVersion(
          context.userId,
          data.id,
          current.version + 1,
          {
            filename: current.original_filename,
            format: current.format,
            bytes: decodeBase64(current.file_b64),
            checksum: current.checksum,
          },
          data.fields,
          JSON.parse(current.analysis_json),
          "ready",
        );
      } else {
        await sql`update template_versions set schema_json = ${JSON.stringify(data.fields)}, processing_status = 'ready'
          where id = ${current.id} and user_id = ${context.userId}`;
      }
      await sql`update templates set
          name = ${data.name}, description = ${data.description}, category = ${data.category},
          subject = ${data.subject}, grade_level = ${data.gradeLevel}, manual_minutes = ${data.manualMinutes},
          status = 'ready', current_version_id = ${versionId}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const reanalyzeTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{ file_b64: string; original_filename: string; id: string }>`
        select v.id, v.file_b64, v.original_filename
        from templates t
        join template_versions v on v.id = t.current_version_id
        where t.id = ${data.id} and t.user_id = ${context.userId}`;
      if (!rows[0]) throw new AppError("That template was not found.");
      const { analyzeFile, decodeBase64 } = await import("../docs/engine.ts");
      const analysis = await analyzeFile(rows[0].original_filename, decodeBase64(rows[0].file_b64));
      await sql`update template_versions set analysis_json = ${JSON.stringify(analysis)} where id = ${rows[0].id} and user_id = ${context.userId}`;
      return analysis;
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const setTemplateStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; status?: string }) => {
    const status = input.status === "archived" ? "archived" : input.status === "ready" ? "ready" : "";
    if (!input.id || !status) throw new AppError("That template could not be updated.");
    return { id: String(input.id), status };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql`update templates set status = ${data.status}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} returning id`;
      if (!rows.length) throw new AppError("That template was not found.");
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const duplicateTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const templates = await sql<{
        name: string;
        description: string;
        category: string;
        subject: string;
        grade_level: string;
        current_version_id: string | null;
      }>`select name, description, category, subject, grade_level, current_version_id from templates where id = ${data.id} and user_id = ${context.userId}`;
      if (!templates[0]?.current_version_id) throw new AppError("That template was not found.");
      const version = await sql<{
        original_filename: string;
        format: string;
        byte_size: number;
        checksum: string;
        file_b64: string;
        schema_json: string;
        analysis_json: string;
      }>`select original_filename, format, byte_size, checksum, file_b64, schema_json, analysis_json
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

export const generateDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { templateId?: string; taskId?: string | null; data?: unknown; documentId?: string | null }) => ({
    templateId: String(input.templateId ?? ""),
    taskId: input.taskId ? String(input.taskId) : null,
    documentId: input.documentId ? String(input.documentId) : null,
    data: input.data ?? {},
  }))
  .handler(async ({ context, data }) => {
    const sql = await db();
    const templates = await sql<{ name: string; status: string; current_version_id: string | null }>`
      select name, status, current_version_id from templates where id = ${data.templateId} and user_id = ${context.userId}`;
    if (!templates[0] || templates[0].status !== "ready" || !templates[0].current_version_id) {
      throw new AppError("Approve the template before generating a document.");
    }
    if (data.taskId) {
      const task = await sql`select id from tasks where id = ${data.taskId} and user_id = ${context.userId}`;
      if (!task.length) throw new AppError("That task was not found.");
    }
    const versions = await sql<{ id: string; format: string; original_filename: string; file_b64: string; schema_json: string }>`
      select id, format, original_filename, file_b64, schema_json from template_versions
      where id = ${templates[0].current_version_id} and user_id = ${context.userId}`;
    const version = versions[0];
    if (!version) throw new AppError("That template was not found.");
    const fields = sanitizeFields(JSON.parse(version.schema_json));
    const validated = validateFormData(fields, data.data);
    if (!validated.ok) return { ok: false as const, errors: validated.errors, documentId: null };
    const docId = data.documentId ?? nid();
    const filenameBase = templates[0].name;
    if (data.documentId) {
      const existing = await sql`select id from generated_documents where id = ${data.documentId} and user_id = ${context.userId} and status = 'failed'`;
      if (!existing.length) throw new AppError("Only a failed document can be retried in place.");
      await sql`update generated_documents set status = 'pending', error = null, form_json = ${JSON.stringify(validated.value)}
        where id = ${docId} and user_id = ${context.userId}`;
    } else {
      await sql`insert into generated_documents (
          id, user_id, template_id, template_version_id, task_id, filename, format, status, form_json
        ) values (
          ${docId}, ${context.userId}, ${data.templateId}, ${version.id}, ${data.taskId}, ${filenameBase},
          ${version.format}, 'pending', ${JSON.stringify(validated.value)}
        )`;
    }
    try {
      const { decodeBase64, encodeBase64, fillFile, safeDownloadName } = await import("../docs/engine.ts");
      const filled = await fillFile(version.format as "docx" | "xlsx" | "pptx" | "pdf", decodeBase64(version.file_b64), fields, validated.value);
      const filename = safeDownloadName(filenameBase, version.format as "docx" | "xlsx" | "pptx" | "pdf");
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
        key: `doc:${docId}:ready`,
      });
      return { ok: true as const, errors: null, documentId: docId };
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 280) : "The document could not be generated.";
      await sql`update generated_documents set status = 'failed', error = ${message} where id = ${docId} and user_id = ${context.userId}`;
      await notify(sql, context.userId, {
        kind: "document",
        title: `${templates[0].name} was not generated`,
        body: message,
        href: `/app/documents/${docId}`,
        key: `doc:${docId}:failed`,
      });
      return { ok: false as const, errors: { form: message }, documentId: docId };
    }
  });

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const rows = await sql<{
        id: string;
        filename: string;
        format: string;
        status: string;
        template_name: string | null;
        task_title: string | null;
        created_at: unknown;
      }>`
        select d.id, d.filename, d.format, d.status, t.name as template_name, k.title as task_title, d.created_at
        from generated_documents d
        left join templates t on t.id = d.template_id and t.user_id = d.user_id
        left join tasks k on k.id = d.task_id and k.user_id = d.user_id
        where d.user_id = ${context.userId}
        order by d.created_at desc
        limit 100`;
      return rows.map((row) => ({
        id: row.id,
        filename: row.filename,
        format: row.format,
        status: row.status,
        templateName: row.template_name,
        taskTitle: row.task_title,
        createdAt: asIso(row.created_at) ?? "",
      }));
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const getDocument = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{
        id: string;
        filename: string;
        format: string;
        status: string;
        validation_note: string;
        form_json: string;
        error: string | null;
        template_id: string | null;
        template_name: string | null;
        task_id: string | null;
        task_title: string | null;
        created_at: unknown;
      }>`
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
        form: JSON.parse(row.form_json) as Record<string, string | boolean | Record<string, string>[]>,
        templateId: row.template_id,
        templateName: row.template_name,
        taskId: row.task_id,
        taskTitle: row.task_title,
        createdAt: asIso(row.created_at) ?? "",
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const downloadDocument = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{ filename: string; format: string; file_b64: string | null; status: string }>`
        select filename, format, file_b64, status from generated_documents
        where id = ${data.id} and user_id = ${context.userId}`;
      if (!rows[0] || rows[0].status !== "ready" || !rows[0].file_b64) {
        throw new AppError("That document is not ready to download.");
      }
      const { mimeFor } = await import("../docs/engine.ts");
      return {
        filename: rows[0].filename,
        mime: mimeFor(rows[0].format as "docx" | "xlsx" | "pptx" | "pdf"),
        base64: rows[0].file_b64,
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });
