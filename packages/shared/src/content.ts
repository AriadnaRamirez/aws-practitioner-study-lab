/** Content model contracts — maestro §5 (APS-6 stubs; Prisma tables come in APS-7). */

/** Topic taxonomy kind. Future: AI_TOPIC. */
export type TopicType = "SERVICE" | "CONCEPT";

export const TOPIC_TYPES = ["SERVICE", "CONCEPT"] as const satisfies readonly TopicType[];

/** Flash MCQ statement variants (canonical fact → runtime render). */
export type FlashVariant =
  | "NAME_TO_DEFINITION"
  | "DEFINITION_TO_NAME"
  | "NAME_FOCUS";

export const FLASH_VARIANTS = [
  "NAME_TO_DEFINITION",
  "DEFINITION_TO_NAME",
  "NAME_FOCUS",
] as const satisfies readonly FlashVariant[];

export type ContentStatus = "draft" | "published" | "archived";

export const CONTENT_STATUSES = [
  "draft",
  "published",
  "archived",
] as const satisfies readonly ContentStatus[];

export const DEFAULT_TRACK_ID = "CLF";

export interface Topic {
  id: string;
  trackId: string;
  type: TopicType;
  name: string;
  parentId?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Canonical flash fact. Session engine (APS-8) picks a variant and builds 4 choices.
 */
export interface KnowledgeItem {
  id: string;
  topicId: string;
  trackId: string;
  name: string;
  definition: string;
  /** At least 3 false names or definitions depending on variant. */
  distractors: string[];
  explanation: string;
  allowedVariants: FlashVariant[];
  status: ContentStatus;
  externalKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Exactly four choices in MVP; one correct via correctIndex. */
export type ExamChoices = [string, string, string, string];

export interface ExamQuestion {
  id: string;
  topicId: string;
  trackId: string;
  stem: string;
  choices: ExamChoices;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  status: ContentStatus;
  externalKey?: string | null;
  createdAt: string;
  updatedAt: string;
}
