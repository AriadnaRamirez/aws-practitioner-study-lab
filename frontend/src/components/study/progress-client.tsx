"use client";

import { useEffect, useState } from "react";
import type { ProgressOverview, TopicProgressRow } from "@aps/shared";
import { fetchProgressOverview, fetchTopicProgress } from "@/lib/api";
import { STUDY_GROUPS, categoriesInGroup } from "@/lib/study-categories";

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
        <p className="mt-4 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {topics == null ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-[var(--surface)]" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--foreground-muted)]">
          Todavía no hay temas con contenido publicado.
        </p>
      ) : (
        <div className="mt-6 grid items-start gap-5 md:grid-cols-2 lg:gap-6">
          {groupTopics(topics).map((section) => (
            <section
              key={section.id}
              className="min-w-0 rounded-3xl bg-[var(--surface)] p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] sm:p-6"
              aria-labelledby={`progreso-${section.id}`}
            >
              <h2
                id={`progreso-${section.id}`}
                className="font-display text-lg font-semibold tracking-tight"
              >
                {section.title}
              </h2>
              <ul className="mt-4 space-y-4">
                {section.rows.map((t) => (
                  <li key={t.topicId}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium">{t.topicName}</span>
                      <span className="shrink-0 tabular-nums text-[var(--foreground-muted)]">
                        {t.mastered}/{t.total} · {Math.round(t.masteryPct)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${Math.min(100, t.masteryPct)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
