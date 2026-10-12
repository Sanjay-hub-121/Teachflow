import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { resetWithRecoveryCode } from "@/lib/teachflow/server/account.functions";
import { Button, Field, TextInput, Wordmark } from "@/components/tf/ui";

export const Route = createFileRoute("/forgot")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block"><Wordmark /></Link>
        <div className="rounded-lg border border-line bg-card p-5 shadow-card">
          <h1 className="font-display text-3xl">Reset password</h1>
          <p className="mt-2 text-sm text-muted">
            Email delivery is not configured, so TeachFlow does not pretend to send a reset message. Use the recovery code saved when you created the account. This signs you out of other devices.
          </p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setMessage("");
              void resetWithRecoveryCode({ data: { email, code, password } })
                .then((result) => {
                  if (!result?.ok) {
                    setMessage(result?.error ?? "Those details were not accepted.");
                    return;
                  }
                  setOk(true);
                  setMessage("Password updated. Sign in with the new one.");
                })
                .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not reset the password."))
                .finally(() => setBusy(false));
            }}
          >
            <Field label="Email"><TextInput type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
            <Field label="Recovery code"><TextInput required autoComplete="off" value={code} onChange={(event) => setCode(event.target.value)} /></Field>
            <Field label="New password" hint="At least 10 characters, with a letter and a number.">
              <div className="flex gap-2">
                <TextInput type={show ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="button" className="min-h-11 shrink-0 rounded-md border border-line-strong px-3 text-sm" aria-pressed={show} onClick={() => setShow((value) => !value)}>{show ? "Hide" : "Show"}</button>
              </div>
            </Field>
            {message ? <p className={`text-sm ${ok ? "text-primary" : "text-danger"}`} role="status">{message}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Updating…" : "Update password"}</Button>
          </form>
          <p className="mt-4 text-sm"><Link to="/login" className="font-semibold text-primary">Back to sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
