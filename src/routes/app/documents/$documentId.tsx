import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { saveFile } from "@/components/tf/files";
import { FieldFillForm } from "@/components/tf/fields-ui";
import { Button, Card, LoadGate, Notice, PageHeader, Status } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import type { FieldDef, FormValue } from "@/lib/teachflow/fields";
import { downloadDocument, generateDocument, getDocument, getTemplate } from "@/lib/teachflow/server/library.functions";
import { formatWhen } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/documents/$documentId")({ component: DocumentPage });

function fieldLabel(fields: FieldDef[], key: string) {
  return fields.find((field) => field.key === key)?.label ?? key.replaceAll("_", " ");
}

function formatEntered(fields: FieldDef[], key: string, value: FormValue) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (!Array.isArray(value)) return String(value ?? "");
  const children = fields.find((field) => field.key === key)?.itemFields ?? [];
  return value
    .map((row) => {
      const pairs = children.length
        ? children.map((child) => [child.label, row[child.key] ?? ""] as const)
        : Object.entries(row).map(([child, text]) => [child.replaceAll("_", " "), text] as const);
      return pairs.map(([label, text]) => `${label}: ${text}`).join(" · ");
    })
    .join("\n");
}

function DocumentPage() {
  const { documentId } = Route.useParams();
  const loaded = useData(() => getDocument({ data: { id: documentId } }), [documentId]);
  const templateId = loaded.data?.templateId ?? "";
  const template = useData(() => (templateId ? getTemplate({ data: { id: templateId } }) : Promise.resolve(null)), [templateId]);
  const [form, setForm] = useState<Record<string, FormValue> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [seen, setSeen] = useState("");
  const stamp = loaded.data ? `${loaded.data.id}:${loaded.data.status}` : "";
  if (loaded.data && seen !== stamp) {
    setSeen(stamp);
    setForm(loaded.data.form as Record<string, FormValue>);
  }
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!loaded.data || !form) {
    return <LoadGate status={loaded.status === "ready" ? "loading" : loaded.status} error={loaded.error} label="Loading document">{null}</LoadGate>;
  }
  const doc = loaded.data;
  const fields = template.data?.version?.fields ?? [];

  return (
    <>
      <PageHeader title={doc.filename} lede={formatWhen(doc.createdAt, zone)} action={<Status status={doc.status} />} />
      <div className="mb-4 space-y-1 text-sm text-muted">
        {doc.templateId ? (
          <p>
            Template:{" "}
            <Link to="/app/templates/$templateId" params={{ templateId: doc.templateId }} className="font-semibold text-primary">
              {doc.templateName ?? "Open template"}
            </Link>
          </p>
        ) : null}
        {doc.taskId ? (
          <p>
            Task:{" "}
            <Link to="/app/tasks/$taskId" params={{ taskId: doc.taskId }} className="font-semibold text-primary">
              {doc.taskTitle ?? "Open task"}
            </Link>
          </p>
        ) : null}
      </div>
      {doc.note ? <p className="mb-4 text-sm text-ink-soft">{doc.note}</p> : null}
      {doc.error ? <div className="mb-4"><Notice>{doc.error}</Notice></div> : null}
      <Card>
        {doc.status === "ready" ? (
          <Button
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void downloadDocument({ data: { id: doc.id } })
                .then((file) => saveFile(file.filename, file.mime, file.base64))
                .catch(() => setErrors({ form: "That document is not ready to download." }))
                .finally(() => setBusy(false));
            }}
          >
            {busy ? "Preparing…" : "Download"}
          </Button>
        ) : null}
        {doc.status === "failed" && fields.length && doc.templateId ? (
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setErrors({});
              void generateDocument({
                data: { templateId: doc.templateId!, documentId: doc.id, taskId: doc.taskId, data: form },
              })
                .then((result) => {
                  if (!result.ok) {
                    setErrors(result.errors ?? { form: "It still could not be generated." });
                    return;
                  }
                  loaded.reload();
                })
                .catch(() => setErrors({ form: "It still could not be generated." }))
                .finally(() => setBusy(false));
            }}
          >
            <h2 className="font-display text-2xl">Try again</h2>
            <FieldFillForm fields={fields} value={form} errors={errors} onChange={setForm} />
            <Button type="submit" disabled={busy}>{busy ? "Generating…" : "Generate again"}</Button>
          </form>
        ) : (
          <dl className="mt-4 space-y-3 text-sm">
            {Object.entries(doc.form).map(([key, value]) => (
              <div key={key}>
                <dt className="font-semibold text-ink-soft">{fieldLabel(fields, key)}</dt>
                <dd className="whitespace-pre-wrap text-ink">{formatEntered(fields, key, value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>
    </>
  );
}
