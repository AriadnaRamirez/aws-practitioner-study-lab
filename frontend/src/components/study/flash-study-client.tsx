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
  STUDY_SIZES,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySize,
  type Topic,
} from "@aps/shared";
import { FlashDeck } from "@/components/study/flash-deck";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { fetchMe, getStoredToken } from "@/lib/api";
import { getTopics } from "@/lib/content-api";
import {
  STUDY_CATEGORIES,
  categoryById,
  resolveCategoryTopicIds,
} from "@/lib/study-categories";
import {
  answerStudy,
  getStudySession,
  startFlashSession,
} from "@/lib/study-api";
import { cn } from "@/lib/utils";

type Phase =
  | "boot"
  | "auth"
  | "setup"
  | "starting"
  | "card"
  | "feedback"
  | "summary";

const VARIANT_LABEL: Record<string, string> = {
  NAME_TO_DEFINITION: "Nombre → definición",
  DEFINITION_TO_NAME: "Definición → nombre",
  NAME_FOCUS: "Enfoque en el nombre",
};

const AUTO_NEXT_CORRECT_MS = 900;
const AUTO_NEXT_WRONG_MS = 1600;

export function FlashStudyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("boot");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [size, setSize] = useState<StudySize>(10);
  const [customize, setCustomize] = useState(false);
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
  const [, startTransition] = useTransition();
  const startedAt = useRef<number>(Date.now());
  const nextPromptRef = useRef<StudyPrompt | null>(null);
  const summaryRef = useRef<StudySessionSummary | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootOnce = useRef(false);
  /** Sync lock — React state `pending` is too slow to stop double-clicks. */
  const answeringRef = useRef(false);
  const currentQueueIdRef = useRef<string | null>(null);

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
    async (overrideSize?: StudySize, topicOverride?: string[]) => {
      setError(null);
      setPending(true);
      setPhase("starting");
      const useSize = overrideSize ?? size;
      const topicsForStart =
        topicOverride ??
        (selectedTopics.length ? selectedTopics : undefined);
      try {
        const view = await startFlashSession({
          mode: "FLASH_STUDY",
          size: useSize,
          topicIds: topicsForStart,
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
    [applyView, router, searchParams, selectedTopics, size],
  );

  useEffect(() => {
    if (bootOnce.current) return;
    bootOnce.current = true;
    let cancelled = false;

    (async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) setPhase("auth");
        return;
      }
      try {
        const [, topicsRes] = await Promise.all([fetchMe(), getTopics()]);
        if (cancelled) return;
        setTopics(topicsRes.data);
        const resumeId = searchParams.get("session");
        const quickStart = searchParams.get("start");
        if (resumeId) {
          setPending(true);
          setPhase("starting");
          try {
            const view = await getStudySession(resumeId);
            if (cancelled) return;
            applyView(view);
          } catch {
            if (!cancelled) {
              setError("No se pudo reanudar la sesión. Empieza una nueva.");
              setPhase("setup");
            }
          } finally {
            if (!cancelled) setPending(false);
          }
          return;
        }
        setPhase("setup");
        const topicParam = searchParams.get("topic");
        const categoryParam = searchParams.get("category");
        const knownIds = topicsRes.data.map((t) => t.id);
        let topicIds: string[] = [];
        if (topicParam && knownIds.includes(topicParam)) {
          topicIds = [topicParam];
        } else if (categoryParam && categoryById(categoryParam)) {
          topicIds = resolveCategoryTopicIds(categoryParam, knownIds);
        }
        if (topicIds.length) {
          setSelectedTopics(topicIds);
        }
        if (quickStart === "10" || quickStart === "20" || quickStart === "30" || quickStart === "50") {
          const n = Number(quickStart) as StudySize;
          setSize(n);
          void onStart(n, topicIds);
        }
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

  const goNext = useCallback(() => {
    if (answeringRef.current) return;
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
    answeringRef.current = false;
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
        setFeedback({
          correct: res.correct,
          correctIndex: res.correctIndex,
          explanation: res.explanation,
          itemMastered: Boolean(res.itemMastered),
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
        const delay = res.correct ? AUTO_NEXT_CORRECT_MS : AUTO_NEXT_WRONG_MS;
        if (autoTimer.current) clearTimeout(autoTimer.current);
        autoTimer.current = setTimeout(() => {
          goNext();
        }, delay);
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

  function toggleTopic(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  if (phase === "boot" || phase === "starting") {
    return (
      <section className="py-8" aria-busy="true">
        <Spinner label="Cargando" />
        <div className="mt-8">
          <FlashDeck loading eyebrow="FLASH" title="…" />
        </div>
      </section>
    );
  }

  if (phase === "auth") {
    return (
      <section className="py-8">
        <p className="text-sm text-[var(--foreground-muted)]">Entrá para estudiar.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Registro</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (phase === "setup") {
    return (
      <section className="min-w-0">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              disabled={pending}
              onClick={() => void onStart(10, [])}
              className="w-full sm:w-auto"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Preparando…
                </span>
              ) : (
                "Empezar 10"
              )}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              disabled={pending}
              onClick={() => void onStart(20, [])}
              className="w-full sm:w-auto"
            >
              Empezar 20
            </Button>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)]">
            Por tema
          </h2>
          <ul className="mt-3 divide-y divide-[var(--border)]">
            {STUDY_CATEGORIES.map((cat) => {
              const ids = resolveCategoryTopicIds(
                cat.id,
                topics.map((t) => t.id),
              );
              if (!ids.length) return null;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setSelectedTopics(ids);
                      void onStart(10, ids);
                    }}
                    className="flex w-full items-center justify-between gap-3 py-3 text-left disabled:opacity-50"
                  >
                    <span className="font-display text-sm font-semibold">
                      {cat.title}
                    </span>
                    <span className="text-sm text-[var(--accent)]">Estudiar</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          onClick={() => setCustomize((v) => !v)}
          aria-expanded={customize}
        >
          {customize ? "Ocultar opciones" : "Más opciones"}
        </button>

        {customize ? (
          <div className="mt-6 space-y-6 animate-[fade-up_0.3s_ease-out]">
            <ul className="flex flex-col gap-2">
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
                          ? "bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]"
                          : "bg-[var(--surface-elevated)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                      )}
                    >
                      <span>{t.name}</span>
                      <span className="text-xs font-semibold text-[var(--accent)]">
                        {on ? "✓" : "+"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-2">
              {STUDY_SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSize(n)}
                  className={cn(
                    "h-11 min-w-14 rounded-md px-4 text-sm font-semibold ring-1 transition-colors",
                    size === n
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] ring-[var(--accent)]"
                      : "bg-[var(--surface-elevated)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <Button size="lg" disabled={pending} onClick={() => void onStart()}>
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> …
                </span>
              ) : (
                `Empezar ${size}`
              )}
            </Button>
          </div>
        ) : null}

        {error ? (
          <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <section className="py-8 animate-[fade-up_0.35s_ease-out]">
        <dl className="grid grid-cols-2 gap-4 text-sm">
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
          <div>
            <dt className="text-[var(--foreground-muted)]">Racha</dt>
            <dd className="text-lg font-semibold">{summary.maxSessionStreak}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Dominados</dt>
            <dd className="text-lg font-semibold">{summary.masteredInSession}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setSummary(null);
              summaryRef.current = null;
              void onStart(10, []);
            }}
          >
            Otra de 10
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSummary(null);
              setPhase("setup");
            }}
          >
            Ajustar
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 py-2">
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
        <p className="font-semibold text-[var(--accent)]">Racha {sessionStreak}</p>
        <p className="text-[var(--foreground-muted)]">
          {answered}/{uniqueItems || size} · quedan {remaining}
        </p>
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
          style={{
            width: `${progressPct}%`,
            boxShadow: "none",
          }}
        />
      </div>

      {prompt ? (
        <div key={prompt.queueItemId} className="mt-8">
          <FlashDeck
            eyebrow={
              (prompt.variant && VARIANT_LABEL[prompt.variant]) ||
              prompt.variant ||
              "FLASH"
            }
            title={prompt.stem}
            footer={`${answered + 1} · ${uniqueItems || size} en el mazo`}
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
                      onClick={() => void onAnswer(i)}
                      className={cn(
                        "w-full rounded-xl px-3.5 py-3 text-left text-sm leading-snug transition-[transform,background-color,box-shadow] duration-150 ring-1 active:scale-[0.99] disabled:cursor-wait",
                        isCorrect && "bg-emerald-100 ring-emerald-500",
                        isWrongPick && "bg-red-100 ring-red-500",
                        !showKey &&
                          "bg-[#f4f4f4] ring-black/10 hover:bg-[#ebebeb] hover:ring-black/20",
                        !showKey &&
                          isSelected &&
                          "bg-orange-50 ring-[var(--accent)]",
                      )}
                    >
                      <span className="mr-2 font-semibold text-black/45">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="text-black">{choice}</span>
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
        <div className="mt-8">
          <FlashDeck loading eyebrow="FLASH" title="…" footer="Cargando" />
        </div>
      ) : null}

      {phase === "feedback" && feedback ? (
        <div
          className={cn(
            "mt-6 rounded-xl px-4 py-3 text-sm ring-1 animate-[fade-up_0.25s_ease-out]",
            feedback.correct
              ? "bg-emerald-500/15 ring-emerald-500/40"
              : "bg-red-500/15 ring-red-500/40",
          )}
        >
          <p className="font-semibold">
            {feedback.correct ? "Correcto" : "Incorrecto"}
            {feedback.itemMastered ? " · Dominado" : null}
          </p>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {feedback.explanation}
          </p>
          <Button className="mt-3" onClick={goNext}>
            {summaryRef.current ? "Resumen" : "Siguiente"}
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
