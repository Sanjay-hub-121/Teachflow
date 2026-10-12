import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { attempt } from "@/components/tf/actions";
import { Button, Card, Notice, PageHeader, TextArea } from "@/components/tf/ui";
import { askAssistant } from "@/lib/teachflow/server/insights.functions";
import { addSubtasks, createTask } from "@/lib/teachflow/server/tasks.functions";

export const Route = createFileRoute("/app/assistant")({ component: AssistantPage });

const MODES = [
  ["steps", "Break into steps"],
  ["plan", "Order the work"],
  ["lesson", "Lesson notes"],
  ["paper", "Paper structure"],
  ["organize", "Tidy my notes"],
] as const;

function AssistantPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<(typeof MODES)[number][0]>("steps");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="Assistant"
        lede="Drafts only. It does not know your syllabus, exam board, or school rules — check those yourself. Nothing is saved until you ask."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {MODES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm font-semibold ${mode === id ? "bg-primary text-primary-ink" : "bg-card text-ink-soft"}`}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <Card>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            void askAssistant({ data: { mode, text } })
              .then((result) => {
                if (!result.ok) {
                  setError(result.error);
                  setAnswer("");
                  setSteps([]);
                  return;
                }
                setAnswer(result.text);
                setSteps(result.steps);
              })
              .catch(() => setError("The assistant could not answer just now."))
              .finally(() => setBusy(false));
          }}
        >
          <TextArea
            required
            value={text}
            placeholder="What do you need to prepare?"
            onChange={(event) => setText(event.target.value)}
          />
          <Button type="submit" disabled={busy}>{busy ? "Thinking…" : "Ask"}</Button>
        </form>
        {error ? <div className="mt-4"><Notice>{error}</Notice></div> : null}
        {answer ? (
          <div className="mt-5 space-y-3">
            <h2 className="font-display text-2xl">Draft</h2>
            {steps.length ? (
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="whitespace-pre-wrap text-sm text-ink-soft">{answer}</p>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                const title = text.split("\n")[0].trim().slice(0, 120) || "Notes from the assistant";
                const category = mode === "lesson" ? "lesson" : mode === "paper" ? "paper" : "other";
                void attempt(async () => {
                  const task = await createTask({
                    data: {
                      title,
                      description: steps.length ? "" : answer,
                      notes: steps.length ? answer : "",
                      category,
                      priority: "normal",
                      remind: false,
                    },
                  });
                  if (steps.length) await addSubtasks({ data: { taskId: task.id, titles: steps } });
                  return task;
                }).then(async (task) => {
                  if (!task) return;
                  await navigate({ to: "/app/tasks/$taskId", params: { taskId: task.id } });
                });
              }}
            >
              {steps.length ? "Save steps as a task" : "Save this as a task"}
            </Button>
          </div>
        ) : null}
      </Card>
    </>
  );
}
