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

function UsageRing({ label, value, total, tone }: { label: string; value: number; total: number; tone: "primary" | "clay" }) {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;
  const stroke = tone === "primary" ? "var(--color-primary)" : "var(--color-clay)";

  return (
    <div className="flex items-center gap-4 rounded-md border border-line bg-paper px-3 py-3">
      <div className="relative size-24 shrink-0" aria-label={`${percent}% ${label.toLowerCase()}`}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-paper-deep)" strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-xl text-ink">{percent}%</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-xs text-muted">{value.toLocaleString()} of {total.toLocaleString()} tracked all-time</p>
      </div>
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
                <UsageRing label="Today’s requests" value={monitor.data.todayRequests} total={monitor.data.requests} tone="primary" />
                <UsageRing label="Today’s tokens" value={monitor.data.todayTokens} total={monitor.data.totalTokens} tone="clay" />
              </div>
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
