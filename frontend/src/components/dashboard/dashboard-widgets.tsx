"use client";

import type { ProgressOverview, TopicProgressRow, UserExam } from "@aps/shared";
import { SectionTitle } from "@/components/ui/page";
import { dashboardSlots } from "./dashboard-grid";
import { TodayGoalWidget } from "./today-goal-widget";
import { WeakTopicsWidget } from "./weak-topics-widget";

/**
 * Goal and weak topics. The weak topics hide when there are no topics to rank; the grid then gives
 * their cells to the goal.
 */
export function DashboardWidgets({
  overview,
  progressError,
  topics,
  topicsLoaded,
  exams,
  examsError,
  timeZone,
}: {
  overview: ProgressOverview | null;
  progressError: boolean;
  topics: TopicProgressRow[];
  topicsLoaded: boolean;
  exams: UserExam[] | null;
  examsError: boolean;
  timeZone: string;
}) {
  const showWeak = !progressError && (!topicsLoaded || topics.length > 0);
  const slots = dashboardSlots(showWeak);

  return (
    <>
      <SectionTitle
        id="tu-progreso"
        className="mx-auto mt-10 max-w-md md:sr-only"
      >
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
      {showWeak ? (
        <WeakTopicsWidget
          topics={topics}
          loading={!topicsLoaded}
          hasPlayed={overview ? overview.hasPlayed : null}
          className={slots.weak}
        />
      ) : null}
    </>
  );
}
