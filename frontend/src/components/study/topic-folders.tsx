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

/** Flat AWS faces — folder cards, never pill/oval shapes. */
const FOLDER_FACE: Record<StudyCategory["tone"], string> = {
  orange: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  ink: "bg-[var(--background)] text-white ring-1 ring-[var(--border)]",
  slate: "bg-[var(--surface-elevated)] text-white ring-1 ring-[var(--border)]",
  cream: "bg-[#f2f3f3] text-[var(--accent-foreground)]",
};

const TAB_FACE: Record<StudyCategory["tone"], string> = {
  orange: "bg-[var(--accent)]",
  ink: "bg-[var(--background)] ring-1 ring-[var(--border)]",
  slate: "bg-[var(--surface-elevated)] ring-1 ring-[var(--border)]",
  cream: "bg-[#f2f3f3]",
};

/**
 * Carpetas de temas — pestaña + cuerpo rectangular a ancho completo.
 * Sustituye el menú de óvalos; sin scroll horizontal.
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
      <h2 className="font-display text-lg font-semibold tracking-tight">
        Carpetas
      </h2>

      <ul className="mt-4 flex w-full min-w-0 flex-col">
        {folders.map(({ cat, total, mastered, pct }, i) => {
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          const muted =
            cat.tone === "orange" || cat.tone === "cream"
              ? "text-black/55"
              : "text-white/55";
          return (
            <li
              key={cat.id}
              className={cn("relative min-w-0", i > 0 && "-mt-1")}
              style={{ zIndex: i + 1 }}
            >
              {/* File-folder tab (left) */}
              <div
                className={cn(
                  "ml-3 h-4 w-[30%] max-w-[7.5rem] rounded-t-lg sm:ml-4",
                  TAB_FACE[cat.tone],
                )}
                aria-hidden
              />
              <Link
                href={href}
                className={cn(
                  "flex min-w-0 items-end justify-between gap-3 rounded-lg rounded-tl-none px-4 py-5 sm:px-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  FOLDER_FACE[cat.tone],
                )}
                aria-label={`Abrir carpeta ${cat.title}`}
              >
                <div className="min-w-0">
                  <p className={cn("text-xs tabular-nums", muted)}>
                    {total} ítems
                  </p>
                  <p className="font-display mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {cat.title}
                  </p>
                  <p className={cn("mt-1 text-xs", muted)}>
                    {mastered} dominados
                  </p>
                </div>
                <div className="shrink-0 pb-0.5 text-right">
                  <p className={cn("text-[10px] uppercase tracking-wider", muted)}>
                    Dominio
                  </p>
                  <p className="font-display text-xl font-semibold tabular-nums">
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
