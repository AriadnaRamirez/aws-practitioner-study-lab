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

/** Session sizes for study / exam practice (mock 65 is APS-10 only). */
export const STUDY_SIZES = [10, 20, 30, 50] as const;
export type StudySize = (typeof STUDY_SIZES)[number];

/** How many cards ahead a miss is re-queued (intra-session miss-repeat). */
export const MISS_REPEAT_OFFSET = 3;

/** Consecutive item hits required for mastery (flash / study). */
export const MASTERY_STREAK = 3;

/** Prompt shown to the learner (no answer key until after submit). */
export interface StudyPrompt {
  /** Stable id for this appearance in the queue (miss-repeats get new ids). */
  queueItemId: string;
  itemId: string;
  stem: string;
  choices: [string, string, string, string];
}

export interface StartStudySessionRequest {
  mode: StudyMode;
  size: StudySize;
  /** Optional topic filter; omit = whole published bank for the mode. */
  topicIds?: string[];
}

export interface StudySessionView {
  sessionId: string;
  mode: StudyMode;
  /** Requested size (may exceed bank; actual unique count is `uniqueItems`). */
  size: number;
  uniqueItems: number;
  remaining: number;
  sessionStreak: number;
  answered: number;
  current: StudyPrompt | null;
  status: 'active' | 'completed';
}

export interface AnswerStudyRequest {
  queueItemId: string;
  choiceIndex: 0 | 1 | 2 | 3;
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
  accuracyPct: number;
}

export interface AnswerStudyResponse {
  correct: boolean;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sessionStreak: number;
  remaining: number;
  finished: boolean;
  next: StudyPrompt | null;
  summary?: StudySessionSummary;
}
