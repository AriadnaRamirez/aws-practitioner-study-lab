import type { SessionSize, TimedSessionStatus } from '@aps/shared';
import type {
  BankItem,
  QueueEntry,
  StudySessionRecord,
  TimedSessionRecord,
} from './study.store';

export type ExamQueueStateJson = {
  kind: 'exam_queue';
  queue: QueueEntry[];
  bank: Record<string, BankItem>;
  itemTypes?: Record<string, 'KNOWLEDGE' | 'EXAM_QUESTION'>;
  incorrectAnswers: number;
};

export type ExamTimedStateJson = {
  kind: 'exam_timed';
  status: TimedSessionStatus;
  endsAt: string;
  questionIds: string[];
  bank: Record<string, BankItem>;
  answers: Record<string, 0 | 1 | 2 | 3 | null>;
  markedForReview: string[];
};

export function serializeExamQueue(session: StudySessionRecord): string {
  const bank: Record<string, BankItem> = {};
  for (const [id, item] of session.bank) {
    bank[id] = item;
  }
  const itemTypes: Record<string, 'KNOWLEDGE' | 'EXAM_QUESTION'> = {};
  if (session.itemTypes) {
    for (const [id, t] of session.itemTypes) {
      itemTypes[id] = t;
    }
  }
  const payload: ExamQueueStateJson = {
    kind: 'exam_queue',
    queue: session.queue,
    bank,
    itemTypes: Object.keys(itemTypes).length ? itemTypes : undefined,
    incorrectAnswers: session.incorrectAnswers,
  };
  return JSON.stringify(payload);
}

export function parseExamQueueState(
  row: {
    id: string;
    userId: string;
    mode: string;
    size: number;
    uniqueItems: number;
    sessionStreak: number;
    maxSessionStreak: number;
    answeredCount: number;
    correctCount: number;
    missRepeatCount: number;
    startedAt: Date;
    endedAt: Date | null;
    stateJson: string;
  },
): StudySessionRecord {
  const raw = JSON.parse(row.stateJson) as ExamQueueStateJson;
  if (raw.kind !== 'exam_queue') {
    throw new Error('stateJson is not exam_queue');
  }
  const bank = new Map<string, BankItem>();
  for (const [id, item] of Object.entries(raw.bank ?? {})) {
    bank.set(id, item);
  }
  const itemTypes = raw.itemTypes
    ? new Map(Object.entries(raw.itemTypes))
    : undefined;
  return {
    id: row.id,
    userId: row.userId,
    mode: row.mode as StudySessionRecord['mode'],
    size: row.size,
    uniqueItems: row.uniqueItems,
    queue: raw.queue ?? [],
    bank,
    itemTypes,
    sessionStreak: row.sessionStreak,
    maxSessionStreak: row.maxSessionStreak,
    answered: row.answeredCount,
    correctAnswers: row.correctCount,
    incorrectAnswers: raw.incorrectAnswers ?? 0,
    missRepeats: row.missRepeatCount,
    status: row.endedAt ? 'completed' : 'active',
    createdAt: row.startedAt.toISOString(),
    endedAt: row.endedAt?.toISOString(),
  };
}

export function serializeTimed(record: TimedSessionRecord): string {
  const bank: Record<string, BankItem> = {};
  for (const [id, item] of record.bank) {
    bank[id] = item;
  }
  const answers: Record<string, 0 | 1 | 2 | 3 | null> = {};
  for (const [id, val] of record.answers) {
    answers[id] = val;
  }
  const payload: ExamTimedStateJson = {
    kind: 'exam_timed',
    status: record.status,
    endsAt: record.endsAt.toISOString(),
    questionIds: record.questionIds,
    bank,
    answers,
    markedForReview: [...record.markedForReview],
  };
  return JSON.stringify(payload);
}

export function parseTimedState(
  row: {
    id: string;
    userId: string;
    size: number;
    timeLimitSec: number | null;
    timezone: string;
    startedAt: Date;
    endedAt: Date | null;
    score: number | null;
    summaryJson: string | null;
    stateJson: string;
  },
): TimedSessionRecord {
  const raw = JSON.parse(row.stateJson) as ExamTimedStateJson;
  if (raw.kind !== 'exam_timed') {
    throw new Error('stateJson is not exam_timed');
  }
  const bank = new Map<string, BankItem>();
  for (const [id, item] of Object.entries(raw.bank ?? {})) {
    bank.set(id, item);
  }
  const answers = new Map<string, 0 | 1 | 2 | 3 | null>();
  for (const [id, val] of Object.entries(raw.answers ?? {})) {
    answers.set(id, val);
  }
  const record: TimedSessionRecord = {
    id: row.id,
    userId: row.userId,
    mode: 'EXAM_TIMED',
    size: row.size as SessionSize,
    timeLimitSec: row.timeLimitSec ?? 0,
    startedAt: row.startedAt,
    endsAt: new Date(raw.endsAt),
    endedAt: row.endedAt ?? undefined,
    status: raw.status,
    timezone: row.timezone,
    questionIds: raw.questionIds ?? [],
    bank,
    answers,
    markedForReview: new Set(raw.markedForReview ?? []),
  };
  if (row.summaryJson) {
    try {
      record.summary = JSON.parse(row.summaryJson);
    } catch {
      /* ignore */
    }
  }
  return record;
}
