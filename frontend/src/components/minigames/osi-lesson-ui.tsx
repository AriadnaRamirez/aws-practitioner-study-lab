"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Eye, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OsiLayerNumber } from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";

export type Missed = { label: string; layer: OsiLayerNumber };

/** Puntuación del primer intento y lo que se falló en cualquier intento. */
export type StepResult = { correct: number; total: number; missed: Missed[] };

export type StepProps = {
  onComplete: (result: StepResult) => void;
};

/** "edit": armando la respuesta; "wrong": se comprobó con errores; "done": todo bien o solución vista. */
export type CheckPhase = "edit" | "wrong" | "done";

/** Intentos fallidos antes de ofrecer "Ver solución". */
export const ATTEMPTS_BEFORE_SOLUTION = 2;

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Baraja hasta que ningún orden coincida del todo con el original. */
export function shuffleUnsolved<T>(items: readonly T[]): T[] {
  if (items.length < 2) return [...items];
  let out = shuffle(items);
  while (out.every((item, i) => item === items[i])) out = shuffle(items);
  return out;
}

export function mergeMissed(prev: Missed[], next: Missed[]): Missed[] {
  const seen = new Set(prev.map((m) => m.label));
  return [...prev, ...next.filter((m) => !seen.has(m.label))];
}

export function StepHeading({
  title,
  instruction,
  children,
}: {
  title: string;
  instruction: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2
        data-step-heading
        tabIndex={-1}
        className="text-2xl font-bold tracking-tight text-[var(--foreground)] outline-none sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[var(--foreground)]">
        {instruction}
      </p>
      {children}
    </div>
  );
}

export function HintBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 flex max-w-prose items-start gap-2 rounded-xl bg-[var(--warning-soft)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--warning-text)]">
      <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** Marca de acierto/error al lado de un elemento ya comprobado. */
export function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="size-5 shrink-0 text-[var(--success-text)]" aria-label="Correcto" />
  ) : (
    <XCircle className="size-5 shrink-0 text-[var(--danger-text)]" aria-label="Incorrecto" />
  );
}

/**
 * Barra fija abajo, como en las apps de idiomas: Comprobar → mensaje → Continuar.
 * Con errores ofrece reintentar y, tras varios intentos, ver la solución.
 */
export function CheckBar({
  phase,
  ready,
  notReadyText,
  attempts,
  okCount,
  total,
  solved,
  onCheck,
  onRetry,
  onSolution,
  onContinue,
  continueLabel = "Continuar",
}: {
  phase: CheckPhase;
  ready: boolean;
  notReadyText: string;
  attempts: number;
  okCount: number;
  total: number;
  /** Se llegó a "done" viendo la solución. */
  solved: boolean;
  onCheck: () => void;
  onRetry: () => void;
  onSolution: () => void;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const continueRef = React.useRef<HTMLButtonElement>(null);
  const retryRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (phase === "done") continueRef.current?.focus({ preventScroll: true });
    if (phase === "wrong") retryRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const tone =
    phase === "done" && !solved ? "success" : phase === "wrong" ? "danger" : "neutral";

  let title = "";
  let body = "";
  if (phase === "edit") {
    title = ready ? "¿Listo? Comprueba tu respuesta." : notReadyText;
  } else if (phase === "wrong") {
    title = `Tienes ${okCount} de ${total} bien.`;
    body =
      attempts >= ATTEMPTS_BEFORE_SOLUTION
        ? "Corrige lo marcado en rojo o mira la solución."
        : "Lo marcado en rojo no va ahí. Lee la pista y corrígelo.";
  } else if (solved) {
    title = "Esta es la respuesta correcta.";
    body = "Repásala con calma antes de seguir.";
  } else {
    title = attempts === 1 ? "¡Perfecto a la primera!" : "¡Bien! Ya está todo en su lugar.";
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 -mx-5 mt-8 border-t px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-5 lg:pb-4",
        tone === "success" && "border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_14%,var(--background))]",
        tone === "danger" && "border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_12%,var(--background))]",
        tone === "neutral" && "border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-overlay)]",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" aria-atomic="true" className="flex min-w-0 items-start gap-2.5">
          {tone === "success" ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--success-text)]" aria-hidden />
          ) : tone === "danger" ? (
            <XCircle className="mt-0.5 size-5 shrink-0 text-[var(--danger-text)]" aria-hidden />
          ) : null}
          <div className="min-w-0">
            <p
              className={cn(
                "font-semibold",
                tone === "success" && "text-[var(--success-text)]",
                tone === "danger" && "text-[var(--danger-text)]",
                tone === "neutral" && "text-[var(--foreground)]",
              )}
            >
              {title}
            </p>
            {body ? <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">{body}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          {phase === "edit" ? (
            <Button size="lg" onClick={onCheck} disabled={!ready}>
              Comprobar
            </Button>
          ) : null}
          {phase === "wrong" ? (
            <>
              {attempts >= ATTEMPTS_BEFORE_SOLUTION ? (
                <Button size="lg" variant="secondary" onClick={onSolution}>
                  <Eye className="size-4" aria-hidden />
                  Ver solución
                </Button>
              ) : null}
              <Button ref={retryRef} size="lg" onClick={onRetry}>
                <RotateCcw className="size-4" aria-hidden />
                Corregir
              </Button>
            </>
          ) : null}
          {phase === "done" ? (
            <Button ref={continueRef} size="lg" onClick={onContinue}>
              {continueLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
