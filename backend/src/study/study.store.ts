import { Injectable } from '@nestjs/common';
import type {
  ExamTimedSummary,
  SessionSize,
  StudyMode,
  TimedSessionStatus,
} from '@aps/shared';

export interface QueueEntry {
  queueItemId: string;
  itemId: string;
}

export interface BankItem {
  stem: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  topicId?: string;
}

/** In-memory study sessions (EXAM_STUDY / WEAK_REVIEW play queue). */
export interface StudySessionRecord {
  id: string;
  userId: string;
  mode: StudyMode;
  size: number;
  uniqueItems: number;
  queue: QueueEntry[];
  bank: Map<string, BankItem>;
  /** Optional: maps itemId → KNOWLEDGE | EXAM_QUESTION (WEAK_REVIEW). */
  itemTypes?: Map<string, 'KNOWLEDGE' | 'EXAM_QUESTION'>;
  sessionStreak: number;
  maxSessionStreak: number;
  answered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  missRepeats: number;
  status: 'active' | 'completed';
  createdAt: string;
  endedAt?: string;
}

/** EXAM_TIMED session (no miss-repeat / live streak). */
export interface TimedSessionRecord {
  id: string;
  userId: string;
  mode: 'EXAM_TIMED';
  size: SessionSize;
  timeLimitSec: number;
  startedAt: Date;
  endsAt: Date;
  endedAt?: Date;
  status: TimedSessionStatus;
  timezone: string;
  questionIds: string[];
  /** Snapshot of questions at start (avoids async lookups mid-session). */
  bank: Map<string, BankItem & { correctIndex: 0 | 1 | 2 | 3 }>;
  answers: Map<string, 0 | 1 | 2 | 3 | null>;
  markedForReview: Set<string>;
  summary?: ExamTimedSummary;
}

@Injectable()
export class StudyStore {
  readonly sessions = new Map<string, StudySessionRecord>();
  readonly timedSessions = new Map<string, TimedSessionRecord>();
}
