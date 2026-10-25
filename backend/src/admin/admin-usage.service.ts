import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import type {
  AdminGuestRow,
  AdminResetPasswordResponse,
  AdminUpdateUserRequest,
  AdminUserRow,
  UsageSummary,
} from '@aps/shared';
import { hashPassword } from '../auth/password.util';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

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

  async listUsers(): Promise<AdminUserRow[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        timezone: true,
        podiumHidden: true,
        bannedAt: true,
        createdAt: true,
      },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      role: u.role,
      timezone: u.timezone,
      podiumHidden: u.podiumHidden,
      bannedAt: u.bannedAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  async updateUser(
    id: string,
    dto: AdminUpdateUserRequest,
  ): Promise<AdminUserRow> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.podiumHidden === undefined && dto.banned === undefined) {
      throw new BadRequestException(
        'Envía podiumHidden y/o banned',
      );
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
    });

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role,
      timezone: updated.timezone,
      podiumHidden: updated.podiumHidden,
      bannedAt: updated.bannedAt?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
    };
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
