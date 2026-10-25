"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  ProgressOverview,
  PublicUser,
  TopicProgressRow,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { ExamCountdown } from "@/components/study/exam-countdown";
import { TopicFolders } from "@/components/study/topic-folders";
import { buttonVariants } from "@/components/ui/button";
import {
  clearAuth,
  fetchMe,
  fetchProgressOverview,
  fetchTopicProgress,
  getStoredToken,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [topics, setTopics] = useState<TopicProgressRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (err) {
      clearAuth();
      setUser(null);
      setError(err instanceof Error ? err.message : "Sesión inválida");
      return;
    }
    try {
      const [ov, byTopic] = await Promise.all([
        fetchProgressOverview(),
        fetchTopicProgress(),
      ]);
      setOverview(ov);
      setTopics(byTopic.topics);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Progreso no disponible: ${err.message}`
          : "Progreso no disponible",
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) {
    return (
      <div
        className="mx-auto px-4 py-20 text-center text-sm text-[var(--foreground-muted)]"
        aria-busy="true"
      >
        {error ?? "…"}
      </div>
    );
  }

  const pct = overview?.masteryPct ?? 0;

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex min-w-0 items-baseline justify-between gap-3">
        <h1 className="font-display min-w-0 truncate text-2xl font-semibold tracking-tight">
          @{user.username}
        </h1>
        <p className="shrink-0 font-mono text-sm tabular-nums text-[var(--accent)]">
          {pct}%
        </p>
      </header>

      <ExamCountdown className="mt-5" examDate={user.examDate} compact />

      <TopicFolders topics={topics} className="mt-7" />

      <Link
        href="/estudiar?start=10"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-7 inline-flex w-full justify-center lowercase",
        )}
      >
        empezar 10
      </Link>

      {overview?.activeSessions?.length ? (
        <ul className="mt-8 space-y-0 border-t border-[var(--border)]">
          {overview.activeSessions.map((s) => (
            <li
              key={s.id}
              className="flex min-w-0 items-center justify-between gap-3 border-b border-[var(--border)] py-3"
            >
              <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]">
                {STUDY_MODE_LABELS[s.mode]} {s.answered}/{s.size}
              </p>
              <Link
                href={
                  s.mode === "EXAM_TIMED"
                    ? `/estudiar/examen?session=${s.id}`
                    : s.mode === "WEAK_REVIEW"
                      ? "/mas-falladas"
                      : `/estudiar?session=${s.id}`
                }
                className="shrink-0 text-sm font-semibold text-[var(--accent)]"
              >
                Continuar
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
