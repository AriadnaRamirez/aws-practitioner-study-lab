"use client";

import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import type { StudySize } from "@aps/shared";
import { STUDY_SIZES } from "@aps/shared";
import { cn } from "@/lib/utils";

/**
 * Mini mazo por tamaño: más cartas y abanico más ancho cuanto mayor la sesión.
 * `angle`/`x` = giro y desplazamiento de las cartas de los extremos al abrirse;
 * deben caber en la columna (~47px a 320px de ancho).
 */
const DECKS: Record<StudySize, { layers: number; angle: number; x: number }> = {
  10: { layers: 1, angle: 6, x: 0 },
  20: { layers: 2, angle: 9, x: 2 },
  30: { layers: 3, angle: 13, x: 3 },
  50: { layers: 5, angle: 17, x: 4 },
};

const STAGGER_IN_MS = 45;
const STAGGER_OUT_MS = 30;

function cardVars(k: number, layers: number, angle: number, x: number) {
  const depth = layers - 1 - k;
  /** -1 (left / back) … 1 (right / front) */
  const t = layers === 1 ? 0 : -1 + (2 * k) / (layers - 1);
  const rest = { x: (layers - 1) * 0.75 - depth * 1.5, y: -depth * 2, rot: -depth * 3 };
  const fan =
    layers === 1
      ? { x: 0, y: -3, rot: -angle }
      : { x: t * x, y: -3 - (1 - Math.abs(t)) * 2, rot: t * angle };
  const peek = {
    x: rest.x + (fan.x - rest.x) * 0.35,
    y: rest.y - 1,
    rot: rest.rot + (fan.rot - rest.rot) * 0.35,
  };
  return {
    "--rest-x": `${rest.x}px`,
    "--rest-y": `${rest.y}px`,
    "--rest-rot": `${rest.rot}deg`,
    "--fan-x": `${fan.x}px`,
    "--fan-y": `${fan.y}px`,
    "--fan-rot": `${fan.rot}deg`,
    "--peek-x": `${peek.x}px`,
    "--peek-y": `${peek.y}px`,
    "--peek-rot": `${peek.rot}deg`,
    "--delay-in": `${k * STAGGER_IN_MS}ms`,
    "--delay-out": `${depth * STAGGER_OUT_MS}ms`,
    zIndex: k + 1,
  } as CSSProperties;
}

function MiniStack({ size, active }: { size: StudySize; active: boolean }) {
  const { layers, angle, x } = DECKS[size];
  return (
    <span aria-hidden className="relative block h-10 w-9">
      {Array.from({ length: layers }, (_, k) => {
        const front = k === layers - 1;
        return (
          <span
            key={k}
            className={cn(
              "size-stack-card absolute bottom-0 left-1/2 h-7 w-5 rounded-[5px] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.55)]",
              active
                ? front
                  ? "bg-[var(--accent)]"
                  : "bg-[color-mix(in_srgb,var(--accent)_55%,var(--surface))]"
                : front
                  ? "bg-[color-mix(in_srgb,var(--foreground)_32%,var(--surface))]"
                  : "bg-[color-mix(in_srgb,var(--foreground)_16%,var(--surface))]",
            )}
            style={cardVars(k, layers, angle, x)}
          />
        );
      })}
    </span>
  );
}

export function SessionSizePicker({
  value,
  onChange,
  labelledBy,
  className,
}: {
  value: StudySize;
  onChange: (size: StudySize) => void;
  labelledBy: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    e.preventDefault();
    const idx = STUDY_SIZES.indexOf(value);
    const next = (idx + delta + STUDY_SIZES.length) % STUDY_SIZES.length;
    onChange(STUDY_SIZES[next]);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className={cn("grid grid-cols-4 gap-1.5", className)}
    >
      {STUDY_SIZES.map((n, i) => {
        const active = value === n;
        return (
          <button
            key={n}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${n} cartas`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(n)}
            className={cn(
              "size-option flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 pb-2 pt-2.5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              active
                ? "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]"
                : "hover:bg-[var(--surface-hover)]",
            )}
          >
            <MiniStack size={n} active={active} />
            <span
              className={cn(
                "text-sm font-bold tabular-nums",
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--foreground-muted)]",
              )}
            >
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );
}
