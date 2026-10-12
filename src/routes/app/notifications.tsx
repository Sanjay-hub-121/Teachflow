import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { attempt } from "@/components/tf/actions";
import { Button, Card, Empty, LoadGate, PageHeader } from "@/components/tf/ui";
import { useData } from "@/components/tf/use-data";
import { listNotifications, markNotifications, snoozeReminder } from "@/lib/teachflow/server/account.functions";
import { formatWhen } from "@/lib/teachflow/time";

export const Route = createFileRoute("/app/notifications")({ component: AlertsPage });

function AlertLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/app/tasks/")) {
    return <Link to="/app/tasks/$taskId" params={{ taskId: href.slice("/app/tasks/".length) }} className="font-semibold">{children}</Link>;
  }
  if (href.startsWith("/app/documents/")) {
    return (
      <Link to="/app/documents/$documentId" params={{ documentId: href.slice("/app/documents/".length) }} className="font-semibold">
        {children}
      </Link>
    );
  }
  if (href === "/app/calendar") return <Link to="/app/calendar" className="font-semibold">{children}</Link>;
  return <span className="font-semibold">{children}</span>;
}

function AlertsPage() {
  const listed = useData(() => listNotifications(), []);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const items = listed.data ?? [];
  return (
    <>
      <PageHeader
        title="Alerts"
        lede="Reminders stay on your account. Quiet hours can delay them until morning. Nothing here is emailed."
        action={
          items.some((item) => !item.readAt) ? (
            <Button
              variant="secondary"
              onClick={() => {
                void attempt(() => markNotifications({ data: { all: true } })).then((next) => {
                  if (next) listed.reload();
                });
              }}
            >
              Mark all read
            </Button>
          ) : null
        }
      />
      <LoadGate status={listed.status} error={listed.error} label="Loading alerts">
        {items.length === 0 ? (
          <Empty title="No alerts" body="When a reminder is due, or a document finishes, it will be listed here." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className={item.readAt ? "opacity-70" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {item.href ? <AlertLink href={item.href}>{item.title}</AlertLink> : <p className="font-semibold">{item.title}</p>}
                    <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
                    <p className="mt-1 text-xs text-muted">{formatWhen(item.createdAt, zone)}</p>
                  </div>
                  {!item.readAt ? (
                    <Button
                      variant="quiet"
                      onClick={() => {
                        void attempt(() => markNotifications({ data: { id: item.id } })).then((next) => {
                          if (next) listed.reload();
                        });
                      }}
                    >
                      Mark read
                    </Button>
                  ) : null}
                </div>
                {item.reminderId ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      [15, "15 min"],
                      [60, "1 hour"],
                      [180, "3 hours"],
                      [1440, "Tomorrow"],
                    ].map(([minutes, label]) => (
                      <Button
                        key={minutes}
                        variant="secondary"
                        onClick={() => {
                          void attempt(() => snoozeReminder({ data: { id: item.reminderId!, minutes: Number(minutes) } }), "Snoozed").then(
                            (next) => {
                              if (next) listed.reload();
                            },
                          );
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </LoadGate>
    </>
  );
}
