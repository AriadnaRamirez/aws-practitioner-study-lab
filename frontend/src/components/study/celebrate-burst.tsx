"use client";

import { cn } from "@/lib/utils";

const DOTS = [
  { x: -28, y: -18, c: "var(--success)", d: "0ms" },
  { x: 8, y: -32, c: "var(--accent)", d: "40ms" },
  { x: 30, y: -14, c: "#d9c3ab", d: "80ms" },
  { x: -18, y: 10, c: "var(--accent-hover)", d: "60ms" },
  { x: 22, y: 16, c: "var(--success)", d: "100ms" },
  { x: -4, y: 26, c: "#d9c3ab", d: "120ms" },
  { x: 36, y: 4, c: "var(--foreground)", d: "90ms" },
  { x: -34, y: 2, c: "var(--accent)", d: "50ms" },
] as const;

/** Lightweight burst that plays once when a correct answer flips in. */
export function CelebrateBurst({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 top-3 -translate-x-1/2",
        className,
      )}
    >
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="celebrate-dot absolute left-0 top-0 size-2 rounded-full"
          style={{
            background: dot.c,
            ["--tx" as string]: `${dot.x}px`,
            ["--ty" as string]: `${dot.y}px`,
            animationDelay: dot.d,
          }}
        />
      ))}
    </span>
  );
}
