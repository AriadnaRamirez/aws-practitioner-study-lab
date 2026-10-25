import { Injectable } from '@nestjs/common';
import type { StudyMode } from '@aps/shared';

export interface QueueEntry {
  queueItemId: string;
  itemId: string;
}

export interface BankItem {
  stem: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

/** In-memory study sessions (APS-8/9 stub — Prisma persistence lands with APS-8 full). */
export interface StudySessionRecord {
  id: string;
  userId: string;
  mode: StudyMode;
  size: number;
  uniqueItems: number;
  queue: QueueEntry[];
  bank: Map<string, BankItem>;
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

@Injectable()
export class StudyStore {
  readonly sessions = new Map<string, StudySessionRecord>();
}
