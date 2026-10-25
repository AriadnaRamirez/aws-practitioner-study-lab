"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TopicProgressRow } from "@aps/shared";
import { cn } from "@/lib/utils";

type Props = {
  topics: TopicProgressRow[];
  className?: string;
  /** Prefer CLF shelf on the home dashboard. */
  trackId?: string;
};

/** Simple glyphs — one idea per folder, no emoji. */
function TopicGlyph({ kind }: { kind: string }) {
  const common = "h-5 w-5";
  switch (kind) {
    case "linux":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2c-1.4 1.6-2.2 3.4-2.2 5.2 0 1 .3 1.9.8 2.6-.9.4-1.7 1.2-2.2 2.3-.6 1.4-.6 3 .2 4.4.7 1.2 1.9 2 3.2 2.3-.2.6-.3 1.2-.3 1.8 0 .7.2 1.4.5 2H9.2c-.4-1-1.4-1.7-2.6-1.7-1.5 0-2.7 1.1-2.7 2.5v.6h16.2v-.6c0-1.4-1.2-2.5-2.7-2.5-1.2 0-2.2.7-2.6 1.7h-1.8c.3-.6.5-1.3.5-2 0-.6-.1-1.2-.3-1.8 1.3-.3 2.5-1.1 3.2-2.3.8-1.4.8-3 .2-4.4-.5-1.1-1.3-1.9-2.2-2.3.5-.7.8-1.6.8-2.6C14.2 5.4 13.4 3.6 12 2z"
          />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "compute":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <rect
            x="3"
            y="5"
            width="18"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 21h8M12 17v4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "storage":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <path
            d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "billing":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 10h18M7 14h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cloud":
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
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

function glyphFor(name: string, topicId: string): string {
  const hay = `${name} ${topicId}`.toLowerCase();
  if (hay.includes("linux")) return "linux";
  if (hay.includes("redes") || hay.includes("network") || hay.includes("vpc"))
    return "network";
  if (hay.includes("cómputo") || hay.includes("compute") || hay.includes("lambda"))
    return "compute";
  if (hay.includes("almacen") || hay.includes("storage") || hay.includes("s3"))
    return "storage";
  if (hay.includes("seguridad") || hay.includes("iam") || hay.includes("kms"))
    return "security";
  if (hay.includes("factur") || hay.includes("pricing") || hay.includes("billing"))
    return "billing";
  return "cloud";
}

function FolderCard({
  topic,
  active,
  onFocus,
}: {
  topic: TopicProgressRow;
  active: boolean;
  onFocus: () => void;
}) {
  const href = `/estudiar?topic=${encodeURIComponent(topic.topicId)}&start=10`;
  const kind = glyphFor(topic.topicName, topic.topicId);

  return (
    <Link
      href={href}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      className={cn(
        "topic-folder group relative block w-[11.5rem] shrink-0 outline-none transition-transform duration-200",
        "hover:-translate-y-1 focus-visible:-translate-y-1",
      )}
      aria-label={`Estudiar tema ${topic.topicName}, ${topic.masteryPct}% dominio`}
    >
      {/* Tab */}
      <span
        className={cn(
          "absolute left-0 top-0 z-10 h-4 w-[42%] rounded-t-xl",
          active ? "bg-[var(--accent)]" : "bg-[var(--surface-elevated)]",
        )}
        aria-hidden
      />
      {/* Body */}
      <span
        className={cn(
          "relative mt-3 flex min-h-[10.5rem] flex-col rounded-2xl rounded-tl-none p-4 ring-1 transition-colors",
          active
            ? "bg-[var(--accent)] text-[var(--accent-foreground)] ring-[var(--accent)]"
            : "bg-[var(--surface-elevated)] text-white ring-[var(--border)] group-hover:ring-[var(--border-strong)]",
        )}
      >
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              active ? "bg-black/15" : "bg-black/40 ring-1 ring-white/10",
            )}
          >
            <TopicGlyph kind={kind} />
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
              active ? "bg-black/15" : "bg-white/8 text-[var(--foreground-muted)]",
            )}
          >
            {topic.total}
          </span>
        </span>

        <span className="font-display mt-4 text-base font-semibold leading-snug">
          {topic.topicName}
        </span>
        <span
          className={cn(
            "mt-1 text-xs",
            active ? "text-black/65" : "text-[var(--foreground-muted)]",
          )}
        >
          {topic.mastered}/{topic.total} dominados
        </span>

        <span className="mt-auto pt-4">
          <span
            className={cn(
              "block h-1.5 overflow-hidden rounded-full",
              active ? "bg-black/20" : "bg-white/10",
            )}
          >
            <span
              className={cn(
                "block h-full rounded-full",
                active ? "bg-black/70" : "bg-[var(--accent)]",
              )}
              style={{ width: `${Math.min(100, topic.masteryPct)}%` }}
            />
          </span>
          <span
            className={cn(
              "mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider",
              active ? "text-black/55" : "text-[var(--foreground-muted)]",
            )}
          >
            <span>Abrir carpeta</span>
            <span className="tabular-nums">{topic.masteryPct}%</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

/**
 * Horizontal “carpetas” shelf — one folder per study topic.
 */
export function TopicFolders({ topics, className, trackId = "CLF" }: Props) {
  const shelf = useMemo(() => {
    const filtered = topics.filter((t) => t.trackId === trackId && t.total > 0);
    // Prefer a friendly order: Linux → Redes → servicios/conceptos
    const rank = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes("linux")) return 0;
      if (n.includes("redes")) return 1;
      if (n.includes("cómputo") || n.includes("compute")) return 2;
      if (n.includes("almacen")) return 3;
      if (n.includes("seguridad")) return 4;
      if (n.includes("fundament")) return 5;
      return 40 + name.localeCompare("z");
    };
    return [...filtered].sort(
      (a, b) => rank(a.topicName) - rank(b.topicName),
    );
  }, [topics, trackId]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const focused = activeId ?? shelf[0]?.topicId ?? null;

  if (shelf.length === 0) {
    return null;
  }

  return (
    <section className={cn("mt-10", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Carpetas por tema
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold">
            Elige una carpeta y estudia ese bloque
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Linux, redes, cómputo, almacenamiento y más — cada carpeta abre 10
            flashcards de ese tema.
          </p>
        </div>
        <p className="rounded-full border border-[var(--accent)]/50 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          {shelf.length} carpetas
        </p>
      </div>

      <div
        className="mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 pt-5 [scrollbar-width:thin]"
        role="list"
      >
        {shelf.map((t) => (
          <div key={t.topicId} role="listitem">
            <FolderCard
              topic={t}
              active={focused === t.topicId}
              onFocus={() => setActiveId(t.topicId)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
