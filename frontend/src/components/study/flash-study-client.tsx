"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  MASTERY_STREAK,
  STUDY_SIZES,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySize,
  type TopicProgressRow,
} from "@aps/shared";
import { CelebrateBurst } from "@/components/study/celebrate-burst";
import { FlashDeck } from "@/components/study/flash-deck";
import {
  SessionBuilder,
  type BuilderPreselect,
} from "@/components/study/session-builder/session-builder";
import { SessionSummary } from "@/components/study/session-summary";
import {
  BuilderSkeleton,
  DeckSkeleton,
} from "@/components/study/study-skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { ProgressBar } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { fetchMe, fetchTopicProgress, getStoredToken } from "@/lib/api";
import { getTopics } from "@/lib/content-api";
import {
  ALL_INICIO_TOPIC_IDS,
  categoryById,
  resolveCategoryTopicIds,
  scopeForTopicIds,
  scopeTitle,
} from "@/lib/study-categories";
import {
  answerStudy,
  getStudySession,
  startFlashSession,
} from "@/lib/study-api";
import { cn, hasTextSelection } from "@/lib/utils";

type Phase =
  | "boot"
  | "auth"
  | "setup"
  | "starting"
  | "card"
  | "feedback"
  | "summary";

const VARIANT_LABEL: Record<string, string> = {
  NAME_TO_DEFINITION: "¿Qué es?",
  DEFINITION_TO_NAME: "¿Cuál es?",
  NAME_FOCUS: "Elige el nombre",
};

/** Encabezado de partida: todos los temas repartidos parejo = partida rápida. */
function sessionLabel(
  topicIds: readonly string[],
  balanced: boolean,
  knownIds?: Iterable<string>,
): string {
  const scope = scopeForTopicIds(topicIds, knownIds);
  return balanced && scope.kind === "all" ? "Partida rápida" : scopeTitle(scope);
}

/** No auto-advance — user reads the explanation on the flipped card. */

export function FlashStudyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("boot");
  /** Topic ids published in the bank; null until boot loads them. */
  const [knownTopicIds, setKnownTopicIds] = useState<string[] | null>(null);
  const [progressRows, setProgressRows] = useState<TopicProgressRow[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [size, setSize] = useState<StudySize>(10);
  const [preselect, setPreselect] = useState<BuilderPreselect | null>(null);
  /** Encabezado de la sesión en curso (null al reanudar: alcance desconocido). */
  const [scopeLabel, setScopeLabel] = useState<string | null>(null);
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
    /** Consecutive correct on this item toward dominio (API `itemConsecutiveCorrect`). */
    itemConsecutiveCorrect: number;
  } | null>(null);
  const [summary, setSummary] = useState<StudySessionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();
  const startedAt = useRef<number>(Date.now());
  const nextPromptRef = useRef<StudyPrompt | null>(null);
  const summaryRef = useRef<StudySessionSummary | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Sync lock — React state `pending` is too slow to stop double-clicks. */
  const answeringRef = useRef(false);
  const currentQueueIdRef = useRef<string | null>(null);
  /** "Otra partida" replays a partida rápida as balanced too. */
  const lastBalancedRef = useRef(false);
  /** Last query string acted on — links within /estudiar don't remount. */
  const handledQueryRef = useRef<string | null>(null);

  const applyView = useCallback(
    (view: {
      sessionId: string;
      current: StudyPrompt | null;
      remaining: number;
      sessionStreak: number;
      answered: number;
      dailyStreak: number;
      uniqueItems: number;
    }) => {
      setSessionId(view.sessionId);
      setPrompt(view.current);
      currentQueueIdRef.current = view.current?.queueItemId ?? null;
      setRemaining(view.remaining);
      setSessionStreak(view.sessionStreak);
      setAnswered(view.answered);
      setDailyStreak(view.dailyStreak);
      setUniqueItems(view.uniqueItems);
      setFeedback(null);
      setSummary(null);
      summaryRef.current = null;
      nextPromptRef.current = null;
      answeringRef.current = false;
      setSelectedChoice(null);
      startedAt.current = Date.now();
      setPhase(view.current ? "card" : "summary");
    },
    [],
  );

  const onStart = useCallback(
    async (
      overrideSize?: StudySize,
      topicOverride?: string[],
      balanced = false,
    ) => {
      setError(null);
      setPending(true);
      setPhase("starting");
      lastBalancedRef.current = balanced;
      const useSize = overrideSize ?? size;
      const topicsForStart =
        topicOverride ??
        (selectedTopics.length ? selectedTopics : undefined);
      if (topicOverride) setSelectedTopics(topicOverride);
      setScopeLabel(
        sessionLabel(topicsForStart ?? [], balanced, knownTopicIds ?? undefined),
      );
      try {
        const view = await startFlashSession({
          mode: "FLASH_STUDY",
          size: useSize,
          topicIds: topicsForStart,
          ...(balanced ? { balanced: true } : {}),
        });
        applyView(view);
        // Drop query params so refresh doesn't restart
        if (searchParams.get("start") || searchParams.get("session")) {
          startTransition(() => {
            router.replace("/estudiar", { scroll: false });
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo iniciar");
        setPhase("setup");
      } finally {
        setPending(false);
      }
    },
    [applyView, knownTopicIds, router, searchParams, selectedTopics, size],
  );

  /** Acts on deep-link params: ?session, ?quick, ?category, ?topics, ?start… */
  const handleQuery = useCallback(
    async (params: URLSearchParams, knownIds: string[]) => {
      const resumeId = params.get("session");
      if (resumeId) {
        setPending(true);
        setPhase("starting");
        setScopeLabel(null);
        try {
          const view = await getStudySession(resumeId);
          if (view.scope) {
            const { topicIds, balanced } = view.scope;
            // "Otra partida" replays the same scope.
            lastBalancedRef.current = balanced;
            setSelectedTopics(topicIds);
            setScopeLabel(sessionLabel(topicIds, balanced, knownIds));
          }
          applyView(view);
        } catch {
          setError("No se pudo reanudar la sesión. Empieza una nueva.");
          setPhase("setup");
        } finally {
          setPending(false);
        }
        return;
      }
      const topicParam = params.get("topic");
      const topicsParam = params.get("topics");
      const categoryParam = params.get("category");
      const quick = params.get("quick") === "1";
      const balanced = quick || params.get("balanced") === "1";
      let topicIds: string[] = [];
      if (quick) {
        topicIds = ALL_INICIO_TOPIC_IDS.filter((id) => knownIds.includes(id));
      } else if (topicsParam) {
        topicIds = topicsParam.split(",").filter((id) => knownIds.includes(id));
      } else if (topicParam && knownIds.includes(topicParam)) {
        topicIds = [topicParam];
      } else if (categoryParam && categoryById(categoryParam)) {
        topicIds = resolveCategoryTopicIds(categoryParam, knownIds);
      }
      if (topicIds.length) {
        setSelectedTopics(topicIds);
      }
      const sizeParam = Number(params.get("size"));
      const urlSize = (STUDY_SIZES as readonly number[]).includes(sizeParam)
        ? (sizeParam as StudySize)
        : null;
      if (urlSize) setSize(urlSize);
      const startParam = Number(params.get("start"));
      if ((STUDY_SIZES as readonly number[]).includes(startParam)) {
        const n = startParam as StudySize;
        setSize(n);
        await onStart(n, topicIds, balanced && topicIds.length > 0);
      } else if (topicIds.length || urlSize) {
        setPreselect({ topicIds: topicIds.length ? topicIds : null, size: urlSize });
      }
    },
    [applyView, onStart],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) setPhase("auth");
        return;
      }
      try {
        const [, topicsRes, progressRes] = await Promise.all([
          fetchMe(),
          getTopics(),
          fetchTopicProgress().catch(() => null),
        ]);
        if (cancelled) return;
        const knownIds = topicsRes.data.map((t) => t.id);
        setKnownTopicIds(knownIds);
        setProgressRows(progressRes?.topics ?? []);
        setPhase("setup");
        handledQueryRef.current = searchParams.toString();
        await handleQuery(new URLSearchParams(searchParams.toString()), knownIds);
      } catch {
        if (!cancelled) setPhase("auth");
      }
    })();

    return () => {
      cancelled = true;
    };
    // intentionally once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Links inside /estudiar (folders, Partida rápida…) only change the query.
  useEffect(() => {
    if (!knownTopicIds || (phase !== "setup" && phase !== "summary")) return;
    const qs = searchParams.toString();
    if (qs === handledQueryRef.current) return;
    handledQueryRef.current = qs;
    void handleQuery(new URLSearchParams(qs), knownTopicIds);
  }, [handleQuery, knownTopicIds, phase, searchParams]);

  const goNext = useCallback(() => {
    // Clear the answer lock first — it must not block "Siguiente".
    // (answeringRef stays true after a successful answer to stop double-submit.)
    answeringRef.current = false;
    if (autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
    if (summaryRef.current) {
      setSummary(summaryRef.current);
      setPhase("summary");
      return;
    }
    const next = nextPromptRef.current;
    setFeedback(null);
    setSelectedChoice(null);
    setError(null);
    startedAt.current = Date.now();
    if (next) {
      setPrompt(next);
      currentQueueIdRef.current = next.queueItemId;
      nextPromptRef.current = null;
      setPhase("card");
    } else {
      setPrompt(null);
      currentQueueIdRef.current = null;
      setPhase("summary");
    }
  }, []);

  const onAnswer = useCallback(
    async (choiceIndex: 0 | 1 | 2 | 3) => {
      if (!sessionId || !prompt) return;
      if (answeringRef.current || phase !== "card") return;
      const queueItemId = prompt.queueItemId;
      if (
        currentQueueIdRef.current &&
        queueItemId !== currentQueueIdRef.current
      ) {
        return;
      }
      answeringRef.current = true;
      setSelectedChoice(choiceIndex);
      setPending(true);
      setError(null);
      try {
        const res = await answerStudy(sessionId, {
          queueItemId,
          choiceIndex,
          latencyMs: Date.now() - startedAt.current,
        });
        // Stale response if user somehow moved on
        if (currentQueueIdRef.current !== queueItemId) {
          return;
        }
        const streakTowardMastery = Math.min(
          Math.max(0, res.itemConsecutiveCorrect ?? (res.correct ? 1 : 0)),
          MASTERY_STREAK,
        );
        setFeedback({
          correct: res.correct,
          correctIndex: res.correctIndex,
          explanation: res.explanation,
          itemMastered: Boolean(res.itemMastered),
          itemConsecutiveCorrect: streakTowardMastery,
        });
        setSessionStreak(res.sessionStreak);
        setRemaining(res.remaining);
        setAnswered((n) => n + 1);
        setPhase("feedback");
        if (res.finished && res.summary) {
          summaryRef.current = res.summary;
          setDailyStreak(res.summary.dailyStreak ?? 0);
          nextPromptRef.current = null;
        } else if (res.next) {
          nextPromptRef.current = res.next;
          summaryRef.current = null;
        } else {
          nextPromptRef.current = null;
        }
        if (autoTimer.current) {
          clearTimeout(autoTimer.current);
          autoTimer.current = null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al responder");
        setSelectedChoice(null);
        answeringRef.current = false;
      } finally {
        setPending(false);
        // On success, answeringRef stays true until goNext() so double-submit
        // cannot race the auto-advance timer.
      }
    },
    [goNext, phase, prompt, sessionId],
  );

  // Keyboard: 1-4 / A-D answer; Enter/Space continue
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      // Ctrl/⌘+C and friends must copy, not answer.
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || hasTextSelection()) {
        return;
      }
      if (phase === "feedback") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goNext();
        }
        return;
      }
      if (phase !== "card" || answeringRef.current || pending || !prompt) return;
      const map: Record<string, 0 | 1 | 2 | 3> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        A: 0,
        B: 1,
        C: 2,
        D: 3,
      };
      const idx = map[e.key];
      if (idx !== undefined) {
        e.preventDefault();
        void onAnswer(idx);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, onAnswer, pending, phase, prompt]);

  useEffect(() => {
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  const progressPct = useMemo(() => {
    if (!uniqueItems) return 0;
    const done = Math.min(answered, uniqueItems);
    return Math.round((done / uniqueItems) * 100);
  }, [answered, uniqueItems]);

  if (phase === "boot" || phase === "starting") {
    const resuming = Boolean(searchParams.get("session"));
    if (phase === "boot" && !resuming && !searchParams.get("start")) {
      return <BuilderSkeleton />;
    }
    return (
      <DeckSkeleton
        message={resuming ? "Retomando tu partida…" : "Preparando tu partida…"}
      />
    );
  }

  if (phase === "auth") {
    return (
      <section className="py-8">
        <p className="text-sm text-[var(--foreground-muted)]">
          Entra para estudiar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login" className={buttonVariants()}>
            Entrar
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ variant: "secondary" })}
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "setup") {
    return (
      <section className="min-w-0">
        {error ? (
          <Notice tone="danger" boxed className="mb-6">
            {error}
          </Notice>
        ) : null}
        <SessionBuilder
          progressRows={progressRows}
          knownTopicIds={knownTopicIds ?? []}
          preselect={preselect}
        />
      </section>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <SessionSummary
        summary={{
          ...summary,
          dailyStreak: summary.dailyStreak ?? dailyStreak,
        }}
        playAgain={{
          label: "Otra partida",
          onClick: () => {
            setSummary(null);
            summaryRef.current = null;
            void onStart(undefined, undefined, lastBalancedRef.current);
          },
        }}
      />
    );
  }

  return (
    <section
      data-study-card
      className="mx-auto w-full min-w-0 py-2 md:max-w-xl lg:max-w-4xl [@media(max-height:500px)]:py-0 [@media(max-height:500px)]:md:max-w-none"
    >
      {scopeLabel ? (
        <p className="mb-2 truncate text-xs font-semibold text-[var(--foreground-muted)] [@media(max-height:500px)]:mb-1">
          {scopeLabel}
        </p>
      ) : null}
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
        <p className="font-semibold text-[var(--foreground)]">Racha {sessionStreak}</p>
        <p className="text-[var(--foreground-muted)]">
          {answered}/{uniqueItems || size}
        </p>
      </div>

      <ProgressBar
        value={progressPct}
        label="Progreso de la partida"
        className="mt-4 [@media(max-height:500px)]:mt-2"
      />

      {prompt ? (
        <div key={prompt.queueItemId} className="mt-8 [@media(max-height:500px)]:mt-3">
          <FlashDeck
            wide
            eyebrow={
              (prompt.variant && VARIANT_LABEL[prompt.variant]) ||
              prompt.variant ||
              "Carta"
            }
            title={prompt.stem}
            footer={`${answered + 1} de ${uniqueItems || size}`}
            flipped={phase === "feedback" && Boolean(feedback)}
            back={
              feedback ? (
                <div
                  className="relative flex h-full flex-col lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:items-start [@media(max-height:500px)]:md:gap-x-6"
                  role="status"
                >
                  {feedback.correct ? <CelebrateBurst /> : null}
                  <div className="min-w-0">
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M5 12.5l4.5 4.5L19 7"
                              stroke="currentColor"
                              strokeWidth="2.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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
                    </div>

                    <p className="font-display animate-celebrate mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)] [@media(max-height:500px)]:mt-2">
                      {feedback.correct
                        ? feedback.itemMastered
                          ? "¡Dominado!"
                          : "Bien"
                        : "Casi"}
                    </p>

                    <div
                      className="mt-3 flex items-center gap-3 [@media(max-height:500px)]:mt-2"
                      aria-label={`${feedback.itemConsecutiveCorrect} de ${MASTERY_STREAK} para dominarlo`}
                    >
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {feedback.itemConsecutiveCorrect}/{MASTERY_STREAK}
                      </p>
                      <ol className="flex gap-1.5" aria-hidden>
                        {Array.from({ length: MASTERY_STREAK }, (_, i) => {
                          const filled = i < feedback.itemConsecutiveCorrect;
                          return (
                            <li
                              key={i}
                              className={cn(
                                "size-2.5 rounded-full transition-colors",
                                filled
                                  ? feedback.itemMastered
                                    ? "bg-[var(--success)]"
                                    : "bg-[var(--foreground)]"
                                  : "bg-[var(--border-strong)]",
                              )}
                            />
                          );
                        })}
                      </ol>
                    </div>

                    {!feedback.correct ? (
                      <p className="mt-2 text-sm leading-snug text-[var(--foreground)]">
                        <span className="text-[var(--foreground-muted)]">Correcta: </span>
                        <span className="font-semibold">
                          {String.fromCharCode(65 + feedback.correctIndex)}.{" "}
                          {prompt.choices[feedback.correctIndex]}
                        </span>
                      </p>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <Card
                      variant="inset"
                      padding="sm"
                      className="mt-4 lg:mt-0 [@media(max-height:500px)]:md:mt-0"
                    >
                      <CardLabel as="p">Explicación</CardLabel>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
                        {feedback.explanation?.trim()
                          ? feedback.explanation
                          : feedback.correct
                            ? "Así se define este concepto."
                            : `La correcta es «${prompt.choices[feedback.correctIndex]}».`}
                      </p>
                    </Card>

                    <Button
                      className="mt-5 w-full [@media(max-height:500px)]:mt-3"
                      onClick={goNext}
                    >
                      {summaryRef.current ? "Ver resultado" : "Siguiente"}
                    </Button>
                  </div>
                </div>
              ) : null
            }
          >
            <ul className="mt-3 flex flex-col gap-2" aria-busy={pending}>
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
                      onClick={() => {
                        if (hasTextSelection()) return;
                        void onAnswer(i);
                      }}
                      className={cn(
                        "keycap keycap-option w-full select-text px-4 py-3 text-sm leading-snug normal-case disabled:cursor-wait [@media(max-height:500px)]:py-2",
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
      ) : pending ? (
        <div className="mt-8 [@media(max-height:500px)]:mt-3" aria-busy="true">
          <p className="sr-only" role="status">
            Cargando la siguiente carta…
          </p>
          <FlashDeck wide loading eyebrow="Carta" title="" footer="Siguiente carta…" />
        </div>
      ) : null}

      {error ? (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      ) : null}
    </section>
  );
}
