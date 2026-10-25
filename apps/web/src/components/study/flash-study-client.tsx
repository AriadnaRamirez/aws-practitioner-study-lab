"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  STUDY_SIZES,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySize,
  type Topic,
} from "@aps/shared";
import { Button } from "@/components/ui/button";
import {
  answerStudy,
  fetchMe,
  fetchTopics,
  getStoredToken,
  startFlashSession,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Phase = "auth" | "setup" | "card" | "feedback" | "summary";

const VARIANT_LABEL: Record<string, string> = {
  NAME_TO_DEFINITION: "Nombre → definición",
  DEFINITION_TO_NAME: "Definición → nombre",
  NAME_FOCUS: "Enfoque en el nombre",
};

export function FlashStudyClient() {
  const [phase, setPhase] = useState<Phase>("auth");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [size, setSize] = useState<StudySize>(10);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<StudyPrompt | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [uniqueItems, setUniqueItems] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    correctIndex: number;
    explanation: string;
    itemMastered: boolean;
  } | null>(null);
  const [summary, setSummary] = useState<StudySessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) setPhase("auth");
        return;
      }
      try {
        await fetchMe();
        const t = await fetchTopics();
        if (cancelled) return;
        setTopics(t);
        setPhase("setup");
      } catch {
        if (!cancelled) setPhase("auth");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const progressPct = useMemo(() => {
    if (!uniqueItems) return 0;
    const done = Math.min(answered, uniqueItems);
    return Math.round((done / uniqueItems) * 100);
  }, [answered, uniqueItems]);

  function toggleTopic(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onStart() {
    setError(null);
    setPending(true);
    try {
      const view = await startFlashSession({
        mode: "FLASH_STUDY",
        size,
        topicIds: selectedTopics.length ? selectedTopics : undefined,
      });
      setSessionId(view.sessionId);
      setPrompt(view.current);
      setRemaining(view.remaining);
      setSessionStreak(view.sessionStreak);
      setAnswered(view.answered);
      setDailyStreak(view.dailyStreak);
      setUniqueItems(view.uniqueItems);
      setFeedback(null);
      setSummary(null);
      setSelectedChoice(null);
      startedAt.current = Date.now();
      setPhase(view.current ? "card" : "summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar");
    } finally {
      setPending(false);
    }
  }

  async function onAnswer(choiceIndex: 0 | 1 | 2 | 3) {
    if (!sessionId || !prompt || pending || phase === "feedback") return;
    setSelectedChoice(choiceIndex);
    setPending(true);
    setError(null);
    try {
      const res = await answerStudy(sessionId, {
        queueItemId: prompt.queueItemId,
        choiceIndex,
        latencyMs: Date.now() - startedAt.current,
      });
      setFeedback({
        correct: res.correct,
        correctIndex: res.correctIndex,
        explanation: res.explanation,
        itemMastered: res.itemMastered,
      });
      setSessionStreak(res.sessionStreak);
      setRemaining(res.remaining);
      setAnswered((n) => n + 1);
      setPhase("feedback");
      if (res.finished && res.summary) {
        setSummary(res.summary);
        setDailyStreak(res.summary.dailyStreak);
      } else if (res.next) {
        // keep next ready after feedback
        setPrompt(res.next);
      } else {
        setPrompt(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al responder");
      setSelectedChoice(null);
    } finally {
      setPending(false);
    }
  }

  function onContinue() {
    if (summary) {
      setPhase("summary");
      return;
    }
    setFeedback(null);
    setSelectedChoice(null);
    startedAt.current = Date.now();
    setPhase(prompt ? "card" : "summary");
  }

  if (phase === "auth") {
    return (
      <section className="mx-auto max-w-lg px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Estudiar
        </h1>
        <p className="mt-3 text-[var(--foreground-muted)]">
          Necesitas una cuenta para guardar progreso, dominio y rachas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login">
            <Button>Iniciar sesión</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Crear cuenta</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "setup") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm font-medium text-[var(--accent)]">
          Repaso / Memoriza
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight">
          Flash MCQ
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          4 opciones, miss-repeat al fallar y dominio con 3 aciertos seguidos.
          {dailyStreak > 0
            ? ` Tu racha diaria: ${dailyStreak} día${dailyStreak === 1 ? "" : "s"}.`
            : null}
        </p>

        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">Alcance</h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Sin selección = mixto (todos los temas publicados).
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {topics.map((t) => {
              const on = selectedTopics.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggleTopic(t.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-4 py-3 text-left text-sm transition-colors",
                      on
                        ? "bg-[var(--accent-soft)] text-[var(--foreground)] ring-1 ring-[var(--accent)]"
                        : "bg-[var(--surface-elevated)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                    )}
                  >
                    <span>
                      {t.name}
                      <span className="ml-2 text-xs text-[var(--foreground-muted)]">
                        {t.type === "SERVICE" ? "Servicio" : "Concepto"}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-[var(--accent)]">
                      {on ? "Incluido" : "Añadir"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">Tamaño</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STUDY_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSize(n)}
                className={cn(
                  "h-11 min-w-14 rounded-md px-4 text-sm font-semibold ring-1 transition-colors",
                  size === n
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] ring-[var(--accent)]"
                    : "bg-[var(--surface-elevated)] text-[var(--foreground)] ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          className="mt-8"
          size="lg"
          disabled={pending}
          onClick={() => void onStart()}
        >
          {pending ? "Preparando…" : "Empezar sesión"}
        </Button>
      </section>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <section className="mx-auto max-w-lg px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Sesión terminada
        </h1>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[var(--foreground-muted)]">Precisión</dt>
            <dd className="font-display text-2xl font-bold">
              {summary.accuracyPct}%
            </dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Racha máx.</dt>
            <dd className="font-display text-2xl font-bold">
              {summary.maxSessionStreak}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Aciertos</dt>
            <dd className="text-lg font-semibold">
              {summary.correctAnswers}/{summary.answered}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Miss-repeat</dt>
            <dd className="text-lg font-semibold">{summary.missRepeats}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Dominados</dt>
            <dd className="text-lg font-semibold">
              {summary.masteredInSession}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Racha diaria</dt>
            <dd className="text-lg font-semibold">
              {summary.dailyStreak}{" "}
              <span className="text-xs text-[var(--foreground-muted)]">
                (máx. {summary.longestDailyStreak})
              </span>
            </dd>
          </div>
        </dl>
        <Button className="mt-10" onClick={() => setPhase("setup")}>
          Nueva sesión
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Racha de sesión · {sessionStreak}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Flash MCQ
          </h1>
        </div>
        <p className="text-sm text-[var(--foreground-muted)]">
          Quedan {remaining} · respondidas {answered}
        </p>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {prompt ? (
        <div className="mt-8 animate-[fade-up_0.35s_ease-out]">
          <p className="text-xs font-medium text-[var(--accent)]">
            {VARIANT_LABEL[prompt.variant] ?? prompt.variant}
          </p>
          <p className="font-display mt-3 text-xl font-semibold leading-snug md:text-2xl">
            {prompt.stem}
          </p>

          <ul className="mt-6 flex flex-col gap-2">
            {prompt.choices.map((choice, idx) => {
              const i = idx as 0 | 1 | 2 | 3;
              const isSelected = selectedChoice === i;
              const showKey = phase === "feedback" && feedback;
              const isCorrect = showKey && feedback.correctIndex === i;
              const isWrongPick =
                showKey && isSelected && !feedback.correct;

              return (
                <li key={`${prompt.queueItemId}-${i}`}>
                  <button
                    type="button"
                    disabled={pending || phase === "feedback"}
                    onClick={() => void onAnswer(i)}
                    className={cn(
                      "w-full rounded-md px-4 py-3.5 text-left text-sm leading-snug transition-[transform,background-color,box-shadow] duration-200 ring-1 active:scale-[0.99]",
                      isCorrect &&
                        "bg-emerald-500/15 ring-emerald-600 dark:ring-emerald-400",
                      isWrongPick &&
                        "bg-red-500/15 ring-red-600 dark:ring-red-400",
                      !showKey &&
                        "bg-[var(--surface-elevated)] ring-[var(--border)] hover:bg-[var(--surface-hover)] hover:ring-[var(--border-strong)]",
                      !showKey &&
                        isSelected &&
                        "ring-[var(--accent)]",
                    )}
                  >
                    <span className="mr-2 font-semibold text-[var(--foreground-muted)]">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {choice}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {phase === "feedback" && feedback ? (
        <div
          className={cn(
            "mt-6 rounded-md px-4 py-4 text-sm ring-1 animate-[fade-up_0.3s_ease-out]",
            feedback.correct
              ? "bg-emerald-500/10 ring-emerald-600/40"
              : "bg-red-500/10 ring-red-600/40",
          )}
        >
          <p className="font-semibold">
            {feedback.correct ? "Correcto" : "Incorrecto — vuelve más adelante"}
            {feedback.itemMastered ? " · ¡Dominado!" : null}
          </p>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {feedback.explanation}
          </p>
          <Button className="mt-4" onClick={onContinue}>
            {summary ? "Ver resumen" : "Siguiente"}
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
