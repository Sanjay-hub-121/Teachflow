import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { attempt } from "@/components/tf/actions";
import { dueLabel } from "@/components/tf/task-form-utils";
import type { TaskItem } from "@/components/tf/types";
import { Button, Card, Empty, LoadGate, PageHeader, Status } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { categoryLabel, eventKindLabel } from "@/lib/teachflow/categories";
import { getDashboard, setTaskStatus } from "@/lib/teachflow/server/tasks.functions";
import { formatWhen } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/")({ component: TodayPage });

function greeting(name: string) {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = name.trim().split(/\s+/)[0];
  return first ? `${hello}, ${first}` : hello;
}

function TodayPage() {
  const dash = useData(() => getDashboard(), []);
  const [busyId, setBusyId] = useState("");

  const toggle = async (task: TaskItem) => {
    setBusyId(task.id);
    const next = await attempt(() =>
      setTaskStatus({
        data: {
          id: task.id,
          version: task.version,
          status: task.status === "completed" ? "open" : "completed",
        },
      }),
    );
    setBusyId("");
    if (next) dash.reload();
  };

  return (
    <LoadGate status={dash.status} error={dash.error} label="Loading today">
      {dash.data ? (
        <>
          <PageHeader
            title={greeting(dash.data.greetingName)}
            lede={`${dash.data.today} in your time zone. Marking something done only updates your own list.`}
            action={
              <Link to="/app/tasks" className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-ink">
                New task
              </Link>
            }
          />
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted">Open</p>
              <p className="font-display text-3xl">{dash.data.progress.open}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Finished in 7 days</p>
              <p className="font-display text-3xl">{dash.data.progress.done}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Unread alerts</p>
              <p className="font-display text-3xl">{dash.data.unread}</p>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <TaskGroup title="Overdue" tasks={dash.data.overdue} timeZone={dash.data.timezone} busyId={busyId} onToggle={toggle} tone="warn" />
              <TaskGroup title="Due today" tasks={dash.data.todayTasks} timeZone={dash.data.timezone} busyId={busyId} onToggle={toggle} />
              <TaskGroup title="Coming up" tasks={dash.data.upcoming} timeZone={dash.data.timezone} busyId={busyId} onToggle={toggle} />
              <TaskGroup title="No date yet" tasks={dash.data.undated} timeZone={dash.data.timezone} busyId={busyId} onToggle={toggle} />
              {dash.data.overdue.length + dash.data.todayTasks.length + dash.data.upcoming.length + dash.data.undated.length === 0 ? (
                <Empty
                  title="Nothing dated is waiting"
                  body="Add a task with a due date when you want it on this desk. Undated work stays in Tasks."
                  action={
                    <Link to="/app/tasks" className="font-semibold text-primary">
                      Open tasks
                    </Link>
                  }
                />
              ) : null}
            </div>
            <div className="space-y-4">
              <EventList title="Examinations" items={dash.data.exams} timeZone={dash.data.timezone} />
              <EventList title="Meetings" items={dash.data.meetings} timeZone={dash.data.timezone} />
              <EventList title="Other dates" items={dash.data.academic} timeZone={dash.data.timezone} />
              <Card>
                <h2 className="font-display text-2xl">Templates</h2>
                {dash.data.templates.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">A question paper or lesson plan you approve can be filled again next term.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {dash.data.templates.map((item) => (
                      <li key={item.id}>
                        <Link to="/app/templates/$templateId" params={{ templateId: item.id }} className="text-sm font-semibold text-primary">
                          {item.name}
                        </Link>
                        <span className="ml-2"><Status status={item.status} /></span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <h2 className="font-display text-2xl">Recent documents</h2>
                {dash.data.documents.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">Generated files will show up here. Downloading one does not close a task.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {dash.data.documents.map((doc) => (
                      <li key={doc.id}>
                        <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="text-sm font-semibold text-primary">
                          {doc.filename}
                        </Link>
                        <span className="ml-2"><Status status={doc.status} /></span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </LoadGate>
  );
}

function TaskGroup({
  title,
  tasks,
  timeZone,
  busyId,
  onToggle,
  tone,
}: {
  title: string;
  tasks: TaskItem[];
  timeZone: string;
  busyId: string;
  onToggle: (task: TaskItem) => void;
  tone?: "warn";
}) {
  if (tasks.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 font-display text-2xl">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <article key={task.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${tone === "warn" ? "border-clay bg-clay-soft" : "border-line bg-card"}`}>
            <div className="min-w-0">
              <Link to="/app/tasks/$taskId" params={{ taskId: task.id }} className="font-semibold">
                {task.title}
              </Link>
              <p className="text-sm text-muted">
                {categoryLabel(task.category)} · {dueLabel(task.dueDate, task.dueTime, timeZone)}
              </p>
            </div>
            <Button variant="secondary" disabled={busyId === task.id} onClick={() => onToggle(task)}>
              Mark done
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventList({
  title,
  items,
  timeZone,
}: {
  title: string;
  items: { id: string; title: string; kind: string; startsAt: string }[];
  timeZone: string;
}) {
  return (
    <Card>
      <h2 className="font-display text-2xl">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">None coming up.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <Link to="/app/calendar" className="font-semibold text-ink">
                {item.title}
              </Link>
              <p className="text-muted">
                {eventKindLabel(item.kind)} · {formatWhen(item.startsAt, timeZone)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
