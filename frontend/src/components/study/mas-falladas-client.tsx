"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  AnswerStudyResponse,
  StudyHistoryDetail,
  StudyPrompt,
  StudySessionView,
  WeakItem,
} from "@aps/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  fetchWeakItems,
  getStoredToken,
  startWeakReview,
} from "@/lib/api";
import { answerStudy, getStudySession } from "@/lib/study-api";
import { cn } from "@/lib/utils";

type Phase = "list" | "play" | "done";

export function MasFalladasClient() {
  const [items, setItems] = useState<WeakItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [started, setStarted] = useState<StudyHistoryDetail | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<StudyPrompt | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [feedback, setFeedback] = useState<AnswerStudyResponse | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(null);
    if (!getStoredToken()) {
      setAuthed(false);
      setItems([]);
      return;
    }
    setAuthed(true);
    try {
      const res = await fetchWeakItems(50);
      setItems(res.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar la lista",
      );
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onStudyWeak() {
    setError(null);
    setPending(true);
    setStarted(null);
    setFeedback(null);
    setSelected(null);
    try {
      const res = await startWeakReview({});
      setStarted(res.session);
      const view = (await getStudySession(
        res.session.id,
      )) as StudySessionView;
      setSessionId(view.sessionId);
      setPrompt(view.current);
      setRemaining(view.remaining);
      setSessionStreak(view.sessionStreak);
      setPhase(view.current ? "play" : "done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar la sesión de refuerzo",
      );
    } finally {
      setPending(false);
    }
  }

  async function onAnswer(choiceIndex: 0 | 1 | 2 | 3) {
    if (!sessionId || !prompt || feedback) return;
    setPending(true);
    setSelected(choiceIndex);
    setError(null);
    try {
      const res = await answerStudy(sessionId, {
        queueItemId: prompt.queueItemId,
        choiceIndex,
      });
      setFeedback(res);
      setSessionStreak(res.sessionStreak);
      setRemaining(res.remaining);
      if (res.finished) {
        setPhase("done");
        void load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al responder");
      setSelected(null);
    } finally {
      setPending(false);
    }
  }

  function onNext() {
    if (!feedback) return;
    if (feedback.finished || !feedback.next) {
      setPhase("done");
      return;
    }
    setPrompt(feedback.next);
    setFeedback(null);
    setSelected(null);
  }

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Más falladas
        </h1>
        <p className="mt-3 text-base text-[var(--foreground-muted)]">
          Inicia sesión para ver tu cola personal de preguntas y tarjetas más
          falladas.
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex")}
        >
          Entrar
        </Link>
      </div>
    );
  }

  if (phase === "play" && prompt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-[var(--accent)]">
          Refuerzo · WEAK_REVIEW
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
          Estudiar solo estas
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Quedan {remaining} · racha {sessionStreak}
          {started ? ` · cola ${started.size}` : null}
        </p>
        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <p className="mt-8 text-base font-medium leading-relaxed">
          {prompt.stem}
        </p>
        <ul className="mt-6 space-y-2">
          {prompt.choices.map((choice, idx) => {
            const i = idx as 0 | 1 | 2 | 3;
            const isSelected = selected === i;
            const showKey = Boolean(feedback);
            const isCorrect = feedback?.correctIndex === i;
            return (
              <li key={`${prompt.queueItemId}-${i}`}>
                <button
                  type="button"
                  disabled={pending || Boolean(feedback)}
                  onClick={() => void onAnswer(i)}
                  className={cn(
                    "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors",
                    showKey && isCorrect
                      ? "border-emerald-500 bg-emerald-500/10"
                      : showKey && isSelected && !feedback?.correct
                        ? "border-red-500 bg-red-500/10"
                        : isSelected
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:bg-[var(--surface-hover)]",
                  )}
                >
                  {choice}
                </button>
              </li>
            );
          })}
        </ul>
        {feedback ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold">
              {feedback.correct ? "Correcto" : "Incorrecto — vuelve en cola"}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              {feedback.explanation}
            </p>
            <Button type="button" onClick={onNext}>
              {feedback.finished ? "Ver resumen" : "Siguiente"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-[var(--accent)]">Progreso</p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">
        Tus más falladas
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
        Ordenadas por número de fallos. Armá una sesión solo con estas para
        reforzar (miss-repeat on).
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {phase === "done" && started ? (
        <div className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4">
          <p className="text-sm font-semibold">Sesión de refuerzo completada</p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Modo WEAK_REVIEW · {started.size} ítems en cola. El progreso queda
            en tu historial.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => setPhase("list")}>
              Volver a la lista
            </Button>
            <Link
              href="/cuenta#historial"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Ver historial
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          disabled={pending || !items?.length}
          onClick={() => void onStudyWeak()}
        >
          {pending ? "Creando sesión…" : "Estudiar solo estas"}
        </Button>
        <Link
          href="/cuenta#historial"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Historial de sesiones
        </Link>
      </div>

      {items == null ? (
        <p className="mt-10 text-sm text-[var(--foreground-muted)]">
          Cargando…
        </p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-10 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            Todavía no hay fallos registrados. Cuando estudies y te equivoques,
            aparecerán aquí.
          </p>
          <Link
            href="/estudiar"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "mt-4 inline-flex",
            )}
          >
            Ir a estudiar
          </Link>
        </div>
      ) : (
        <ol className="mt-10 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.itemType}:${item.itemId}`}
              className="flex gap-3 border-b border-[var(--border)] pb-3 last:border-0"
            >
              <span className="font-mono text-sm tabular-nums text-[var(--foreground-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </p>
                {item.subtitle ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--foreground-muted)]">
                    {item.subtitle}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  {item.itemType === "KNOWLEDGE" ? "Flash" : "Examen"} ·{" "}
                  <span className="font-medium text-[var(--foreground)]">
                    {item.failCount} fallo{item.failCount === 1 ? "" : "s"}
                  </span>
                  {item.passCount > 0
                    ? ` · ${item.passCount} acierto${item.passCount === 1 ? "" : "s"}`
                    : null}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
