"use client";

import type { ProgressOverview, TopicProgressRow } from "@aps/shared";
import { dashboardSlots } from "./dashboard-grid";
import { MinigamesWidget } from "./minigames-widget";
import { WeakTopicsWidget } from "./weak-topics-widget";

/**
 * Minigames and weak topics. The weak topics hide when there are no topics to rank; the grid then
 * gives their cells to the minigames.
 */
export function DashboardWidgets({
  overview,
  progressError,
  topics,
  topicsLoaded,
}: {
  overview: ProgressOverview | null;
  progressError: boolean;
  topics: TopicProgressRow[];
  topicsLoaded: boolean;
}) {
  const showWeak = !progressError && (!topicsLoaded || topics.length > 0);
  const slots = dashboardSlots(showWeak);

  return (
    <>
      <MinigamesWidget className={slots.games} />
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
