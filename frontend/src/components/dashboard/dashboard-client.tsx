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
import { Mascot } from "@/components/brand/mascot";
import { DASHBOARD_TILE, DASHBOARD_TRACKS } from "./dashboard-grid";
import {
  DashboardHero,
  HERO_EXAM_PANE,
  HERO_EXAM_SKELETON,
  HERO_GREETING,
  HERO_MASCOT_SIZE,
  HERO_TILE,
} from "./dashboard-hero";
import { DashboardWidgets } from "./dashboard-widgets";
import { NewGameCard, resumeHref } from "@/components/study/new-game-card";
import { BentoGrid } from "@/components/ui/bento";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageContainer } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import {
  clearAuth,
  fetchMe,
  fetchMyExams,
  fetchPodium,
  fetchProgressOverview,
  fetchTopicProgress,
  getStoredToken,
} from "@/lib/api";
import { cn } from "@/lib/utils";

/** Same grid as Inicio: greeting · mascot · exam row, "Nueva partida" deck and the progress tiles. */
function DashboardSkeleton() {
  return (
    <PageContainer
      width="wide"
      className="[@media(max-height:500px)]:md:py-5"
      aria-busy="true"
    >
      <p className="sr-only" role="status">
        Cargando tu inicio…
      </p>
      <BentoGrid flowOnMobile className={DASHBOARD_TRACKS}>
        <div className={HERO_TILE}>
          <div className={HERO_GREETING}>
            <div className="min-w-0 flex-1">
              <Skeleton className="block h-10 w-56 max-w-full sm:h-12 sm:w-72 xl:h-14 xl:w-96" />
              <p className="mt-2 text-base text-[var(--foreground-muted)] sm:text-lg">
                Así vas con tu certificación.
              </p>
            </div>
            <div aria-hidden className="shrink-0">
              <Mascot
                pose="wave"
                size="lg"
                priority
                glow={false}
                className={HERO_MASCOT_SIZE}
              />
            </div>
          </div>
          <div className={HERO_EXAM_PANE}>
            <Skeleton className={HERO_EXAM_SKELETON} />
          </div>
        </div>
        <div className={DASHBOARD_TILE.newGame}>
          <Skeleton className="block h-[26rem] w-full rounded-2xl md:h-full md:min-h-[26rem]" />
        </div>
        <DashboardWidgets
          overview={null}
          progressError={false}
          topics={[]}
          topicsLoaded={false}
          podium={null}
          podiumError={false}
          exams={null}
          examsError={false}
          timeZone="America/Mexico_City"
        />
      </BentoGrid>
    </PageContainer>
  );
}

export function DashboardClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [progressError, setProgressError] = useState(false);
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
    } catch {
      setProgressError(true);
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
    return error ? (
      <PageContainer
        width="narrow"
        className="flex justify-center py-20 sm:py-20 lg:py-20"
      >
        <Notice tone="danger" boxed className="w-full">
          {error}
        </Notice>
      </PageContainer>
    ) : (
      <DashboardSkeleton />
    );
  }

  const activeSessions = overview?.activeSessions ?? [];
  const hasActive = activeSessions.length > 0;
  const primarySession = hasActive ? activeSessions[0] : null;
  const otherSessions = hasActive ? activeSessions.slice(1) : [];

  return (
    <PageContainer width="wide" className="[@media(max-height:500px)]:md:py-5">
      <BentoGrid flowOnMobile className={DASHBOARD_TRACKS}>
        <DashboardHero
          user={user}
          onUserChange={setUser}
          onExamsChange={onExamsChange}
        />

        <div className={cn("flex flex-col gap-5 lg:gap-6", DASHBOARD_TILE.newGame)}>
          <NewGameCard
            topics={topics}
            primarySession={primarySession}
            className="flex-1"
          />

          {otherSessions.length ? (
            <ul className="space-y-2">
              {otherSessions.map((s) => (
                <Card
                  as="li"
                  key={s.id}
                  variant="flat"
                  padding="none"
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]">
                    {STUDY_MODE_LABELS[s.mode]} {s.answered}/{s.size}
                  </p>
                  <Link
                    href={resumeHref(s)}
                    className={cn(
                      buttonVariants({ variant: "soft", size: "xs" }),
                      "shrink-0",
                    )}
                  >
                    Continuar
                  </Link>
                </Card>
              ))}
            </ul>
          ) : null}
        </div>

        <DashboardWidgets
          overview={overview}
          progressError={progressError}
          topics={topics}
          topicsLoaded={topicsLoaded}
          podium={podium}
          podiumError={podiumError}
          exams={exams}
          examsError={examsError}
          timeZone={user.timezone || "America/Mexico_City"}
        />
      </BentoGrid>
    </PageContainer>
  );
}
