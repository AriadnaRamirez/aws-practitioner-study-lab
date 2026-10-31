"use client";

import type {
  PodiumResponse,
  ProgressOverview,
  TopicProgressRow,
  UserExam,
} from "@aps/shared";
import { SectionTitle } from "@/components/ui/page";
import { dashboardSlots } from "./dashboard-grid";
import { PodiumPlaceWidget } from "./podium-place-widget";
import { TodayGoalWidget } from "./today-goal-widget";
import { WeakTopicsWidget } from "./weak-topics-widget";

/**
 * Goal, podium and weak topics. The podium hides when it can't load (or is turned off) and the weak
 * topics when there are no topics to rank; the grid gives their cells to the remaining tiles.
 */
export function DashboardWidgets({
  overview,
  progressError,
  topics,
  topicsLoaded,
  podium,
  podiumError,
  exams,
  examsError,
  timeZone,
}: {
  overview: ProgressOverview | null;
  progressError: boolean;
  topics: TopicProgressRow[];
  topicsLoaded: boolean;
  podium: PodiumResponse | null;
  podiumError: boolean;
  exams: UserExam[] | null;
  examsError: boolean;
  timeZone: string;
}) {
  const showPodium = !podiumError;
  const showWeak = !progressError && (!topicsLoaded || topics.length > 0);
  const slots = dashboardSlots(showPodium, showWeak);

  return (
    <>
      <SectionTitle id="tu-progreso" className="mx-auto mt-10 max-w-md md:sr-only">
        Tu progreso
      </SectionTitle>
      <TodayGoalWidget
        exams={exams}
        overview={overview}
        progressError={progressError}
        timeZone={timeZone}
        examsError={examsError}
        className={slots.goal}
      />
      {showPodium ? (
        <PodiumPlaceWidget podium={podium} className={slots.podium} />
      ) : null}
      {showWeak ? (
        <WeakTopicsWidget
          topics={topics}
          loading={!topicsLoaded}
          className={slots.weak}
        />
      ) : null}
    </>
  );
}
