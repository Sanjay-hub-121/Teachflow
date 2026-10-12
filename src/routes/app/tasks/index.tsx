import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { attempt } from "@/components/tf/actions";
import { TaskFields, TaskSummary } from "@/components/tf/task-form";
import { blankTask, payloadFromDraft, type TaskDraft, type TaskItem } from "@/components/tf/types";
import { Button, Card, Empty, Field, LoadGate, PageHeader, Select, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { PRIORITIES, TASK_CATEGORIES } from "@/lib/teachflow/categories";
import { listTemplates } from "@/lib/teachflow/server/library.functions";
import { createTask, listTasks, setTaskStatus } from "@/lib/teachflow/server/tasks.functions";

export const Route = createFileRoute("/app/tasks/")({ component: TasksPage });

const VIEWS = [
  ["all", "Everything"],
  ["today", "Today"],
  ["upcoming", "Upcoming"],
  ["overdue", "Overdue"],
  ["completed", "Completed"],
] as const;

function TasksPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<(typeof VIEWS)[number][0]>("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("due");
  const [draft, setDraft] = useState<TaskDraft>(blankTask());
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(q.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [q]);

  const listed = useData(
    () => listTasks({ data: { view, q: query, category, priority, sort } }),
    [view, query, category, priority, sort],
  );
  const templates = useData(() => listTemplates({ data: { archived: false } }), []);

  const toggle = async (task: TaskItem) => {
    setBusyId(task.id);
    const next = await attempt(() =>
      setTaskStatus({
        data: { id: task.id, version: task.version, status: task.status === "completed" ? "open" : "completed" },
      }),
    );
    setBusyId("");
    if (next) listed.reload();
  };

  return (
    <>
      <PageHeader
        title="Tasks"
        lede="Your own list. Search looks through titles, descriptions, and notes."
        action={<Button onClick={() => setOpen((value) => !value)}>{open ? "Close form" : "New task"}</Button>}
      />
      {open ? (
        <Card className="mb-5">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              void attempt(() => createTask({ data: payloadFromDraft(draft) }), "Task saved").then(async (created) => {
                setBusy(false);
                if (!created) return;
                setDraft(blankTask());
                setOpen(false);
                await navigate({ to: "/app/tasks/$taskId", params: { taskId: created.id } });
              });
            }}
          >
            <TaskFields
              draft={draft}
              onChange={setDraft}
              mode="create"
              templates={(templates.data ?? []).map((item) => ({ id: item.id, name: item.name }))}
            />
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save task"}</Button>
          </form>
        </Card>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-2">
        {VIEWS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm font-semibold ${view === id ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Field label="Search">
          <TextInput value={q} onChange={(event) => setQ(event.target.value)} placeholder="Title or note" />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any</option>
            {TASK_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Priority">
          <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">Any</option>
            {PRIORITIES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Sort">
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
            <option value="updated">Recently changed</option>
            <option value="title">Title</option>
          </Select>
        </Field>
      </div>
      <LoadGate status={listed.status} error={listed.error} label="Loading tasks">
        {listed.data && listed.data.tasks.length === 0 ? (
          <Empty title="No tasks in this view" body="Change the filters, or add a task when you are ready. Nothing here is a sample." />
        ) : (
          <div className="space-y-2">
            {listed.data?.tasks.map((task) => (
              <TaskSummary
                key={task.id}
                task={task}
                timeZone={listed.data?.timezone ?? "UTC"}
                busy={busyId === task.id}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </LoadGate>
    </>
  );
}
