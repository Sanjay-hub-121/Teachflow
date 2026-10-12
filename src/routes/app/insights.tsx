import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, LoadGate, PageHeader } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { getInsights } from "@/lib/teachflow/server/insights.functions";

export const Route = createFileRoute("/app/insights")({ component: InsightsPage });

function hours(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const whole = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${whole} h ${rest} min` : `${whole} h`;
}

function InsightsPage() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const stats = useData(() => getInsights({ data: { days } }), [days]);
  return (
    <>
      <PageHeader
        title="Insights"
        lede="Counts from your own tasks and documents. Estimates appear only when you recorded the minutes yourself."
      />
      <div className="mb-4 flex gap-2">
        {([7, 30, 90] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm font-semibold ${days === value ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`}
            onClick={() => setDays(value)}
          >
            {value} days
          </button>
        ))}
      </div>
      <LoadGate status={stats.status} error={stats.error} label="Loading insights">
        {stats.data ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <p className="text-sm text-muted">Completed</p>
                <p className="font-display text-3xl">{stats.data.completed}</p>
              </Card>
              <Card>
                <p className="text-sm text-muted">Still overdue</p>
                <p className="font-display text-3xl">{stats.data.overdue}</p>
              </Card>
              <Card>
                <p className="text-sm text-muted">Due in this window</p>
                <p className="font-display text-3xl">{stats.data.upcoming}</p>
              </Card>
              <Card>
                <p className="text-sm text-muted">Documents generated</p>
                <p className="font-display text-3xl">{stats.data.documents}</p>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card>
                <h2 className="font-display text-2xl">Time</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Open tasks with an estimate: {hours(stats.data.estimatedMinutes)} across {stats.data.estimatedTasks} tasks.
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  Recorded on finished tasks: {hours(stats.data.recordedMinutes)} across {stats.data.recordedTasks} tasks.
                </p>
                <p className="mt-3 text-sm text-muted">
                  {stats.data.savedMinutes == null
                    ? "Add “minutes this usually takes” on a template if you want an estimate of time saved. We will not invent one."
                    : `About ${hours(stats.data.savedMinutes)} saved, using the minutes you stored on each template times how often you generated it. That is your estimate, not a timesheet.`}
                </p>
              </Card>
              <Card>
                <h2 className="font-display text-2xl">Templates used</h2>
                {stats.data.templates.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No documents were generated in this window.</p>
                ) : (
                  <div className="mt-3 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.data.templates} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <XAxis type="number" allowDecimals={false} stroke="var(--color-muted)" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          stroke="var(--color-muted)"
                          tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 15)}…` : value)}
                        />
                        <Tooltip
                          cursor={{ fill: "var(--color-paper-deep)" }}
                          contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-line)", borderRadius: 8 }}
                        />
                        <Bar dataKey="count" name="Documents" fill="var(--color-primary)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>
          </>
        ) : null}
      </LoadGate>
    </>
  );
}
