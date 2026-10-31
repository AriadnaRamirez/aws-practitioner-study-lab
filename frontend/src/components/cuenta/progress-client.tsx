"use client";

import { useEffect, useState } from "react";
import type { ProgressOverview, TopicProgressRow } from "@aps/shared";
import { BentoGrid } from "@/components/ui/bento";
import { Card, CardLabel } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/spinner";
import { fetchProgressOverview, fetchTopicProgress } from "@/lib/api";
import { STUDY_GROUPS, categoriesInGroup } from "@/lib/study-categories";
import { cn } from "@/lib/utils";

type ProgressSection = {
  id: string;
  title: string;
  rows: TopicProgressRow[];
};

/** Servicios de AWS / Conceptos por módulo; cualquier otro tema al final. */
function groupTopics(topics: TopicProgressRow[]): ProgressSection[] {
  const byId = new Map(topics.map((t) => [t.topicId, t]));
  const placed = new Set<string>();
  const sections: ProgressSection[] = STUDY_GROUPS.map((g) => {
    const rows = categoriesInGroup(g.id)
      .flatMap((c) => c.topicIds)
      .map((id) => byId.get(id))
      .filter((t): t is TopicProgressRow => Boolean(t));
    rows.forEach((t) => placed.add(t.topicId));
    return { id: g.id, title: g.title, rows };
  });
  const rest = topics.filter((t) => !placed.has(t.topicId));
  if (rest.length) sections.push({ id: "otros", title: "Otros temas", rows: rest });
  return sections.filter((s) => s.rows.length > 0);
}

/** Two equal tiles per row from md; an odd last group takes the whole row. */
const PROGRESS_GRID = "gap-5 md:grid-cols-2";

/** Mastery per topic, shown under Cuenta › Progreso. */
export function ProgressPanel() {
  const [topics, setTopics] = useState<TopicProgressRow[] | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopicProgress().then(
      (res) => setTopics(res.topics),
      (err) => {
        setError(err instanceof Error ? err.message : "Error al cargar");
        setTopics([]);
      },
    );
    fetchProgressOverview().then(setOverview, () => {});
  }, []);

  return (
    <section aria-label="Progreso por tema">
      <p className="text-sm text-[var(--foreground-muted)]">
        {overview
          ? `Dominas ${overview.masteredItems} de ${overview.totalTrackableItems} conceptos (${Math.round(overview.masteryPct)}%). Un concepto queda dominado al acertar su carta 3 veces seguidas.`
          : "Cuántos conceptos dominas de cada tema."}
      </p>
      {error ? (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      ) : null}
      {topics == null ? (
        <BentoGrid className={cn(PROGRESS_GRID, "mt-6")} aria-busy="true">
          <p className="sr-only" role="status">
            Cargando tu progreso por tema…
          </p>
          {[0, 1].map((i) => (
            <Card key={i} aria-hidden>
              <Skeleton className="block h-4 w-32" />
              <ul className="mt-4 space-y-4">
                {[0, 1, 2, 3].map((j) => (
                  <li key={j}>
                    <div className="flex items-baseline justify-between gap-3">
                      <Skeleton className="block h-4 w-1/2" />
                      <Skeleton className="block h-4 w-16" />
                    </div>
                    <Skeleton className="mt-2 block h-2.5 w-full rounded-full" />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </BentoGrid>
      ) : topics.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--foreground-muted)]">
          Todavía no hay temas con contenido publicado.
        </p>
      ) : (
        <BentoGrid className={cn(PROGRESS_GRID, "mt-6")}>
          {groupTopics(topics).map((section, i, all) => (
            <Card
              as="section"
              key={section.id}
              aria-labelledby={`progreso-${section.id}`}
              className={cn(i === all.length - 1 && i % 2 === 0 && "md:col-span-2")}
            >
              <CardLabel as="h2" id={`progreso-${section.id}`}>
                {section.title}
              </CardLabel>
              <ul className="mt-4 space-y-4">
                {section.rows.map((t) => (
                  <li key={t.topicId}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium">{t.topicName}</span>
                      <span className="shrink-0 tabular-nums text-[var(--foreground-muted)]">
                        {t.mastered}/{t.total} · {Math.round(t.masteryPct)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={t.masteryPct}
                      size="md"
                      className="mt-2"
                    />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </BentoGrid>
      )}
    </section>
  );
}
