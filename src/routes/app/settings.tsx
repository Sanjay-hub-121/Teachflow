import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { attempt } from "@/components/tf/actions";
import { Button, Card, Field, LoadGate, Notice, PageHeader, Select, TextArea, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { signOut } from "@/lib/auth/client";
import {
  deleteAccount,
  getAccount,
  listSessions,
  revokeSession,
  rotateRecoveryCode,
  updateAccount,
} from "@/lib/teachflow/server/account.functions";
import { formatWhen } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

const ZONES = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
  "Africa/Johannesburg",
  "Pacific/Auckland",
];

type Account = Awaited<ReturnType<typeof getAccount>>;

function SettingsPage() {
  const loaded = useData(() => getAccount(), []);
  const sessions = useData(() => listSessions(), []);
  const [form, setForm] = useState<Account | null>(null);
  const [seen, setSeen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [emailConfirm, setEmailConfirm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (loaded.data && !seen) {
    setForm(loaded.data);
    setSeen(true);
  }

  if (!form) return <LoadGate status={loaded.status === "ready" ? "loading" : loaded.status} error={loaded.error} label="Loading settings">{null}</LoadGate>;

  const zones = form.timezone && !ZONES.includes(form.timezone) ? [form.timezone, ...ZONES] : ZONES;
  const set = (patch: Partial<Account>) => setForm({ ...form, ...patch });

  return (
    <>
      <PageHeader
        title="Settings"
        lede="Your profile, quiet hours, and the devices signed in to this account."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              const data = {
                ...form,
                workStart: form.workStart.slice(0, 5),
                workEnd: form.workEnd.slice(0, 5),
                quietStart: form.quietStart.slice(0, 5),
                quietEnd: form.quietEnd.slice(0, 5),
              };
              void attempt(() => updateAccount({ data }), "Saved").then(() => setBusy(false));
            }}
          >
            <Field label="Name">
              <TextInput value={form.fullName} onChange={(event) => set({ fullName: event.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput value={form.email} readOnly />
            </Field>
            <Field label="Institution">
              <TextInput value={form.institution} onChange={(event) => set({ institution: event.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Department">
                <TextInput value={form.department} onChange={(event) => set({ department: event.target.value })} />
              </Field>
              <Field label="Role">
                <TextInput value={form.designation} onChange={(event) => set({ designation: event.target.value })} />
              </Field>
              <Field label="Subjects">
                <TextInput value={form.subjects} onChange={(event) => set({ subjects: event.target.value })} />
              </Field>
              <Field label="Classes">
                <TextInput value={form.grades} onChange={(event) => set({ grades: event.target.value })} />
              </Field>
            </div>
            <Field label="Time zone">
              <Select value={form.timezone} onChange={(event) => set({ timezone: event.target.value })}>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Work starts">
                <TextInput type="time" value={form.workStart} onChange={(event) => set({ workStart: event.target.value })} />
              </Field>
              <Field label="Work ends" hint="Used when a task has a date but no clock time.">
                <TextInput type="time" value={form.workEnd} onChange={(event) => set({ workEnd: event.target.value })} />
              </Field>
              <Field label="Quiet from">
                <TextInput type="time" value={form.quietStart} onChange={(event) => set({ quietStart: event.target.value })} />
              </Field>
              <Field label="Quiet until" hint="A reminder that lands here waits until quiet hours end.">
                <TextInput type="time" value={form.quietEnd} onChange={(event) => set({ quietEnd: event.target.value })} />
              </Field>
            </div>
            <Field label="Default reminder, in minutes">
              <TextInput
                inputMode="numeric"
                value={String(form.reminderLeadMinutes)}
                onChange={(event) => set({ reminderLeadMinutes: Number(event.target.value) })}
              />
            </Field>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={form.remindersEnabled}
                onChange={(event) => set({ remindersEnabled: event.target.checked })}
              />
              Reminders on
            </label>
            <Field label="A note for yourself" hint="Saved on your profile. It is not inserted into generated files.">
              <TextArea value={form.docNote} onChange={(event) => set({ docNote: event.target.value })} />
            </Field>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save settings"}</Button>
          </form>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl">Devices</h2>
            <LoadGate status={sessions.status} error={sessions.error} label="Loading devices">
              <ul className="mt-3 space-y-3">
                {(sessions.data ?? []).map((session) => (
                  <li key={session.id} className="text-sm">
                    <p className="font-semibold">{session.current ? "This device" : "Other device"}</p>
                    <p className="text-muted">{session.userAgent}</p>
                    <p className="text-muted">Signed in {formatWhen(session.createdAt, form.timezone)}</p>
                    {session.current ? null : (
                      <Button
                        variant="quiet"
                        onClick={() => {
                          void attempt(() => revokeSession({ data: { id: session.id } })).then((next) => {
                            if (next) sessions.reload();
                          });
                        }}
                      >
                        Sign that device out
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-3"
                variant="secondary"
                onClick={() => {
                  void attempt(() => revokeSession({ data: { others: true } }), "Other devices were signed out").then((next) => {
                    if (next) sessions.reload();
                  });
                }}
              >
                Sign out other devices
              </Button>
            </LoadGate>
          </Card>
          {form.hasPassword ? (
            <Card>
              <h2 className="font-display text-2xl">Recovery code</h2>
              <p className="mt-1 text-sm text-muted">Email reset is not set up. A new code replaces the old one, and it is shown only once.</p>
              {code ? <p className="mt-3 rounded-md bg-paper px-3 py-3 text-center font-mono text-lg">{code}</p> : null}
              <Button
                className="mt-3"
                variant="secondary"
                onClick={() => {
                  void attempt(() => rotateRecoveryCode()).then((next) => {
                    if (next) setCode(next.recoveryCode);
                  });
                }}
              >
                Make a new recovery code
              </Button>
            </Card>
          ) : null}
          <Card>
            <h2 className="font-display text-2xl">Delete account</h2>
            <p className="mt-1 text-sm text-muted">This removes your tasks, templates, documents, and sign-in. It cannot be undone.</p>
            {confirmDelete ? (
              <form
                className="mt-3 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void attempt(() => deleteAccount({ data: { email: emailConfirm } })).then(async (next) => {
                    if (!next) return;
                    try {
                      await signOut("/");
                    } catch {
                      window.location.href = "/";
                    }
                  });
                }}
              >
                <Field label="Type your email to confirm">
                  <TextInput type="email" value={emailConfirm} onChange={(event) => setEmailConfirm(event.target.value)} />
                </Field>
                <div className="flex gap-2">
                  <Button type="submit" variant="danger">Delete account</Button>
                  <Button type="button" variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <Button className="mt-3" variant="quiet" onClick={() => setConfirmDelete(true)}>Delete account</Button>
            )}
          </Card>
        </div>
      </div>
      {loaded.error ? <div className="mt-4"><Notice>{loaded.error}</Notice></div> : null}
    </>
  );
}
