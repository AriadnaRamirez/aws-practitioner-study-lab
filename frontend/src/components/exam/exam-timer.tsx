"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function formatRemaining(totalSec: number): string {
  const s = Math.max(0, totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

type Props = {
  endsAt: string;
  onExpire: () => void;
};

export function ExamTimer({ endsAt, onExpire }: Props) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    const tick = () => {
      const next = Math.max(
        0,
        Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000),
      );
      setRemaining(next);
      if (next <= 0) onExpire();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt, onExpire]);

  const urgent = remaining > 0 && remaining <= 5 * 60;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Tiempo restante ${formatRemaining(remaining)}`}
      className={cn(
        "font-mono text-lg font-semibold tracking-tight tabular-nums sm:text-xl",
        urgent ? "text-[var(--warning-text)]" : "text-[var(--foreground)]",
        remaining === 0 && "text-[var(--danger-text)]",
      )}
    >
      {formatRemaining(remaining)}
    </div>
  );
}
