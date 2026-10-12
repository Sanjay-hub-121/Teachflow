import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { c as isPriority, l as isTaskCategory, s as isEventKind } from "./categories-Cd43Z7G-.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as cleanTime, r as cleanDate } from "./common-GdDXDCtZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks.functions-D5VofiPi.js
function taskInput(input, partial = false) {
	const title = String(input.title ?? "").trim();
	if (!partial && !title) throw new AppError("Give the task a title.");
	if (title.length > 160) throw new AppError("The title is too long.");
	const category = String(input.category ?? "other");
	const priority = String(input.priority ?? "normal");
	if (!isTaskCategory(category)) throw new AppError("Choose a category.");
	if (!isPriority(priority)) throw new AppError("Choose a priority.");
	const dueDate = cleanDate(input.dueDate);
	const dueTime = cleanTime(input.dueTime);
	if (dueTime && !dueDate) throw new AppError("Add a due date before a due time.");
	const estimated = input.estimatedMinutes == null || input.estimatedMinutes === "" ? null : Number(input.estimatedMinutes);
	if (estimated != null && (!Number.isFinite(estimated) || estimated < 0 || estimated > 1e4)) throw new AppError("Estimated minutes should be between 0 and 10000.");
	const actual = input.actualMinutes == null || input.actualMinutes === "" ? null : Number(input.actualMinutes);
	if (actual != null && (!Number.isFinite(actual) || actual < 0 || actual > 1e4)) throw new AppError("Recorded minutes should be between 0 and 10000.");
	const lead = input.reminderLeadMinutes == null || input.reminderLeadMinutes === "" ? null : Number(input.reminderLeadMinutes);
	if (lead != null && (!Number.isFinite(lead) || lead < 0 || lead > 10080)) throw new AppError("Reminder timing looks off.");
	return {
		title,
		description: String(input.description ?? "").slice(0, 4e3),
		category,
		priority,
		dueDate,
		dueTime,
		estimatedMinutes: estimated == null ? null : Math.round(estimated),
		actualMinutes: actual == null ? null : Math.round(actual),
		notes: String(input.notes ?? "").slice(0, 8e3),
		templateId: input.templateId ? String(input.templateId) : null,
		remind: input.remind !== false,
		reminderLeadMinutes: lead == null ? null : Math.round(lead),
		addToCalendar: Boolean(input.addToCalendar),
		eventKind: isEventKind(String(input.eventKind ?? "")) ? String(input.eventKind) : "academic",
		version: Number(input.version ?? 0)
	};
}
var listTasks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	view: [
		"today",
		"upcoming",
		"overdue",
		"completed",
		"all"
	].includes(String(input?.view)) ? String(input?.view) : "all",
	q: String(input?.q ?? "").trim().slice(0, 80),
	category: String(input?.category ?? ""),
	priority: String(input?.priority ?? ""),
	sort: [
		"due",
		"priority",
		"updated",
		"title"
	].includes(String(input?.sort)) ? String(input?.sort) : "due"
})).handler(createSsrRpc("9af0d3301399eb31b8f5a4a27c7deafc2ddd4b2085ef142c1c1714fb1a1988ff"));
var getTask = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	return { id };
}).handler(createSsrRpc("381c3ee28c9963a8d529603b81199158182b4a5f006957a410d04327fb1698d3"));
var createTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => taskInput(input)).handler(createSsrRpc("9dab16e8ef668d66eb0f8f21cf4917299823e5a7a8b9d591e0fb2cefa617a976"));
var updateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	const parsed = taskInput(input);
	if (!Number.isFinite(parsed.version)) throw new AppError("Reload this task and try again.");
	return {
		...parsed,
		id
	};
}).handler(createSsrRpc("1f7bedf6e04e538a6e7eebcab5f2c554f167761c4941ad765bbdf88b29cdec17"));
var setTaskStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	const status = input.status === "completed" ? "completed" : input.status === "open" ? "open" : "";
	if (!id || !status) throw new AppError("That task could not be updated.");
	return {
		id,
		status,
		version: Number(input.version ?? 0),
		actualMinutes: input.actualMinutes ?? null
	};
}).handler(createSsrRpc("6fb882e0c8357c159fd689bd52fd5b6efeec80f587b6bf8515c974a3fa3cf370"));
var deleteTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = String(input.id ?? "");
	if (!id) throw new AppError("That task was not found.");
	return { id };
}).handler(createSsrRpc("88dbb7947cd8b76395fd637aacc540289821e81a6d589d9d6103189db71bd278"));
var addSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const taskId = String(input.taskId ?? "");
	const title = String(input.title ?? "").trim();
	if (!taskId || !title) throw new AppError("Write a step before adding it.");
	return {
		taskId,
		title: title.slice(0, 200)
	};
}).handler(createSsrRpc("845f40bad25eb2769d6057471721adc19d059e18a6e2e5ff0ea2a289714d4343"));
var addSubtasks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const taskId = String(input.taskId ?? "");
	const titles = (input.titles ?? []).map((title) => String(title).trim()).filter(Boolean).slice(0, 8);
	if (!taskId || titles.length === 0) throw new AppError("There are no steps to add.");
	return {
		taskId,
		titles: titles.map((title) => title.slice(0, 200))
	};
}).handler(createSsrRpc("d5e140ac0f7e9bbe01886d1b2774ec1166f450f76e6b96abc3a659a429b0b353"));
var toggleSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input.id ?? ""),
	done: Boolean(input.done)
})).handler(createSsrRpc("a485e04c1c2c88db08b3bfba7fe70c027b56299b5c0efee862fee0f21750f53c"));
var deleteSubtask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("eaac9f67288954b4e60f3a722a1ef18cc0dadb3fb67b7f7a3a9282bcac7f63d4"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("07f5bbf7902b55c2132d195ab0182fca2e427e5efd4f86f88cbb78140d4e8297"));
//#endregion
export { deleteTask as a, listTasks as c, updateTask as d, deleteSubtask as i, setTaskStatus as l, addSubtasks as n, getDashboard as o, createTask as r, getTask as s, addSubtask as t, toggleSubtask as u };
