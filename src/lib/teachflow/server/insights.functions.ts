import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { sanitizeFields } from "../fields.ts";
import { AppError, rethrowKnown } from "../errors.ts";
import { db, loadProfile } from "./common.ts";

export const getInsights = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { days?: number } | undefined) => {
    const days = [7, 30, 90].includes(Number(input?.days)) ? Number(input?.days) : 30;
    return { days };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const counts = await sql<{
        completed: number;
        overdue: number;
        upcoming: number;
        estimated: number;
        estimated_tasks: number;
        recorded: number;
        recorded_tasks: number;
      }>`
        select
          (count(*) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day')))::int as completed,
          (count(*) filter (where status = 'open' and due_date is not null and due_date < (now() at time zone ${profile.timezone})::date))::int as overdue,
          (count(*) filter (where status = 'open' and due_date is not null and due_date >= (now() at time zone ${profile.timezone})::date and due_date <= ((now() at time zone ${profile.timezone})::date + ${data.days}::int)))::int as upcoming,
          (coalesce(sum(estimated_minutes) filter (where status = 'open' and estimated_minutes is not null), 0))::int as estimated,
          (count(*) filter (where status = 'open' and estimated_minutes is not null))::int as estimated_tasks,
          (coalesce(sum(actual_minutes) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day') and actual_minutes is not null), 0))::int as recorded,
          (count(*) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day') and actual_minutes is not null))::int as recorded_tasks
        from tasks where user_id = ${context.userId}`;
      const documents = await sql<{ count: number }>`
        select count(*)::int as count from generated_documents
        where user_id = ${context.userId} and status = 'ready' and created_at >= now() - (${data.days}::int * interval '1 day')`;
      const templates = await sql<{ name: string; count: number; manual_minutes: number | null }>`
        select t.name, count(*)::int as count, t.manual_minutes
        from generated_documents d
        join templates t on t.id = d.template_id and t.user_id = d.user_id
        where d.user_id = ${context.userId} and d.status = 'ready' and d.created_at >= now() - (${data.days}::int * interval '1 day')
        group by t.id, t.name, t.manual_minutes
        order by count desc
        limit 6`;
      const saved = templates.reduce((sum, row) => sum + (row.manual_minutes ? row.manual_minutes * row.count : 0), 0);
      const hasEstimate = templates.some((row) => row.manual_minutes);
      return {
        days: data.days,
        completed: counts[0]?.completed ?? 0,
        overdue: counts[0]?.overdue ?? 0,
        upcoming: counts[0]?.upcoming ?? 0,
        estimatedMinutes: counts[0]?.estimated ?? 0,
        estimatedTasks: counts[0]?.estimated_tasks ?? 0,
        recordedMinutes: counts[0]?.recorded ?? 0,
        recordedTasks: counts[0]?.recorded_tasks ?? 0,
        documents: documents[0]?.count ?? 0,
        templates: templates.map((row) => ({ name: row.name, count: row.count })),
        savedMinutes: hasEstimate ? saved : null,
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });

async function ask(prompt: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return { ok: false, error: "AI assistance is not configured. Everything else in TeachFlow still works." };
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "nvidia/nemotron-3.5-lightning-30b-a3b",
      messages: [
        {
          role: "system",
          content:
            "You help a teacher organize their own work. Never invent institutional policies, student records, exam-board rules, or official facts. If something is unknown, say the teacher should check it. Keep the answer practical and short.",
        },
        { role: "user", content: prompt.slice(0, 5000) },
      ],
      temperature: 0.3,
      max_tokens: 700,
      stream: false,
    }),
  });
  if (!response.ok) return { ok: false, error: "The assistant could not answer just now. Try again in a moment." };
  const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return { ok: true, text: body.choices?.[0]?.message?.content?.trim() || "The assistant returned an empty answer." };
}

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { mode?: string; text?: string }) => {
    const mode = String(input.mode ?? "steps");
    const text = String(input.text ?? "").trim();
    if (!text) throw new AppError("Write what you want help with first.");
    return { mode, text: text.slice(0, 4000) };
  })
  .handler(async ({ data }) => {
    const instruction =
      data.mode === "plan"
        ? "Suggest a realistic order for this work. Return plain sentences, not a fake timetable with invented school rules."
        : data.mode === "lesson"
          ? "Draft lesson-plan notes the teacher can edit: objectives, activities, and a check for understanding. Mark anything they must confirm."
          : data.mode === "paper"
            ? "Suggest a question-paper structure only (sections and mark ideas). Do not claim it matches a board syllabus."
            : data.mode === "organize"
              ? "Organize the teacher's notes into short labeled points they can paste into a form."
              : 'Break this task into at most 8 short steps. Reply with JSON only: {"steps":["..."]}.';
    const result = await ask(`${instruction}\n\nTeacher's notes:\n${data.text}`);
    if (!result.ok) return { ok: false as const, error: result.error, text: "", steps: [] as string[] };
    let steps: string[] = [];
    if (data.mode === "steps") {
      const match = result.text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]) as { steps?: unknown };
          if (Array.isArray(parsed.steps)) steps = parsed.steps.map((step) => String(step).trim()).filter(Boolean).slice(0, 8);
        } catch {
          steps = [];
        }
      }
    }
    return { ok: true as const, error: null, text: result.text, steps };
  });

export const suggestTemplateFields = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string }) => ({ id: String(input.id ?? "") }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const rows = await sql<{ analysis_json: string }>`
        select v.analysis_json from templates t
        join template_versions v on v.id = t.current_version_id
        where t.id = ${data.id} and t.user_id = ${context.userId}`;
      if (!rows[0]) throw new AppError("That template was not found.");
      const analysis = JSON.parse(rows[0].analysis_json) as { textPreview?: string };
      const preview = String(analysis.textPreview ?? "").slice(0, 6000);
      const result = await ask(
        `Look at this teacher document excerpt and propose editable fields. Reply with JSON only: {"fields":[{"label":"","type":"text|textarea|number|date|select|repeat","required":false,"token":"optional existing placeholder name"}]}. Only set token if that {{name}} appears in the excerpt. Do not invent facts.\n\n${preview}`,
      );
      if (!result.ok) return { ok: false as const, error: result.error, fields: [] as ReturnType<typeof sanitizeFields> };
      const match = result.text.match(/\{[\s\S]*\}/);
      let fields: unknown = [];
      if (match) {
        try {
          fields = (JSON.parse(match[0]) as { fields?: unknown }).fields ?? [];
        } catch {
          fields = [];
        }
      }
      return {
        ok: true as const,
        error: null,
        fields: sanitizeFields(fields),
        note: "These are suggestions. Check them before you approve the template.",
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });
