//#region node_modules/.nitro/vite/services/ssr/assets/categories-Cd43Z7G-.js
var TASK_CATEGORIES = [
	{
		id: "lesson",
		label: "Lesson preparation"
	},
	{
		id: "exam",
		label: "Examinations"
	},
	{
		id: "paper",
		label: "Question papers"
	},
	{
		id: "assignment",
		label: "Assignments"
	},
	{
		id: "assessment",
		label: "Assessment"
	},
	{
		id: "meeting",
		label: "Meetings"
	},
	{
		id: "report",
		label: "Reports"
	},
	{
		id: "admin",
		label: "Administration"
	},
	{
		id: "other",
		label: "Miscellaneous"
	}
];
var EVENT_KINDS = [
	{
		id: "exam",
		label: "Examination"
	},
	{
		id: "assignment",
		label: "Assignment deadline"
	},
	{
		id: "meeting",
		label: "Meeting"
	},
	{
		id: "academic",
		label: "Academic event"
	},
	{
		id: "institutional",
		label: "Institutional date"
	}
];
var TEMPLATE_CATEGORIES = [
	{
		id: "paper",
		label: "Question paper"
	},
	{
		id: "lesson",
		label: "Lesson plan"
	},
	{
		id: "worksheet",
		label: "Worksheet"
	},
	{
		id: "report",
		label: "Report"
	},
	{
		id: "schedule",
		label: "Schedule"
	},
	{
		id: "meeting",
		label: "Meeting"
	},
	{
		id: "other",
		label: "Other"
	}
];
var PRIORITIES = [
	{
		id: "low",
		label: "Low"
	},
	{
		id: "normal",
		label: "Normal"
	},
	{
		id: "high",
		label: "High"
	}
];
function categoryLabel(id) {
	return TASK_CATEGORIES.find((item) => item.id === id)?.label ?? TEMPLATE_CATEGORIES.find((item) => item.id === id)?.label ?? "Miscellaneous";
}
function eventKindLabel(id) {
	return EVENT_KINDS.find((item) => item.id === id)?.label ?? "Event";
}
function isTaskCategory(id) {
	return TASK_CATEGORIES.some((item) => item.id === id);
}
function isEventKind(id) {
	return EVENT_KINDS.some((item) => item.id === id);
}
function isPriority(id) {
	return PRIORITIES.some((item) => item.id === id);
}
function isTemplateCategory(id) {
	return TEMPLATE_CATEGORIES.some((item) => item.id === id);
}
//#endregion
export { categoryLabel as a, isPriority as c, TEMPLATE_CATEGORIES as i, isTaskCategory as l, PRIORITIES as n, eventKindLabel as o, TASK_CATEGORIES as r, isEventKind as s, EVENT_KINDS as t, isTemplateCategory as u };
