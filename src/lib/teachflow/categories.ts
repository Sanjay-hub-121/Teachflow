export const TASK_CATEGORIES = [
  { id: "lesson", label: "Lesson preparation" },
  { id: "exam", label: "Examinations" },
  { id: "paper", label: "Question papers" },
  { id: "assignment", label: "Assignments" },
  { id: "assessment", label: "Assessment" },
  { id: "meeting", label: "Meetings" },
  { id: "report", label: "Reports" },
  { id: "admin", label: "Administration" },
  { id: "other", label: "Miscellaneous" },
  { id: "custom", label: "Custom" },
] as const;

export const EVENT_KINDS = [
  { id: "exam", label: "Examination" },
  { id: "assignment", label: "Assignment deadline" },
  { id: "meeting", label: "Meeting" },
  { id: "academic", label: "Academic event" },
  { id: "institutional", label: "Institutional date" },
  { id: "custom", label: "Custom" },
] as const;

export const TEMPLATE_CATEGORIES = [
  { id: "paper", label: "Question paper" },
  { id: "lesson", label: "Lesson plan" },
  { id: "worksheet", label: "Worksheet" },
  { id: "report", label: "Report" },
  { id: "schedule", label: "Schedule" },
  { id: "meeting", label: "Meeting" },
  { id: "other", label: "Other" },
  { id: "custom", label: "Custom" },
] as const;

export const PRIORITIES = [
  { id: "low", label: "Low" },
  { id: "normal", label: "Normal" },
  { id: "high", label: "High" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["id"];
export type EventKind = (typeof EVENT_KINDS)[number]["id"];
export type Priority = (typeof PRIORITIES)[number]["id"];

export function categoryLabel(id: string): string {
  if (id.startsWith("custom:")) return id.slice("custom:".length) || "Custom";
  return (
    TASK_CATEGORIES.find((item) => item.id === id)?.label ??
    TEMPLATE_CATEGORIES.find((item) => item.id === id)?.label ??
    "Miscellaneous"
  );
}

export function eventKindLabel(id: string): string {
  if (id.startsWith("custom:")) return id.slice("custom:".length) || "Custom";
  return EVENT_KINDS.find((item) => item.id === id)?.label ?? "Event";
}

export function isTaskCategory(id: string): id is TaskCategory {
  return TASK_CATEGORIES.some((item) => item.id === id) || id.startsWith("custom:") && id.length > "custom:".length;
}

export function isEventKind(id: string): id is EventKind {
  return EVENT_KINDS.some((item) => item.id === id) || id.startsWith("custom:") && id.length > "custom:".length;
}

export function isPriority(id: string): id is Priority {
  return PRIORITIES.some((item) => item.id === id);
}

export function isTemplateCategory(id: string): boolean {
  return TEMPLATE_CATEGORIES.some((item) => item.id === id) || id.startsWith("custom:") && id.length > "custom:".length;
}
