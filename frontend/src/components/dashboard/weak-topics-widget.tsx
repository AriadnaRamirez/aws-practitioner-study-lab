"use client";

import Link from "next/link";
import { TrendingDown } from "lucide-react";
import type { TopicProgressRow } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/spinner";
import { ALL_INICIO_TOPIC_IDS } from "@/lib/study-categories";
import { cn } from "@/lib/utils";
import { DashboardTile, TileLoading, TileMessage } from "./dashboard-tile";

const WEAK_TOPICS_SHOWN = 3;

/** One row per topic; a tile wide enough for the longest topic name lays the three side by side. */
const TOPIC_LIST =
  "space-y-4 @min-[58rem]:grid @min-[58rem]:grid-cols-3 @min-[58rem]:gap-x-6 @min-[58rem]:space-y-0";

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
  className,
}: {
  topics: TopicProgressRow[];
  loading: boolean;
  className?: string;
}) {
  const weakest = weakestTopics(topics);

  return (
    <DashboardTile
      id="widget-temas-debiles"
      title="Tus temas más débiles"
      icon={<TrendingDown aria-hidden />}
      className={cn("@container", className)}
    >
      {loading ? (
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
                  <ProgressBar
                    value={pct}
                    label={`Dominio de ${t.topicName}`}
                    className="mt-1.5"
                  />
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
    </DashboardTile>
  );
}
