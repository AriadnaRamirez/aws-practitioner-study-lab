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

      <ul className="mt-5 flex w-full min-w-0 flex-col">
        {folders.map(({ cat, total, mastered, pct }, i) => {
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          const muted =
            cat.tone === "orange" || cat.tone === "cream"
              ? "text-black/55"
              : "text-white/60";
          return (
            <li
              key={cat.id}
              className={cn("relative min-w-0", i > 0 && "-mt-3")}
              style={{ zIndex: folders.length - i }}
            >
              {/* Folder tab */}
              <div
                className={cn(
                  "mx-auto h-3.5 w-[38%] max-w-[9rem] rounded-t-lg sm:w-[28%]",
                  TAB_FACE[cat.tone],
                )}
                aria-hidden
              />
              <Link
                href={href}
                className={cn(
                  "flex min-w-0 items-center justify-between gap-4 rounded-2xl px-4 py-5 transition-[transform,filter] sm:px-6 sm:py-6",
                  "hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  FOLDER_FACE[cat.tone],
                )}
              >
                <div className="min-w-0">
                  <p className={cn("text-xs tabular-nums", muted)}>
                    {total} ítems · {mastered}/{total}
                  </p>
                  <p className="font-display mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {cat.title}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={cn("text-xs uppercase tracking-wider", muted)}>
                    Dominio
                  </p>
                  <p className="font-display mt-0.5 text-lg font-semibold tabular-nums sm:text-xl">
                    {pct}%
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
