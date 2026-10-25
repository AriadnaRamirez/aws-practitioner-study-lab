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
  type ImportEntityKind,
  type ImportFormat,
  type ImportJobStatus,
  type ImportRowAction,
  type ImportRowResult,
  type ImportJobSummary,
  type ImportJob,
  type ContentExportBundle,
  type ImportTopicInput,
  type ImportKnowledgeInput,
  type ImportQuestionInput,
} from './content';
export {
  STUDY_MODES,
  STUDY_SIZES,
  EXAM_TIMED_SIZES,
  EXAM_TIMED_LIMIT_SEC,
  examTimedLimitSec,
  MISS_REPEAT_OFFSET,
  MASTERY_STREAK,
  STUDY_ITEM_TYPES,
  STUDY_MODE_LABELS,
  type StudyMode,
  type StudySize,
  type SessionSize,
  type StudyItemType,
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
  type AdminUpdateUserRequest,
  type AdminResetPasswordResponse,
} from './guest';
export {
  PODIUM_WINDOWS,
  type PodiumWindow,
  type PodiumMetric,
  type PodiumEntry,
  type PodiumMe,
  type PodiumResponse,
} from './podium';
export {
  FEATURE_FLAG_EXAM_TRACK_AI,
  KNOWN_FEATURE_FLAGS,
  type KnownFeatureFlagKey,
  type FeatureFlagDto,
} from './flags';
export {
  type StudyQueueItem,
  type WeakItem,
  type WeakItemsResponse,
  type StudyHistoryEntry,
  type StudyHistoryResponse,
  type StudyHistoryDetail,
  type HistoryAttemptRow,
  type StartWeakReviewRequest,
  type StartWeakReviewResponse,
  type ProgressOverview,
  type ActiveSessionSummary,
  type TopicProgressRow,
  type TopicProgressResponse,
} from './progress';
