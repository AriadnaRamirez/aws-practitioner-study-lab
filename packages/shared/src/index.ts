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
  GUEST_PROBE_STORAGE_KEY,
  GUEST_MAX_SESSIONS,
  GUEST_SAMPLE_SIZE,
  type GuestProbe,
  type UsageSummary,
  type AdminUserRow,
  type AdminGuestRow,
} from './guest';
