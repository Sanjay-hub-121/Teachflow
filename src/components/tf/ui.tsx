import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-semibold ${light ? "text-primary-ink" : "text-ink"}`}>
      <span className={`grid h-8 w-8 place-items-center rounded-md text-sm ${light ? "bg-primary-ink text-primary" : "bg-primary text-primary-ink"}`} aria-hidden="true">
        T
      </span>
      TeachFlow
    </span>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" | "danger" }) {
  const styles = {
    primary: "bg-primary text-primary-ink hover:opacity-90",
    secondary: "border border-line-strong bg-card text-ink hover:bg-paper",
    quiet: "text-primary hover:bg-primary-soft",
    danger: "bg-danger text-primary-ink hover:opacity-90",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    />
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-11 w-full rounded-md border border-line-strong bg-card px-3 text-ink outline-none placeholder:text-muted ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-md border border-line-strong bg-card px-3 py-2 text-ink outline-none placeholder:text-muted ${props.className ?? ""}`}
    />
  );
}

export function Select(props: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className={`min-h-11 w-full rounded-md border border-line-strong bg-card px-3 text-ink ${props.className ?? ""}`}
    />
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-semibold text-ink-soft">{label}</span>
      {children}
      {error ? <span className="block text-danger">{error}</span> : hint ? <span className="block text-muted">{hint}</span> : null}
    </label>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-line bg-card p-4 shadow-card ${className}`}>{children}</section>;
}

export function PageHeader({ title, lede, action }: { title: string; lede?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {lede ? <p className="mt-1 max-w-2xl text-muted">{lede}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-card px-5 py-10 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Status({ status }: { status: string }) {
  const tone =
    status === "ready" || status === "completed"
      ? "bg-primary-soft text-primary"
      : status === "failed" || status === "overdue" || status === "high"
        ? "bg-clay-soft text-clay"
        : "bg-paper-deep text-ink-soft";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="rounded-md bg-clay-soft px-3 py-2 text-sm text-clay">{children}</p>;
}

export function LoadGate({
  status,
  error,
  label,
  children,
}: {
  status: "loading" | "ready" | "error";
  error: string;
  label: string;
  children: ReactNode;
}) {
  if (status === "loading") return <Spinner label={label} />;
  if (status === "error") return <Notice>{error}</Notice>;
  return children;
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-muted">{label}…</p>
      <div className="h-24 animate-pulse rounded-lg bg-paper-deep" />
      <div className="h-24 animate-pulse rounded-lg bg-paper-deep" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 text-center" aria-live="polite">
      <div className="space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary text-3xl font-semibold text-primary-ink shadow-card">T</div>
        <p className="font-display text-2xl text-ink">TeachFlow</p>
        <p className="text-sm text-muted">Preparing your workspace…</p>
        <div className="mx-auto h-1.5 w-28 overflow-hidden rounded-full bg-paper-deep"><div className="h-full w-1/2 animate-pulse rounded-full bg-primary" /></div>
      </div>
    </main>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-semibold text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
