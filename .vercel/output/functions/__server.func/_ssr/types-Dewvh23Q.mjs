//#region node_modules/.nitro/vite/services/ssr/assets/types-Dewvh23Q.js
function blankTask() {
	return {
		title: "",
		description: "",
		category: "other",
		priority: "normal",
		dueDate: "",
		dueTime: "",
		estimatedMinutes: "",
		actualMinutes: "",
		notes: "",
		templateId: "",
		remind: true,
		reminderLeadMinutes: "",
		addToCalendar: false,
		eventKind: "academic"
	};
}
function draftFromTask(task) {
	return {
		title: task.title,
		description: task.description,
		category: task.category,
		priority: task.priority,
		dueDate: task.dueDate ?? "",
		dueTime: task.dueTime ?? "",
		estimatedMinutes: task.estimatedMinutes == null ? "" : String(task.estimatedMinutes),
		actualMinutes: task.actualMinutes == null ? "" : String(task.actualMinutes),
		notes: task.notes,
		templateId: task.templateId ?? "",
		remind: task.remind,
		reminderLeadMinutes: task.reminderLeadMinutes == null ? "" : String(task.reminderLeadMinutes),
		addToCalendar: false,
		eventKind: "academic"
	};
}
function clock(value) {
	return value.length > 5 ? value.slice(0, 5) : value;
}
function payloadFromDraft(draft, extra) {
	return {
		...extra,
		title: draft.title.trim(),
		description: draft.description,
		category: draft.category,
		priority: draft.priority,
		dueDate: draft.dueDate || null,
		dueTime: draft.dueTime ? clock(draft.dueTime) : null,
		estimatedMinutes: draft.estimatedMinutes === "" ? null : Number(draft.estimatedMinutes),
		actualMinutes: draft.actualMinutes === "" ? null : Number(draft.actualMinutes),
		notes: draft.notes,
		templateId: draft.templateId || null,
		remind: draft.remind,
		reminderLeadMinutes: draft.reminderLeadMinutes === "" ? null : Number(draft.reminderLeadMinutes),
		addToCalendar: draft.addToCalendar,
		eventKind: draft.eventKind
	};
}
//#endregion
export { draftFromTask as n, payloadFromDraft as r, blankTask as t };
