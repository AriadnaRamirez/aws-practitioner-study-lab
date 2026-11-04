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
import { AnswerFeedback } from "@/components/study/answer-feedback";
import { FlashDeck } from "@/components/study/flash-deck";
import { WeakListView, WeakSignedOut } from "./weak-list-view";
import { Button, buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { ProgressBar } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Stat } from "@/components/ui/stat";
import {
  fetchProgressOverview,
  fetchWeakItems,
  getStoredToken,
  startWeakReview,
} from "@/lib/api";
import { answerStudy, getStudySession } from "@/lib/study-api";
import { cn, hasTextSelection } from "@/lib/utils";
import { SessionSummary } from "@/components/study/session-summary";

type Phase = "list" | "play" | "feedback" | "done";

const VARIANT_LABEL: Record<string, string> = {
  NAME_TO_DEFINITION: "¿Qué es?",
  DEFINITION_TO_NAME: "¿Cuál es?",
  NAME_FOCUS: "Elige el nombre",
};

/** No auto-advance — user taps Siguiente after reading feedback. */
export function MasFalladasClient() {
  const [items, setItems] = useState<WeakItem[] | null>(null);
  const [hasPlayed, setHasPlayed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [started, setStarted] = useState<StudyHistoryDetail | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<StudyPrompt | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [feedback, setFeedback] = useState<AnswerStudyResponse | null>(null);
  const [requeued, setRequeued] = useState(false);
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
      const [res, overview] = await Promise.all([
        fetchWeakItems(50),
        fetchProgressOverview().catch(() => null),
      ]);
      setHasPlayed(overview?.hasPlayed ?? true);
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
    try {
      const res = await startWeakReview({});
      setStarted(res.session);
      const view = (await getStudySession(res.session.id)) as StudySessionView;
      setSessionId(view.sessionId);
      setPrompt(view.current);
      setRemaining(view.remaining);
      setAnswered(view.answered);
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
      setRequeued(!res.correct && res.remaining >= remaining);
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
    return <WeakSignedOut />;
  }

  if ((phase === "play" || phase === "feedback") && prompt) {
    const eyebrow =
      (prompt.variant && VARIANT_LABEL[prompt.variant]) ||
      prompt.variant ||
      "Refuerzo";

    const total = answered + remaining;
    const progressPct = total ? Math.round((answered / total) * 100) : 0;

    return (
      <PageContainer width="wide">
        <section className="mx-auto w-full min-w-0 py-2 md:max-w-xl lg:max-w-4xl">
          <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
            <h1 className="truncate text-xs font-semibold text-[var(--foreground-muted)]">
              Ronda de refuerzo · Más falladas
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                backToList();
                void load();
              }}
            >
              Salir de la ronda
            </Button>
          </div>
          <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
            <p className="font-semibold text-[var(--foreground)]">
              Racha {sessionStreak}
            </p>
            <p className="tabular-nums text-[var(--foreground-muted)]">
              {remaining > 0
                ? `Quedan ${remaining} ${remaining === 1 ? "carta" : "cartas"}`
                : "¡Listo!"}
            </p>
          </div>

          <ProgressBar
            value={progressPct}
            label="Progreso de la ronda"
            className="mt-4"
          />

          {error ? (
            <Notice tone="danger" className="mt-4">
              {error}
            </Notice>
          ) : null}

          <div key={prompt.queueItemId} className="mt-8">
            <FlashDeck
              wide
              eyebrow={eyebrow}
              title={prompt.stem}
              footer={
                prompt.isRepeat
                  ? "Otra vez: la fallaste hace un momento"
                  : "Carta nueva"
              }
              flipped={phase === "feedback" && Boolean(feedback)}
              back={
                feedback ? (
                  <AnswerFeedback
                    correct={feedback.correct}
                    correctLabel={`${String.fromCharCode(65 + feedback.correctIndex)}. ${prompt.choices[feedback.correctIndex]}`}
                    explanation={
                      feedback.explanation?.trim() ||
                      (feedback.correct
                        ? "Así se define este concepto."
                        : `La correcta es «${prompt.choices[feedback.correctIndex]}».`)
                    }
                    chosenHint={feedback.chosenHint}
                    requeued={requeued}
                    itemMastered={Boolean(feedback.itemMastered)}
                    streakTowardMastery={feedback.itemConsecutiveCorrect}
                    nextLabel={
                      summaryRef.current || feedback.finished
                        ? "Ver resultado"
                        : "Siguiente"
                    }
                    onNext={onNext}
                  />
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
                        onClick={() => {
                          if (hasTextSelection()) return;
                          void onAnswer(i);
                        }}
                        className={cn(
                          "keycap keycap-option w-full select-text px-4 py-3 text-sm leading-snug normal-case disabled:cursor-wait",
                          isCorrect && "keycap-correct",
                          isWrongPick && "keycap-wrong",
                          !showKey && isSelected && "keycap-accent",
                        )}
                      >
                        <span className="mr-2 shrink-0 font-semibold opacity-45">
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
      </PageContainer>
    );
  }

  if (phase === "done" && summary) {
    return (
      <PageContainer width="wide">
        <SessionSummary
          summary={summary}
          autoReturn={false}
          extraAction={{ label: "Volver a la lista", onClick: backToList }}
        />
      </PageContainer>
    );
  }

  if (phase === "done") {
    return (
      <PageContainer className="animate-[fade-up_0.35s_ease-out]">
        <PageHeader
          title="Refuerzo listo"
          subtitle={
            summary
              ? `${summary.correctAnswers}/${summary.answered} aciertos · racha máx. ${summary.maxSessionStreak}`
              : started
                ? `Sesión de ${started.size} ítems terminada`
                : "Sesión terminada"
          }
        />

        {summary ? (
          <dl className="mt-8 grid grid-cols-2 gap-3">
            <Stat label="Precisión" value={`${summary.accuracyPct}%`} />
            <Stat
              label="Aciertos"
              value={`${summary.correctAnswers}/${summary.answered}`}
            />
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
      </PageContainer>
    );
  }

  return (
    <WeakListView
      items={items}
      hasPlayed={hasPlayed}
      error={error}
      pending={pending}
      onStudyWeak={() => void onStudyWeak()}
      onRetry={() => {
        setItems(null);
        void load();
      }}
    />
  );
}
