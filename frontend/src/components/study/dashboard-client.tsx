"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  ActiveSessionSummary,
  ProgressOverview,
  PublicUser,
  TopicProgressRow,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
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

function resumeHref(s: ActiveSessionSummary): string {
  if (s.mode === "EXAM_TIMED") return `/estudiar/examen?session=${s.id}`;
  if (s.mode === "WEAK_REVIEW") return "/mas-falladas";
  return `/estudiar?session=${s.id}`;
}

function streakLabel(n: number): string {
  return n === 1 ? "1 día" : `${n} días`;
}

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
  const dailyStreak = overview?.dailyStreak ?? 0;
  const activeSessions = overview?.activeSessions ?? [];
  const hasActive = activeSessions.length > 0;
  const primarySession = hasActive ? activeSessions[0] : null;
  const otherSessions = hasActive ? activeSessions.slice(1) : [];

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display min-w-0 truncate text-2xl font-semibold tracking-tight">
            @{user.username}
          </h1>
          <p className="mt-0.5 font-mono text-sm tabular-nums text-[var(--foreground)]">
            {pct}%
          </p>
          <p
            className="mt-1 text-sm text-[var(--foreground-muted)]"
            aria-label={`Racha diaria: ${streakLabel(dailyStreak)}`}
          >
            Racha{" "}
            <span className="font-mono tabular-nums text-[var(--foreground)]">
              {dailyStreak}
            </span>
            <span className="text-[var(--foreground-muted)]">
              {" "}
              · {streakLabel(dailyStreak)}
            </span>
          </p>
        </div>
        <Mascot pose="wave" size="sm" className="shrink-0" />
      </header>

      <ExamCountdown className="mt-5" examDate={user.examDate} compact />

      <TopicFolders topics={topics} className="mt-7" />

      {primarySession ? (
        <div className="mt-7 space-y-3">
          <Link
            href={resumeHref(primarySession)}
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex w-full justify-center",
            )}
          >
            Continuar
          </Link>
          <p className="text-center text-xs text-[var(--foreground-muted)]">
            {STUDY_MODE_LABELS[primarySession.mode]}{" "}
            {primarySession.answered}/{primarySession.size}
          </p>
          <Link
            href="/estudiar?start=10"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "inline-flex w-full justify-center",
            )}
          >
            Empezar 10
          </Link>
        </div>
      ) : (
        <Link
          href="/estudiar?start=10"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-7 inline-flex w-full justify-center",
          )}
        >
          Empezar 10
        </Link>
      )}

      {otherSessions.length ? (
        <ul className="mt-6 space-y-0 border-t border-[var(--border)]">
          {otherSessions.map((s) => (
            <li
              key={s.id}
              className="flex min-w-0 items-center justify-between gap-3 border-b border-[var(--border)] py-3"
            >
              <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]">
                {STUDY_MODE_LABELS[s.mode]} {s.answered}/{s.size}
              </p>
              <Link
                href={resumeHref(s)}
                className="shrink-0 text-sm font-semibold text-[var(--foreground)]"
              >
                Continuar
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <nav
        className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)] pt-6 text-sm"
        aria-label="Atajos"
      >
        <Link href="/podio" className="hover:text-[var(--foreground)]">
          Podio
        </Link>
        <Link href="/mas-falladas" className="hover:text-[var(--foreground)]">
          Más falladas
        </Link>
      </nav>
    </div>
  );
}
