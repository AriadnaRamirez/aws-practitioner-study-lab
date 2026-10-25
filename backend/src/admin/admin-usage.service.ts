import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import type {
  AdminGuestRow,
  AdminUserRow,
  UsageSummary,
} from '@aps/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsageSummary(): Promise<UsageSummary> {
    const [
      usersTotal,
      usersStudents,
      usersAdmins,
      guestsTotal,
      guestsConverted,
      guestSessionsAgg,
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
    ]);

    const conversionRate =
      guestsTotal === 0 ? 0 : guestsConverted / guestsTotal;

    return {
      usersTotal,
      usersStudents,
      usersAdmins,
      guestsTotal,
      guestsConverted,
      conversionRate: Math.round(conversionRate * 1000) / 1000,
      guestSessionsTotal: guestSessionsAgg._sum.sessionsCount ?? 0,
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
      createdAt: u.createdAt.toISOString(),
    }));
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
