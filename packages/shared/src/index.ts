/** Shared contracts for AWS Practitioner Study Lab. */

export const APP_NAME = 'AWS Practitioner Study Lab';
export const API_PREFIX = 'api/v1';

export type HealthStatus = 'ok' | 'degraded';

export interface HealthResponse {
  status: HealthStatus;
  service: 'api';
  app: typeof APP_NAME;
  timestamp: string;
}

export * from './auth';
export {
  TOPIC_TYPES,
  FLASH_VARIANTS,
  CONTENT_STATUSES,
  DEFAULT_TRACK_ID,
  type TopicType,
  type FlashVariant,
  type ContentStatus,
  type Topic,
  type KnowledgeItem,
  type ExamChoices,
  type ExamQuestion,
} from './content';
export {
  STUDY_MODES,
  STUDY_SIZES,
  EXAM_TIMED_SIZES,
  EXAM_TIMED_LIMIT_SEC,
  examTimedLimitSec,
  MISS_REPEAT_OFFSET,
  MASTERY_STREAK,
  type StudyMode,
  type StudySize,
  type SessionSize,
  type TimedSessionStatus,
  type StudyPrompt,
  type StartStudySessionRequest,
  type StudySessionView,
  type AnswerStudyRequest,
  type AnswerStudyResponse,
  type StudySessionSummary,
  type ExamTimedQuestionView,
  type ExamTimedSessionView,
  type ExamTimedMistake,
  type ExamTimedSummary,
  type AnswerExamTimedRequest,
  type MarkReviewRequest,
} from './study';
export {
  GUEST_PROBE_STORAGE_KEY,
  GUEST_MAX_SESSIONS,
  GUEST_SAMPLE_SIZE,
  type GuestProbe,
  type UsageSummary,
  type AdminUserRow,
  type AdminGuestRow,
} from './guest';
