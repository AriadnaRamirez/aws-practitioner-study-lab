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
  type Topic,
} from "@aps/shared";
import { AwsMark } from "@/components/brand/aws-mark";
import { Mascot } from "@/components/brand/mascot";
import { CelebrateBurst } from "@/components/study/celebrate-burst";
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

/** No auto-advance — user reads the explanation on the flipped card. */

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
        <p className="text-sm text-[var(--foreground-muted)]">
          Entra para estudiar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login">
            <Button>Entrar</Button>
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
                  <Spinner /> …
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
                    <span className="text-sm text-[var(--foreground)]">Estudiar</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
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
                          ? "bg-[var(--surface-hover)] ring-1 ring-[var(--border-strong)]"
                          : "bg-[var(--surface-elevated)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-hover)]",
                      )}
                    >
                      <span>{t.name}</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
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
                      "keycap h-12 min-w-14 px-4 text-sm",
                      size === n && "keycap-accent",
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
    const rachaDiaria = summary.dailyStreak ?? dailyStreak;
    const dominados = summary.masteredInSession ?? 0;
    return (
      <section className="py-8 animate-[fade-up_0.35s_ease-out]">
        <Mascot pose="wave" size="md" float className="mb-6" />
        <p className="font-display text-xl font-semibold tracking-tight">
          Lección terminada
        </p>
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
          <div>
            <dt className="text-[var(--foreground-muted)]">Racha diaria</dt>
            <dd className="font-display text-2xl font-bold">
              {rachaDiaria}
              <span className="ml-1 text-sm font-medium text-[var(--foreground-muted)]">
                {rachaDiaria === 1 ? "día" : "días"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Dominados</dt>
            <dd className="font-display text-2xl font-bold">{dominados}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Racha de sesión</dt>
            <dd className="text-lg font-semibold">{summary.maxSessionStreak}</dd>
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
          <Link href="/mas-falladas">
            <Button variant="secondary">Más falladas</Button>
          </Link>
          <Link href="/podio">
            <Button variant="secondary">Podio</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Inicio</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 py-2">
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
        <p className="font-semibold text-[var(--foreground)]">Racha {sessionStreak}</p>
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
          className="h-full rounded-full bg-[var(--foreground)] transition-[width] duration-300"
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
              "Repaso"
            }
            title={prompt.stem}
            footer={`${answered + 1} · ${uniqueItems || size} en la sesión`}
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
                    <AwsMark height={26} />
                  </div>

                  <p className="font-display animate-celebrate mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {feedback.correct
                      ? feedback.itemMastered
                        ? "Concepto dominado"
                        : "Muy bien"
                      : "Casi — mira la respuesta correcta"}
                  </p>

                  <div
                    className="mt-3 flex items-center gap-3"
                    aria-label={`Racha ${feedback.itemConsecutiveCorrect} de ${MASTERY_STREAK} hacia dominio`}
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      Racha {feedback.itemConsecutiveCorrect} de {MASTERY_STREAK}
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
                  ) : (
                    <p className="mt-2 text-sm leading-snug text-[var(--foreground-muted)]">
                      Elegiste:{" "}
                      <span className="font-medium text-[var(--foreground)]">
                        {selectedChoice != null
                          ? `${String.fromCharCode(65 + selectedChoice)}. ${prompt.choices[selectedChoice]}`
                          : "—"}
                      </span>
                    </p>
                  )}

                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                      Por qué {feedback.correct ? "es correcta" : "es incorrecta"}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
                      {feedback.explanation?.trim()
                        ? feedback.explanation
                        : feedback.correct
                          ? "Esta opción coincide con la definición o el nombre que pedía la carta."
                          : `La respuesta correcta es «${prompt.choices[feedback.correctIndex]}» porque describe el concepto del enunciado; la que elegiste no encaja con esa definición.`}
                    </p>
                  </div>

                  <Button className="mt-5 w-full" onClick={goNext}>
                    {summaryRef.current ? "Ver resumen" : "Siguiente carta"}
                  </Button>
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
      ) : pending ? (
        <div className="mt-8">
          <FlashDeck loading eyebrow="FLASH" title="…" footer="Cargando" />
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
