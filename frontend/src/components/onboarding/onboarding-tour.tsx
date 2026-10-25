"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS, ONBOARDING_TITLE } from "./steps";

type OnboardingTourProps = {
  open: boolean;
  stepIndex: number;
  onStepChange: (index: number) => void;
  onClose: () => void;
  onComplete: () => void;
};

export function OnboardingTour({
  open,
  stepIndex,
  onStepChange,
  onClose,
  onComplete,
}: OnboardingTourProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const step = ONBOARDING_STEPS[stepIndex];
  const isLast = stepIndex >= ONBOARDING_STEPS.length - 1;
  const isFirst = stepIndex <= 0;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !step) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar tour"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_42%,transparent)] backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-fade-up relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_24px_60px_-28px_var(--glow)] outline-none"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{
            background: `
              radial-gradient(ellipse 80% 100% at 10% 0%, var(--hero-mesh-a), transparent 60%),
              radial-gradient(ellipse 70% 100% at 90% 0%, var(--hero-mesh-c), transparent 55%)
            `,
          }}
        />

        <div className="relative px-6 pb-6 pt-7 sm:px-8">
          <p className="font-display text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {ONBOARDING_TITLE}
          </p>
          <p className="mt-3 text-xs font-medium text-[var(--foreground-muted)]">
            {step.eyebrow}
          </p>
          <h2
            id={titleId}
            className="font-display mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-[1.7rem]"
          >
            {step.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
            {step.body}
          </p>

          <ol
            className="mt-6 flex items-center gap-2"
            aria-label={`Paso ${stepIndex + 1} de ${ONBOARDING_STEPS.length}`}
          >
            {ONBOARDING_STEPS.map((s, i) => (
              <li key={s.id} className="flex-1">
                <button
                  type="button"
                  aria-label={`Ir al paso ${i + 1}: ${s.title}`}
                  aria-current={i === stepIndex ? "step" : undefined}
                  onClick={() => onStepChange(i)}
                  className="block h-1.5 w-full rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  style={{
                    background:
                      i <= stepIndex
                        ? "var(--accent)"
                        : "var(--border)",
                  }}
                />
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Saltar
            </Button>
            <div className="flex flex-wrap gap-2">
              {!isFirst ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onStepChange(stepIndex - 1)}
                >
                  Atrás
                </Button>
              ) : null}
              {isLast ? (
                <Button type="button" size="sm" onClick={onComplete}>
                  Empezar a estudiar
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onStepChange(stepIndex + 1)}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
