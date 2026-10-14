import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Bell, CalendarDays, FileStack, ListChecks } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FullPageLoader, Wordmark } from "@/components/tf/ui";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <FullPageLoader />;
  if (user) return <Navigate to="/app" />;
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Wordmark />
        <Link to="/login" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-primary">
          Sign in
        </Link>
      </header>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 pb-16 pt-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">For teachers</p>
          <h1 className="mt-2 font-display text-5xl leading-tight text-ink">Less work stress. More time for teaching.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Keep tasks, dates, and academic documents in one account. Sign in on a laptop, then open the same work on your phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-ink">
              Create an account
            </Link>
            <Link to="/login" className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-card px-4 text-sm font-semibold">
              I already have one
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-card p-5 shadow-card">
          <p className="text-sm font-semibold text-muted">A quieter desk</p>
          <ul className="mt-4 space-y-4">
            {[
              ["Today’s tasks and overdue items come from your account, not a sample list.", ListChecks],
              ["Reminders stay on the server, so closing the browser does not erase them.", Bell],
              ["Reuse a question paper or lesson plan instead of starting from a blank file.", FileStack],
            ].map(([text, Icon]) => (
              <li key={String(text)} className="flex gap-3 text-sm text-ink-soft">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{text as string}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 md:grid-cols-3">
        {[
          [CalendarDays, "Dates in one calendar", "Exams, meetings, and assignment deadlines, shown in your time zone."],
          [FileStack, "Templates you approve", "Upload a document, check the fields, then fill it again next term."],
          [Bell, "Alerts without nagging", "In-app reminders respect quiet hours. No guilt streaks."],
        ].map(([Icon, title, body]) => (
          <article key={String(title)} className="rounded-lg border border-line bg-card p-4">
            <Icon className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-2xl">{title as string}</h2>
            <p className="mt-2 text-sm text-muted">{body as string}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
