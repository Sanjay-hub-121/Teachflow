import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChartColumn,
  Files,
  LayoutDashboard,
  Library,
  ListChecks,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureProfile, syncInbox } from "@/lib/teachflow/server/account.functions";
import { Wordmark } from "./ui";

const NAV = [
  { to: "/app", label: "Today", icon: LayoutDashboard, exact: true },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/templates", label: "Templates", icon: Library },
  { to: "/app/documents", label: "Documents", icon: Files },
  { to: "/app/notifications", label: "Alerts", icon: Bell },
  { to: "/app/insights", label: "Insights", icon: ChartColumn },
  { to: "/app/assistant", label: "Assistant", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell() {
  const { user, isPending } = useCurrentUserState();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [recovery, setRecovery] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let stop = false;
    const run = () => {
      void ensureProfile({ data: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } })
        .then((result) => {
          if (!stop && result.recoveryCode) setRecovery(result.recoveryCode);
          return syncInbox();
        })
        .then((inbox) => {
          if (!stop) setUnread(inbox.unread);
        })
        .catch(() => undefined);
    };
    run();
    const timer = window.setInterval(run, 60_000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, [user]);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper text-muted">
        <p>Opening your desk…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const itemClass = (to: string, exact = false) => {
    const active = exact ? path === to : path === to || path.startsWith(`${to}/`);
    return `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold ${active ? "bg-primary text-primary-ink" : "text-ink-soft hover:bg-paper-deep"}`;
  };

  return (
    <div className="min-h-dvh bg-paper text-ink md:grid md:grid-cols-[15.5rem_1fr]">
      <aside className="hidden border-r border-line bg-card md:flex md:min-h-dvh md:flex-col md:justify-between md:p-4">
        <div>
          <Link to="/app" className="mb-6 block px-2">
            <Wordmark />
          </Link>
          <nav className="space-y-1" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={itemClass(item.to, "exact" in item)}>
                <item.icon className="size-4" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.to === "/app/notifications" && unread > 0 ? (
                  <span className="rounded-full bg-clay px-2 text-xs text-primary-ink">{unread}</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-2 pt-4">
          <UserButton />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line bg-card px-4 py-3 md:hidden">
          <Wordmark />
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-line" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
        </header>
        {open ? (
          <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setOpen(false)}>
            <nav className="ml-auto flex h-full w-72 flex-col gap-1 bg-card p-4" aria-label="Mobile" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="mb-2 ml-auto grid h-11 w-11 place-items-center" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X />
              </button>
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className={itemClass(item.to, "exact" in item)} onClick={() => setOpen(false)}>
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
              <div className="mt-auto pt-4">
                <UserButton />
              </div>
            </nav>
          </div>
        ) : null}
        <main className="mx-auto w-full max-w-6xl px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-10">
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card md:hidden" aria-label="Mobile primary">
          {NAV.slice(0, 4).map((item) => (
            <Link key={item.to} to={item.to} className="flex min-h-14 flex-col items-center justify-center text-xs font-semibold text-ink-soft">
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
          <button type="button" className="flex min-h-14 flex-col items-center justify-center text-xs font-semibold text-ink-soft" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
            More
          </button>
        </nav>
      </div>
      {recovery ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-5 shadow-card" role="dialog" aria-labelledby="recovery-title">
            <h2 id="recovery-title" className="font-display text-2xl">Save your recovery code</h2>
            <p className="mt-2 text-sm text-muted">Email reset is not set up. This code is the way back in if you forget your password. It is shown only once.</p>
            <p className="mt-4 rounded-md bg-paper px-3 py-3 text-center font-mono text-lg tracking-wide text-ink">{recovery}</p>
            <button type="button" className="mt-4 min-h-11 w-full rounded-md bg-primary font-semibold text-primary-ink" onClick={() => setRecovery(null)}>
              I have saved this code
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
