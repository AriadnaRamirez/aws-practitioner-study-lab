"use client";

import Link from "next/link";
import { useState } from "react";
import {
  STUDY_SIZES,
  type AnswerStudyResponse,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySessionView,
  type StudySize,
} from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getStoredToken } from "@/lib/api";
import { answerStudy, startStudySession } from "@/lib/study-api";
import { cn } from "@/lib/utils";

type Phase = "setup" | "prompt" | "feedback" | "summary";

export function ExamStudyPanel() {
  const [size, setSize] = useState<StudySize>(10);
  const [phase, setPhase] = useState<Phase>("setup");
  const [session, setSession] = useState<StudySessionView | null>(null);
  const [prompt, setPrompt] = useState<StudyPrompt | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerStudyResponse | null>(null);
  const [summary, setSummary] = useState<StudySessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [remaining, setRemaining] = useState(0);

  async function onStart() {
    setError(null);
    if (!getStoredToken()) {
      setError("Entra para guardar tu progreso.");
      return;
    }
    setPending(true);
    try {
      const view = await startStudySession({ mode: "EXAM_STUDY", size });
      setSession(view);
      setPrompt(view.current);
      setStreak(view.sessionStreak);
      setAnswered(view.answered);
      setRemaining(view.remaining);
      setFeedback(null);
      setSummary(null);
      setSelected(null);
      setPhase(view.current ? "prompt" : "summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar");
    } finally {
      setPending(false);
    }
  }

  async function onSubmitAnswer() {
    if (!session || !prompt || selected === null) return;
    setError(null);
    setPending(true);
    try {
      const res = await answerStudy(session.sessionId, {
        queueItemId: prompt.queueItemId,
        choiceIndex: selected as 0 | 1 | 2 | 3,
      });
      setFeedback(res);
      setStreak(res.sessionStreak);
      setRemaining(res.remaining);
      setAnswered((n) => n + 1);
      setPhase("feedback");
      if (res.finished && res.summary) {
        setSummary(res.summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo responder");
    } finally {
      setPending(false);
    }
  }

  function onContinue() {
    if (!feedback) return;
    if (feedback.finished) {
      setPhase("summary");
      return;
    }
    setPrompt(feedback.next);
    setSelected(null);
    setFeedback(null);
    setPhase("prompt");
  }

  function onReset() {
    setPhase("setup");
    setSession(null);
    setPrompt(null);
    setFeedback(null);
    setSummary(null);
    setSelected(null);
    setStreak(0);
    setError(null);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:max-w-4xl lg:px-8 lg:py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
        Estudio
      </h1>
      <p className="mt-3 max-w-xl text-[var(--foreground-muted)] lg:max-w-2xl">
        Preguntas tipo examen. Si fallas, regresan más adelante.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-md border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          {error}{" "}
          <Link href="/login" className="font-semibold underline">
            Entrar
          </Link>
        </p>
      ) : null}

      {phase === "setup" ? (
        <section className="mt-10 animate-[fade-up_0.45s_ease-out]">
          <h2 className="font-display text-lg font-semibold">
            ¿Cuántas preguntas?
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {STUDY_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSize(n)}
                className={cn(
                  "min-w-16 rounded-md px-4 py-3 text-sm font-semibold transition-colors",
                  size === n
                    ? "bg-[var(--foreground)] text-[var(--accent-foreground)]"
                    : "bg-[var(--surface-elevated)] text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onStart} disabled={pending}>
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> …
                </span>
              ) : (
                "Empezar"
              )}
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "prompt" && prompt ? (
        <section className="mt-10 animate-[fade-up_0.35s_ease-out]">
          <div className="flex items-center justify-between gap-3 text-sm text-[var(--foreground-muted)]">
            <span>
              Cola: {remaining} · Respondidas: {answered}
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              Racha {streak}
            </span>
          </div>
          <h2 className="font-display mt-6 text-xl font-semibold leading-snug sm:text-2xl">
            {prompt.stem}
          </h2>
          <ul className="mt-6 flex flex-col gap-2">
            {prompt.choices.map((choice, idx) => (
              <li key={`${prompt.queueItemId}-${idx}`}>
                <button
                  type="button"
                  onClick={() => setSelected(idx)}
                  className={cn(
                    "w-full rounded-md px-4 py-3 text-left text-sm transition-colors ring-1",
                    selected === idx
                      ? "bg-[var(--surface-hover)] ring-[var(--border-strong)]"
                      : "bg-[var(--surface-elevated)] ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                  )}
                >
                  <span className="mr-2 font-mono text-xs text-[var(--foreground-muted)]">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          <Button
            className="mt-8"
            onClick={onSubmitAnswer}
            disabled={selected === null || pending}
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Enviando…
              </span>
            ) : (
              "Comprobar"
            )}
          </Button>
        </section>
      ) : null}

      {phase === "feedback" && feedback && prompt ? (
        <section className="mt-10 animate-[fade-up_0.35s_ease-out]">
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
              feedback.correct
                ? "bg-[var(--success)] text-[var(--success-fg)]"
                : "bg-[var(--danger)] text-[var(--danger-fg)]",
            )}
          >
            {feedback.correct ? "¡Correcto!" : "Incorrecto"}
          </p>
          {!feedback.correct ? (
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              Correcta:{" "}
              <span className="font-medium text-[var(--foreground)]">
                {prompt.choices[feedback.correctIndex]}
              </span>
            </p>
          ) : null}
          <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Explicación
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
              {feedback.explanation?.trim() ||
                (feedback.correct
                  ? "Así se define este concepto."
                  : `La correcta es «${prompt.choices[feedback.correctIndex]}».`)}
            </p>
          </div>
          <p className="mt-4 text-sm text-[var(--foreground-muted)]">
            Racha{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {feedback.sessionStreak}
            </span>
            {" · "}
            Quedan {feedback.remaining}
          </p>
          <Button className="mt-8" onClick={onContinue}>
            {feedback.finished ? "Ver resultado" : "Siguiente"}
          </Button>
        </section>
      ) : null}

      {phase === "summary" && (summary || feedback?.summary) ? (
        <SummaryBlock
          summary={(summary ?? feedback!.summary)!}
          onReset={onReset}
        />
      ) : null}
    </div>
  );
}

function SummaryBlock({
  summary,
  onReset,
}: {
  summary: StudySessionSummary;
  onReset: () => void;
}) {
  return (
    <section className="mt-10 animate-[fade-up_0.4s_ease-out]">
      <h2 className="font-display text-2xl font-bold">¡Listo!</h2>
      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Precisión" value={`${summary.accuracyPct}%`} />
        <Stat label="Aciertos" value={String(summary.correctAnswers)} />
        <Stat label="Fallos" value={String(summary.incorrectAnswers)} />
        <Stat label="Refuerzos" value={String(summary.missRepeats)} />
        <Stat label="Racha máx." value={String(summary.maxSessionStreak)} />
        <Stat label="Conceptos" value={String(summary.uniqueItems)} />
      </dl>
      <Button className="mt-10" onClick={onReset}>
        Nueva sesión
      </Button>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--surface-elevated)] px-4 py-3 ring-1 ring-[var(--border)]">
      <dt className="text-xs uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-semibold">{value}</dd>
    </div>
  );
}
