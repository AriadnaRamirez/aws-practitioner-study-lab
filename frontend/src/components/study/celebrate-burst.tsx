"use client";

import { cn } from "@/lib/utils";

const DOTS = [
  { x: -28, y: -18, c: "#2fbf71", d: "0ms" },
  { x: 8, y: -32, c: "#FF9900", d: "40ms" },
  { x: 30, y: -14, c: "#5ec8ff", d: "80ms" },
  { x: -18, y: 10, c: "#FF9900", d: "60ms" },
  { x: 22, y: 16, c: "#2fbf71", d: "100ms" },
  { x: -4, y: 26, c: "#5ec8ff", d: "120ms" },
  { x: 36, y: 4, c: "#ffffff", d: "90ms" },
  { x: -34, y: 2, c: "#ffffff", d: "50ms" },
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
