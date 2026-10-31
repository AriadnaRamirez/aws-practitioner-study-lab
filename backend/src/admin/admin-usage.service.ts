import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, type User } from '@prisma/client';
import { randomBytes } from 'crypto';
import type {
  AdminGuestRow,
  AdminMetrics,
  AdminResetPasswordResponse,
  AdminUpdateUserRequest,
  AdminUserRow,
  UsageSummary,
} from '@aps/shared';
import { hashPassword } from '../auth/password.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  METRICS_DAYS,
  METRICS_TIMEZONE,
  buildDaily,
  buildKpis,
  lastCivilDates,
  metricsRatio,
} from './admin-metrics';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

type UserActivity = Pick<
  AdminUserRow,
  'sessionsTotal' | 'masteredCount' | 'lastActiveAt' | 'currentStreak'
>;

function latestIso(...dates: (Date | null | undefined)[]): string | null {
  const times = dates.filter((d): d is Date => !!d).map((d) => d.getTime());
  return times.length ? new Date(Math.max(...times)).toISOString() : null;
}

function toAdminUserRow(u: User, activity: UserActivity): AdminUserRow {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    role: u.role,
    timezone: u.timezone,
    podiumHidden: u.podiumHidden,
    bannedAt: u.bannedAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    ...activity,
  };
}

@Injectable()
export class AdminUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsageSummary(): Promise<UsageSummary> {
    const now = Date.now();
    const sinceDay = new Date(now - DAY_MS);
    const sinceWeek = new Date(now - WEEK_MS);

    const [
      usersTotal,
      usersStudents,
      usersAdmins,
      guestsTotal,
      guestsConverted,
      guestSessionsAgg,
      dauRows,
      wauRows,
      sessionsLast7d,
      sessionsCompletedLast7d,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.STUDENT } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.guestProbe.count(),
      this.prisma.guestProbe.count({
        where: { convertedUserId: { not: null } },
      }),
      this.prisma.guestProbe.aggregate({
        _sum: { sessionsCount: true },
      }),
      this.prisma.studySession.groupBy({
        by: ['userId'],
        where: { startedAt: { gte: sinceDay } },
      }),
      this.prisma.studySession.groupBy({
        by: ['userId'],
        where: { startedAt: { gte: sinceWeek } },
      }),
      this.prisma.studySession.count({
        where: { startedAt: { gte: sinceWeek } },
      }),
      this.prisma.studySession.count({
        where: {
          startedAt: { gte: sinceWeek },
          endedAt: { not: null },
        },
      }),
    ]);

    const conversionRate =
      guestsTotal === 0 ? 0 : guestsConverted / guestsTotal;
    const finishRateLast7d =
      sessionsLast7d === 0 ? 0 : sessionsCompletedLast7d / sessionsLast7d;

    return {
      usersTotal,
      usersStudents,
      usersAdmins,
      guestsTotal,
      guestsConverted,
      conversionRate: Math.round(conversionRate * 1000) / 1000,
      guestSessionsTotal: guestSessionsAgg._sum.sessionsCount ?? 0,
      dau: dauRows.length,
      wau: wauRows.length,
      sessionsLast7d,
      sessionsCompletedLast7d,
      finishRateLast7d: Math.round(finishRateLast7d * 1000) / 1000,
    };
  }

  async getMetrics(now = new Date()): Promise<AdminMetrics> {
    const tz = METRICS_TIMEZONE;
    const dates = lastCivilDates(now, METRICS_DAYS, tz);
    // One extra day so the oldest civil date is fully covered in any offset.
    const since = new Date(now.getTime() - (METRICS_DAYS + 1) * DAY_MS);
    const missedSince = new Date(now.getTime() - 30 * DAY_MS);
    const student = { user: { role: Role.STUDENT } };

    const [
      sessions,
      newUsers,
      masteredRows,
      students,
      admins,
      banned,
      masteredItems,
      publishedItems,
      sessionUsers,
      progressUsers,
      masteredUsers,
      guestsTotal,
      guestsConverted,
      guestSessions,
      attemptTotals,
      attemptMisses,
      recent,
    ] = await Promise.all([
      this.prisma.studySession.findMany({
        where: { startedAt: { gte: since }, ...student },
        select: {
          userId: true,
          startedAt: true,
          endedAt: true,
          answeredCount: true,
          correctCount: true,
        },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: since }, role: Role.STUDENT },
        select: { createdAt: true },
      }),
      this.prisma.itemProgress.findMany({
        where: { masteredAt: { gte: since }, ...student },
        select: { masteredAt: true },
      }),
      this.prisma.user.count({ where: { role: Role.STUDENT } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.user.count({ where: { bannedAt: { not: null } } }),
      this.prisma.itemProgress.count({
        where: { masteredAt: { not: null }, ...student },
      }),
      this.prisma.knowledgeItem.count({ where: { status: 'published' } }),
      this.prisma.studySession.groupBy({ by: ['userId'], where: student }),
      this.prisma.itemProgress.groupBy({ by: ['userId'], where: student }),
      this.prisma.itemProgress.groupBy({
        by: ['userId'],
        where: { masteredAt: { not: null }, ...student },
      }),
      this.prisma.guestProbe.count(),
      this.prisma.guestProbe.count({
        where: { convertedUserId: { not: null } },
      }),
      this.prisma.guestProbe.aggregate({ _sum: { sessionsCount: true } }),
      this.prisma.attempt.groupBy({
        by: ['itemId'],
        where: {
          itemType: 'KNOWLEDGE',
          createdAt: { gte: missedSince },
          ...student,
        },
        _count: { _all: true },
      }),
      this.prisma.attempt.groupBy({
        by: ['itemId'],
        where: {
          itemType: 'KNOWLEDGE',
          correct: false,
          createdAt: { gte: missedSince },
          ...student,
        },
        _count: { _all: true },
      }),
      this.prisma.studySession.findMany({
        where: student,
        orderBy: { startedAt: 'desc' },
        take: 8,
        include: { user: { select: { username: true } } },
      }),
    ]);

    const daily = buildDaily(
      dates,
      tz,
      sessions,
      newUsers.map((u) => u.createdAt),
      masteredRows.flatMap((r) => (r.masteredAt ? [r.masteredAt] : [])),
    );
    const today = dates[dates.length - 1];

    const missesBy = new Map(
      attemptMisses.map((r) => [r.itemId, r._count._all]),
    );
    const missedRanked = attemptTotals
      .map((r) => {
        const misses = missesBy.get(r.itemId) ?? 0;
        return {
          itemId: r.itemId,
          attempts: r._count._all,
          misses,
          missRate: metricsRatio(misses, r._count._all),
        };
      })
      .filter((r) => r.misses > 0 && r.attempts >= 3)
      .sort((a, b) => b.misses - a.misses || b.missRate - a.missRate)
      .slice(0, 8);
    const missedItems = missedRanked.length
      ? await this.prisma.knowledgeItem.findMany({
          where: { id: { in: missedRanked.map((r) => r.itemId) } },
          select: { id: true, name: true, topic: { select: { name: true } } },
        })
      : [];
    const itemById = new Map(missedItems.map((i) => [i.id, i]));

    return {
      generatedAt: now.toISOString(),
      timezone: tz,
      daily,
      kpis: buildKpis(daily, sessions, tz),
      activeToday: daily.find((d) => d.date === today)?.activeUsers ?? 0,
      funnel: {
        registered: students,
        studied: new Set(
          [...sessionUsers, ...progressUsers].map((r) => r.userId),
        ).size,
        mastered: masteredUsers.length,
      },
      guests: {
        total: guestsTotal,
        converted: guestsConverted,
        conversionRate: metricsRatio(guestsConverted, guestsTotal),
        sessions: guestSessions._sum.sessionsCount ?? 0,
      },
      totals: { students, admins, banned, masteredItems, publishedItems },
      mostMissed: missedRanked.flatMap((r) => {
        const item = itemById.get(r.itemId);
        return item
          ? [{ ...r, name: item.name, topicName: item.topic.name }]
          : [];
      }),
      recentSessions: recent.map((s) => ({
        id: s.id,
        username: s.user.username,
        mode: s.mode,
        size: s.size,
        answered: s.answeredCount,
        correct: s.correctCount,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
      })),
    };
  }

  async listUsers(): Promise<AdminUserRow[]> {
    const [users, sessionStats, masteredStats, progressStats] =
      await Promise.all([
        this.prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          include: { dailyStreak: { select: { current: true } } },
        }),
        this.prisma.studySession.groupBy({
          by: ['userId'],
          _count: { _all: true },
          _max: { startedAt: true },
        }),
        this.prisma.itemProgress.groupBy({
          by: ['userId'],
          where: { masteredAt: { not: null } },
          _count: { _all: true },
        }),
        this.prisma.itemProgress.groupBy({
          by: ['userId'],
          _max: { updatedAt: true },
        }),
      ]);

    const sessionsBy = new Map(sessionStats.map((s) => [s.userId, s]));
    const masteredBy = new Map(
      masteredStats.map((m) => [m.userId, m._count._all]),
    );
    const progressBy = new Map(
      progressStats.map((p) => [p.userId, p._max.updatedAt]),
    );

    return users.map((u) => {
      const s = sessionsBy.get(u.id);
      return toAdminUserRow(u, {
        sessionsTotal: s?._count._all ?? 0,
        masteredCount: masteredBy.get(u.id) ?? 0,
        lastActiveAt: latestIso(s?._max.startedAt, progressBy.get(u.id)),
        currentStreak: u.dailyStreak?.current ?? 0,
      });
    });
  }

  async updateUser(
    id: string,
    dto: AdminUpdateUserRequest,
  ): Promise<AdminUserRow> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.podiumHidden === undefined && dto.banned === undefined) {
      throw new BadRequestException('Envía podiumHidden y/o banned');
    }

    if (dto.banned === true && existing.role === Role.ADMIN) {
      throw new BadRequestException('No se puede banear al admin');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.podiumHidden !== undefined
          ? { podiumHidden: dto.podiumHidden }
          : {}),
        ...(dto.banned !== undefined
          ? { bannedAt: dto.banned ? new Date() : null }
          : {}),
      },
      include: { dailyStreak: { select: { current: true } } },
    });

    const [sessions, mastered, progress] = await Promise.all([
      this.prisma.studySession.aggregate({
        where: { userId: id },
        _count: { _all: true },
        _max: { startedAt: true },
      }),
      this.prisma.itemProgress.count({
        where: { userId: id, masteredAt: { not: null } },
      }),
      this.prisma.itemProgress.aggregate({
        where: { userId: id },
        _max: { updatedAt: true },
      }),
    ]);

    return toAdminUserRow(updated, {
      sessionsTotal: sessions._count._all,
      masteredCount: mastered,
      lastActiveAt: latestIso(sessions._max.startedAt, progress._max.updatedAt),
      currentStreak: updated.dailyStreak?.current ?? 0,
    });
  }

  async resetPassword(id: string): Promise<AdminResetPasswordResponse> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    const temporaryPassword = `Tmp${randomBytes(4).toString('hex')}A1!`;
    const passwordHash = await hashPassword(temporaryPassword);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return {
      userId: existing.id,
      username: existing.username,
      temporaryPassword,
    };
  }

  async listGuests(): Promise<AdminGuestRow[]> {
    const guests = await this.prisma.guestProbe.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return guests.map((g) => ({
      id: g.id,
      createdAt: g.createdAt.toISOString(),
      sessionsCount: g.sessionsCount,
      convertedUserId: g.convertedUserId,
      converted: g.convertedUserId != null,
    }));
  }
}
