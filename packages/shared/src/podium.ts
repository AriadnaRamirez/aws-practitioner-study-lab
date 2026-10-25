/** Podium / leaderboard contracts (APS-12). */

export const PODIUM_WINDOWS = ['all', 'week'] as const;
export type PodiumWindow = (typeof PODIUM_WINDOWS)[number];

/** Metric: count of ItemProgress rows with masteredAt set. */
export type PodiumMetric = 'masteredItems';

export interface PodiumEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
}

export interface PodiumMe {
  /** Null when the viewer has score 0 or is not on the visible board. */
  rank: number | null;
  userId: string;
  username: string;
  score: number;
  podiumHidden: boolean;
}

export interface PodiumResponse {
  window: PodiumWindow;
  metric: PodiumMetric;
  /** Rolling 7×24h for `week`; null for all-time. */
  windowStartedAt: string | null;
  computedAt: string;
  entries: PodiumEntry[];
  me: PodiumMe;
}
