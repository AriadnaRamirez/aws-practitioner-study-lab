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

/** Keycap faces — orange accent vs soft grey, matching the landing grid. */
const FOLDER_FACE: Record<StudyCategory["tone"], string> = {
  orange: "keycap keycap-accent",
  ink: "keycap",
  slate: "keycap",
  cream: "keycap",
};

const TAB_FACE: Record<StudyCategory["tone"], string> = {
  orange: "bg-[var(--accent)]",
  ink: "bg-[var(--keycap)]",
  slate: "bg-[var(--keycap)]",
  cream: "bg-[var(--keycap)]",
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
      <ul className="flex w-full min-w-0 flex-col gap-3">
        {folders.map(({ cat, pct }, i) => {
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          return (
            <li key={cat.id} className="relative min-w-0" style={{ zIndex: i + 1 }}>
              <div
                className={cn(
                  "ml-3 h-3 w-[28%] max-w-[6.5rem] rounded-t-xl sm:ml-4",
                  TAB_FACE[cat.tone],
                )}
                aria-hidden
              />
              <Link
                href={href}
                className={cn(
                  "flex min-w-0 items-center justify-between gap-3 rounded-2xl rounded-tl-none px-4 py-4 sm:px-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  FOLDER_FACE[cat.tone],
                )}
                aria-label={cat.title}
              >
                <p className="font-display min-w-0 truncate text-lg font-semibold lowercase tracking-tight sm:text-xl">
                  {cat.title}
                </p>
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
