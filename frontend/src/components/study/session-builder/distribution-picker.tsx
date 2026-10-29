"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { Distribution } from "./builder-model";

const OPTIONS: {
  id: Distribution;
  title: string;
  description: string;
  /** Alturas (%) de las barritas del dibujo. */
  bars: number[];
}[] = [
  {
    id: "balanced",
    title: "Parejo entre temas",
    description:
      "La misma cantidad de cartas de cada tema. Si uno se queda sin cartas, los demás completan.",
    bars: [70, 70, 70, 70],
  },
  {
    id: "random",
    title: "Al azar",
    description:
      "Cartas sueltas de toda tu selección: los temas con más cartas salen más.",
    bars: [95, 35, 65, 20],
  },
];

export function DistributionPicker({
  value,
  onChange,
  labelledBy,
}: {
  value: Distribution;
  onChange: (value: Distribution) => void;
  labelledBy: string;
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
    const idx = OPTIONS.findIndex((o) => o.id === value);
    const next = (idx + delta + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className="grid gap-2 sm:grid-cols-2"
    >
      {OPTIONS.map((opt, i) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.id)}
            className={cn(
              "group flex min-w-0 items-start gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors",
              "shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              "[@media(max-height:500px)]:py-2.5",
              active
                ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))]"
                : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
            )}
          >
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-9 shrink-0 items-end justify-between gap-[3px]"
            >
              {opt.bars.map((h, k) => (
                <span
                  key={k}
                  className={cn(
                    "w-1.5 rounded-full transition-colors",
                    active
                      ? "bg-[var(--accent)]"
                      : "bg-[color-mix(in_srgb,var(--foreground)_28%,var(--surface))]",
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-[var(--accent)]"
                      : "bg-[color-mix(in_srgb,var(--foreground)_14%,var(--surface))]",
                  )}
                >
                  {active ? (
                    <span className="size-1.5 rounded-full bg-[var(--accent-foreground)]" />
                  ) : null}
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {opt.title}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-[var(--foreground-muted)]">
                {opt.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
