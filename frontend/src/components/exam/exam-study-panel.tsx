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
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { SectionTitle } from "@/components/ui/page";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { Stat } from "@/components/ui/stat";
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
    <div>
      <SectionTitle>Estudio</SectionTitle>
      <p className="mt-2 max-w-prose text-[var(--foreground-muted)]">
        Preguntas tipo examen. Si fallas, regresan más adelante.
      </p>

      {error ? (
        <Notice tone="danger" boxed className="mt-6">
          {error}{" "}
          <Link href="/login" className="font-semibold underline">
            Entrar
          </Link>
        </Notice>
      ) : null}

      {phase === "setup" ? (
        <section className="animate-fade-up mt-10">
          <SectionTitle as="h3" id="estudio-cuantas">
            ¿Cuántas preguntas?
          </SectionTitle>
          <div
            className={cn(segmentedList, "mt-4")}
            role="group"
            aria-labelledby="estudio-cuantas"
          >
            {STUDY_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={size === n}
                onClick={() => setSize(n)}
                className={segmentedItem(size === n, "min-w-12 tabular-nums")}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onStart} pending={pending}>
              {pending ? "Preparando tus preguntas…" : "Empezar"}
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "prompt" && prompt ? (
        <section className="animate-fade-up mt-10">
          <div className="flex items-center justify-between gap-3 text-sm text-[var(--foreground-muted)]">
            <span>
              Cola: {remaining} · Respondidas: {answered}
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              Racha {streak}
            </span>
          </div>
          <h3 className="font-display mt-6 text-xl font-semibold leading-snug text-[var(--foreground)] sm:text-2xl">
            {prompt.stem}
          </h3>
          <ul className="mt-6 flex flex-col gap-2">
            {prompt.choices.map((choice, idx) => (
              <li key={`${prompt.queueItemId}-${idx}`}>
                <button
                  type="button"
                  aria-pressed={selected === idx}
                  onClick={() => setSelected(idx)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-left text-sm text-[var(--foreground)] transition-colors",
                    FOCUS_RING,
                    selected === idx
                      ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))]"
                      : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
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
            disabled={selected === null}
            pending={pending}
          >
            {pending ? "Comprobando…" : "Comprobar"}
          </Button>
        </section>
      ) : null}

      {phase === "feedback" && feedback && prompt ? (
        <section className="animate-fade-up mt-10">
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
          <Card variant="flat" padding="sm" className="mt-4">
            <CardLabel as="p">Explicación</CardLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
              {feedback.explanation?.trim() ||
                (feedback.correct
                  ? "Así se define este concepto."
                  : `La correcta es «${prompt.choices[feedback.correctIndex]}».`)}
            </p>
          </Card>
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
    <section className="animate-fade-up mt-10">
      <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)]">
        ¡Listo!
      </h3>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Precisión" value={`${summary.accuracyPct}%`} />
        <Stat label="Aciertos" value={summary.correctAnswers} />
        <Stat label="Fallos" value={summary.incorrectAnswers} />
        <Stat label="Refuerzos" value={summary.missRepeats} />
        <Stat label="Racha máx." value={summary.maxSessionStreak} />
        <Stat label="Conceptos" value={summary.uniqueItems} />
      </dl>
      <Button className="mt-10" onClick={onReset}>
        Nueva sesión
      </Button>
    </section>
  );
}
