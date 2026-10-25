import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EXAM_TIMED_SIZES,
  MASTERY_STREAK,
  MISS_REPEAT_OFFSET,
  STUDY_SIZES,
  examTimedLimitSec,
  type AnswerStudyResponse,
  type ExamQuestion,
  type ExamTimedMistake,
  type ExamTimedQuestionView,
  type ExamTimedSessionView,
  type ExamTimedSummary,
  type KnowledgeItem,
  type SessionSize,
  type StudyMode,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySessionView,
  type StudySize,
} from '@aps/shared';
import { StudyItemType, StudyMode as PrismaStudyMode, type User } from '@prisma/client';
import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';
import { pickVariant, renderFlashVariant } from './flash-render';
import {
  parseState,
  serializeState,
  type QueueEntry as FlashQueueEntry,
  type SessionRuntimeState,
} from './study-session.state';
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

function civilDateInTz(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function dayDiff(a: string, b: string): number {
  const ms =
    Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

function toExamPrompt(
  entry: QueueEntry,
  bank: Map<string, BankItem>,
): StudyPrompt {
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

function toFlashPrompt(
  current: NonNullable<SessionRuntimeState['current']>,
): StudyPrompt {
  return {
    queueItemId: current.queueItemId,
    itemId: current.itemId,
    variant: current.variant,
    stem: current.stem,
    choices: current.choices,
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
      ? toExamPrompt(session.queue[0], session.bank)
      : null;
  return {
    sessionId: session.id,
    mode: session.mode,
    size: session.size,
    uniqueItems: session.uniqueItems,
    remaining: session.queue.length,
    sessionStreak: session.sessionStreak,
    maxSessionStreak: session.maxSessionStreak,
    answered: session.answered,
    masteredInSession: 0,
    dailyStreak: 0,
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
    private readonly prisma: PrismaService,
  ) {}

  async startSession(opts: {
    user: User;
    mode: StudyMode;
    size: SessionSize;
    topicIds?: string[];
    timezone?: string;
  }): Promise<StudySessionView | ExamTimedSessionView> {
    if (opts.mode === 'FLASH_STUDY') {
      return this.startFlashSession(opts.user, {
        size: opts.size,
        topicIds: opts.topicIds,
        timezone: opts.timezone,
      });
    }
    if (opts.mode === 'EXAM_TIMED') {
      return this.startExamTimed(opts.user.id, {
        size: opts.size,
        topicIds: opts.topicIds,
        timezone: opts.timezone,
      });
    }
    if (opts.mode !== 'EXAM_STUDY') {
      throw new BadRequestException(
        `Mode ${opts.mode} not available yet`,
      );
    }
    if (!(STUDY_SIZES as readonly number[]).includes(opts.size)) {
      throw new BadRequestException(
        'EXAM_STUDY solo admite tamaños 10/20/30/50',
      );
    }

    let questions = await this.content.listQuestions({ publishedOnly: true });
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
      userId: opts.user.id,
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

  async getAnySession(
    user: User,
    sessionId: string,
  ): Promise<StudySessionView | ExamTimedSessionView> {
    if (this.store.timedSessions.has(sessionId)) {
      return this.getTimedSession(user.id, sessionId);
    }
    if (this.store.sessions.has(sessionId)) {
      return viewOf(this.requireExamSession(sessionId, user.id));
    }
    return this.getFlashSession(user, sessionId);
  }

  async answerAny(
    user: User,
    sessionId: string,
    dto: { queueItemId: string; choiceIndex: number; latencyMs?: number },
  ): Promise<AnswerStudyResponse> {
    if (this.store.sessions.has(sessionId)) {
      return this.answerExamStudy(
        sessionId,
        user.id,
        dto.queueItemId,
        dto.choiceIndex,
      );
    }
    return this.answerFlash(user, sessionId, dto);
  }

  async getAnySummary(
    user: User,
    sessionId: string,
  ): Promise<StudySessionSummary | ExamTimedSummary> {
    if (this.store.timedSessions.has(sessionId)) {
      return this.getTimedSummary(user.id, sessionId);
    }
    if (this.store.sessions.has(sessionId)) {
      return this.getExamStudySummary(sessionId, user.id);
    }
    return this.getFlashSummary(user, sessionId);
  }

  private answerExamStudy(
    sessionId: string,
    userId: string,
    queueItemId: string,
    choiceIndex: number,
  ): AnswerStudyResponse {
    const session = this.requireExamSession(sessionId, userId);
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
      next: finished ? null : toExamPrompt(session.queue[0], session.bank),
      summary: finished ? summaryOf(session) : undefined,
    };
  }

  private getExamStudySummary(
    sessionId: string,
    userId: string,
  ): StudySessionSummary {
    const session = this.requireExamSession(sessionId, userId);
    if (session.status !== 'completed') {
      throw new BadRequestException('Session is still active');
    }
    return summaryOf(session);
  }

  private requireExamSession(
    sessionId: string,
    userId: string,
  ): StudySessionRecord {
    const session = this.store.sessions.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return session;
  }

  /* —— FLASH_STUDY (APS-8 Prisma) —— */

  private async startFlashSession(
    user: User,
    opts: { size: SessionSize; topicIds?: string[]; timezone?: string },
  ): Promise<StudySessionView> {
    if (!(STUDY_SIZES as readonly number[]).includes(opts.size)) {
      throw new BadRequestException(
        'FLASH_STUDY solo admite tamaños 10/20/30/50',
      );
    }

    const topicIds = opts.topicIds?.filter(Boolean) ?? [];
    let pool = await this.content.listKnowledge({ publishedOnly: true });
    if (topicIds.length) {
      const set = new Set(topicIds);
      pool = pool.filter((k) => set.has(k.topicId));
    }
    if (!pool.length) {
      throw new BadRequestException(
        'No hay ítems publicados para el alcance elegido',
      );
    }

    const picked = shuffle(pool).slice(
      0,
      Math.min(opts.size as StudySize, pool.length),
    );
    const queue: FlashQueueEntry[] = picked.map((item) => ({
      queueItemId: crypto.randomUUID(),
      itemId: item.id,
      variant: pickVariant(item),
    }));

    const state: SessionRuntimeState = {
      queue,
      current: null,
      masteredItemIds: [],
    };
    this.advanceFlashCurrent(state, pool);

    const tz = opts.timezone || user.timezone || 'UTC';
    const session = await this.prisma.studySession.create({
      data: {
        userId: user.id,
        mode: PrismaStudyMode.FLASH_STUDY,
        size: opts.size,
        scopeJson: JSON.stringify(topicIds),
        timezone: tz,
        stateJson: serializeState(state),
        uniqueItems: picked.length,
      },
    });

    const streak = await this.prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });

    return this.toFlashView(session, state, streak?.current ?? 0);
  }

  private async getFlashSession(
    user: User,
    sessionId: string,
  ): Promise<StudySessionView> {
    const session = await this.requireFlashSession(user.id, sessionId);
    const state = parseState(session.stateJson);
    const streak = await this.prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });
    return this.toFlashView(session, state, streak?.current ?? 0);
  }

  private async answerFlash(
    user: User,
    sessionId: string,
    dto: { queueItemId: string; choiceIndex: number; latencyMs?: number },
  ): Promise<AnswerStudyResponse> {
    const session = await this.requireFlashSession(user.id, sessionId);
    if (session.endedAt) {
      throw new BadRequestException('La sesión ya terminó');
    }

    const state = parseState(session.stateJson);
    const current = state.current;
    if (!current || current.queueItemId !== dto.queueItemId) {
      throw new BadRequestException(
        'queueItemId no coincide con la carta actual',
      );
    }
    if (dto.choiceIndex < 0 || dto.choiceIndex > 3) {
      throw new BadRequestException('choiceIndex must be 0..3');
    }

    const pool = await this.content.listKnowledge({ publishedOnly: true });
    const correct = dto.choiceIndex === current.correctIndex;

    await this.prisma.attempt.create({
      data: {
        sessionId: session.id,
        userId: user.id,
        itemType: StudyItemType.KNOWLEDGE,
        itemId: current.itemId,
        correct,
        latencyMs: dto.latencyMs,
        variant: current.variant,
        choiceIndex: dto.choiceIndex,
      },
    });

    const progress = await this.updateItemProgress(
      user.id,
      current.itemId,
      correct,
    );

    let sessionStreak = session.sessionStreak;
    let maxSessionStreak = session.maxSessionStreak;
    let missRepeatCount = session.missRepeatCount;
    let correctCount = session.correctCount;
    const answeredCount = session.answeredCount + 1;

    if (correct) {
      correctCount += 1;
      sessionStreak += 1;
      maxSessionStreak = Math.max(maxSessionStreak, sessionStreak);
      if (
        progress.masteredAt &&
        !state.masteredItemIds.includes(current.itemId)
      ) {
        state.masteredItemIds.push(current.itemId);
      }
    } else {
      sessionStreak = 0;
      missRepeatCount += 1;
      const requeue: FlashQueueEntry = {
        queueItemId: crypto.randomUUID(),
        itemId: current.itemId,
        variant: current.variant,
      };
      const insertAt = Math.min(MISS_REPEAT_OFFSET, state.queue.length);
      state.queue.splice(insertAt, 0, requeue);
    }

    state.current = null;
    this.advanceFlashCurrent(state, pool);

    const finished = state.current === null && state.queue.length === 0;
    let summary: StudySessionSummary | undefined;

    if (finished) {
      const streak = await this.bumpDailyStreak(user, session.timezone);
      summary = this.buildFlashSummary(
        session.id,
        session.uniqueItems,
        answeredCount,
        correctCount,
        missRepeatCount,
        maxSessionStreak,
        state.masteredItemIds.length,
        streak.current,
        streak.longest,
      );
    }

    await this.prisma.studySession.update({
      where: { id: session.id },
      data: {
        stateJson: serializeState(state),
        sessionStreak,
        maxSessionStreak,
        answeredCount,
        correctCount,
        missRepeatCount,
        endedAt: finished ? new Date() : null,
        score: finished
          ? answeredCount
            ? (correctCount / answeredCount) * 100
            : 0
          : null,
        summaryJson: summary ? JSON.stringify(summary) : null,
      },
    });

    return {
      correct,
      correctIndex: current.correctIndex,
      explanation: current.explanation,
      itemMastered: Boolean(progress.masteredAt),
      itemConsecutiveCorrect: progress.consecutiveCorrect,
      sessionStreak,
      remaining: state.queue.length + (state.current ? 1 : 0),
      finished,
      next: state.current ? toFlashPrompt(state.current) : null,
      summary,
    };
  }

  private async getFlashSummary(
    user: User,
    sessionId: string,
  ): Promise<StudySessionSummary> {
    const session = await this.requireFlashSession(user.id, sessionId);
    if (!session.endedAt || !session.summaryJson) {
      throw new BadRequestException('La sesión aún no tiene resumen');
    }
    return JSON.parse(session.summaryJson) as StudySessionSummary;
  }

  private advanceFlashCurrent(
    state: SessionRuntimeState,
    pool: KnowledgeItem[],
  ): void {
    while (!state.current && state.queue.length) {
      const next = state.queue.shift()!;
      const item = pool.find((k) => k.id === next.itemId);
      if (!item) continue;
      const rendered = renderFlashVariant(item, next.variant, pool);
      state.current = {
        queueItemId: next.queueItemId,
        itemId: next.itemId,
        variant: rendered.variant,
        stem: rendered.stem,
        choices: rendered.choices,
        correctIndex: rendered.correctIndex,
        explanation: rendered.explanation,
      };
    }
  }

  private async updateItemProgress(
    userId: string,
    itemId: string,
    correct: boolean,
  ) {
    const existing = await this.prisma.itemProgress.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: StudyItemType.KNOWLEDGE,
          itemId,
        },
      },
    });

    if (!existing) {
      const consecutiveCorrect = correct ? 1 : 0;
      const mastered =
        consecutiveCorrect >= MASTERY_STREAK ? new Date() : null;
      return this.prisma.itemProgress.create({
        data: {
          userId,
          itemType: StudyItemType.KNOWLEDGE,
          itemId,
          consecutiveCorrect,
          failCount: correct ? 0 : 1,
          passCount: correct ? 1 : 0,
          masteredAt: mastered,
        },
      });
    }

    const consecutiveCorrect = correct
      ? existing.consecutiveCorrect + 1
      : 0;
    const justMastered =
      !existing.masteredAt && consecutiveCorrect >= MASTERY_STREAK;

    return this.prisma.itemProgress.update({
      where: { id: existing.id },
      data: {
        consecutiveCorrect,
        failCount: correct ? existing.failCount : existing.failCount + 1,
        passCount: correct ? existing.passCount + 1 : existing.passCount,
        masteredAt: justMastered ? new Date() : existing.masteredAt,
      },
    });
  }

  private async bumpDailyStreak(user: User, sessionTz: string) {
    const tz = sessionTz || user.timezone || 'UTC';
    const today = civilDateInTz(new Date(), tz);
    const existing = await this.prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });

    if (!existing) {
      return this.prisma.dailyStreak.create({
        data: {
          userId: user.id,
          current: 1,
          longest: 1,
          lastStudyDate: today,
        },
      });
    }

    if (existing.lastStudyDate === today) {
      return existing;
    }

    const prev = existing.lastStudyDate;
    const consecutive =
      prev && dayDiff(prev, today) === 1 ? existing.current + 1 : 1;
    const longest = Math.max(existing.longest, consecutive);

    return this.prisma.dailyStreak.update({
      where: { userId: user.id },
      data: {
        current: consecutive,
        longest,
        lastStudyDate: today,
      },
    });
  }

  private buildFlashSummary(
    sessionId: string,
    uniqueItems: number,
    answered: number,
    correctAnswers: number,
    missRepeats: number,
    maxSessionStreak: number,
    masteredInSession: number,
    dailyStreak: number,
    longestDailyStreak: number,
  ): StudySessionSummary {
    const incorrectAnswers = answered - correctAnswers;
    return {
      sessionId,
      mode: 'FLASH_STUDY',
      uniqueItems,
      answered,
      correctAnswers,
      incorrectAnswers,
      missRepeats,
      maxSessionStreak,
      masteredInSession,
      accuracyPct: answered
        ? Math.round((correctAnswers / answered) * 1000) / 10
        : 0,
      dailyStreak,
      longestDailyStreak,
    };
  }

  private async requireFlashSession(userId: string, sessionId: string) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Sesión no encontrada');
    if (session.userId !== userId) {
      throw new ForbiddenException('Sesión de otro usuario');
    }
    return session;
  }

  private toFlashView(
    session: {
      id: string;
      mode: PrismaStudyMode;
      size: number;
      uniqueItems: number;
      sessionStreak: number;
      maxSessionStreak: number;
      answeredCount: number;
      endedAt: Date | null;
    },
    state: SessionRuntimeState,
    dailyStreak: number,
  ): StudySessionView {
    return {
      sessionId: session.id,
      mode: session.mode as StudyMode,
      size: session.size,
      uniqueItems: session.uniqueItems,
      remaining: state.queue.length + (state.current ? 1 : 0),
      sessionStreak: session.sessionStreak,
      maxSessionStreak: session.maxSessionStreak,
      answered: session.answeredCount,
      masteredInSession: state.masteredItemIds.length,
      dailyStreak,
      current: state.current ? toFlashPrompt(state.current) : null,
      status: session.endedAt ? 'completed' : 'active',
    };
  }

  /* —— EXAM_TIMED —— */

  async startExamTimed(
    userId: string,
    opts: { size: SessionSize; topicIds?: string[]; timezone?: string },
  ): Promise<ExamTimedSessionView> {
    if (!(EXAM_TIMED_SIZES as readonly number[]).includes(opts.size)) {
      throw new BadRequestException(
        'EXAM_TIMED admite 10/20/30/50/65',
      );
    }

    const questions = await this.pickTimedQuestions(opts.size, opts.topicIds);
    const timeLimitSec = examTimedLimitSec(opts.size);
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + timeLimitSec * 1000);
    const id = newId('ex');
    const bank: TimedSessionRecord['bank'] = new Map();
    const answers = new Map<string, 0 | 1 | 2 | 3 | null>();
    const questionIds: string[] = [];
    for (const q of questions) {
      questionIds.push(q.id);
      bank.set(q.id, {
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topicId: q.topicId,
      });
      answers.set(q.id, null);
    }

    const record: TimedSessionRecord = {
      id,
      userId,
      mode: 'EXAM_TIMED',
      size: opts.size,
      timeLimitSec,
      startedAt,
      endsAt,
      status: 'IN_PROGRESS',
      timezone: opts.timezone ?? 'UTC',
      questionIds,
      bank,
      answers,
      markedForReview: new Set(),
    };
    this.store.timedSessions.set(id, record);
    return this.toTimedView(record);
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

  private async pickTimedQuestions(
    size: SessionSize,
    topicIds?: string[],
  ): Promise<ExamQuestion[]> {
    let pool = await this.content.listQuestions({ publishedOnly: true });
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
    userSessionId: string,
  ): TimedSessionRecord {
    const record = this.store.timedSessions.get(userSessionId);
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
      const q = record.bank.get(id);
      if (!q) {
        throw new BadRequestException(`Bank missing question ${id}`);
      }
      return {
        id,
        stem: q.stem,
        choices: q.choices,
        topicId: q.topicId ?? '',
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
      const q = record.bank.get(id);
      if (!q) continue;
      const selected = record.answers.get(id) ?? null;
      if (selected === null) {
        unansweredCount += 1;
        mistakes.push({
          questionId: id,
          stem: q.stem,
          choices: q.choices,
          selectedIndex: null,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          topicId: q.topicId ?? '',
        });
        continue;
      }
      if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        mistakes.push({
          questionId: id,
          stem: q.stem,
          choices: q.choices,
          selectedIndex: selected,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          topicId: q.topicId ?? '',
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
