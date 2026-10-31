/** Progress / weak-list / session history — APS-11. */

import { MASTERY_STREAK, type StudyItemType, type StudyMode } from './study';

/** Queue entry for a session (flash or exam bank). */
export interface StudyQueueItem {
  itemType: StudyItemType;
  itemId: string;
}

/** Personal weak-list row (ItemProgress ordered by failCount). */
export interface WeakItem {
  itemType: StudyItemType;
  itemId: string;
  failCount: number;
  passCount: number;
  consecutiveCorrect: number;
  masteredAt: string | null;
  /** Display title (knowledge name or exam stem short). */
  title: string;
  subtitle?: string | null;
  topicId?: string | null;
  /** Topic display name (e.g. "Servicios de seguridad"). */
  topicName: string | null;
  /** What to remember: the definition (flash) or the correct choice (exam). */
  answer: string | null;
  explanation: string | null;
  /**
   * Latest wrong answer recorded as an Attempt (flash sessions only);
   * null when unknown.
   */
  lastFailedAt: string | null;
  /** Most frequent wrong pick (ties → most recent); null when never recorded. */
  confusedWith: string | null;
  /** Flash variant of that pick: names for DEFINITION_TO_NAME / NAME_FOCUS, definitions for NAME_TO_DEFINITION. */
  confusedVariant: string | null;
  /** How many times that same wrong option was picked. */
  confusedCount: number;
}

/** Smallest weak-review round when no explicit limit is requested. */
export const WEAK_REVIEW_MIN_ROUND = 10;
export const WEAK_REVIEW_MAX_ROUND = 50;

type WeakReviewCandidate = Pick<
  WeakItem,
  'consecutiveCorrect' | 'failCount' | 'lastFailedAt'
>;

/**
 * Weak-review queue: every card not yet mastered first (input order = most
 * failed first); only when they don't fill the round, top up with mastered
 * cards (most failed, then most recently failed).
 */
export function planWeakReview<T extends WeakReviewCandidate>(
  items: readonly T[],
  limit?: number,
): { queue: T[]; pending: number; refresh: number } {
  const pending = items.filter((i) => i.consecutiveCorrect < MASTERY_STREAK);
  const mastered = items
    .filter((i) => i.consecutiveCorrect >= MASTERY_STREAK)
    .sort(
      (a, b) =>
        b.failCount - a.failCount ||
        (b.lastFailedAt ?? '').localeCompare(a.lastFailedAt ?? ''),
    );
  const size =
    limit != null
      ? Math.min(Math.max(limit, 1), WEAK_REVIEW_MAX_ROUND)
      : Math.min(
          Math.max(pending.length, WEAK_REVIEW_MIN_ROUND),
          WEAK_REVIEW_MAX_ROUND,
        );
  const queue = [...pending, ...mastered].slice(0, size);
  const pendingIn = Math.min(pending.length, queue.length);
  return { queue, pending: pendingIn, refresh: queue.length - pendingIn };
}

export interface WeakItemsResponse {
  items: WeakItem[];
  total: number;
}

/** Session list row for historial (distinct from end-of-session StudySessionSummary). */
export interface StudyHistoryEntry {
  id: string;
  mode: StudyMode;
  size: number;
  timezone: string;
  startedAt: string;
  endedAt: string | null;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  maxStreak: number | null;
  durationMs: number | null;
}

export interface StudyHistoryResponse {
  sessions: StudyHistoryEntry[];
  total: number;
}

export interface HistoryAttemptRow {
  id: string;
  itemType: StudyItemType;
  itemId: string;
  correct: boolean;
  choiceIndex: number | null;
  variant: string | null;
  createdAt: string;
  /** Display title (knowledge name / exam stem short). */
  title: string;
  prompt: string | null;
  selectedLabel: string | null;
  correctLabel: string | null;
  explanation: string | null;
}

export interface StudyHistoryDetail extends StudyHistoryEntry {
  queue: StudyQueueItem[];
  timeLimitSec: number | null;
  /** Per-attempt breakdown when requested (historial detalle). */
  attempts?: HistoryAttemptRow[];
}

export interface StartWeakReviewRequest {
  /** Cap queue size (default: all weak items, max 50). */
  limit?: number;
}

export interface StartWeakReviewResponse {
  session: StudyHistoryDetail;
}

/** Dashboard / progress overview (CCST-parity). */
export interface ProgressOverview {
  masteredItems: number;
  totalTrackableItems: number;
  masteryPct: number;
  weakItems: number;
  dailyStreak: number;
  longestDailyStreak: number;
  /** Cards answered today (civil day in the user's timezone). */
  answeredToday: number;
  /** Cards first mastered today (civil day in the user's timezone). */
  masteredToday: number;
  /** Share of correct answers over the latest attempts (0–1); null if too few. */
  recentAccuracy: number | null;
  activeSessions: ActiveSessionSummary[];
}

export interface ActiveSessionSummary {
  id: string;
  mode: import('./study').StudyMode;
  size: number;
  answered: number;
  startedAt: string;
}

export interface TopicProgressRow {
  topicId: string;
  topicName: string;
  trackId: string;
  mastered: number;
  total: number;
  masteryPct: number;
}

export interface TopicProgressResponse {
  topics: TopicProgressRow[];
}
