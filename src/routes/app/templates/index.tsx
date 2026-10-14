import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { attempt } from "@/components/tf/actions";
import { fileToBase64 } from "@/components/tf/files";
import { Button, Card, Empty, Field, LoadGate, PageHeader, Select, Status, TextInput } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { TEMPLATE_CATEGORIES, categoryLabel } from "@/lib/teachflow/categories";
import { createStarter, listTemplates, uploadTemplate } from "@/lib/teachflow/server/library.functions";

export const Route = createFileRoute("/app/templates/")({ component: TemplatesPage });

const STARTERS = [
  ["question-paper", "Question paper"],
  ["lesson-plan", "Lesson plan"],
  ["worksheet", "Worksheet"],
  ["meeting", "Meeting agenda"],
  ["report", "Report"],
] as const;

const MAX_UPLOAD = 3_000_000;

function TemplatesPage() {
  const navigate = useNavigate();
  const [archived, setArchived] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState("");
  const listed = useData(() => listTemplates({ data: { archived } }), [archived]);

  const go = async (id: string) => {
    await navigate({ to: "/app/templates/$templateId", params: { templateId: id } });
  };

  return (
    <>
      <PageHeader
        title="Templates"
        lede="Start from a blank school document, or upload one you already use. Approve the fields before you fill it again."
      />
      <Card className="mb-5">
        <h2 className="font-display text-2xl">Starters</h2>
        <p className="mt-1 text-sm text-muted">These are ready to fill. You can still change the fields.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STARTERS.map(([kind, label]) => (
            <Button
              key={kind}
              variant="secondary"
              disabled={busy !== ""}
              onClick={() => {
                setBusy(kind);
                void attempt(() => createStarter({ data: { kind } })).then(async (created) => {
                  setBusy("");
                  if (created) await go(created.id);
                });
              }}
            >
              {busy === kind ? "Creating…" : label}
            </Button>
          ))}
        </div>
      </Card>
      <Card className="mb-5">
        <h2 className="font-display text-2xl">Upload a file</h2>
        <p className="mt-1 text-sm text-muted">Word, Excel, PowerPoint, or PDF, up to 3 MB. Formulas in a spreadsheet are left alone.</p>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!file) return;
            if (file.size > MAX_UPLOAD) return;
            setBusy("upload");
            void fileToBase64(file).then((base64) =>
              attempt(() =>
                uploadTemplate({
                  data: {
                    filename: file.name,
                    base64,
                    name: name || file.name.replace(/\.[^.]+$/, ""),
                    category,
                    description,
                  },
                }),
              ),
            ).then(async (created) => {
              setBusy("");
              if (!created) return;
              setFile(null);
              setName("");
              setDescription("");
              await go(created.id);
            });
          }}
        >
          <Field label="Name">
            <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Optional" />
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              {TEMPLATE_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="File">
            <TextInput
              type="file"
              accept=".docx,.xlsx,.pptx,.pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Field>
          <Field label="Note">
            <TextInput value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          {file && file.size > MAX_UPLOAD ? <p className="text-sm text-danger sm:col-span-2">That file is over 3 MB. Choose a smaller file so it can be uploaded safely.</p> : null}
          <Button type="submit" disabled={!file || busy === "upload" || (file?.size ?? 0) > MAX_UPLOAD}>
            {busy === "upload" ? "Reading the file…" : "Upload"}
          </Button>
        </form>
      </Card>
      <div className="mb-3">
        <Button variant="secondary" onClick={() => setArchived((value) => !value)}>
          {archived ? "Show active templates" : "Show archived"}
        </Button>
      </div>
      <LoadGate status={listed.status} error={listed.error} label="Loading templates">
        {listed.data && listed.data.length === 0 ? (
          <Empty title={archived ? "No archived templates" : "No templates yet"} body="Create a starter or upload a file you already trust." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {listed.data?.map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-lg border border-line bg-card p-4 text-left"
                onClick={() => void go(item.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-2xl">{item.name}</h2>
                  <Status status={item.status} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  {categoryLabel(item.category)}
                  {item.format ? ` · ${item.format}` : ""}
                  {item.version ? ` · version ${item.version}` : ""}
                </p>
                {item.description ? <p className="mt-2 text-sm text-ink-soft">{item.description}</p> : null}
              </button>
            ))}
          </div>
        )}
      </LoadGate>
    </>
  );
}
