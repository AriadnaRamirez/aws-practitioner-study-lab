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
  type StudyHistoryDetail,
  type StudyHistoryEntry,
  type StudyHistoryResponse,
  type StudyItemType as SharedStudyItemType,
  type StudyMode,
  type StudyPrompt,
  type StudyQueueItem,
  type StudySessionSummary,
  type StudySessionView,
  type StudySize,
  type WeakItem,
  type WeakItemsResponse,
} from '@aps/shared';
import {
  StudyItemType,
  StudyMode as PrismaStudyMode,
  type StudySession,
  type User,
} from '@prisma/client';
import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  parseExamQueueState,
  parseTimedState,
  serializeExamQueue,
  serializeTimed,
} from './exam-session-state';
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

const STEM_PREVIEW = 96;

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
      return this.startExamTimed(opts.user, {
        size: opts.size,
        topicIds: opts.topicIds,
        timezone: opts.timezone,
      });
    }
    if (opts.mode === 'WEAK_REVIEW') {
      const started = await this.startWeakReview(opts.user, opts.size);
      return this.getAnySession(opts.user, started.id);
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

    const tz = opts.timezone || opts.user.timezone || 'UTC';
    const row = await this.prisma.studySession.create({
      data: {
        userId: opts.user.id,
        mode: PrismaStudyMode.EXAM_STUDY,
        size: studySize,
        scopeJson: JSON.stringify(opts.topicIds ?? []),
        timezone: tz,
        uniqueItems: picked.length,
        stateJson: '{}',
      },
    });

    const session: StudySessionRecord = {
      id: row.id,
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
      createdAt: row.startedAt.toISOString(),
    };
    await this.prisma.studySession.update({
      where: { id: row.id },
      data: { stateJson: serializeExamQueue(session) },
    });
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

    const row = await this.prisma.studySession.findFirst({
      where: { id: sessionId, userId: user.id },
    });
    if (!row) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    if (row.mode === PrismaStudyMode.FLASH_STUDY) {
      return this.getFlashSession(user, sessionId);
    }
    if (row.mode === PrismaStudyMode.EXAM_TIMED) {
      const timed = parseTimedState(row);
      this.store.timedSessions.set(timed.id, timed);
      return this.getTimedSession(user.id, sessionId);
    }

    const exam = parseExamQueueState(row);
    this.store.sessions.set(exam.id, exam);
    return viewOf(exam);
  }

  async answerAny(
    user: User,
    sessionId: string,
    dto: { queueItemId: string; choiceIndex: number; latencyMs?: number },
  ): Promise<AnswerStudyResponse> {
    if (
      !this.store.sessions.has(sessionId) &&
      !this.store.timedSessions.has(sessionId)
    ) {
      await this.getAnySession(user, sessionId);
    }
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
    // Ensure store hydration for EXAM_* / WEAK after restart.
    await this.getAnySession(user, sessionId);

    if (this.store.timedSessions.has(sessionId)) {
      return this.getTimedSummary(user.id, sessionId);
    }
    if (this.store.sessions.has(sessionId)) {
      return this.getExamStudySummary(sessionId, user.id);
    }
    return this.getFlashSummary(user, sessionId);
  }

  private async answerExamStudy(
    sessionId: string,
    userId: string,
    queueItemId: string,
    choiceIndex: number,
  ): Promise<AnswerStudyResponse> {
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
    const itemType =
      (session.itemTypes?.get(current.itemId) as StudyItemType | undefined) ??
      StudyItemType.EXAM_QUESTION;

    const progress = await this.updateItemProgress(
      userId,
      current.itemId,
      correct,
      itemType,
    );

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
    let summary = finished ? summaryOf(session) : undefined;

    if (finished) {
      session.status = 'completed';
      session.endedAt = nowIso();
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const tz = user?.timezone || 'UTC';
      const streak = await this.bumpDailyStreak(
        user ?? ({ id: userId, timezone: tz } as User),
        tz,
      );
      summary = {
        ...summaryOf(session),
        dailyStreak: streak.current,
        longestDailyStreak: streak.longest,
      };
    }

    this.store.sessions.set(session.id, session);

    await this.prisma.studySession.update({
      where: { id: session.id },
      data: {
        stateJson: serializeExamQueue(session),
        sessionStreak: session.sessionStreak,
        maxSessionStreak: session.maxSessionStreak,
        answeredCount: session.answered,
        correctCount: session.correctAnswers,
        missRepeatCount: session.missRepeats,
        endedAt: finished ? new Date() : null,
        score: finished
          ? session.answered > 0
            ? (session.correctAnswers / session.answered) * 100
            : 0
          : null,
        summaryJson: summary ? JSON.stringify(summary) : null,
      },
    });

    return {
      correct,
      correctIndex: item.correctIndex,
      explanation: item.explanation,
      itemMastered: Boolean(progress.masteredAt),
      itemConsecutiveCorrect: progress.consecutiveCorrect,
      sessionStreak: session.sessionStreak,
      remaining: session.queue.length,
      finished,
      next: finished ? null : toExamPrompt(session.queue[0], session.bank),
      summary,
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
    itemType: StudyItemType = StudyItemType.KNOWLEDGE,
  ) {
    const existing = await this.prisma.itemProgress.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType,
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
          itemType,
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
    user: User,
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

    const tz = opts.timezone || user.timezone || 'UTC';
    const row = await this.prisma.studySession.create({
      data: {
        userId: user.id,
        mode: PrismaStudyMode.EXAM_TIMED,
        size: opts.size,
        scopeJson: JSON.stringify(opts.topicIds ?? []),
        timeLimitSec,
        timezone: tz,
        uniqueItems: questions.length,
        stateJson: '{}',
      },
    });

    const record: TimedSessionRecord = {
      id: row.id,
      userId: user.id,
      mode: 'EXAM_TIMED',
      size: opts.size,
      timeLimitSec,
      startedAt: row.startedAt,
      endsAt,
      status: 'IN_PROGRESS',
      timezone: tz,
      questionIds,
      bank,
      answers,
      markedForReview: new Set(),
    };
    await this.persistTimed(record);
    this.store.timedSessions.set(record.id, record);
    return this.toTimedView(record);
  }

  async getTimedSession(
    userId: string,
    sessionId: string,
  ): Promise<ExamTimedSessionView> {
    const record = await this.requireTimedOwned(userId, sessionId);
    await this.refreshTimedExpiry(record);
    return this.toTimedView(record);
  }

  async answerTimed(
    userId: string,
    sessionId: string,
    questionId: string,
    choiceIndex: 0 | 1 | 2 | 3,
  ): Promise<ExamTimedSessionView> {
    const record = await this.requireTimedActive(userId, sessionId);
    if (!record.answers.has(questionId)) {
      throw new BadRequestException('Pregunta fuera de esta sesión');
    }
    record.answers.set(questionId, choiceIndex);
    await this.persistTimed(record);
    return this.toTimedView(record);
  }

  async markTimedReview(
    userId: string,
    sessionId: string,
    questionId: string,
    marked: boolean,
  ): Promise<ExamTimedSessionView> {
    const record = await this.requireTimedActive(userId, sessionId);
    if (!record.answers.has(questionId)) {
      throw new BadRequestException('Pregunta fuera de esta sesión');
    }
    if (marked) record.markedForReview.add(questionId);
    else record.markedForReview.delete(questionId);
    await this.persistTimed(record);
    return this.toTimedView(record);
  }

  async submitTimed(
    userId: string,
    sessionId: string,
  ): Promise<ExamTimedSummary> {
    const record = await this.requireTimedOwned(userId, sessionId);
    await this.refreshTimedExpiry(record);
    if (record.summary) return record.summary;
    if (record.status === 'IN_PROGRESS') {
      record.status = 'SUBMITTED';
    }
    record.endedAt = new Date();
    record.summary = this.buildTimedSummary(record);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.bumpDailyStreak(user, record.timezone || user.timezone);
    }

    let answeredCount = 0;
    let correctCount = 0;
    for (const id of record.questionIds) {
      const q = record.bank.get(id);
      const selected = record.answers.get(id) ?? null;
      if (selected !== null) {
        answeredCount += 1;
        if (q && selected === q.correctIndex) correctCount += 1;
      }
    }

    await this.prisma.studySession.update({
      where: { id: record.id },
      data: {
        stateJson: serializeTimed(record),
        endedAt: record.endedAt,
        answeredCount,
        correctCount,
        score: record.summary.scorePercent,
        summaryJson: JSON.stringify(record.summary),
      },
    });
    this.store.timedSessions.set(record.id, record);
    return record.summary;
  }

  async getTimedSummary(
    userId: string,
    sessionId: string,
  ): Promise<ExamTimedSummary> {
    const record = await this.requireTimedOwned(userId, sessionId);
    await this.refreshTimedExpiry(record);
    if (!record.summary) {
      if (record.status === 'IN_PROGRESS') {
        throw new BadRequestException(
          'El examen sigue en curso; envíalo para ver el resultado',
        );
      }
      record.endedAt = record.endedAt ?? new Date();
      record.summary = this.buildTimedSummary(record);
      await this.persistTimed(record, true);
    }
    return record.summary;
  }

  private async persistTimed(
    record: TimedSessionRecord,
    withSummary = false,
  ): Promise<void> {
    this.store.timedSessions.set(record.id, record);
    await this.prisma.studySession.update({
      where: { id: record.id },
      data: {
        stateJson: serializeTimed(record),
        endedAt: record.endedAt ?? null,
        ...(withSummary && record.summary
          ? {
              summaryJson: JSON.stringify(record.summary),
              score: record.summary.scorePercent,
            }
          : {}),
      },
    });
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

  private async requireTimedOwned(
    userId: string,
    userSessionId: string,
  ): Promise<TimedSessionRecord> {
    let record = this.store.timedSessions.get(userSessionId);
    if (!record) {
      const row = await this.prisma.studySession.findFirst({
        where: {
          id: userSessionId,
          userId,
          mode: PrismaStudyMode.EXAM_TIMED,
        },
      });
      if (!row) throw new NotFoundException('Sesión no encontrada');
      record = parseTimedState(row);
      this.store.timedSessions.set(record.id, record);
    }
    if (record.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta sesión');
    }
    return record;
  }

  private async requireTimedActive(
    userId: string,
    sessionId: string,
  ): Promise<TimedSessionRecord> {
    const record = await this.requireTimedOwned(userId, sessionId);
    await this.refreshTimedExpiry(record);
    if (record.status !== 'IN_PROGRESS') {
      throw new BadRequestException('El examen ya terminó');
    }
    return record;
  }

  private async refreshTimedExpiry(record: TimedSessionRecord): Promise<void> {
    if (record.status !== 'IN_PROGRESS') return;
    if (Date.now() >= record.endsAt.getTime()) {
      record.status = 'EXPIRED';
      record.endedAt = record.endsAt;
      record.summary = this.buildTimedSummary(record);
      const user = await this.prisma.user.findUnique({
        where: { id: record.userId },
      });
      if (user) {
        await this.bumpDailyStreak(user, record.timezone || user.timezone);
      }
      await this.persistTimed(record, true);
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

  /* —— APS-11: weak items / history / WEAK_REVIEW —— */

  async listWeakItems(
    userId: string,
    limit = 50,
  ): Promise<WeakItemsResponse> {
    const rows = await this.prisma.itemProgress.findMany({
      where: { userId, failCount: { gt: 0 } },
      orderBy: [{ failCount: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });

    const items = await Promise.all(rows.map((row) => this.toWeakItem(row)));
    return { items, total: items.length };
  }

  async listSessions(
    userId: string,
    limit = 50,
  ): Promise<StudyHistoryResponse> {
    const rows = await this.prisma.studySession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    const sessions = rows.map((row) => this.toHistoryEntry(row));
    return { sessions, total: sessions.length };
  }

  async getHistorySession(
    userId: string,
    sessionId: string,
  ): Promise<StudyHistoryDetail> {
    const row = await this.prisma.studySession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!row) {
      throw new NotFoundException('Sesión no encontrada');
    }
    return this.toHistoryDetail(row);
  }

  /**
   * CTA “Estudiar solo estas”: cola = más falladas, miss-repeat on.
   * Playable via StudyStore + persisted StudySession for historial.
   */
  async startWeakReview(
    user: User,
    limit?: number,
  ): Promise<StudyHistoryDetail> {
    const cap = Math.min(limit ?? 50, 50);
    const weak = await this.listWeakItems(user.id, cap);

    if (weak.items.length === 0) {
      throw new BadRequestException(
        'No tienes ítems fallados todavía. Estudia un poco y vuelve aquí.',
      );
    }

    const queueMeta: StudyQueueItem[] = weak.items.map((w) => ({
      itemType: w.itemType,
      itemId: w.itemId,
    }));

    const bank: StudySessionRecord['bank'] = new Map();
    const itemTypesMap = new Map<string, 'KNOWLEDGE' | 'EXAM_QUESTION'>();
    const playQueue: QueueEntry[] = [];
    const knowledgePool = await this.content.listKnowledge({
      publishedOnly: true,
    });

    for (const w of weak.items) {
      if (w.itemType === 'KNOWLEDGE') {
        try {
          const k = await this.content.getKnowledge(w.itemId, {
            publishedOnly: true,
          });
          const variant = pickVariant(k);
          const rendered = renderFlashVariant(k, variant, knowledgePool);
          bank.set(k.id, {
            stem: rendered.stem,
            choices: rendered.choices,
            correctIndex: rendered.correctIndex,
            explanation: rendered.explanation,
            topicId: k.topicId,
          });
          itemTypesMap.set(k.id, 'KNOWLEDGE');
          playQueue.push({ queueItemId: newId('qi'), itemId: k.id });
        } catch {
          /* skip unpublished / missing */
        }
      } else {
        try {
          const q = await this.content.getQuestion(w.itemId, {
            publishedOnly: true,
          });
          bank.set(q.id, {
            stem: q.stem,
            choices: q.choices,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            topicId: q.topicId,
          });
          itemTypesMap.set(q.id, 'EXAM_QUESTION');
          playQueue.push({ queueItemId: newId('qi'), itemId: q.id });
        } catch {
          /* skip */
        }
      }
    }

    if (playQueue.length === 0) {
      throw new BadRequestException(
        'Los ítems fallados ya no están publicados. Estudia de nuevo para regenerar la cola.',
      );
    }

    const row = await this.prisma.studySession.create({
      data: {
        userId: user.id,
        mode: PrismaStudyMode.WEAK_REVIEW,
        size: playQueue.length,
        timezone: user.timezone || 'UTC',
        scopeJson: JSON.stringify(queueMeta),
        stateJson: '{}',
        uniqueItems: playQueue.length,
      },
    });

    const session: StudySessionRecord = {
      id: row.id,
      userId: user.id,
      mode: 'WEAK_REVIEW',
      size: playQueue.length,
      uniqueItems: playQueue.length,
      queue: playQueue,
      bank,
      itemTypes: itemTypesMap,
      sessionStreak: 0,
      maxSessionStreak: 0,
      answered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      missRepeats: 0,
      status: 'active',
      createdAt: row.startedAt.toISOString(),
    };
    await this.prisma.studySession.update({
      where: { id: row.id },
      data: { stateJson: serializeExamQueue(session) },
    });
    this.store.sessions.set(session.id, session);

    return this.toHistoryDetail(row, queueMeta);
  }

  private async toWeakItem(row: {
    itemType: string;
    itemId: string;
    failCount: number;
    passCount: number;
    consecutiveCorrect: number;
    masteredAt: Date | null;
  }): Promise<WeakItem> {
    const itemType = row.itemType as SharedStudyItemType;
    const enriched = await this.enrichItem(itemType, row.itemId);
    return {
      itemType,
      itemId: row.itemId,
      failCount: row.failCount,
      passCount: row.passCount,
      consecutiveCorrect: row.consecutiveCorrect,
      masteredAt: row.masteredAt?.toISOString() ?? null,
      title: enriched.title,
      subtitle: enriched.subtitle,
      topicId: enriched.topicId,
    };
  }

  private async enrichItem(
    itemType: SharedStudyItemType,
    itemId: string,
  ): Promise<{ title: string; subtitle: string | null; topicId: string | null }> {
    try {
      if (itemType === 'KNOWLEDGE') {
        const k = await this.content.getKnowledge(itemId);
        return {
          title: k.name,
          subtitle: k.definition,
          topicId: k.topicId,
        };
      }
      const q = await this.content.getQuestion(itemId);
      const stem =
        q.stem.length > STEM_PREVIEW
          ? `${q.stem.slice(0, STEM_PREVIEW).trim()}…`
          : q.stem;
      return { title: stem, subtitle: null, topicId: q.topicId };
    } catch {
      return {
        title: itemId,
        subtitle: null,
        topicId: null,
      };
    }
  }

  private toHistoryEntry(row: StudySession): StudyHistoryEntry {
    const durationMs =
      row.endedAt != null
        ? Math.max(0, row.endedAt.getTime() - row.startedAt.getTime())
        : null;
    return {
      id: row.id,
      mode: row.mode as StudyMode,
      size: row.size,
      timezone: row.timezone,
      startedAt: row.startedAt.toISOString(),
      endedAt: row.endedAt?.toISOString() ?? null,
      scoreCorrect: row.correctCount > 0 || row.endedAt ? row.correctCount : null,
      scoreTotal:
        row.answeredCount > 0 || row.endedAt ? row.answeredCount : null,
      maxStreak: row.maxSessionStreak > 0 || row.endedAt ? row.maxSessionStreak : null,
      durationMs,
    };
  }

  private toHistoryDetail(
    row: StudySession,
    queueOverride?: StudyQueueItem[],
  ): StudyHistoryDetail {
    return {
      ...this.toHistoryEntry(row),
      queue: queueOverride ?? parseQueueFromScope(row.scopeJson, row.stateJson),
      timeLimitSec: row.timeLimitSec,
    };
  }
}

function parseQueueFromScope(
  scopeJson: string,
  stateJson: string,
): StudyQueueItem[] {
  try {
    const scope = JSON.parse(scopeJson) as unknown;
    if (Array.isArray(scope) && scope.length && typeof scope[0] === 'object') {
      const out: StudyQueueItem[] = [];
      for (const entry of scope) {
        if (
          entry &&
          typeof entry === 'object' &&
          'itemType' in entry &&
          'itemId' in entry &&
          typeof (entry as StudyQueueItem).itemId === 'string'
        ) {
          out.push({
            itemType: (entry as StudyQueueItem).itemType,
            itemId: (entry as StudyQueueItem).itemId,
          });
        }
      }
      if (out.length) return out;
    }
  } catch {
    /* fall through */
  }
  try {
    const state = JSON.parse(stateJson) as {
      queue?: Array<{ itemId?: string }>;
      itemTypes?: Record<string, string>;
    };
    if (Array.isArray(state.queue)) {
      return state.queue
        .filter((q) => q.itemId)
        .map((q) => ({
          itemType: (state.itemTypes?.[q.itemId!] ??
            'EXAM_QUESTION') as SharedStudyItemType,
          itemId: q.itemId!,
        }));
    }
  } catch {
    /* ignore */
  }
  return [];
}
