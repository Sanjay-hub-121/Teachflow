import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { rememberPreviewToken } from "@/components/tf/files";
import { Button, Field, TextInput, Wordmark } from "@/components/tf/ui";

export const Route = createFileRoute("/login")({ component: LoginPage });

function safeAuthError(error: { message?: string; code?: string } | null | undefined) {
  const blob = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (blob.includes("invalid") || blob.includes("unauthorized") || blob.includes("password") || blob.includes("credential")) {
    return "Email or password is incorrect.";
  }
  return "We couldn't sign you in. Check the details and try again.";
}

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) return <main className="grid min-h-dvh place-items-center bg-paper text-muted">Checking your session…</main>;
  if (user) return <Navigate to="/app" />;

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block"><Wordmark /></Link>
        <div className="rounded-lg border border-line bg-card p-5 shadow-card">
          <h1 className="font-display text-3xl">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Use the same account on every device.</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              void authClient.signIn.email({ email: email.trim(), password }).then(async (result) => {
                if (result.error) {
                  setError(safeAuthError(result.error));
                  setBusy(false);
                  return;
                }
                rememberPreviewToken(result.data?.token);
                await authClient.getSession();
                await router.invalidate();
                await router.navigate({ to: "/app" });
              }).catch(() => {
                setError("We couldn't sign you in. Try again.");
                setBusy(false);
              });
            }}
          >
            <Field label="Email">
              <TextInput type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            <Field label="Password">
              <div className="flex gap-2">
                <TextInput type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="button" className="min-h-11 shrink-0 rounded-md border border-line-strong px-3 text-sm" aria-pressed={show} onClick={() => setShow((value) => !value)}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </Field>
            {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
          <p className="mt-4 text-sm">
            <Link to="/forgot" className="font-semibold text-primary">Forgot password</Link>
            <span className="text-muted"> · </span>
            <Link to="/register" className="font-semibold text-primary">Create an account</Link>
          </p>
          <div className="my-4 h-px bg-line" />
          <div className="space-y-2">
            {GROK_PROVIDERS.map((provider) => (
              <Button key={provider.providerId} type="button" variant="secondary" className="w-full" onClick={() => void signIn(provider.providerId, { callbackURL: "/app" })}>
                Continue with {provider.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
