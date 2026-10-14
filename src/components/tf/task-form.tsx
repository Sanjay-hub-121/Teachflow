import { Link } from "@tanstack/react-router";
import { EVENT_KINDS, PRIORITIES, TASK_CATEGORIES, categoryLabel } from "@/lib/teachflow/categories";
import type { TaskDraft, TaskItem } from "./types";
import { dueLabel } from "./task-form-utils";
import { Button, Field, Select, Status, TextArea, TextInput } from "./ui";

export function TaskSummary({
  task,
  timeZone,
  busy,
  onToggle,
}: {
  task: TaskItem;
  timeZone: string;
  busy?: boolean;
  onToggle?: (task: TaskItem) => void;
}) {
  const done = task.subtasks.filter((item) => item.done).length;
  return (
    <article className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-line bg-card px-4 py-3">
      <div className="min-w-0">
        <Link to="/app/tasks/$taskId" params={{ taskId: task.id }} className="font-semibold text-ink hover:underline">
          {task.title}
        </Link>
        <p className="mt-1 text-sm text-muted">
          {categoryLabel(task.category)} · {dueLabel(task.dueDate, task.dueTime, timeZone)}
          {task.subtasks.length ? ` · ${done} of ${task.subtasks.length} steps` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Status status={task.status === "open" && task.priority === "high" ? "high" : task.status} />
        {onToggle ? (
          <Button variant="secondary" disabled={busy} onClick={() => onToggle(task)}>
            {task.status === "completed" ? "Reopen" : "Mark done"}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function TaskFields({
  draft,
  onChange,
  templates,
  mode,
}: {
  draft: TaskDraft;
  onChange: (next: TaskDraft) => void;
  templates: { id: string; name: string }[];
  mode: "create" | "edit";
}) {
  const set = (patch: Partial<TaskDraft>) => onChange({ ...draft, ...patch });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Title">
        <TextInput value={draft.title} required maxLength={160} onChange={(event) => set({ title: event.target.value })} />
      </Field>
      <Field label="Category">
        <Select value={draft.category.startsWith("custom:") ? "custom" : draft.category} onChange={(event) => set({ category: event.target.value === "custom" ? "custom:" : event.target.value })}>
          {TASK_CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </Select>
      </Field>
      {draft.category.startsWith("custom:") ? (
        <Field label="Custom work name">
          <TextInput
            required
            autoFocus
            value={draft.category.slice("custom:".length)}
            placeholder="e.g. Science fair planning"
            onChange={(event) => set({ category: `custom:${event.target.value.trim()}` })}
          />
        </Field>
      ) : null}
      <div className="sm:col-span-2">
        <Field label="What has to happen">
          <TextArea value={draft.description} onChange={(event) => set({ description: event.target.value })} />
        </Field>
      </div>
      <Field label="Priority">
        <Select value={draft.priority} onChange={(event) => set({ priority: event.target.value })}>
          {PRIORITIES.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </Select>
      </Field>
      <Field label="Linked template" hint="Optional. Generating a document does not complete the task.">
        <Select value={draft.templateId} onChange={(event) => set({ templateId: event.target.value })}>
          <option value="">None</option>
          {templates.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </Select>
      </Field>
      <Field label="Due date">
        <TextInput type="date" value={draft.dueDate} onChange={(event) => set({ dueDate: event.target.value })} />
      </Field>
      <Field label="Due time" hint="Leave blank to use the end of your working day for reminders.">
        <TextInput type="time" value={draft.dueTime} onChange={(event) => set({ dueTime: event.target.value })} />
      </Field>
      <Field label="Estimated minutes">
        <TextInput inputMode="numeric" value={draft.estimatedMinutes} onChange={(event) => set({ estimatedMinutes: event.target.value })} />
      </Field>
      {mode === "edit" ? (
        <Field label="Minutes it actually took">
          <TextInput inputMode="numeric" value={draft.actualMinutes} onChange={(event) => set({ actualMinutes: event.target.value })} />
        </Field>
      ) : (
        <Field label="Add to calendar">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-primary" checked={draft.addToCalendar} onChange={(event) => set({ addToCalendar: event.target.checked })} />
            Put this due date on the calendar
          </label>
        </Field>
      )}
      {mode === "create" && draft.addToCalendar ? (
        <Field label="Calendar type">
          <Select value={draft.eventKind} onChange={(event) => set({ eventKind: event.target.value })}>
            {EVENT_KINDS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </Select>
        </Field>
      ) : null}
      <Field label="Reminder">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={draft.remind} onChange={(event) => set({ remind: event.target.checked })} />
          Remind me before this is due
        </label>
      </Field>
      <Field label="Minutes before" hint="Blank uses the default from Settings.">
        <TextInput inputMode="numeric" value={draft.reminderLeadMinutes} onChange={(event) => set({ reminderLeadMinutes: event.target.value })} disabled={!draft.remind} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Private notes">
          <TextArea value={draft.notes} onChange={(event) => set({ notes: event.target.value })} />
        </Field>
      </div>
    </div>
  );
}
