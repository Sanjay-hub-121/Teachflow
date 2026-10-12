import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { attempt } from "@/components/tf/actions";
import { TaskFields } from "@/components/tf/task-form";
import { draftFromTask, payloadFromDraft, type TaskDraft } from "@/components/tf/types";
import { Button, Card, Field, LoadGate, Notice, PageHeader, Status, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { listTemplates } from "@/lib/teachflow/server/library.functions";
import { addSubtask, deleteSubtask, deleteTask, getTask, setTaskStatus, toggleSubtask, updateTask } from "@/lib/teachflow/server/tasks.functions";

export const Route = createFileRoute("/app/tasks/$taskId")({ component: TaskPage });

function TaskPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const loaded = useData(() => getTask({ data: { id: taskId } }), [taskId]);
  const templates = useData(() => listTemplates({ data: { archived: false } }), []);
  const [draft, setDraft] = useState<TaskDraft | null>(null);
  const [step, setStep] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [seen, setSeen] = useState<string>("");
  const version = loaded.data ? `${loaded.data.id}:${loaded.data.version}` : "";
  if (loaded.data && seen !== version) {
    setDraft(draftFromTask(loaded.data));
    setSeen(version);
  }

  if (!draft && loaded.status !== "ready") {
    return <LoadGate status={loaded.status} error={loaded.error} label="Loading task">{null}</LoadGate>;
  }
  if (!loaded.data || !draft) {
    return loaded.status === "error" ? <Notice>{loaded.error}</Notice> : <LoadGate status="loading" error="" label="Loading task">{null}</LoadGate>;
  }

  const task = loaded.data;
  return (
    <>
      <PageHeader
        title={task.title}
        lede="Edits are saved when you press Save. A document made from the linked template stays separate from done."
        action={<Status status={task.status} />}
      />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              void attempt(
                () => updateTask({ data: payloadFromDraft(draft, { id: task.id, version: task.version }) }),
                "Saved",
              ).then((next) => {
                setBusy(false);
                if (next) loaded.reload();
              });
            }}
          >
            <TaskFields
              draft={draft}
              onChange={setDraft}
              mode="edit"
              templates={(templates.data ?? []).map((item) => ({ id: item.id, name: item.name }))}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  void attempt(() =>
                    setTaskStatus({
                      data: {
                        id: task.id,
                        version: task.version,
                        status: task.status === "completed" ? "open" : "completed",
                        actualMinutes: draft.actualMinutes === "" ? null : Number(draft.actualMinutes),
                      },
                    }),
                  ).then((next) => {
                    setBusy(false);
                    if (next) loaded.reload();
                  });
                }}
              >
                {task.status === "completed" ? "Reopen" : "Mark done"}
              </Button>
            </div>
          </form>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl">Steps</h2>
            <ul className="mt-3 space-y-2">
              {task.subtasks.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <label className="flex min-h-11 flex-1 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={item.done}
                      onChange={() => {
                        void attempt(() => toggleSubtask({ data: { id: item.id, done: !item.done } })).then((next) => {
                          if (next) loaded.reload();
                        });
                      }}
                    />
                    <span className={item.done ? "text-muted line-through" : ""}>{item.title}</span>
                  </label>
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={() => {
                      void attempt(() => deleteSubtask({ data: { id: item.id } })).then((next) => {
                        if (next) loaded.reload();
                      });
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 space-y-2"
              onSubmit={(event) => {
                event.preventDefault();
                const title = step.trim();
                if (!title) return;
                void attempt(() => addSubtask({ data: { taskId: task.id, title } })).then((next) => {
                  if (!next) return;
                  setStep("");
                  loaded.reload();
                });
              }}
            >
              <Field label="Add a step">
                <TextInput value={step} onChange={(event) => setStep(event.target.value)} />
              </Field>
              <Button type="submit" variant="secondary">Add</Button>
            </form>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Documents</h2>
            {task.templateId ? (
              <p className="mt-2 text-sm">
                <Link to="/app/templates/$templateId" params={{ templateId: task.templateId }} className="font-semibold text-primary">
                  {task.templateName ?? "Open the linked template"}
                </Link>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">No template is linked.</p>
            )}
            <ul className="mt-3 space-y-2 text-sm">
              {(task.documents ?? []).map((doc) => (
                <li key={doc.id}>
                  <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-semibold text-primary">
                    {doc.filename}
                  </Link>
                  <span className="ml-2"><Status status={doc.status} /></span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            {confirmDelete ? (
              <div className="space-y-3">
                <p className="text-sm">Delete “{task.title}”? Linked reminders go with it. Documents stay in your library.</p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={() => {
                      void attempt(() => deleteTask({ data: { id: task.id } })).then(async (next) => {
                        if (next) await navigate({ to: "/app/tasks" });
                      });
                    }}
                  >
                    Delete task
                  </Button>
                  <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Keep it</Button>
                </div>
              </div>
            ) : (
              <Button variant="quiet" onClick={() => setConfirmDelete(true)}>Delete task</Button>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
