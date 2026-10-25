import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import type {
  PodiumEntry,
  PodiumResponse,
  PodiumWindow,
} from '@aps/shared';
import { PrismaService } from '../prisma/prisma.service';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class PodiumService {
  constructor(private readonly prisma: PrismaService) {}

  async getPodium(window: PodiumWindow, viewer: User): Promise<PodiumResponse> {
    const computedAt = new Date();
    const windowStartedAt =
      window === 'week' ? new Date(computedAt.getTime() - WEEK_MS) : null;

    const scores = await this.aggregateMasteredScores(windowStartedAt);
    const userIds = scores.map((s) => s.userId);

    const users =
      userIds.length === 0
        ? []
        : await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
              id: true,
              username: true,
              podiumHidden: true,
            },
          });

    const byId = new Map(users.map((u) => [u.id, u]));

    const visibleRows = scores
      .map((s) => {
        const u = byId.get(s.userId);
        if (!u || u.podiumHidden) return null;
        return {
          userId: u.id,
          username: u.username,
          score: s.score,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    visibleRows.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.username.localeCompare(b.username, 'es');
    });

    const entries: PodiumEntry[] = visibleRows.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      username: row.username,
      score: row.score,
    }));

    const myScore = scores.find((s) => s.userId === viewer.id)?.score ?? 0;
    const myEntry = entries.find((e) => e.userId === viewer.id);

    return {
      window,
      metric: 'masteredItems',
      windowStartedAt: windowStartedAt?.toISOString() ?? null,
      computedAt: computedAt.toISOString(),
      entries,
      me: {
        rank: viewer.podiumHidden ? null : (myEntry?.rank ?? null),
        userId: viewer.id,
        username: viewer.username,
        score: myScore,
        podiumHidden: viewer.podiumHidden,
      },
    };
  }

  private async aggregateMasteredScores(
    windowStartedAt: Date | null,
  ): Promise<Array<{ userId: string; score: number }>> {
    const rows = await this.prisma.itemProgress.groupBy({
      by: ['userId'],
      where: {
        masteredAt: windowStartedAt
          ? { not: null, gte: windowStartedAt }
          : { not: null },
      },
      _count: { _all: true },
    });

    return rows
      .map((r) => ({ userId: r.userId, score: r._count._all }))
      .filter((r) => r.score > 0);
  }
}
