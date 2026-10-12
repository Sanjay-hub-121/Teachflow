import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, Q as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Card, o as Notice, s as PageHeader, t as Button, u as TextArea } from "./ui-NXfbhcwX.mjs";
import { t as attempt } from "./actions-Dhl2mSHk.mjs";
import { n as addSubtasks, r as createTask } from "./tasks.functions-D5VofiPi.mjs";
import { t as askAssistant } from "./insights.functions-ZU57X0ru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-DbhhKLrw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	["steps", "Break into steps"],
	["plan", "Order the work"],
	["lesson", "Lesson notes"],
	["paper", "Paper structure"],
	["organize", "Tidy my notes"]
];
function AssistantPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("steps");
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [steps, setSteps] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Assistant",
			lede: "Drafts only. It does not know your syllabus, exam board, or school rules — check those yourself. Nothing is saved until you ask."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: MODES.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `min-h-11 rounded-full px-3 text-sm font-semibold ${mode === id ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`,
				onClick: () => setMode(id),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (event) => {
					event.preventDefault();
					setBusy(true);
					setError("");
					askAssistant({ data: {
						mode,
						text
					} }).then((result) => {
						if (!result.ok) {
							setError(result.error);
							setAnswer("");
							setSteps([]);
							return;
						}
						setAnswer(result.text);
						setSteps(result.steps);
					}).catch(() => setError("The assistant could not answer just now.")).finally(() => setBusy(false));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					required: true,
					value: text,
					placeholder: "What do you need to prepare?",
					onChange: (event) => setText(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Thinking…" : "Ask"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, { children: error })
			}) : null,
			answer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Draft"
					}),
					steps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "list-decimal space-y-1 pl-5 text-sm",
						children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-sm text-ink-soft",
						children: answer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const title = text.split("\n")[0].trim().slice(0, 120) || "Notes from the assistant";
							const category = mode === "lesson" ? "lesson" : mode === "paper" ? "paper" : "other";
							attempt(async () => {
								const task = await createTask({ data: {
									title,
									description: steps.length ? "" : answer,
									notes: steps.length ? answer : "",
									category,
									priority: "normal",
									remind: false
								} });
								if (steps.length) await addSubtasks({ data: {
									taskId: task.id,
									titles: steps
								} });
								return task;
							}).then(async (task) => {
								if (!task) return;
								await navigate({
									to: "/app/tasks/$taskId",
									params: { taskId: task.id }
								});
							});
						},
						children: steps.length ? "Save steps as a task" : "Save this as a task"
					})
				]
			}) : null
		] })
	] });
}
//#endregion
export { AssistantPage as component };
