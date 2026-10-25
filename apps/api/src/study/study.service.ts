import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MISS_REPEAT_OFFSET,
  type AnswerStudyResponse,
  type ExamQuestion,
  type StudyMode,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySessionView,
  type StudySize,
} from '@aps/shared';
import { ContentService } from '../content/content.service';
import {
  type BankItem,
  type QueueEntry,
  type StudySessionRecord,
  StudyStore,
} from './study.store';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toPrompt(entry: QueueEntry, bank: Map<string, BankItem>): StudyPrompt {
  const item = bank.get(entry.itemId);
  if (!item) {
    throw new BadRequestException(`Bank missing item ${entry.itemId}`);
  }
  return {
    queueItemId: entry.queueItemId,
    itemId: entry.itemId,
    stem: item.stem,
    choices: item.choices,
  };
}

function summaryOf(session: StudySessionRecord): StudySessionSummary {
  const accuracyPct =
    session.answered === 0
      ? 0
      : Math.round((session.correctAnswers / session.answered) * 100);
  return {
    sessionId: session.id,
    mode: session.mode,
    uniqueItems: session.uniqueItems,
    answered: session.answered,
    correctAnswers: session.correctAnswers,
    incorrectAnswers: session.incorrectAnswers,
    missRepeats: session.missRepeats,
    maxSessionStreak: session.maxSessionStreak,
    accuracyPct,
  };
}

function viewOf(session: StudySessionRecord): StudySessionView {
  const current =
    session.status === 'active' && session.queue.length > 0
      ? toPrompt(session.queue[0], session.bank)
      : null;
  return {
    sessionId: session.id,
    mode: session.mode,
    size: session.size,
    uniqueItems: session.uniqueItems,
    remaining: session.queue.length,
    sessionStreak: session.sessionStreak,
    answered: session.answered,
    current,
    status: session.status,
  };
}

/** Insert failed card `offset` slots after the front (after dequeue). */
export function requeueMiss(
  queue: QueueEntry[],
  entry: QueueEntry,
  offset = MISS_REPEAT_OFFSET,
): QueueEntry[] {
  const insertAt = Math.min(offset, queue.length);
  const next = [...queue];
  next.splice(insertAt, 0, entry);
  return next;
}

@Injectable()
export class StudyService {
  constructor(
    private readonly store: StudyStore,
    private readonly content: ContentService,
  ) {}

  startSession(opts: {
    userId: string;
    mode: StudyMode;
    size: StudySize;
    topicIds?: string[];
  }): StudySessionView {
    if (opts.mode !== 'EXAM_STUDY') {
      throw new BadRequestException(
        `Mode ${opts.mode} not available yet (APS-9 delivers EXAM_STUDY; FLASH_STUDY is APS-8)`,
      );
    }

    let questions = this.content.listQuestions({ publishedOnly: true });
    if (opts.topicIds?.length) {
      const allowed = new Set(opts.topicIds);
      questions = questions.filter((q) => allowed.has(q.topicId));
    }
    if (questions.length === 0) {
      throw new BadRequestException(
        'No published ExamQuestions available for this scope',
      );
    }

    const picked = shuffle(questions).slice(
      0,
      Math.min(opts.size, questions.length),
    ) as ExamQuestion[];

    const bank: StudySessionRecord['bank'] = new Map();
    const queue: QueueEntry[] = [];
    for (const q of picked) {
      bank.set(q.id, {
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
      queue.push({ queueItemId: newId('qi'), itemId: q.id });
    }

    const session: StudySessionRecord = {
      id: newId('ss'),
      userId: opts.userId,
      mode: opts.mode,
      size: opts.size,
      uniqueItems: picked.length,
      queue,
      bank,
      sessionStreak: 0,
      maxSessionStreak: 0,
      answered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      missRepeats: 0,
      status: 'active',
      createdAt: nowIso(),
    };
    this.store.sessions.set(session.id, session);
    return viewOf(session);
  }

  getSession(sessionId: string, userId: string): StudySessionView {
    return viewOf(this.requireSession(sessionId, userId));
  }

  answer(
    sessionId: string,
    userId: string,
    queueItemId: string,
    choiceIndex: number,
  ): AnswerStudyResponse {
    const session = this.requireSession(sessionId, userId);
    if (session.status !== 'active') {
      throw new BadRequestException('Session already completed');
    }
    if (session.queue.length === 0) {
      throw new BadRequestException('Session queue is empty');
    }

    const current = session.queue[0];
    if (current.queueItemId !== queueItemId) {
      throw new BadRequestException(
        'queueItemId does not match the current prompt',
      );
    }
    if (choiceIndex < 0 || choiceIndex > 3) {
      throw new BadRequestException('choiceIndex must be 0..3');
    }

    const item = session.bank.get(current.itemId);
    if (!item) {
      throw new BadRequestException(`Bank missing item ${current.itemId}`);
    }

    const correct = choiceIndex === item.correctIndex;
    session.answered += 1;
    session.queue = session.queue.slice(1);

    if (correct) {
      session.correctAnswers += 1;
      session.sessionStreak += 1;
      session.maxSessionStreak = Math.max(
        session.maxSessionStreak,
        session.sessionStreak,
      );
    } else {
      session.incorrectAnswers += 1;
      session.sessionStreak = 0;
      session.missRepeats += 1;
      const requeued: QueueEntry = {
        queueItemId: newId('qi'),
        itemId: current.itemId,
      };
      session.queue = requeueMiss(session.queue, requeued);
    }

    const finished = session.queue.length === 0;
    if (finished) {
      session.status = 'completed';
      session.endedAt = nowIso();
    }

    this.store.sessions.set(session.id, session);

    return {
      correct,
      correctIndex: item.correctIndex,
      explanation: item.explanation,
      sessionStreak: session.sessionStreak,
      remaining: session.queue.length,
      finished,
      next: finished ? null : toPrompt(session.queue[0], session.bank),
      summary: finished ? summaryOf(session) : undefined,
    };
  }

  getSummary(sessionId: string, userId: string): StudySessionSummary {
    const session = this.requireSession(sessionId, userId);
    if (session.status !== 'completed') {
      throw new BadRequestException('Session is still active');
    }
    return summaryOf(session);
  }

  private requireSession(
    sessionId: string,
    userId: string,
  ): StudySessionRecord {
    const session = this.store.sessions.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return session;
  }
}
