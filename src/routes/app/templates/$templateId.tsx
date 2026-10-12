import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { attempt } from "@/components/tf/actions";
import { FieldFillForm, FieldSchemaEditor } from "@/components/tf/fields-ui";
import { Button, Card, Field, LoadGate, Notice, PageHeader, Select, Status, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { TEMPLATE_CATEGORIES } from "@/lib/teachflow/categories";
import { emptyForm, type FieldDef, type FormValue } from "@/lib/teachflow/fields";
import { suggestTemplateFields } from "@/lib/teachflow/server/insights.functions";
import {
  duplicateTemplate,
  generateDocument,
  getTemplate,
  reanalyzeTemplate,
  saveTemplate,
  setTemplateStatus,
} from "@/lib/teachflow/server/library.functions";
import { listTasks } from "@/lib/teachflow/server/tasks.functions";

export const Route = createFileRoute("/app/templates/$templateId")({ component: TemplatePage });

type Meta = {
  name: string;
  description: string;
  category: string;
  subject: string;
  gradeLevel: string;
  manualMinutes: string;
};

function TemplatePage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const loaded = useData(() => getTemplate({ data: { id: templateId } }), [templateId]);
  const tasks = useData(() => listTasks({ data: { view: "all" } }), []);
  const [seen, setSeen] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [form, setForm] = useState<Record<string, FormValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taskId, setTaskId] = useState("");
  const [busy, setBusy] = useState("");
  const [suggestion, setSuggestion] = useState<FieldDef[] | null>(null);
  const [suggestionNote, setSuggestionNote] = useState("");
  const stamp = loaded.data ? `${loaded.data.id}:${loaded.data.version?.id ?? ""}:${loaded.data.status}` : "";
  if (loaded.data && seen !== stamp) {
    setSeen(stamp);
    setMeta({
      name: loaded.data.name,
      description: loaded.data.description,
      category: loaded.data.category,
      subject: loaded.data.subject,
      gradeLevel: loaded.data.gradeLevel,
      manualMinutes: loaded.data.manualMinutes == null ? "" : String(loaded.data.manualMinutes),
    });
    const nextFields = loaded.data.version?.fields ?? [];
    setFields(nextFields);
    setForm(emptyForm(nextFields));
    setSuggestion(null);
  }

  if (!loaded.data || !meta) {
    return <LoadGate status={loaded.status === "ready" ? "loading" : loaded.status} error={loaded.error} label="Loading template">{null}</LoadGate>;
  }

  const template = loaded.data;
  const ready = template.status === "ready";
  const notes = template.version?.analysis?.notes ?? [];

  const save = (event: FormEvent) => {
    event.preventDefault();
    setBusy("save");
    void attempt(
      () =>
        saveTemplate({
          data: {
            id: template.id,
            ...meta,
            manualMinutes: meta.manualMinutes === "" ? null : Number(meta.manualMinutes),
            fields: fields.map((field) => ({
              ...field,
              options: field.options?.map((option) => option.trim()).filter(Boolean),
            })),
          },
        }),
      "Template approved",
    ).then((next) => {
      setBusy("");
      if (next) loaded.reload();
    });
  };

  return (
    <>
      <PageHeader
        title={template.name}
        lede="Check every field before you approve it. Generating a file does not mark a task done."
        action={<Status status={template.status} />}
      />
      {template.version ? (
        <p className="mb-4 text-sm text-muted">
          {template.version.filename} · {template.version.format} · version {template.version.version}
        </p>
      ) : (
        <Notice>This template has no file yet.</Notice>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <form className="space-y-4" onSubmit={save}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <TextInput required value={meta.name} onChange={(event) => setMeta({ ...meta, name: event.target.value })} />
              </Field>
              <Field label="Category">
                <Select value={meta.category} onChange={(event) => setMeta({ ...meta, category: event.target.value })}>
                  {TEMPLATE_CATEGORIES.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Subject">
                <TextInput value={meta.subject} onChange={(event) => setMeta({ ...meta, subject: event.target.value })} />
              </Field>
              <Field label="Class">
                <TextInput value={meta.gradeLevel} onChange={(event) => setMeta({ ...meta, gradeLevel: event.target.value })} />
              </Field>
              <Field label="Minutes this usually takes" hint="Used only as your own estimate on Insights. Leave blank if you don't know.">
                <TextInput inputMode="numeric" value={meta.manualMinutes} onChange={(event) => setMeta({ ...meta, manualMinutes: event.target.value })} />
              </Field>
              <Field label="Description">
                <TextInput value={meta.description} onChange={(event) => setMeta({ ...meta, description: event.target.value })} />
              </Field>
            </div>
            <h2 className="font-display text-2xl">Fields</h2>
            <FieldSchemaEditor fields={fields} onChange={setFields} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy === "save"}>{busy === "save" ? "Saving…" : ready ? "Save a new version" : "Approve template"}</Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy !== ""}
                onClick={() => {
                  setBusy("read");
                  void attempt(() => reanalyzeTemplate({ data: { id: template.id } })).then((next) => {
                    setBusy("");
                    if (next) loaded.reload();
                  });
                }}
              >
                Read the file again
              </Button>
            </div>
          </form>
          {notes.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          {template.version?.analysis?.textPreview ? (
            <details className="mt-4">
              <summary className="min-h-11 cursor-pointer text-sm font-semibold">Text found in the file</summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-paper p-3 text-sm text-ink-soft">
                {template.version.analysis.textPreview.slice(0, 4000)}
              </pre>
            </details>
          ) : null}
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl">Suggestions</h2>
            <p className="mt-1 text-sm text-muted">Detected fields come from the file. The assistant only suggests — it does not approve anything.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={!template.version?.analysis?.suggested?.length}
                onClick={() => {
                  setSuggestion(template.version?.analysis?.suggested ?? []);
                  setSuggestionNote("Taken from the file. Check them before you approve.");
                }}
              >
                Use detected fields
              </Button>
              <Button
                variant="secondary"
                disabled={busy === "ai"}
                onClick={() => {
                  setBusy("ai");
                  void suggestTemplateFields({ data: { id: template.id } })
                    .then((result) => {
                      if (!result.ok) {
                        setSuggestionNote(result.error);
                        setSuggestion(null);
                        return;
                      }
                      setSuggestion(result.fields);
                      setSuggestionNote(result.note);
                    })
                    .catch(() => setSuggestionNote("The assistant could not answer just now."))
                    .finally(() => setBusy(""));
                }}
              >
                {busy === "ai" ? "Asking…" : "Ask the assistant"}
              </Button>
            </div>
            {suggestionNote ? <p className="mt-3 text-sm text-muted">{suggestionNote}</p> : null}
            {suggestion ? (
              <div className="mt-3 space-y-2">
                <ul className="text-sm">
                  {suggestion.map((field) => (
                    <li key={field.key}>{field.label} · {field.type}{field.required ? " · required" : ""}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => {
                    setFields(suggestion);
                    setForm(emptyForm(suggestion));
                    setSuggestion(null);
                  }}
                >
                  Replace current fields
                </Button>
              </div>
            ) : null}
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Fill a copy</h2>
            {ready ? (
              <form
                className="mt-3 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setBusy("fill");
                  setErrors({});
                  void generateDocument({
                    data: { templateId: template.id, taskId: taskId || null, data: form },
                  })
                    .then(async (result) => {
                      if (!result.ok) {
                        setErrors(result.errors ?? { form: "The document was not generated." });
                        return;
                      }
                      if (result.documentId) await navigate({ to: "/app/documents/$documentId", params: { documentId: result.documentId } });
                    })
                    .catch(() => setErrors({ form: "The document was not generated." }))
                    .finally(() => setBusy(""));
                }}
              >
                <Field label="Attach to a task" hint="Optional. The task stays open until you mark it done.">
                  <Select value={taskId} onChange={(event) => setTaskId(event.target.value)}>
                    <option value="">None</option>
                    {(tasks.data?.tasks ?? []).filter((task) => task.status === "open").map((task) => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </Select>
                </Field>
                <FieldFillForm fields={template.version?.fields ?? fields} value={form} errors={errors} onChange={setForm} />
                <Button type="submit" disabled={busy === "fill"}>{busy === "fill" ? "Generating…" : "Generate document"}</Button>
              </form>
            ) : (
              <p className="mt-2 text-sm text-muted">Approve the fields first. Nothing is generated from a template you have not checked.</p>
            )}
          </Card>
          <Card>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  void attempt(() => duplicateTemplate({ data: { id: template.id } })).then(async (copy) => {
                    if (copy) await navigate({ to: "/app/templates/$templateId", params: { templateId: copy.id } });
                  });
                }}
              >
                Duplicate
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const status = template.status === "archived" ? "ready" : "archived";
                  void attempt(() => setTemplateStatus({ data: { id: template.id, status } })).then((next) => {
                    if (next) loaded.reload();
                  });
                }}
              >
                {template.status === "archived" ? "Restore" : "Archive"}
              </Button>
            </div>
            {(template.documents ?? []).length ? (
              <ul className="mt-4 space-y-2 text-sm">
                {template.documents.map((doc) => (
                  <li key={doc.id}>
                    <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-semibold text-primary">
                      {doc.filename}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        </div>
      </div>
    </>
  );
}
