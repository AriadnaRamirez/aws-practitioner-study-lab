/** Study session contracts — maestro §4 / APS-8–10. */

export type StudyMode =
  | 'FLASH_STUDY'
  | 'EXAM_STUDY'
  | 'EXAM_TIMED'
  | 'WEAK_REVIEW';

export const STUDY_MODES = [
  'FLASH_STUDY',
  'EXAM_STUDY',
  'EXAM_TIMED',
  'WEAK_REVIEW',
] as const satisfies readonly StudyMode[];

/** Session sizes for study practice (EXAM_STUDY / FLASH_STUDY). Mock 65 is EXAM_TIMED only. */
export const STUDY_SIZES = [10, 20, 30, 50] as const;
export type StudySize = (typeof STUDY_SIZES)[number];

/** Practice sizes + mock completo CLF (65) for EXAM_TIMED. */
export type SessionSize = 10 | 20 | 30 | 50 | 65;

export const EXAM_TIMED_SIZES = [
  10, 20, 30, 50, 65,
] as const satisfies readonly SessionSize[];

/**
 * Timer table (maestro §4.3): ~83 s/pregunta; mock 65 → 90 min.
 * 10→14m, 20→28m, 30→42m, 50→69m, 65→90m.
 */
export const EXAM_TIMED_LIMIT_SEC: Record<SessionSize, number> = {
  10: 14 * 60, // 840
  20: 28 * 60, // 1680
  30: 42 * 60, // 2520
  50: 69 * 60, // 4140
  65: 90 * 60, // 5400
};

export function examTimedLimitSec(size: SessionSize): number {
  return EXAM_TIMED_LIMIT_SEC[size];
}

/** How many cards ahead a miss is re-queued (intra-session miss-repeat). */
export const MISS_REPEAT_OFFSET = 3;

/** Consecutive item hits required for mastery (flash / study). */
export const MASTERY_STREAK = 3;

export type StudyItemType = 'KNOWLEDGE' | 'EXAM_QUESTION';

export const STUDY_ITEM_TYPES = [
  'KNOWLEDGE',
  'EXAM_QUESTION',
] as const satisfies readonly StudyItemType[];

/** Prompt shown to the learner (no answer key until after submit). */
export interface StudyPrompt {
  /** Stable id for this appearance in the queue (miss-repeats get new ids). */
  queueItemId: string;
  itemId: string;
  /** Flash variant label when mode is FLASH_STUDY. */
  variant?: string;
  stem: string;
  choices: [string, string, string, string];
}

export interface StartStudySessionRequest {
  mode: StudyMode;
  /** FLASH/EXAM_STUDY: 10/20/30/50. EXAM_TIMED: also 65. */
  size: SessionSize;
  /** Optional topic filter; omit = whole published bank for the mode. */
  topicIds?: string[];
  /** Snapshot timezone for EXAM_TIMED / daily streak. */
  timezone?: string;
}

export interface StudySessionView {
  sessionId: string;
  mode: StudyMode;
  /** Requested size (may exceed bank; actual unique count is `uniqueItems`). */
  size: number;
  uniqueItems: number;
  remaining: number;
  sessionStreak: number;
  maxSessionStreak: number;
  answered: number;
  masteredInSession: number;
  dailyStreak: number;
  current: StudyPrompt | null;
  status: 'active' | 'completed';
}

export interface AnswerStudyRequest {
  queueItemId: string;
  choiceIndex: 0 | 1 | 2 | 3;
  latencyMs?: number;
}

export interface StudySessionSummary {
  sessionId: string;
  mode: StudyMode;
  uniqueItems: number;
  answered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  missRepeats: number;
  maxSessionStreak: number;
  masteredInSession?: number;
  accuracyPct: number;
  dailyStreak?: number;
  longestDailyStreak?: number;
}

export interface AnswerStudyResponse {
  correct: boolean;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  itemMastered?: boolean;
  itemConsecutiveCorrect?: number;
  sessionStreak: number;
  remaining: number;
  finished: boolean;
  next: StudyPrompt | null;
  summary?: StudySessionSummary;
}

/* —— EXAM_TIMED (APS-10) —— */

export type TimedSessionStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

/** Question payload while the timed exam is live — no key / explanation. */
export interface ExamTimedQuestionView {
  id: string;
  stem: string;
  choices: [string, string, string, string];
  topicId: string;
}

export interface ExamTimedSessionView {
  id: string;
  mode: 'EXAM_TIMED';
  size: SessionSize;
  timeLimitSec: number;
  startedAt: string;
  endsAt: string;
  status: TimedSessionStatus;
  remainingSec: number;
  questions: ExamTimedQuestionView[];
  /** choiceIndex 0–3, or null if unanswered */
  answers: Record<string, 0 | 1 | 2 | 3 | null>;
  markedForReview: string[];
  answeredCount: number;
}

export interface ExamTimedMistake {
  questionId: string;
  stem: string;
  choices: [string, string, string, string];
  selectedIndex: 0 | 1 | 2 | 3 | null;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  topicId: string;
}

export interface ExamTimedSummary {
  sessionId: string;
  mode: 'EXAM_TIMED';
  size: SessionSize;
  status: 'SUBMITTED' | 'EXPIRED';
  scorePercent: number;
  correctCount: number;
  totalCount: number;
  unansweredCount: number;
  timeLimitSec: number;
  timeUsedSec: number;
  startedAt: string;
  endedAt: string;
  mistakes: ExamTimedMistake[];
}

export interface AnswerExamTimedRequest {
  questionId: string;
  choiceIndex: 0 | 1 | 2 | 3;
}

export interface MarkReviewRequest {
  questionId: string;
  marked: boolean;
}
