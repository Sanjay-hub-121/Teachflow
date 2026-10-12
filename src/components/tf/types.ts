export type TaskItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string | null;
  dueTime: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  notes: string;
  calendarEventId: string | null;
  templateId: string | null;
  templateName: string | null;
  remind: boolean;
  reminderLeadMinutes: number | null;
  version: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: { id: string; title: string; done: boolean; sortOrder: number }[];
  documents?: { id: string; filename: string; format: string; status: string; createdAt: string }[];
};

export type TaskDraft = {
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  estimatedMinutes: string;
  actualMinutes: string;
  notes: string;
  templateId: string;
  remind: boolean;
  reminderLeadMinutes: string;
  addToCalendar: boolean;
  eventKind: string;
};

export function blankTask(): TaskDraft {
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
    eventKind: "academic",
  };
}

export function draftFromTask(task: TaskItem): TaskDraft {
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
    eventKind: "academic",
  };
}

function clock(value: string) {
  return value.length > 5 ? value.slice(0, 5) : value;
}

export function payloadFromDraft(draft: TaskDraft, extra?: { id: string; version: number }) {
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
    eventKind: draft.eventKind,
  };
}
