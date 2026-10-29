"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  PodiumResponse,
  ProgressOverview,
  PublicUser,
  TopicProgressRow,
  UserExam,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { DashboardHero } from "@/components/study/dashboard-hero";
import { DashboardWidgets } from "@/components/study/dashboard/dashboard-widgets";
import { tileLinkClass } from "@/components/study/dashboard/dashboard-tile";
import { NewGameCard, resumeHref } from "@/components/study/new-game-card";
import {
  clearAuth,
  fetchMe,
  fetchMyExams,
  fetchPodium,
  fetchProgressOverview,
  fetchTopicProgress,
  getStoredToken,
} from "@/lib/api";

export function DashboardClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [topics, setTopics] = useState<TopicProgressRow[]>([]);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [podium, setPodium] = useState<PodiumResponse | null>(null);
  const [podiumError, setPodiumError] = useState(false);
  const [exams, setExams] = useState<UserExam[] | null>(null);
  const [examsError, setExamsError] = useState(false);
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
    fetchPodium("all").then(setPodium, () => setPodiumError(true));
    fetchMyExams().then(setExams, () => setExamsError(true));
    try {
      const [ov, byTopic] = await Promise.all([
        fetchProgressOverview(),
        fetchTopicProgress(),
      ]);
      setOverview(ov);
      setTopics(byTopic.topics);
      setTopicsLoaded(true);
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

  const onExamsChange = useCallback((next: UserExam[]) => {
    setExams(next);
    setExamsError(false);
  }, []);

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

  const activeSessions = overview?.activeSessions ?? [];
  const hasActive = activeSessions.length > 0;
  const primarySession = hasActive ? activeSessions[0] : null;
  const otherSessions = hasActive ? activeSessions.slice(1) : [];

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl px-6 py-8 sm:px-6 sm:py-10 md:max-w-5xl lg:max-w-6xl lg:px-8 lg:py-12 [@media(max-height:500px)]:md:py-5">
      <div className="md:[&>section]:max-w-none">
        <DashboardHero
          user={user}
          overview={overview}
          onUserChange={setUser}
          onExamsChange={onExamsChange}
        />
      </div>

      <div className="md:mt-8 md:grid md:grid-cols-2 md:items-start md:gap-8 lg:mt-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] [@media(max-height:500px)]:md:mt-5">
        <div className="min-w-0 md:sticky md:top-24 [@media(max-height:640px)]:md:static">
          <NewGameCard topics={topics} primarySession={primarySession} />

          {otherSessions.length ? (
            <ul className="mx-auto mt-5 max-w-md space-y-2 md:max-w-none lg:mt-6">
              {otherSessions.map((s) => (
                <li
                  key={s.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-[var(--surface)] px-4 py-3"
                >
                  <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]">
                    {STUDY_MODE_LABELS[s.mode]} {s.answered}/{s.size}
                  </p>
                  <Link href={resumeHref(s)} className={`shrink-0 ${tileLinkClass}`}>
                    Continuar
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <DashboardWidgets
          overview={overview}
          topics={topics}
          topicsLoaded={topicsLoaded}
          podium={podium}
          podiumError={podiumError}
          exams={exams}
          examsError={examsError}
          timeZone={user.timezone || "America/Mexico_City"}
        />
      </div>
    </div>
  );
}
