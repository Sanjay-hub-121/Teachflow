import { r as createServerFn } from "./ssr.mjs";
import { i as rethrowKnown, n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { r as sanitizeFields } from "./fields-yzKHtmUG.mjs";
import { a as db, c as loadProfile } from "./common-GdDXDCtZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights.functions-RK28xtkF.js
var getInsights_createServerFn_handler = createServerRpc({
	id: "fa7208156111f26b69819b4c047d8d4c1f213125f38b944e8cdbc216b24cf7c6",
	name: "getInsights",
	filename: "src/lib/teachflow/server/insights.functions.ts"
}, (opts) => getInsights.__executeServer(opts));
var getInsights = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	return { days: [
		7,
		30,
		90
	].includes(Number(input?.days)) ? Number(input?.days) : 30 };
}).handler(getInsights_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await db();
		const profile = await loadProfile(sql, context.userId);
		const counts = await sql`
        select
          (count(*) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day')))::int as completed,
          (count(*) filter (where status = 'open' and due_date is not null and due_date < (now() at time zone ${profile.timezone})::date))::int as overdue,
          (count(*) filter (where status = 'open' and due_date is not null and due_date >= (now() at time zone ${profile.timezone})::date and due_date <= ((now() at time zone ${profile.timezone})::date + ${data.days}::int)))::int as upcoming,
          (coalesce(sum(estimated_minutes) filter (where status = 'open' and estimated_minutes is not null), 0))::int as estimated,
          (count(*) filter (where status = 'open' and estimated_minutes is not null))::int as estimated_tasks,
          (coalesce(sum(actual_minutes) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day') and actual_minutes is not null), 0))::int as recorded,
          (count(*) filter (where status = 'completed' and completed_at >= now() - (${data.days}::int * interval '1 day') and actual_minutes is not null))::int as recorded_tasks
        from tasks where user_id = ${context.userId}`;
		const documents = await sql`
        select count(*)::int as count from generated_documents
        where user_id = ${context.userId} and status = 'ready' and created_at >= now() - (${data.days}::int * interval '1 day')`;
		const templates = await sql`
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
			templates: templates.map((row) => ({
				name: row.name,
				count: row.count
			})),
			savedMinutes: hasEstimate ? saved : null
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
async function ask(prompt) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI assistance is not configured. Everything else in TeachFlow still works."
	};
	const response = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .3,
			max_tokens: 700,
			messages: [{
				role: "system",
				content: "You help a teacher organize their own work. Never invent institutional policies, student records, exam-board rules, or official facts. If something is unknown, say the teacher should check it. Keep the answer practical and short."
			}, {
				role: "user",
				content: prompt.slice(0, 5e3)
			}]
		})
	});
	if (!response.ok) return {
		ok: false,
		error: "The assistant could not answer just now. Try again in a moment."
	};
	return {
		ok: true,
		text: (await response.json()).choices?.[0]?.message?.content?.trim() || "The assistant returned an empty answer."
	};
}
var askAssistant_createServerFn_handler = createServerRpc({
	id: "b54d9dce2173fd5edd99b6ce3eadccc1d6e668bbd080919ec1cfac24b3d3139a",
	name: "askAssistant",
	filename: "src/lib/teachflow/server/insights.functions.ts"
}, (opts) => askAssistant.__executeServer(opts));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const mode = String(input.mode ?? "steps");
	const text = String(input.text ?? "").trim();
	if (!text) throw new AppError("Write what you want help with first.");
	return {
		mode,
		text: text.slice(0, 4e3)
	};
}).handler(askAssistant_createServerFn_handler, async ({ data }) => {
	const result = await ask(`${data.mode === "plan" ? "Suggest a realistic order for this work. Return plain sentences, not a fake timetable with invented school rules." : data.mode === "lesson" ? "Draft lesson-plan notes the teacher can edit: objectives, activities, and a check for understanding. Mark anything they must confirm." : data.mode === "paper" ? "Suggest a question-paper structure only (sections and mark ideas). Do not claim it matches a board syllabus." : data.mode === "organize" ? "Organize the teacher's notes into short labeled points they can paste into a form." : "Break this task into at most 8 short steps. Reply with JSON only: {\"steps\":[\"...\"]}."}\n\nTeacher's notes:\n${data.text}`);
	if (!result.ok) return {
		ok: false,
		error: result.error,
		text: "",
		steps: []
	};
	let steps = [];
	if (data.mode === "steps") {
		const match = result.text.match(/\{[\s\S]*\}/);
		if (match) try {
			const parsed = JSON.parse(match[0]);
			if (Array.isArray(parsed.steps)) steps = parsed.steps.map((step) => String(step).trim()).filter(Boolean).slice(0, 8);
		} catch {
			steps = [];
		}
	}
	return {
		ok: true,
		error: null,
		text: result.text,
		steps
	};
});
var suggestTemplateFields_createServerFn_handler = createServerRpc({
	id: "d39b0608c1d19b67cecde3290a1039eadc15982b8c1ffd40c0c7280ff62ee571",
	name: "suggestTemplateFields",
	filename: "src/lib/teachflow/server/insights.functions.ts"
}, (opts) => suggestTemplateFields.__executeServer(opts));
var suggestTemplateFields = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(suggestTemplateFields_createServerFn_handler, async ({ context, data }) => {
	try {
		const rows = await (await db())`
        select v.analysis_json from templates t
        join template_versions v on v.id = t.current_version_id
        where t.id = ${data.id} and t.user_id = ${context.userId}`;
		if (!rows[0]) throw new AppError("That template was not found.");
		const analysis = JSON.parse(rows[0].analysis_json);
		const result = await ask(`Look at this teacher document excerpt and propose editable fields. Reply with JSON only: {"fields":[{"label":"","type":"text|textarea|number|date|select|repeat","required":false,"token":"optional existing placeholder name"}]}. Only set token if that {{name}} appears in the excerpt. Do not invent facts.\n\n${String(analysis.textPreview ?? "").slice(0, 6e3)}`);
		if (!result.ok) return {
			ok: false,
			error: result.error,
			fields: []
		};
		const match = result.text.match(/\{[\s\S]*\}/);
		let fields = [];
		if (match) try {
			fields = JSON.parse(match[0]).fields ?? [];
		} catch {
			fields = [];
		}
		return {
			ok: true,
			error: null,
			fields: sanitizeFields(fields),
			note: "These are suggestions. Check them before you approve the template."
		};
	} catch (error) {
		rethrowKnown(error);
	}
});
//#endregion
export { askAssistant_createServerFn_handler, getInsights_createServerFn_handler, suggestTemplateFields_createServerFn_handler };
