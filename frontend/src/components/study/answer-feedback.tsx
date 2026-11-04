"use client";

import { useEffect, useRef } from "react";
import { MASTERY_STREAK } from "@aps/shared";
import { CelebrateBurst } from "@/components/study/celebrate-burst";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  correct: boolean;
  /** "B. Shield" — shown on a miss. */
  correctLabel: string;
  explanation: string;
  /** What the wrong pick actually is ("KMS: …"). */
  chosenHint?: string | null;
  /** The miss comes back later in this same round. */
  requeued?: boolean;
  /** Replaces the "what happens to this miss" line. */
  missNote?: string;
  itemMastered?: boolean;
  /** Consecutive hits toward dominio; omit to hide the dots. */
  streakTowardMastery?: number;
  nextLabel: string;
  onNext: () => void;
  /** Two columns from lg (Estudiar's wide deck). */
  wide?: boolean;
};

function Glyph({ correct }: { correct: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={correct ? "M5 12.5l4.5 4.5L19 7" : "M7 7l10 10M17 7L7 17"}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function missLine(requeued: boolean | undefined): string {
  return requeued
    ? "Te la volvemos a preguntar en un momento."
    : "Queda en tu lista de Más falladas para repasarla.";
}

/**
 * Back of an answered card. Moves focus to the continue button so keyboard
 * and screen-reader users land on the next step; only the verdict is
 * announced, not the whole explanation.
 */
export function AnswerFeedback({
  correct,
  correctLabel,
  explanation,
  chosenHint,
  requeued,
  missNote,
  itemMastered,
  streakTowardMastery,
  nextLabel,
  onNext,
  wide = false,
}: Props) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, []);

  const headline = correct ? (itemMastered ? "¡Dominado!" : "Bien") : "Aún no";
  const announcement = correct
    ? itemMastered
      ? "Correcto. Concepto dominado."
      : "Correcto."
    : `Incorrecto. La correcta es ${correctLabel.replace(/[.\s]+$/, "")}. ${missNote ?? missLine(requeued)}`;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col",
        wide &&
          "lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:items-start [@media(max-height:500px)]:md:gap-x-6",
      )}
    >
      <p className="sr-only" role="status">
        {announcement}
      </p>
      {correct ? <CelebrateBurst /> : null}
      <div className="min-w-0">
        <span
          className={cn(
            "animate-celebrate inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
            correct
              ? "bg-[var(--success)] text-[var(--success-fg)]"
              : "bg-[var(--danger)] text-[var(--danger-fg)]",
          )}
        >
          <Glyph correct={correct} />
          {correct ? "¡Correcto!" : "Incorrecto"}
        </span>

        <p className="font-display animate-celebrate mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)] [@media(max-height:500px)]:mt-2">
          {headline}
        </p>

        {streakTowardMastery != null ? (
          <div
            className="mt-3 flex items-center gap-3 [@media(max-height:500px)]:mt-2"
            aria-label={`${streakTowardMastery} de ${MASTERY_STREAK} aciertos seguidos para dominarlo`}
          >
            <p className="text-sm font-semibold text-[var(--foreground)]" aria-hidden>
              {streakTowardMastery}/{MASTERY_STREAK}
            </p>
            <ol className="flex gap-1.5" aria-hidden>
              {Array.from({ length: MASTERY_STREAK }, (_, i) => (
                <li
                  key={i}
                  className={cn(
                    "size-2.5 rounded-full transition-colors",
                    i < streakTowardMastery
                      ? itemMastered
                        ? "bg-[var(--success)]"
                        : "bg-[var(--foreground)]"
                      : "bg-[var(--border-strong)]",
                  )}
                />
              ))}
            </ol>
            <p className="text-xs text-[var(--foreground-muted)]" aria-hidden>
              seguidos para dominarlo
            </p>
          </div>
        ) : null}

        {!correct ? (
          <div className="mt-2 space-y-1.5 text-sm leading-snug text-[var(--foreground)]">
            <p>
              <span className="text-[var(--foreground-muted)]">Correcta: </span>
              <span className="font-semibold">{correctLabel}</span>
            </p>
            {chosenHint ? (
              <p>
                <span className="text-[var(--foreground-muted)]">Elegiste: </span>
                {chosenHint}
              </p>
            ) : null}
            <p className="text-xs text-[var(--foreground-muted)]">{missNote ?? missLine(requeued)}</p>
          </div>
        ) : null}
      </div>

      <div className="min-w-0">
        <Card
          variant="inset"
          padding="sm"
          className={cn("mt-4", wide && "lg:mt-0 [@media(max-height:500px)]:md:mt-0")}
        >
          <CardLabel as="p">Explicación</CardLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
            {explanation}
          </p>
        </Card>

        <Button
          ref={nextRef}
          className="mt-5 w-full [@media(max-height:500px)]:mt-3"
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
