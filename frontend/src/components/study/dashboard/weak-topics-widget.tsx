"use client";

import Link from "next/link";
import { TrendingDown } from "lucide-react";
import type { TopicProgressRow } from "@aps/shared";
import { ALL_INICIO_TOPIC_IDS } from "@/lib/study-categories";
import { DashboardTile, TileMessage, tilePillClass } from "./dashboard-tile";

const WEAK_TOPICS_SHOWN = 3;

function weakestTopics(topics: TopicProgressRow[]): TopicProgressRow[] {
  const inicio = new Set(ALL_INICIO_TOPIC_IDS);
  return topics
    .filter(
      (t) =>
        inicio.has(t.topicId) &&
        !t.topicId.startsWith("topic-aif-") &&
        t.masteryPct < 100,
    )
    .sort(
      (a, b) =>
        a.masteryPct - b.masteryPct ||
        b.total - b.mastered - (a.total - a.mastered) ||
        a.topicName.localeCompare(b.topicName, "es"),
    )
    .slice(0, WEAK_TOPICS_SHOWN);
}

export function WeakTopicsWidget({
  topics,
  loading,
}: {
  topics: TopicProgressRow[];
  loading: boolean;
}) {
  const weakest = weakestTopics(topics);

  return (
    <DashboardTile
      id="widget-temas-debiles"
      title="Tus temas más débiles"
      icon={<TrendingDown className="size-4" />}
    >
      {loading ? (
        <TileMessage>Cargando…</TileMessage>
      ) : weakest.length === 0 ? (
        <TileMessage>
          {topics.length
            ? "Dominas todos los temas. ¡Excelente trabajo!"
            : "Aún no hay temas para mostrar."}
        </TileMessage>
      ) : (
        <ul className="space-y-4">
          {weakest.map((t) => {
            const pct = Math.round(t.masteryPct);
            return (
              <li key={t.topicId} className="flex min-w-0 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-baseline justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">
                      {t.topicName}
                    </p>
                    <p className="shrink-0 text-xs tabular-nums text-[var(--foreground-muted)]">
                      {pct}%
                    </p>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`Dominio de ${t.topicName}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]"
                  >
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
                <Link
                  href={`/estudiar?topics=${encodeURIComponent(t.topicId)}&start=10`}
                  className={tilePillClass}
                  aria-label={`Practicar ${t.topicName}`}
                >
                  Practicar
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardTile>
  );
}
