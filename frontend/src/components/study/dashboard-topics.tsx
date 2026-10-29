"use client";

import type { TopicProgressRow } from "@aps/shared";
import { TopicFolders } from "@/components/study/topic-folders";
import { STUDY_GROUPS } from "@/lib/study-categories";

export function DashboardTopics({ topics }: { topics: TopicProgressRow[] }) {
  return (
    <>
      {STUDY_GROUPS.map((g) => (
        <section
          key={g.id}
          className="mt-10 lg:mt-14"
          aria-labelledby={`grupo-${g.id}`}
        >
          <h2
            id={`grupo-${g.id}`}
            className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)] lg:text-xl"
          >
            {g.title}
          </h2>
          <TopicFolders topics={topics} group={g.id} className="mt-3 lg:mt-4" />
        </section>
      ))}
    </>
  );
}
