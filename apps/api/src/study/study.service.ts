import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MASTERY_STREAK,
  MISS_REPEAT_OFFSET,
  type AnswerStudyResponse,
  type StudyPrompt,
  type StudySessionSummary,
  type StudySessionView,
} from '@aps/shared';
import { StudyItemType, StudyMode, type User } from '@prisma/client';
import { ContentService } from '../content/content.service';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerFlashDto } from './dto/answer.dto';
import { StartFlashSessionDto } from './dto/start-session.dto';
import { pickVariant, renderFlashVariant } from './flash-render';
import {
  parseState,
  serializeState,
  type QueueEntry,
  type SessionRuntimeState,
} from './study-session.state';

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

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toPrompt(
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

@Injectable()
export class StudyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly content: ContentService,
  ) {}

  async startFlashSession(
    user: User,
    dto: StartFlashSessionDto,
  ): Promise<StudySessionView> {
    if (dto.mode !== 'FLASH_STUDY') {
      throw new BadRequestException(
        'Solo FLASH_STUDY está disponible en APS-8',
      );
    }

    const topicIds = dto.topicIds?.filter(Boolean) ?? [];
    let pool = this.content.listKnowledge({ publishedOnly: true });
    if (topicIds.length) {
      const set = new Set(topicIds);
      pool = pool.filter((k) => set.has(k.topicId));
    }
    if (!pool.length) {
      throw new BadRequestException(
        'No hay ítems publicados para el alcance elegido',
      );
    }

    const picked = shuffle(pool).slice(0, Math.min(dto.size, pool.length));
    const queue: QueueEntry[] = picked.map((item) => ({
      queueItemId: crypto.randomUUID(),
      itemId: item.id,
      variant: pickVariant(item),
    }));

    const state: SessionRuntimeState = {
      queue,
      current: null,
      masteredItemIds: [],
    };
    this.advanceCurrent(state, pool);

    const session = await this.prisma.studySession.create({
      data: {
        userId: user.id,
        mode: StudyMode.FLASH_STUDY,
        size: dto.size,
        scopeJson: JSON.stringify(topicIds),
        timezone: user.timezone || 'UTC',
        stateJson: serializeState(state),
        uniqueItems: picked.length,
      },
    });

    const streak = await this.prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });

    return this.toView(session, state, streak?.current ?? 0);
  }

  async getSession(user: User, sessionId: string): Promise<StudySessionView> {
    const session = await this.requireSession(user.id, sessionId);
    const state = parseState(session.stateJson);
    const streak = await this.prisma.dailyStreak.findUnique({
      where: { userId: user.id },
    });
    return this.toView(session, state, streak?.current ?? 0);
  }

  async answer(
    user: User,
    sessionId: string,
    dto: AnswerFlashDto,
  ): Promise<AnswerStudyResponse> {
    const session = await this.requireSession(user.id, sessionId);
    if (session.endedAt) {
      throw new BadRequestException('La sesión ya terminó');
    }

    const state = parseState(session.stateJson);
    const current = state.current;
    if (!current || current.queueItemId !== dto.queueItemId) {
      throw new BadRequestException(
        'La carta actual no coincide; recarga la sesión',
      );
    }

    const correct = dto.choiceIndex === current.correctIndex;
    const pool = this.content.listKnowledge({ publishedOnly: true });

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
      const requeue: QueueEntry = {
        queueItemId: crypto.randomUUID(),
        itemId: current.itemId,
        variant: current.variant,
      };
      const insertAt = Math.min(MISS_REPEAT_OFFSET, state.queue.length);
      state.queue.splice(insertAt, 0, requeue);
    }

    state.current = null;
    this.advanceCurrent(state, pool);

    const finished = state.current === null && state.queue.length === 0;
    let summary: StudySessionSummary | undefined;

    if (finished) {
      const streak = await this.bumpDailyStreak(user, session.timezone);
      summary = this.buildSummary(
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
      next: state.current ? toPrompt(state.current) : null,
      summary,
    };
  }

  async getSummary(
    user: User,
    sessionId: string,
  ): Promise<StudySessionSummary> {
    const session = await this.requireSession(user.id, sessionId);
    if (!session.endedAt || !session.summaryJson) {
      throw new BadRequestException('La sesión aún no tiene resumen');
    }
    return JSON.parse(session.summaryJson) as StudySessionSummary;
  }

  private advanceCurrent(
    state: SessionRuntimeState,
    pool: ReturnType<ContentService['listKnowledge']>,
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

  private buildSummary(
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

  private async requireSession(userId: string, sessionId: string) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Sesión no encontrada');
    if (session.userId !== userId) {
      throw new ForbiddenException('Sesión de otro usuario');
    }
    return session;
  }

  private toView(
    session: {
      id: string;
      mode: StudyMode;
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
      mode: session.mode,
      size: session.size,
      uniqueItems: session.uniqueItems,
      remaining: state.queue.length + (state.current ? 1 : 0),
      sessionStreak: session.sessionStreak,
      maxSessionStreak: session.maxSessionStreak,
      answered: session.answeredCount,
      masteredInSession: state.masteredItemIds.length,
      dailyStreak,
      current: state.current ? toPrompt(state.current) : null,
      status: session.endedAt ? 'completed' : 'active',
    };
  }
}
