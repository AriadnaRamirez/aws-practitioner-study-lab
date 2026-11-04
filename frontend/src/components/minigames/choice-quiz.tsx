"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Lightbulb, X } from "lucide-react";
import type { MascotPose } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { ProgressBar } from "@/components/ui/progress";
import {
  GameShell,
  GameSummary,
  ReviewList,
  formatElapsed,
} from "@/components/minigames/game-ui";
import { recordGameResult } from "@/lib/minigames/progress";
import type { QuizOption, QuizQuestion } from "@/lib/minigames/quiz";
import { cn } from "@/lib/utils";

type Answer = { question: QuizQuestion; chosen: string };

function verdict(
  correct: number,
  total: number,
): {
  title: string;
  pose: MascotPose;
} {
  if (correct === total) return { title: "¡Perfecto!", pose: "champion" };
  if (correct / total >= 0.7) return { title: "¡Muy bien!", pose: "silver" };
  return { title: "Sigue practicando", pose: "study" };
}

function Prompt({
  question,
  marked,
}: {
  question: QuizQuestion;
  marked: boolean;
}) {
  const { prompt, clue } = question;
  const at = marked && clue ? prompt.indexOf(clue) : -1;
  if (at < 0 || !clue) return prompt;
  return (
    <>
      {prompt.slice(0, at)}
      <mark className="rounded bg-[var(--warning-soft)] px-1 text-[var(--warning-text)]">
        {clue}
      </mark>
      {prompt.slice(at + clue.length)}
    </>
  );
}

function CheatSheet({
  title,
  options,
}: {
  title: string;
  options: readonly QuizOption[];
}) {
  return (
    <details className="group mt-4 rounded-xl bg-[var(--surface-elevated)] px-4 py-3 text-sm">
      <summary
        className={cn(
          "cursor-pointer rounded font-semibold text-[var(--foreground)] select-none",
          FOCUS_RING,
        )}
      >
        {title}
      </summary>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <div key={o.id}>
            <dt className="font-semibold text-[var(--foreground)]">
              {o.label}{" "}
              <span className="font-normal text-[var(--accent)]">
                · {o.tag}
              </span>
            </dt>
            <dd className="mt-0.5 leading-snug text-[var(--foreground-muted)]">
              {o.summary}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/** One scenario at a time: pick an option, read why, move on. */
export function ChoiceQuiz({
  gameId,
  title,
  subtitle,
  cheatSheetTitle,
  questions,
  onReplay,
  onExit,
  exitLabel,
}: {
  /** Slug the result is saved under ("completed" with every answer right). */
  gameId: string;
  title: string;
  subtitle?: string;
  cheatSheetTitle: string;
  questions: readonly QuizQuestion[];
  onReplay: () => void;
  onExit: () => void;
  exitLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hinted, setHinted] = useState<ReadonlySet<string>>(new Set());
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState<number | null>(null);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const question = questions[index];
  const answered = chosen !== null;
  const last = index === questions.length - 1;

  useEffect(() => {
    if (index > 0) promptRef.current?.focus();
  }, [index]);

  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  function choose(optionId: string) {
    if (answered) return;
    setChosen(optionId);
    setAnswers((a) => [...a, { question, chosen: optionId }]);
  }

  const chooseRef = useRef(choose);
  chooseRef.current = choose;
  const optionCount = question?.options.length ?? 0;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= optionCount) {
        e.preventDefault();
        chooseRef.current(question.options[n - 1].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [optionCount, question]);

  function next() {
    if (last) {
      recordGameResult(
        answers.every((a) => a.chosen === a.question.answer),
        gameId,
      );
      setElapsed(Date.now() - startedAt);
      return;
    }
    setChosen(null);
    setIndex((i) => i + 1);
  }

  const correctCount = answers.filter(
    (a) => a.chosen === a.question.answer,
  ).length;

  if (elapsed !== null) {
    const misses = answers.filter((a) => a.chosen !== a.question.answer);
    const { title: verdictTitle, pose } = verdict(correctCount, answers.length);
    const optionOf = (q: QuizQuestion, id: string) =>
      q.options.find((o) => o.id === id)!;
    const hints = hinted.size;
    return (
      <GameShell
        title={title}
        subtitle={subtitle}
        onExit={onExit}
        exitLabel={exitLabel}
      >
        <GameSummary
          title={verdictTitle}
          pose={pose}
          detail={`${correctCount} de ${answers.length} correctas · ${formatElapsed(elapsed)}${
            hints ? ` · ${hints === 1 ? "1 pista" : `${hints} pistas`}` : ""
          }`}
          onReplay={onReplay}
          onExit={onExit}
          exitLabel={exitLabel}
          perfect={misses.length === 0}
        >
          <ReviewList
            heading="Para repasar"
            entries={misses.map(({ question: q, chosen: c }) => {
              const right = optionOf(q, q.answer);
              return {
                id: q.id,
                title: q.prompt,
                note: `Era ${right.label} (elegiste ${optionOf(q, c).label}).`,
                body: q.why ?? right.summary,
              };
            })}
          />
        </GameSummary>
      </GameShell>
    );
  }

  const right = question.options.find((o) => o.id === question.answer)!;
  const picked = question.options.find((o) => o.id === chosen);
  const isRight = chosen === question.answer;
  const showClue = answered || hinted.has(question.id);

  return (
    <GameShell
      title={title}
      subtitle={subtitle}
      onExit={onExit}
      exitLabel={exitLabel}
    >
      <div className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold text-[var(--foreground-muted)]">
        <span>
          Pregunta{" "}
          <span className="text-[var(--foreground)] tabular-nums">
            {index + 1} de {questions.length}
          </span>
        </span>
        <span className="tabular-nums">{correctCount} aciertos</span>
      </div>
      <ProgressBar
        value={index + (answered ? 1 : 0)}
        max={questions.length}
        className="mt-2"
      />

      <CheatSheet title={cheatSheetTitle} options={question.options} />

      <Card className="mt-4">
        <h2
          ref={promptRef}
          tabIndex={-1}
          className="text-lg leading-snug font-semibold text-[var(--foreground)] outline-none sm:text-xl"
        >
          <Prompt question={question} marked={showClue} />
        </h2>
        {question.clue && !showClue ? (
          <Button
            variant="ghost"
            size="xs"
            className="mt-2 -ml-3"
            onClick={() => setHinted(new Set(hinted).add(question.id))}
          >
            <Lightbulb className="size-3.5" aria-hidden />
            Pista: resaltar la frase clave
          </Button>
        ) : null}

        <ul
          className={cn(
            "mt-5 grid gap-2.5",
            question.options.length === 2 ? "grid-cols-2" : "sm:grid-cols-2",
          )}
        >
          {question.options.map((o, i) => {
            const state = !answered
              ? "idle"
              : o.id === question.answer
                ? "right"
                : o.id === chosen
                  ? "wrong"
                  : "dim";
            return (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => choose(o.id)}
                  aria-disabled={answered || undefined}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                    state === "idle" &&
                      "bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
                    state === "right" &&
                      "bg-[var(--success-soft)] text-[var(--success-text)]",
                    state === "wrong" &&
                      "bg-[var(--danger-soft)] text-[var(--danger-text)]",
                    state === "dim" &&
                      "bg-[var(--surface-elevated)] text-[var(--foreground-muted)] opacity-60",
                    answered && "cursor-default",
                    FOCUS_RING,
                  )}
                >
                  <kbd
                    aria-hidden
                    className="hidden size-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] font-sans text-xs font-semibold text-[var(--foreground-muted)] sm:flex"
                  >
                    {i + 1}
                  </kbd>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{o.label}</span>
                    <span className="block text-xs opacity-80">{o.tag}</span>
                  </span>
                  {state === "right" ? (
                    <Check className="size-4 shrink-0" aria-label="Correcta" />
                  ) : state === "wrong" ? (
                    <X className="size-4 shrink-0" aria-label="Tu respuesta" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div role="status" aria-live="polite">
          {answered ? (
            <div
              className={cn(
                "mt-5 rounded-xl px-4 py-3 text-sm leading-relaxed",
                isRight
                  ? "bg-[var(--success-soft)] text-[var(--success-text)]"
                  : "bg-[var(--danger-soft)] text-[var(--danger-text)]",
              )}
            >
              <p className="font-semibold">
                {isRight ? "¡Correcto!" : `No: era ${right.label}.`}
              </p>
              {question.why ? (
                <p className="mt-1 text-[var(--foreground)]">{question.why}</p>
              ) : null}
              <p className="mt-1 text-[var(--foreground)]">
                <strong>{right.label}:</strong> {right.summary}
              </p>
              {!isRight && picked ? (
                <p className="mt-1 text-[var(--foreground-muted)]">
                  <strong>{picked.label}:</strong> {picked.summary}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {answered ? (
          <div className="mt-5 flex justify-end">
            <Button ref={nextRef} onClick={next}>
              {last ? "Ver resultado" : "Siguiente"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        ) : null}
      </Card>
    </GameShell>
  );
}
