"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { TopicProgressRow } from "@aps/shared";
import {
  STUDY_CATEGORIES,
  type StudyCategory,
} from "@/lib/study-categories";
import { cn } from "@/lib/utils";

type Props = {
  topics: TopicProgressRow[];
  className?: string;
};

const FOLDER_FACE: Record<StudyCategory["tone"], string> = {
  orange:
    "border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--foreground)]",
  ink: "border border-[var(--glass-border)] bg-[var(--surface)] text-[var(--foreground)]",
  slate:
    "border border-[var(--glass-border)] bg-[var(--surface-elevated)] text-[var(--foreground)]",
  cream:
    "border border-[var(--glass-border)] bg-[var(--surface-hover)] text-[var(--foreground)]",
};

const TAB_FACE: Record<StudyCategory["tone"], string> = {
  orange: "bg-[var(--surface-elevated)] border border-[var(--border-strong)] border-b-0",
  ink: "bg-[var(--glass)] border border-[var(--glass-border)] border-b-0",
  slate: "bg-[var(--surface-elevated)] border border-[var(--glass-border)] border-b-0",
  cream: "bg-[var(--glass-strong)] border border-[var(--glass-border)] border-b-0",
};

export function TopicFolders({ topics, className }: Props) {
  const byId = useMemo(() => new Map(topics.map((t) => [t.topicId, t])), [topics]);

  const folders = useMemo(() => {
    return STUDY_CATEGORIES.map((cat) => {
      let total = 0;
      let mastered = 0;
      for (const id of cat.topicIds) {
        const row = byId.get(id);
        if (!row) continue;
        total += row.total;
        mastered += row.mastered;
      }
      return {
        cat,
        total,
        mastered,
        pct: total ? Math.round((mastered / total) * 1000) / 10 : 0,
      };
    }).filter((f) => f.total > 0);
  }, [byId]);

  if (folders.length === 0) return null;

  return (
    <section className={cn("w-full min-w-0", className)}>
      <ul className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {folders.map(({ cat, pct }, i) => {
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          return (
            <li key={cat.id} className="relative min-w-0" style={{ zIndex: i + 1 }}>
              <div
                className={cn(
                  "ml-3 h-3 w-[28%] max-w-[6.5rem] rounded-t-2xl sm:ml-4",
                  TAB_FACE[cat.tone],
                )}
                aria-hidden
              />
              <Link
                href={href}
                className={cn(
                  "flex min-w-0 items-center justify-between gap-3 rounded-2xl rounded-tl-none px-4 py-4 transition-colors sm:px-5 lg:py-5",
                  "hover:bg-[var(--surface-hover)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  FOLDER_FACE[cat.tone],
                )}
                aria-label={cat.title}
              >
                <div className="min-w-0">
                  <p className="font-display truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {cat.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--foreground-muted)]">
                    {cat.subtitle}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-sm tabular-nums opacity-80">
                  {pct}%
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
