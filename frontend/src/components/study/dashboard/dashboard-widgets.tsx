"use client";

import type {
  PodiumResponse,
  ProgressOverview,
  TopicProgressRow,
  UserExam,
} from "@aps/shared";
import { PodiumPlaceWidget } from "./podium-place-widget";
import { TodayGoalWidget } from "./today-goal-widget";
import { WeakTopicsWidget } from "./weak-topics-widget";

export function DashboardWidgets({
  overview,
  topics,
  topicsLoaded,
  podium,
  podiumError,
  exams,
  examsError,
  timeZone,
}: {
  overview: ProgressOverview | null;
  topics: TopicProgressRow[];
  topicsLoaded: boolean;
  podium: PodiumResponse | null;
  podiumError: boolean;
  exams: UserExam[] | null;
  examsError: boolean;
  timeZone: string;
}) {
  return (
    <section
      aria-labelledby="tu-progreso"
      className="mx-auto mt-10 max-w-md md:mx-0 md:mt-0 md:max-w-none"
    >
      <h2
        id="tu-progreso"
        className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)] lg:text-xl"
      >
        Tu progreso
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 lg:mt-4">
        <TodayGoalWidget
          exams={exams}
          overview={overview}
          timeZone={timeZone}
          examsError={examsError}
        />
        <PodiumPlaceWidget podium={podium} error={podiumError} />
        <WeakTopicsWidget topics={topics} loading={!topicsLoaded} />
      </div>
    </section>
  );
}
