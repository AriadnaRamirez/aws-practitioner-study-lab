"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, TrendingDown } from "lucide-react";
import type { TopicProgressRow } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/spinner";
import { fetchWeakItems } from "@/lib/api";
import { ALL_INICIO_TOPIC_IDS } from "@/lib/study-categories";
import { cn } from "@/lib/utils";
import {
  DashboardTile,
  TileLoading,
  TileMessage,
  tileLinkClass,
} from "./dashboard-tile";

const WEAK_TOPICS_SHOWN = 4;

/** One row per topic; a wide tile lays them out two by two. */
const TOPIC_LIST =
  "space-y-4 @min-[34rem]:grid @min-[34rem]:grid-cols-2 @min-[34rem]:gap-x-8 @min-[34rem]:gap-y-5 @min-[34rem]:space-y-0";

function ProgressLink() {
  return (
    <div className="mt-auto pt-5">
      <Link href="/cuenta?tab=progreso" className={tileLinkClass}>
        Ver tu progreso por tema
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

/**
 * Topics with the most cards still failing first; mastery only breaks ties. Early on every topic
 * sits at 0% mastery, so ranking by mastery alone would just list the biggest topics.
 */
function weakestTopics(
  topics: TopicProgressRow[],
  failing: Map<string, number>,
): TopicProgressRow[] {
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
        (failing.get(b.topicId) ?? 0) - (failing.get(a.topicId) ?? 0) ||
        a.masteryPct - b.masteryPct ||
        b.total - b.mastered - (a.total - a.mastered) ||
        a.topicName.localeCompare(b.topicName, "es"),
    )
    .slice(0, WEAK_TOPICS_SHOWN);
}

/** Cards not yet mastered that the student has failed, per topic. */
function useFailingByTopic(enabled: boolean): Map<string, number> {
  const [failing, setFailing] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchWeakItems(100)
      .then((res) => {
        if (cancelled) return;
        const counts = new Map<string, number>();
        for (const item of res.items) {
          if (!item.topicId || item.masteredAt) continue;
          counts.set(item.topicId, (counts.get(item.topicId) ?? 0) + 1);
        }
        setFailing(counts);
      })
      .catch(() => {
        /* ranking falls back to mastery only */
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return failing;
}

export function WeakTopicsWidget({
  topics,
  loading,
  hasPlayed,
  className,
}: {
  topics: TopicProgressRow[];
  loading: boolean;
  /** Unknown (null) while the overview loads. */
  hasPlayed: boolean | null;
  className?: string;
}) {
  const failing = useFailingByTopic(hasPlayed === true);
  const weakest = weakestTopics(topics, failing);

  if (hasPlayed === false) {
    return (
      <DashboardTile
        id="widget-temas-debiles"
        title="Tus temas más débiles"
        icon={<TrendingDown aria-hidden />}
        className={className}
      >
        <TileMessage>
          Aún no sabemos cuáles son. Después de tu primera partida verás aquí
          los temas que más te cuestan.
        </TileMessage>
      </DashboardTile>
    );
  }

  return (
    <DashboardTile
      id="widget-temas-debiles"
      title="Tus temas más débiles"
      icon={<TrendingDown aria-hidden />}
      className={cn("@container", className)}
    >
      {loading || hasPlayed === null ? (
        <TileLoading label="Cargando tus temas más débiles…">
          <ul className={TOPIC_LIST}>
            {Array.from({ length: WEAK_TOPICS_SHOWN }, (_, i) => (
              <li key={i} className="flex min-w-0 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <Skeleton className="block h-4 w-2/3" />
                    <Skeleton className="block h-3 w-8" />
                  </div>
                  <Skeleton className="mt-1.5 block h-2 w-full rounded-full" />
                </div>
                <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
              </li>
            ))}
          </ul>
        </TileLoading>
      ) : weakest.length === 0 ? (
        <TileMessage>
          {topics.length
            ? "Dominas todos los temas. ¡Excelente trabajo!"
            : "Aún no hay temas para mostrar."}
        </TileMessage>
      ) : (
        <ul className={TOPIC_LIST}>
          {weakest.map((t) => {
            const pct = Math.round(t.masteryPct);
            const failed = failing.get(t.topicId) ?? 0;
            return (
              <li key={t.topicId} className="flex min-w-0 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="min-w-0 text-sm font-medium leading-snug text-[var(--foreground)]">
                    {t.topicName}
                  </p>
                  <ProgressBar
                    value={pct}
                    label={`Dominio de ${t.topicName}`}
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs tabular-nums text-[var(--foreground-muted)]">
                    {failed > 0
                      ? `${failed} ${failed === 1 ? "carta fallada" : "cartas falladas"} · `
                      : ""}
                    {t.mastered} de {t.total} dominadas
                  </p>
                </div>
                <Link
                  href={`/estudiar?topics=${encodeURIComponent(t.topicId)}&start=10`}
                  className={cn(
                    buttonVariants({ variant: "soft", size: "xs" }),
                    "shrink-0",
                  )}
                  aria-label={`Practicar ${t.topicName}`}
                >
                  Practicar
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {hasPlayed && !loading ? <ProgressLink /> : null}
    </DashboardTile>
  );
}
