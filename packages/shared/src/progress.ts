/** Progress / weak-list / session history — APS-11. */

import type { StudyItemType, StudyMode } from './study';

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

export interface StudyHistoryDetail extends StudyHistoryEntry {
  queue: StudyQueueItem[];
  timeLimitSec: number | null;
}

export interface StartWeakReviewRequest {
  /** Cap queue size (default: all weak items, max 50). */
  limit?: number;
}

export interface StartWeakReviewResponse {
  session: StudyHistoryDetail;
}
