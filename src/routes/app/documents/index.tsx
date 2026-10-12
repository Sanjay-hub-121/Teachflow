import { createFileRoute, Link } from "@tanstack/react-router";
import { Empty, LoadGate, PageHeader, Status } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { listDocuments } from "@/lib/teachflow/server/library.functions";
import { formatWhen } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/documents/")({ component: DocumentsPage });

function DocumentsPage() {
  const listed = useData(() => listDocuments(), []);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <>
      <PageHeader title="Documents" lede="Files you generated from templates. A download does not close the task it was attached to." />
      <LoadGate status={listed.status} error={listed.error} label="Loading documents">
        {listed.data && listed.data.length === 0 ? (
          <Empty title="No documents yet" body="Approve a template, then fill a copy. The original file stays in Templates." />
        ) : (
          <ul className="space-y-2">
            {listed.data?.map((doc) => (
              <li key={doc.id} className="rounded-lg border border-line bg-card px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link to="/app/documents/$documentId" params={{ documentId: doc.id }} className="font-semibold">
                    {doc.filename}
                  </Link>
                  <Status status={doc.status} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  {doc.format}
                  {doc.templateName ? ` · ${doc.templateName}` : ""}
                  {doc.taskTitle ? ` · ${doc.taskTitle}` : ""}
                  {doc.createdAt ? ` · ${formatWhen(doc.createdAt, zone)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </LoadGate>
    </>
  );
}
