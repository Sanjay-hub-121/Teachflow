import { useState } from "react";
import { createFileRoute, Link, Navigate, useRouter } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { rememberPreviewToken } from "@/components/tf/files";
import { Button, Field, FullPageLoader, TextInput, Wordmark } from "@/components/tf/ui";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function passwordProblem(password: string) {
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
  return "";
}

function RegisterPage() {
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (isPending) return <FullPageLoader />;
  if (user) return <Navigate to="/app" />;

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block"><Wordmark /></Link>
        <div className="rounded-lg border border-line bg-card p-5 shadow-card">
          <h1 className="font-display text-3xl">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Your tasks and documents stay private to this account.</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const problem = passwordProblem(password);
              if (problem) {
                setError(problem);
                return;
              }
              setBusy(true);
              setError("");
              void authClient.signUp.email({ email: email.trim(), password, name: name.trim() || email.trim() }).then(async (result) => {
                if (result.error) {
                  const blob = `${result.error.code ?? ""} ${result.error.message ?? ""}`.toLowerCase();
                  setError(blob.includes("exist") ? "An account with this email already exists. Sign in instead." : "We couldn't create the account. Check the details and try again.");
                  setBusy(false);
                  return;
                }
                rememberPreviewToken(result.data?.token);
                await authClient.getSession();
                await router.invalidate();
                await router.navigate({ to: "/app" });
              }).catch(() => {
                setError("We couldn't create the account. Try again.");
                setBusy(false);
              });
            }}
          >
            <Field label="Full name">
              <TextInput required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label="Email">
              <TextInput type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            <Field label="Password" hint="At least 10 characters, with a letter and a number.">
              <div className="flex gap-2">
                <TextInput type={show ? "text" : "password"} required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="button" className="min-h-11 shrink-0 rounded-md border border-line-strong px-3 text-sm" aria-pressed={show} onClick={() => setShow((value) => !value)}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </Field>
            {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
          </form>
          <p className="mt-4 text-sm">Already registered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
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
