"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { TopicProgressRow } from "@aps/shared";
import {
  STUDY_CATEGORIES,
  type StudyCategory,
  type StudyCategoryId,
} from "@/lib/study-categories";
import { cn } from "@/lib/utils";

type Props = {
  topics: TopicProgressRow[];
  className?: string;
};

const BLOB_RADIUS: Record<StudyCategoryId, string> = {
  "aws-services": "42% 58% 48% 52% / 48% 42% 58% 52%",
  linux: "55% 45% 42% 58% / 50% 55% 45% 50%",
  networking: "48% 52% 58% 42% / 55% 48% 52% 45%",
  "cloud-concepts": "50% 50% 45% 55% / 42% 58% 48% 52%",
};

function CategoryGlyph({ kind }: { kind: StudyCategory["glyph"] }) {
  const c = "h-5 w-5";
  switch (kind) {
    case "linux":
      return (
        <svg viewBox="0 0 24 24" className={c} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2c-1.4 1.6-2.2 3.4-2.2 5.2 0 1 .3 1.9.8 2.6-.9.4-1.7 1.2-2.2 2.3-.6 1.4-.6 3 .2 4.4.7 1.2 1.9 2 3.2 2.3-.2.6-.3 1.2-.3 1.8 0 .7.2 1.4.5 2H9.2c-.4-1-1.4-1.7-2.6-1.7-1.5 0-2.7 1.1-2.7 2.5v.6h16.2v-.6c0-1.4-1.2-2.5-2.7-2.5-1.2 0-2.2.7-2.6 1.7h-1.8c.3-.6.5-1.3.5-2 0-.6-.1-1.2-.3-1.8 1.3-.3 2.5-1.1 3.2-2.3.8-1.4.8-3 .2-4.4-.5-1.1-1.3-1.9-2.2-2.3.5-.7.8-1.6.8-2.6C14.2 5.4 13.4 3.6 12 2z"
          />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" aria-hidden>
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "cloud":
    default:
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" aria-hidden>
          <path
            d="M7.5 18h9.2A4.3 4.3 0 0 0 21 13.8a4.2 4.2 0 0 0-3.7-4.1A5.5 5.5 0 0 0 7.2 11 3.8 3.8 0 0 0 7.5 18z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function toneClasses(tone: StudyCategory["tone"], selected: boolean) {
  if (selected) {
    return "bg-[var(--accent)] text-[var(--accent-foreground)]";
  }
  switch (tone) {
    case "orange":
      return "bg-[var(--accent)]/90 text-[var(--accent-foreground)] hover:bg-[var(--accent)]";
    case "ink":
      return "bg-[var(--background)] text-white ring-1 ring-[var(--border)] hover:ring-[var(--accent)]";
    case "slate":
      return "bg-[var(--surface-elevated)] text-white ring-1 ring-[var(--border)] hover:ring-[var(--accent)]";
    case "cream":
      return "bg-[#f2f3f3] text-[var(--accent-foreground)] hover:bg-white";
  }
}

type CatStats = {
  total: number;
  mastered: number;
  pct: number;
  topicIds: string[];
};

/**
 * Soft “blob” menu to pick a study category — mobile-first 2-col grid.
 */
export function TopicCategoryMenu({ topics, className }: Props) {
  const byId = useMemo(() => {
    const m = new Map(topics.map((t) => [t.topicId, t]));
    return m;
  }, [topics]);

  const rows = useMemo(() => {
    return STUDY_CATEGORIES.map((cat) => {
      let total = 0;
      let mastered = 0;
      const present: string[] = [];
      for (const id of cat.topicIds) {
        const row = byId.get(id);
        if (!row || row.total <= 0) continue;
        present.push(id);
        total += row.total;
        mastered += row.mastered;
      }
      const stats: CatStats = {
        total,
        mastered,
        pct: total ? Math.round((mastered / total) * 1000) / 10 : 0,
        topicIds: present,
      };
      return { cat, stats };
    }).filter((r) => r.stats.total > 0);
  }, [byId]);

  const [selected, setSelected] = useState<StudyCategoryId | null>(null);

  useEffect(() => {
    if (!selected && rows[0]) setSelected(rows[0].cat.id);
  }, [rows, selected]);

  if (rows.length === 0) return null;

  return (
    <section className={cn("mt-10", className)}>
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Elige un tema
        </p>
        <h2 className="font-display mt-1 text-xl font-semibold sm:text-2xl">
          ¿Qué quieres practicar hoy?
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Servicios de AWS, Linux o redes — un toque y abres el mazo de esa
          categoría.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {rows.map(({ cat, stats }, i) => {
          const isOn = selected === cat.id;
          const href = `/estudiar?category=${encodeURIComponent(cat.id)}&start=10`;
          return (
            <li key={cat.id}>
              <Link
                href={href}
                onMouseEnter={() => setSelected(cat.id)}
                onFocus={() => setSelected(cat.id)}
                className={cn(
                  "group relative flex min-h-[5.5rem] items-center gap-3 px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-200",
                  "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                  toneClasses(cat.tone, isOn),
                )}
                style={{
                  borderRadius: BLOB_RADIUS[cat.id],
                  animationDelay: `${i * 60}ms`,
                }}
                aria-label={`${cat.title}: ${stats.mastered} de ${stats.total} dominados`}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    cat.tone === "cream" || cat.tone === "orange" || isOn
                      ? "bg-black/12"
                      : "bg-white/10",
                  )}
                >
                  <CategoryGlyph kind={cat.glyph} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="font-display block text-[0.95rem] font-semibold leading-snug sm:text-base">
                    {cat.title}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-xs leading-snug",
                      cat.tone === "cream" || cat.tone === "orange" || isOn
                        ? "text-black/60"
                        : "text-white/65",
                    )}
                  >
                    {cat.subtitle}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block text-[10px] font-semibold uppercase tracking-wider tabular-nums",
                      cat.tone === "cream" || cat.tone === "orange" || isOn
                        ? "text-black/45"
                        : "text-white/45",
                    )}
                  >
                    {stats.mastered}/{stats.total} · {stats.pct}%
                  </span>
                </span>

                {isOn ? (
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[var(--accent-foreground)]"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                      <path
                        d="M5 12.5l5 5L19 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm",
                      cat.tone === "cream"
                        ? "bg-black/8 text-black/50"
                        : "bg-white/10 text-white/70",
                    )}
                    aria-hidden
                  >
                    →
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
