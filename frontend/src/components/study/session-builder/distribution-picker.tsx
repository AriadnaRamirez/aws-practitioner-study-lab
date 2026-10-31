"use client";

import { useRef, type KeyboardEvent } from "react";
import { FOCUS_RING } from "@/components/ui/focus";
import { cn } from "@/lib/utils";
import type { Distribution } from "./builder-model";

const OPTIONS: {
  id: Distribution;
  title: string;
  description: string;
}[] = [
  {
    id: "balanced",
    title: "Parejo",
    description: "La misma cantidad de cada tema.",
  },
  {
    id: "random",
    title: "Al azar",
    description: "Salen más los temas con más cartas.",
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
      className="grid grid-cols-2 gap-2"
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
              "flex min-w-0 flex-col rounded-xl px-3 py-2.5 text-left transition-colors",
              FOCUS_RING,
              active
                ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))]"
                : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-3.5 shrink-0 items-center justify-center rounded-full",
                  active
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--surface-hover)]",
                )}
              >
                {active ? (
                  <span className="size-1.5 rounded-full bg-[var(--accent-foreground)]" />
                ) : null}
              </span>
              <span className="font-semibold text-[var(--foreground)]">{opt.title}</span>
            </span>
            <span className="mt-1 text-xs leading-snug text-[var(--foreground-muted)]">
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
