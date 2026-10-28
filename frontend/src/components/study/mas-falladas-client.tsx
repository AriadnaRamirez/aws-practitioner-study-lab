"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnswerStudyResponse,
  StudyHistoryDetail,
  StudyPrompt,
  StudySessionSummary,
  StudySessionView,
  WeakItem,
} from "@aps/shared";
import { AwsMark } from "@/components/brand/aws-mark";
import { CelebrateBurst } from "@/components/study/celebrate-burst";
import { FlashDeck } from "@/components/study/flash-deck";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchWeakItems,
  getStoredToken,
  startWeakReview,
} from "@/lib/api";
import { answerStudy, getStudySession } from "@/lib/study-api";
import { cn } from "@/lib/utils";

type Phase = "list" | "play" | "feedback" | "done";

const VARIANT_LABEL: Record<string, string> = {
  NAME_TO_DEFINITION: "Nombre → definición",
  DEFINITION_TO_NAME: "Definición → nombre",
  NAME_FOCUS: "Enfoque en el nombre",
};

/** No auto-advance — user taps Siguiente after reading feedback. */
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
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState<AnswerStudyResponse | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [summary, setSummary] = useState<StudySessionSummary | null>(null);
  const answeringRef = useRef(false);
  const summaryRef = useRef<StudySessionSummary | null>(null);
  const nextPromptRef = useRef<StudyPrompt | null>(null);

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
    setSummary(null);
    summaryRef.current = null;
    nextPromptRef.current = null;
    answeringRef.current = false;
    setAnswered(0);
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
      setAnswered(view.answered);
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
    if (!sessionId || !prompt || answeringRef.current || phase !== "play") {
      return;
    }
    answeringRef.current = true;
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
      setAnswered((n) => n + 1);
      setPhase("feedback");
      if (res.finished && res.summary) {
        summaryRef.current = res.summary;
        nextPromptRef.current = null;
      } else if (res.next) {
        nextPromptRef.current = res.next;
        summaryRef.current = null;
      } else {
        nextPromptRef.current = null;
        if (res.finished) {
          summaryRef.current = res.summary ?? null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al responder");
      setSelected(null);
      answeringRef.current = false;
    } finally {
      setPending(false);
    }
  }

  function onNext() {
    if (!feedback || phase !== "feedback") return;

    if (summaryRef.current || feedback.finished || !nextPromptRef.current) {
      setSummary(summaryRef.current);
      setPhase("done");
      setFeedback(null);
      setSelected(null);
      answeringRef.current = false;
      void load();
      return;
    }

    setPrompt(nextPromptRef.current);
    nextPromptRef.current = null;
    setFeedback(null);
    setSelected(null);
    answeringRef.current = false;
    setPhase("play");
  }

  function backToList() {
    setPhase("list");
    setFeedback(null);
    setSelected(null);
    setSummary(null);
    summaryRef.current = null;
    nextPromptRef.current = null;
    answeringRef.current = false;
    setPrompt(null);
    setSessionId(null);
  }

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-4xl lg:px-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Más falladas
        </h1>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex")}
        >
          Entrar
        </Link>
      </div>
    );
  }

  if ((phase === "play" || phase === "feedback") && prompt) {
    const eyebrow =
      (prompt.variant && VARIANT_LABEL[prompt.variant]) ||
      prompt.variant ||
      "Refuerzo";
    const cardN = phase === "feedback" ? Math.max(answered, 1) : answered + 1;

    return (
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-4xl lg:px-8 lg:py-12">
        <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
          <p className="font-semibold text-[var(--foreground)]">
            Racha {sessionStreak}
          </p>
          <p className="text-[var(--foreground-muted)]">
            quedan {remaining}
          </p>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <div key={prompt.queueItemId} className="mt-8">
          <FlashDeck
            eyebrow={eyebrow}
            title={prompt.stem}
            footer={`${cardN} · refuerzo de falladas`}
            flipped={phase === "feedback" && Boolean(feedback)}
            back={
              feedback ? (
                <div className="relative flex h-full flex-col" role="status">
                  {feedback.correct ? <CelebrateBurst /> : null}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "animate-celebrate inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
                        feedback.correct
                          ? "bg-[var(--success)] text-[var(--success-fg)]"
                          : "bg-[var(--danger)] text-[var(--danger-fg)]",
                      )}
                    >
                      {feedback.correct ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M5 12.5l4.5 4.5L19 7"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M7 7l10 10M17 7L7 17"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {feedback.correct ? "¡Correcto!" : "Incorrecto"}
                    </span>
                    <AwsMark height={26} />
                  </div>

                  <p className="font-display animate-celebrate mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {feedback.correct
                      ? feedback.itemMastered
                        ? "Concepto dominado"
                        : "Muy bien"
                      : "Casi — mira la respuesta correcta"}
                  </p>

                  {!feedback.correct ? (
                    <p className="mt-2 text-sm leading-snug text-[var(--foreground)]">
                      <span className="text-[var(--foreground-muted)]">
                        Correcta:{" "}
                      </span>
                      <span className="font-semibold">
                        {String.fromCharCode(65 + feedback.correctIndex)}.{" "}
                        {prompt.choices[feedback.correctIndex]}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-snug text-[var(--foreground-muted)]">
                      Elegiste:{" "}
                      <span className="font-medium text-[var(--foreground)]">
                        {selected != null
                          ? `${String.fromCharCode(65 + selected)}. ${prompt.choices[selected]}`
                          : "—"}
                      </span>
                    </p>
                  )}

                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                      Por qué{" "}
                      {feedback.correct ? "es correcta" : "es incorrecta"}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
                      {feedback.explanation?.trim()
                        ? feedback.explanation
                        : feedback.correct
                          ? "Esta opción coincide con la definición o el nombre que pedía la carta."
                          : `La respuesta correcta es «${prompt.choices[feedback.correctIndex]}» porque describe el concepto del enunciado; la que elegiste no encaja con esa definición.`}
                    </p>
                  </div>

                  <Button className="mt-5 w-full" onClick={onNext}>
                    {summaryRef.current || feedback.finished
                      ? "Ver resumen"
                      : "Siguiente"}
                  </Button>
                </div>
              ) : null
            }
          >
            <ul className="mt-3 flex flex-col gap-2" aria-busy={pending}>
              {prompt.choices.map((choice, idx) => {
                const i = idx as 0 | 1 | 2 | 3;
                const isSelected = selected === i;
                const showKey = phase === "feedback" && feedback;
                const isCorrect = Boolean(
                  showKey && feedback.correctIndex === i,
                );
                const isWrongPick = Boolean(
                  showKey && isSelected && !feedback.correct,
                );

                return (
                  <li key={`${prompt.queueItemId}-${i}`}>
                    <button
                      type="button"
                      disabled={pending || phase === "feedback"}
                      onClick={() => void onAnswer(i)}
                      className={cn(
                        "keycap w-full justify-start px-3.5 py-3 text-left text-sm leading-snug normal-case disabled:cursor-wait",
                        isCorrect && "keycap-correct",
                        isWrongPick && "keycap-wrong",
                        !showKey && isSelected && "keycap-accent",
                      )}
                    >
                      <span className="mr-2 font-semibold opacity-45">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span>{choice}</span>
                      {pending && isSelected ? (
                        <span className="ml-2 inline-flex align-middle">
                          <Spinner label="Enviando respuesta" />
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </FlashDeck>
        </div>
      </section>
    );
  }

  if (phase === "done") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 animate-[fade-up_0.35s_ease-out] lg:max-w-4xl lg:px-8 lg:py-12">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Refuerzo listo
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          {summary
            ? `${summary.correctAnswers}/${summary.answered} aciertos · racha máx. ${summary.maxSessionStreak}`
            : started
              ? `Sesión de ${started.size} ítems terminada`
              : "Sesión terminada"}
        </p>

        {summary ? (
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--foreground-muted)]">Precisión</dt>
              <dd className="font-display text-2xl font-bold">
                {summary.accuracyPct}%
              </dd>
            </div>
            <div>
              <dt className="text-[var(--foreground-muted)]">Aciertos</dt>
              <dd className="font-display text-2xl font-bold">
                {summary.correctAnswers}/{summary.answered}
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/estudiar" className={cn(buttonVariants())}>
            Estudiar
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Inicio
          </Link>
          <Button type="button" variant="ghost" onClick={backToList}>
            Lista
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-4xl lg:px-8 lg:py-12">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Más falladas
      </h1>

      {error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        <Button
          type="button"
          size="lg"
          disabled={pending || !items?.length}
          onClick={() => void onStudyWeak()}
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> …
            </span>
          ) : (
            "Estudiar"
          )}
        </Button>
      </div>

      {items == null ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">
          Sin fallos.{" "}
          <Link
            href="/estudiar"
            className="text-[var(--foreground)] hover:underline"
          >
            Estudiar
          </Link>
        </p>
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
