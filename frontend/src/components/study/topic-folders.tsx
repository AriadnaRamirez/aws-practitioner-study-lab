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
  orange: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  ink: "bg-[var(--background)] text-white ring-1 ring-[var(--border)]",
  slate: "bg-[var(--surface-elevated)] text-white",
  cream: "bg-[#f2f3f3] text-[var(--accent-foreground)]",
};

const TAB_FACE: Record<StudyCategory["tone"], string> = {
  orange: "bg-[var(--accent)]",
  ink: "bg-[var(--background)] ring-1 ring-[var(--border)]",
  slate: "bg-[var(--surface-elevated)]",
  cream: "bg-[#f2f3f3]",
};

/**
 * Vertical stack of study folders — full width, mobile-first web layout.
 * No horizontal scroll.
 */
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
      <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
        Temas
      </h2>

      <ul className="mt-5 flex w-full min-w-0 flex-col gap-3">
        {folders.map(({ cat, total, mastered, pct }) => {
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          const muted =
            cat.tone === "orange" || cat.tone === "cream"
              ? "text-black/55"
              : "text-white/60";
          return (
            <li key={cat.id} className="relative min-w-0">
              <div
                className={cn(
                  "ml-4 h-3 w-24 rounded-t-md sm:ml-6",
                  TAB_FACE[cat.tone],
                )}
                aria-hidden
              />
              <Link
                href={href}
                className={cn(
                  "flex min-w-0 items-center justify-between gap-4 rounded-md px-4 py-4 sm:px-5 sm:py-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  FOLDER_FACE[cat.tone],
                )}
              >
                <div className="min-w-0">
                  <p className={cn("text-xs tabular-nums", muted)}>
                    {mastered}/{total}
                  </p>
                  <p className="font-display mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {cat.title}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-sm tabular-nums">
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
