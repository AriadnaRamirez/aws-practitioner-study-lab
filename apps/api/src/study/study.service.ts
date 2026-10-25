import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EXAM_TIMED_SIZES,
  MISS_REPEAT_OFFSET,
  STUDY_SIZES,
  examTimedLimitSec,
  type AnswerStudyResponse,
  type ExamQuestion,
  type ExamTimedMistake,
  type ExamTimedQuestionView,
  type ExamTimedSessionView,
  type ExamTimedSummary,
  type SessionSize,
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
  type TimedSessionRecord,
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
    size: SessionSize;
    topicIds?: string[];
    timezone?: string;
  }): StudySessionView | ExamTimedSessionView {
    if (opts.mode === 'EXAM_TIMED') {
      return this.startExamTimed(opts.userId, {
        size: opts.size,
        topicIds: opts.topicIds,
        timezone: opts.timezone,
      });
    }
    if (opts.mode !== 'EXAM_STUDY') {
      throw new BadRequestException(
        `Mode ${opts.mode} not available yet (APS-9 delivers EXAM_STUDY; FLASH_STUDY is APS-8; EXAM_TIMED is APS-10)`,
      );
    }
    if (!(STUDY_SIZES as readonly number[]).includes(opts.size)) {
      throw new BadRequestException(
        'EXAM_STUDY solo admite tamaños 10/20/30/50',
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

    const studySize = opts.size as StudySize;
    const picked = shuffle(questions).slice(
      0,
      Math.min(studySize, questions.length),
    ) as ExamQuestion[];

    const bank: StudySessionRecord['bank'] = new Map();
    const queue: QueueEntry[] = [];
    for (const q of picked) {
      bank.set(q.id, {
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topicId: q.topicId,
      });
      queue.push({ queueItemId: newId('qi'), itemId: q.id });
    }

    const session: StudySessionRecord = {
      id: newId('ss'),
      userId: opts.userId,
      mode: opts.mode,
      size: studySize,
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

  /* —— EXAM_TIMED —— */

  startExamTimed(
    userId: string,
    opts: { size: SessionSize; topicIds?: string[]; timezone?: string },
  ): ExamTimedSessionView {
    if (!(EXAM_TIMED_SIZES as readonly number[]).includes(opts.size)) {
      throw new BadRequestException(
        'EXAM_TIMED admite 10/20/30/50/65',
      );
    }
    const pool = this.pickTimedQuestions(opts.size, opts.topicIds);
    const now = new Date();
    const timeLimitSec = examTimedLimitSec(opts.size);
    const endsAt = new Date(now.getTime() + timeLimitSec * 1000);
    const id = newId('sess');
    const answers = new Map<string, 0 | 1 | 2 | 3 | null>();
    for (const q of pool) answers.set(q.id, null);

    const record: TimedSessionRecord = {
      id,
      userId,
      mode: 'EXAM_TIMED',
      size: opts.size,
      timeLimitSec,
      startedAt: now,
      endsAt,
      status: 'IN_PROGRESS',
      timezone: opts.timezone ?? 'UTC',
      questionIds: pool.map((q) => q.id),
      answers,
      markedForReview: new Set(),
    };
    this.store.timedSessions.set(id, record);
    return this.toTimedView(record);
  }

  getAnySession(
    userId: string,
    sessionId: string,
  ): StudySessionView | ExamTimedSessionView {
    if (this.store.timedSessions.has(sessionId)) {
      return this.getTimedSession(userId, sessionId);
    }
    return this.getSession(sessionId, userId);
  }

  getAnySummary(
    userId: string,
    sessionId: string,
  ): StudySessionSummary | ExamTimedSummary {
    if (this.store.timedSessions.has(sessionId)) {
      return this.getTimedSummary(userId, sessionId);
    }
    return this.getSummary(sessionId, userId);
  }

  getTimedSession(userId: string, sessionId: string): ExamTimedSessionView {
    const record = this.requireTimedOwned(userId, sessionId);
    this.refreshTimedExpiry(record);
    return this.toTimedView(record);
  }

  answerTimed(
    userId: string,
    sessionId: string,
    questionId: string,
    choiceIndex: 0 | 1 | 2 | 3,
  ): ExamTimedSessionView {
    const record = this.requireTimedActive(userId, sessionId);
    if (!record.answers.has(questionId)) {
      throw new BadRequestException('Pregunta fuera de esta sesión');
    }
    record.answers.set(questionId, choiceIndex);
    // No live feedback / miss-repeat / streak — maestro §4.3
    return this.toTimedView(record);
  }

  markTimedReview(
    userId: string,
    sessionId: string,
    questionId: string,
    marked: boolean,
  ): ExamTimedSessionView {
    const record = this.requireTimedActive(userId, sessionId);
    if (!record.answers.has(questionId)) {
      throw new BadRequestException('Pregunta fuera de esta sesión');
    }
    if (marked) record.markedForReview.add(questionId);
    else record.markedForReview.delete(questionId);
    return this.toTimedView(record);
  }

  submitTimed(userId: string, sessionId: string): ExamTimedSummary {
    const record = this.requireTimedOwned(userId, sessionId);
    this.refreshTimedExpiry(record);
    if (record.summary) return record.summary;
    if (record.status === 'IN_PROGRESS') {
      record.status = 'SUBMITTED';
    }
    record.endedAt = new Date();
    record.summary = this.buildTimedSummary(record);
    return record.summary;
  }

  getTimedSummary(userId: string, sessionId: string): ExamTimedSummary {
    const record = this.requireTimedOwned(userId, sessionId);
    this.refreshTimedExpiry(record);
    if (!record.summary) {
      if (record.status === 'IN_PROGRESS') {
        throw new BadRequestException(
          'El examen sigue en curso; envíalo para ver el resultado',
        );
      }
      record.endedAt = record.endedAt ?? new Date();
      record.summary = this.buildTimedSummary(record);
    }
    return record.summary;
  }

  private pickTimedQuestions(
    size: SessionSize,
    topicIds?: string[],
  ): ExamQuestion[] {
    let pool = this.content.listQuestions({ publishedOnly: true });
    if (topicIds?.length) {
      const set = new Set(topicIds);
      pool = pool.filter((q) => set.has(q.topicId));
    }
    if (pool.length === 0) {
      throw new BadRequestException(
        'No hay preguntas publicadas para el alcance pedido',
      );
    }
    if (pool.length < size) {
      throw new BadRequestException(
        `Se necesitan al menos ${size} preguntas publicadas (hay ${pool.length})`,
      );
    }
    return shuffle(pool).slice(0, size);
  }

  private requireTimedOwned(
    userId: string,
    sessionId: string,
  ): TimedSessionRecord {
    const record = this.store.timedSessions.get(sessionId);
    if (!record) throw new NotFoundException('Sesión no encontrada');
    if (record.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta sesión');
    }
    return record;
  }

  private requireTimedActive(
    userId: string,
    sessionId: string,
  ): TimedSessionRecord {
    const record = this.requireTimedOwned(userId, sessionId);
    this.refreshTimedExpiry(record);
    if (record.status !== 'IN_PROGRESS') {
      throw new BadRequestException('El examen ya terminó');
    }
    return record;
  }

  private refreshTimedExpiry(record: TimedSessionRecord): void {
    if (record.status !== 'IN_PROGRESS') return;
    if (Date.now() >= record.endsAt.getTime()) {
      record.status = 'EXPIRED';
      record.endedAt = record.endsAt;
      record.summary = this.buildTimedSummary(record);
    }
  }

  private remainingTimedSec(record: TimedSessionRecord): number {
    if (record.status !== 'IN_PROGRESS') return 0;
    return Math.max(
      0,
      Math.ceil((record.endsAt.getTime() - Date.now()) / 1000),
    );
  }

  private toTimedView(record: TimedSessionRecord): ExamTimedSessionView {
    const questions: ExamTimedQuestionView[] = record.questionIds.map((id) => {
      const q = this.content.getQuestion(id);
      return {
        id: q.id,
        stem: q.stem,
        choices: q.choices,
        topicId: q.topicId,
      };
    });
    const answers: ExamTimedSessionView['answers'] = {};
    let answeredCount = 0;
    for (const [qid, val] of record.answers) {
      answers[qid] = val;
      if (val !== null) answeredCount += 1;
    }
    return {
      id: record.id,
      mode: 'EXAM_TIMED',
      size: record.size,
      timeLimitSec: record.timeLimitSec,
      startedAt: record.startedAt.toISOString(),
      endsAt: record.endsAt.toISOString(),
      status: record.status,
      remainingSec: this.remainingTimedSec(record),
      questions,
      answers,
      markedForReview: [...record.markedForReview],
      answeredCount,
    };
  }

  private buildTimedSummary(record: TimedSessionRecord): ExamTimedSummary {
    const endedAt = record.endedAt ?? new Date();
    const timeUsedSec = Math.min(
      record.timeLimitSec,
      Math.max(
        0,
        Math.round((endedAt.getTime() - record.startedAt.getTime()) / 1000),
      ),
    );
    let correctCount = 0;
    let unansweredCount = 0;
    const mistakes: ExamTimedMistake[] = [];

    for (const id of record.questionIds) {
      const q = this.content.getQuestion(id);
      const selected = record.answers.get(id) ?? null;
      if (selected === null) {
        unansweredCount += 1;
        mistakes.push({
          questionId: q.id,
          stem: q.stem,
          choices: q.choices,
          selectedIndex: null,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          topicId: q.topicId,
        });
        continue;
      }
      if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        mistakes.push({
          questionId: q.id,
          stem: q.stem,
          choices: q.choices,
          selectedIndex: selected,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          topicId: q.topicId,
        });
      }
    }

    const totalCount = record.questionIds.length;
    const scorePercent =
      totalCount === 0
        ? 0
        : Math.round((correctCount / totalCount) * 1000) / 10;

    return {
      sessionId: record.id,
      mode: 'EXAM_TIMED',
      size: record.size,
      status: record.status === 'EXPIRED' ? 'EXPIRED' : 'SUBMITTED',
      scorePercent,
      correctCount,
      totalCount,
      unansweredCount,
      timeLimitSec: record.timeLimitSec,
      timeUsedSec,
      startedAt: record.startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      mistakes,
    };
  }
}
