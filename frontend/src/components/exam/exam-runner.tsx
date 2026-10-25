"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EXAM_TIMED_LIMIT_SEC,
  EXAM_TIMED_SIZES,
  type ExamTimedSessionView,
  type ExamTimedSummary,
  type SessionSize,
} from "@aps/shared";
import { Button } from "@/components/ui/button";
import { ExamSummary } from "@/components/exam/exam-summary";
import { ExamTimer } from "@/components/exam/exam-timer";
import { getStoredToken } from "@/lib/api";
import {
  answerExamTimed,
  markExamReview,
  startExamTimed,
  submitExamTimed,
} from "@/lib/study-api";
import { cn } from "@/lib/utils";

function formatMinutes(sec: number): string {
  return `${Math.round(sec / 60)} min`;
}

type Phase = "setup" | "running" | "done";

export function ExamRunner() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [size, setSize] = useState<SessionSize>(10);
  const [session, setSession] = useState<ExamTimedSessionView | null>(null);
  const [summary, setSummary] = useState<ExamTimedSummary | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(Boolean(getStoredToken()));
  }, []);

  const finish = useCallback(async (sess: ExamTimedSessionView) => {
    setBusy(true);
    setError(null);
    try {
      const result = await submitExamTimed(sess.id);
      setSummary(result);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar el examen");
    } finally {
      setBusy(false);
    }
  }, []);

  const sessionRef = useRef(session);
  const phaseRef = useRef(phase);
  sessionRef.current = session;
  phaseRef.current = phase;

  const onExpire = useCallback(() => {
    const sess = sessionRef.current;
    if (!sess || phaseRef.current !== "running") return;
    void finish(sess);
  }, [finish]);

  async function handleStart() {
    setBusy(true);
    setError(null);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const next = await startExamTimed(size, tz);
      setSession(next);
      setIndex(0);
      setSummary(null);
      setPhase("running");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar");
    } finally {
      setBusy(false);
    }
  }

  async function selectChoice(choiceIndex: 0 | 1 | 2 | 3) {
    if (!session || busy) return;
    const q = session.questions[index];
    if (!q) return;
    setBusy(true);
    setError(null);
    try {
      const next = await answerExamTimed(session.id, {
        questionId: q.id,
        choiceIndex,
      });
      setSession(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }

  async function toggleMark() {
    if (!session || busy) return;
    const q = session.questions[index];
    if (!q) return;
    const marked = !session.markedForReview.includes(q.id);
    setBusy(true);
    try {
      const next = await markExamReview(session.id, {
        questionId: q.id,
        marked,
      });
      setSession(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo marcar");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPhase("setup");
    setSession(null);
    setSummary(null);
    setIndex(0);
    setError(null);
  }

  if (authed === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
          Examen
        </h1>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)]"
        >
          Entrar
        </Link>
      </div>
    );
  }

  if (phase === "done" && summary) {
    return <ExamSummary summary={summary} onAgain={reset} />;
  }

  if (phase === "running" && session) {
    const q = session.questions[index]!;
    const selected = session.answers[q.id];
    const isMarked = session.markedForReview.includes(q.id);
    const total = session.questions.length;

    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Examen
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              Pregunta {index + 1} de {total}
              {" · "}
              {session.answeredCount} respondidas
            </p>
          </div>
          <ExamTimer endsAt={session.endsAt} onExpire={onExpire} />
        </div>

        <div
          className="flex flex-wrap gap-1.5"
          role="navigation"
          aria-label="Mapa de preguntas"
        >
          {session.questions.map((item, i) => {
            const ans = session.answers[item.id];
            const marked = session.markedForReview.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-8 min-w-8 rounded-md px-2 text-xs font-medium transition-colors",
                  i === index
                    ? "bg-[var(--foreground)] text-[var(--accent-foreground)]"
                    : ans !== null
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)]"
                      : "bg-[var(--surface-hover)] text-[var(--foreground-muted)]",
                  marked && "ring-2 ring-amber-500/70",
                )}
                aria-label={`Ir a pregunta ${i + 1}${marked ? ", marcada" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <article className="space-y-5 animate-[fade-up_0.35s_ease-out]">
          <h2 className="font-display text-xl font-semibold leading-snug text-[var(--foreground)] sm:text-2xl">
            {q.stem}
          </h2>
          <ul className="space-y-2">
            {q.choices.map((choice, i) => {
              const active = selected === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void selectChoice(i as 0 | 1 | 2 | 3)
                    }
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-[var(--border-strong)] bg-[var(--surface-hover)] text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
                    )}
                  >
                    <span className="font-mono text-[var(--foreground-muted)]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{choice}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </article>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
          <Button
            type="button"
            variant="secondary"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={index >= total - 1}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            Siguiente
          </Button>
          <Button
            type="button"
            variant={isMarked ? "default" : "outline"}
            onClick={() => void toggleMark()}
            disabled={busy}
          >
            {isMarked ? "Marcada para revisar" : "Marcar para revisar"}
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            onClick={() => void finish(session)}
            disabled={busy}
          >
            Enviar examen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        Examen
      </h1>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Tamaño
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {EXAM_TIMED_SIZES.map((n) => {
            const limit = EXAM_TIMED_LIMIT_SEC[n];
            const label =
              n === 65
                ? `Mock completo · ${n} preguntas · ${formatMinutes(limit)}`
                : `${n} preguntas · ${formatMinutes(limit)}`;
            return (
              <label
                key={n}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors",
                  size === n
                    ? "border-[var(--border-strong)] bg-[var(--surface-hover)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
                )}
              >
                <input
                  type="radio"
                  name="exam-size"
                  className="accent-[var(--foreground)]"
                  checked={size === n}
                  onChange={() => setSize(n)}
                />
                <span className="font-medium text-[var(--foreground)]">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        size="lg"
        disabled={busy || authed === null}
        onClick={() => void handleStart()}
      >
        {busy ? "Preparando…" : "Empezar examen"}
      </Button>
    </div>
  );
}
