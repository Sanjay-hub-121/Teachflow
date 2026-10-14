import { createFileRoute } from "@tanstack/react-router";
import { Card, LoadGate, PageHeader } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { getApiMonitor } from "@/lib/teachflow/server/insights.functions";

export const Route = createFileRoute("/app/api-monitor")({ component: ApiMonitorPage });

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

function ApiMonitorPage() {
  const monitor = useData(() => getApiMonitor(), []);

  return (
    <>
      <PageHeader
        title="API Monitor"
        lede="See which AI provider TeachFlow is using and how much Assistant activity this account has generated."
      />
      <LoadGate status={monitor.status} error={monitor.error} label="Loading API usage">
        {monitor.data ? (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Active provider</p>
              <h2 className="mt-2 font-display text-2xl text-ink">{monitor.data.provider}</h2>
              <p className="mt-1 break-words text-sm text-muted">{monitor.data.model}</p>
              <p className="mt-5 rounded-md bg-paper-deep px-3 py-3 text-sm text-ink-soft">
                Provider quota and remaining percentage are not exposed by NVIDIA’s API, so TeachFlow does not invent a percentage. Use the NVIDIA dashboard for account-level quota limits.
              </p>
            </Card>
            <Card>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Measured usage</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Metric label="All-time requests" value={monitor.data.requests} />
                <Metric label="All-time tokens" value={monitor.data.totalTokens} />
                <Metric label="Requests today" value={monitor.data.todayRequests} />
                <Metric label="Tokens today" value={monitor.data.todayTokens} />
              </div>
            </Card>
          </div>
        ) : null}
      </LoadGate>
    </>
  );
}
