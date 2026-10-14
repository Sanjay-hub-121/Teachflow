import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { attempt } from "@/components/tf/actions";
import { Button, Card, Field, LoadGate, Notice, PageHeader, Select, TextArea, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { EVENT_KINDS, eventKindLabel } from "@/lib/teachflow/categories";
import { createEvent, deleteEvent, getCalendar, updateEvent } from "@/lib/teachflow/server/calendar.functions";
import { addDays, dayKeyInZone, formatDay, monthBounds, wallClock } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/calendar")({ component: CalendarPage });

type Draft = {
  id?: string;
  version?: number;
  title: string;
  description: string;
  kind: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  recurrence: string;
  recurrenceUntil: string;
  remind: boolean;
  reminderLeadMinutes: string;
};

function blank(day: string): Draft {
  return {
    title: "",
    description: "",
    kind: "academic",
    startDate: day,
    endDate: day,
    allDay: false,
    startTime: "09:00",
    endTime: "10:00",
    recurrence: "none",
    recurrenceUntil: "",
    remind: false,
    reminderLeadMinutes: "",
  };
}

function localDay() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weeksOf(year: number, month: number) {
  const { start, end } = monthBounds(year, month);
  const first = new Date(`${start}T12:00:00Z`).getUTCDay();
  let day = addDays(start, -((first + 6) % 7));
  const weeks: string[][] = [];
  while (weeks.length < 6) {
    const week: string[] = [];
    for (let index = 0; index < 7; index += 1) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
    if (week[6] >= end && weeks.length >= 4) break;
  }
  return weeks;
}

function splitInstant(iso: string, timeZone: string) {
  const wall = wallClock(new Date(iso), timeZone);
  const hh = String(Math.floor(wall.minutes / 60)).padStart(2, "0");
  const mm = String(wall.minutes % 60).padStart(2, "0");
  return { date: wall.date, time: `${hh}:${mm}` };
}

function CalendarPage() {
  const startDay = localDay();
  const [cursor, setCursor] = useState(() => {
    const [year, month] = startDay.split("-").map(Number);
    return { year, month: month - 1 };
  });
  const [selected, setSelected] = useState(startDay);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const weeks = useMemo(() => weeksOf(cursor.year, cursor.month), [cursor]);
  const rangeStart = weeks[0][0];
  const rangeEnd = weeks[weeks.length - 1][6];
  const cal = useData(() => getCalendar({ data: { start: rangeStart, end: rangeEnd } }), [rangeStart, rangeEnd]);
  const today = cal.data ? dayKeyInZone(new Date(), cal.data.timezone) : startDay;
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(cursor.year, cursor.month, 1)),
  );

  const shift = (delta: number) => {
    const next = new Date(Date.UTC(cursor.year, cursor.month + delta, 1));
    setCursor({ year: next.getUTCFullYear(), month: next.getUTCMonth() });
  };

  const eventsByDay = new Map<string, { id: string; title: string; kind: string }[]>();
  for (const item of cal.data?.occurrences ?? []) {
    const list = eventsByDay.get(item.day) ?? [];
    list.push({ id: item.eventId, title: item.title, kind: item.kind });
    eventsByDay.set(item.day, list);
  }
  const tasksByDay = new Map<string, { id: string; title: string; priority: string }[]>();
  for (const task of cal.data?.tasks ?? []) {
    const list = tasksByDay.get(task.dueDate) ?? [];
    list.push(task);
    tasksByDay.set(task.dueDate, list);
  }
  const dayEvents = (cal.data?.occurrences ?? []).filter((item) => item.day === selected);
  const dayTasks = (cal.data?.tasks ?? []).filter((task) => task.dueDate === selected);

  const openEvent = (eventId: string) => {
    const event = cal.data?.events.find((item) => item.id === eventId);
    if (!event || !cal.data) return;
    const start = splitInstant(event.startsAt, cal.data.timezone);
    const end = event.endsAt ? splitInstant(event.endsAt, cal.data.timezone) : start;
    setDraft({
      id: event.id,
      version: event.version,
      title: event.title,
      description: event.description,
      kind: event.kind,
      startDate: start.date,
      endDate: end.date,
      allDay: event.allDay,
      startTime: event.allDay ? "09:00" : start.time,
      endTime: event.allDay ? "10:00" : end.time,
      recurrence: event.recurrence,
      recurrenceUntil: event.recurrenceUntil ?? "",
      remind: event.remind,
      reminderLeadMinutes: event.reminderLeadMinutes == null ? "" : String(event.reminderLeadMinutes),
    });
    setSelected(start.date);
    setConfirmDelete(false);
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        lede="Exams, meetings, and deadlines in your time zone. Tasks with a due date appear even if they are not events."
        action={<Button onClick={() => setDraft(blank(selected))}>Add a date</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl">{monthLabel}</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => shift(-1)}>Previous</Button>
          <Button
            variant="secondary"
            onClick={() => {
              const [year, month, day] = today.split("-").map(Number);
              setCursor({ year, month: month - 1 });
              setSelected(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
            }}
          >
            Today
          </Button>
          <Button variant="secondary" onClick={() => shift(1)}>Next</Button>
        </div>
      </div>
      <LoadGate status={cal.status} error={cal.error} label="Loading the calendar">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <div key={label} className="py-1">{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day) => {
            const inMonth = Number(day.slice(5, 7)) === cursor.month + 1;
            const count = (eventsByDay.get(day)?.length ?? 0) + (tasksByDay.get(day)?.length ?? 0);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(day)}
                className={`min-h-16 rounded-md border px-1 py-1 text-left ${selected === day ? "border-primary bg-primary-soft" : "border-line bg-card"} ${inMonth ? "" : "opacity-50"}`}
              >
                <span className={`text-sm font-semibold ${day === today ? "text-primary" : "text-ink"}`}>{Number(day.slice(8))}</span>
                <span className="mt-1 hidden truncate text-xs text-ink-soft md:block">{eventsByDay.get(day)?.[0]?.title}</span>
                {count > 0 ? <span className="mt-1 block text-xs text-muted md:hidden">{count}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl">{formatDay(selected, cal.data?.timezone ?? "UTC")}</h2>
            {dayEvents.length === 0 && dayTasks.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nothing on this day.</p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {dayEvents.map((item) => (
                <li key={`${item.eventId}-${item.startsAt}`}>
                  <button type="button" className="min-h-11 text-left" onClick={() => openEvent(item.eventId)}>
                    <span className="block font-semibold">{item.title}</span>
                    <span className="text-sm text-muted">{eventKindLabel(item.kind)}{item.allDay ? " · all day" : ""}</span>
                  </button>
                </li>
              ))}
              {dayTasks.map((task) => (
                <li key={task.id}>
                  <Link to="/app/tasks/$taskId" params={{ taskId: task.id }} className="block min-h-11">
                    <span className="font-semibold">Due: {task.title}</span>
                    <span className="block text-sm text-muted">{task.dueTime ? `At ${task.dueTime}` : "No clock time"}{task.priority === "high" ? " · high priority" : ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          {draft ? (
            <Card>
              <h2 className="font-display text-2xl">{draft.id ? "Edit date" : "New date"}</h2>
              <form
                className="mt-3 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setBusy(true);
                  const data = {
                    id: draft.id,
                    version: draft.version,
                    title: draft.title,
                    description: draft.description,
                    kind: draft.kind,
                    startDate: draft.startDate,
                    endDate: draft.endDate || draft.startDate,
                    allDay: draft.allDay,
                    startTime: draft.startTime.slice(0, 5),
                    endTime: draft.endTime.slice(0, 5),
                    recurrence: draft.recurrence,
                    recurrenceUntil: draft.recurrenceUntil || null,
                    remind: draft.remind,
                    reminderLeadMinutes: draft.reminderLeadMinutes === "" ? null : Number(draft.reminderLeadMinutes),
                  };
                  void attempt(async () => {
                    if (draft.id) return updateEvent({ data });
                    return createEvent({ data });
                  }).then((saved) => {
                    setBusy(false);
                    if (!saved) return;
                    setDraft(null);
                    cal.reload();
                  });
                }}
              >
                <Field label="Title">
                  <TextInput required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
                </Field>
                <Field label="Type">
                  <Select value={draft.kind.startsWith("custom:") ? "custom" : draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value === "custom" ? "custom:" : event.target.value })}>
                    {EVENT_KINDS.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </Select>
                </Field>
                {draft.kind.startsWith("custom:") ? (
                  <Field label="Custom event name">
                    <TextInput required autoFocus value={draft.kind.slice("custom:".length)} placeholder="e.g. Science fair" onChange={(event) => setDraft({ ...draft, kind: `custom:${event.target.value.trim()}` })} />
                  </Field>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Starts">
                    <TextInput type="date" required value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} />
                  </Field>
                  <Field label="Ends">
                    <TextInput type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} />
                  </Field>
                </div>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-primary" checked={draft.allDay} onChange={(event) => setDraft({ ...draft, allDay: event.target.checked })} />
                  All day
                </label>
                {draft.allDay ? null : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Start time">
                      <TextInput type="time" value={draft.startTime} onChange={(event) => setDraft({ ...draft, startTime: event.target.value })} />
                    </Field>
                    <Field label="End time">
                      <TextInput type="time" value={draft.endTime} onChange={(event) => setDraft({ ...draft, endTime: event.target.value })} />
                    </Field>
                  </div>
                )}
                <Field label="Repeats">
                  <Select value={draft.recurrence} onChange={(event) => setDraft({ ...draft, recurrence: event.target.value })}>
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </Field>
                {draft.recurrence !== "none" ? (
                  <Field label="Repeat until" hint="Leave blank to keep showing it in the months you open.">
                    <TextInput type="date" value={draft.recurrenceUntil} onChange={(event) => setDraft({ ...draft, recurrenceUntil: event.target.value })} />
                  </Field>
                ) : null}
                <Field label="Notes">
                  <TextArea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
                </Field>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-primary" checked={draft.remind} onChange={(event) => setDraft({ ...draft, remind: event.target.checked })} />
                  Remind me
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save date"}</Button>
                  <Button type="button" variant="secondary" onClick={() => setDraft(null)}>Cancel</Button>
                </div>
                {draft.id ? (
                  confirmDelete ? (
                    <div className="space-y-2">
                      <Notice>Delete this date? A linked task stays on your list.</Notice>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => {
                          void attempt(() => deleteEvent({ data: { id: draft.id! } })).then((next) => {
                            if (!next) return;
                            setDraft(null);
                            cal.reload();
                          });
                        }}
                      >
                        Delete date
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="quiet" onClick={() => setConfirmDelete(true)}>Delete date</Button>
                  )
                ) : null}
              </form>
            </Card>
          ) : null}
        </div>
      </LoadGate>
    </>
  );
}
