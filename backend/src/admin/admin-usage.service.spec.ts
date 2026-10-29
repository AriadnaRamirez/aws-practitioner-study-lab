import { Role } from '@prisma/client';
import { AdminUsageService } from './admin-usage.service';

describe('AdminUsageService', () => {
  let prisma: {
    user: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    guestProbe: {
      count: jest.Mock;
      aggregate: jest.Mock;
      findMany: jest.Mock;
    };
    studySession: {
      groupBy: jest.Mock;
      count: jest.Mock;
      aggregate: jest.Mock;
    };
    itemProgress: {
      groupBy: jest.Mock;
      count: jest.Mock;
      aggregate: jest.Mock;
    };
  };
  let service: AdminUsageService;

  beforeEach(() => {
    prisma = {
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      guestProbe: {
        count: jest.fn(),
        aggregate: jest.fn(),
        findMany: jest.fn(),
      },
      studySession: {
        groupBy: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
      itemProgress: {
        groupBy: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
    };
    service = new AdminUsageService(prisma as never);
  });

  it('computes usage summary with conversion rate and engagement', async () => {
    prisma.user.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(9)
      .mockResolvedValueOnce(1);
    prisma.guestProbe.count.mockResolvedValueOnce(4).mockResolvedValueOnce(1);
    prisma.guestProbe.aggregate.mockResolvedValue({
      _sum: { sessionsCount: 7 },
    });
    prisma.studySession.groupBy
      .mockResolvedValueOnce([{ userId: 'a' }, { userId: 'b' }])
      .mockResolvedValueOnce([
        { userId: 'a' },
        { userId: 'b' },
        { userId: 'c' },
      ]);
    prisma.studySession.count
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(15);

    const summary = await service.getUsageSummary();
    expect(summary).toEqual({
      usersTotal: 10,
      usersStudents: 9,
      usersAdmins: 1,
      guestsTotal: 4,
      guestsConverted: 1,
      conversionRate: 0.25,
      guestSessionsTotal: 7,
      dau: 2,
      wau: 3,
      sessionsLast7d: 20,
      sessionsCompletedLast7d: 15,
      finishRateLast7d: 0.75,
    });
  });

  it('lists users and guests for admin tables', async () => {
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'u1',
        email: 'a@example.com',
        username: 'ana',
        role: Role.STUDENT,
        timezone: 'UTC',
        podiumHidden: false,
        bannedAt: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        dailyStreak: { current: 4 },
      },
    ]);
    prisma.studySession.groupBy.mockResolvedValue([
      {
        userId: 'u1',
        _count: { _all: 6 },
        _max: { startedAt: new Date('2026-10-28T10:00:00.000Z') },
      },
    ]);
    prisma.itemProgress.groupBy
      .mockResolvedValueOnce([{ userId: 'u1', _count: { _all: 12 } }])
      .mockResolvedValueOnce([
        {
          userId: 'u1',
          _max: { updatedAt: new Date('2026-10-27T10:00:00.000Z') },
        },
      ]);
    prisma.guestProbe.findMany.mockResolvedValue([
      {
        id: 'g1',
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
        sessionsCount: 2,
        convertedUserId: null,
      },
    ]);

    const users = await service.listUsers();
    const guests = await service.listGuests();
    expect(users[0]?.username).toBe('ana');
    expect(users[0]?.bannedAt).toBeNull();
    expect(users[0]).toMatchObject({
      sessionsTotal: 6,
      masteredCount: 12,
      lastActiveAt: '2026-10-28T10:00:00.000Z',
      currentStreak: 4,
    });
    expect(guests[0]).toMatchObject({
      id: 'g1',
      sessionsCount: 2,
      converted: false,
    });
  });

  it('toggles podiumHidden and ban', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@example.com',
      username: 'ana',
      role: Role.STUDENT,
      timezone: 'UTC',
      podiumHidden: false,
      bannedAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const bannedAt = new Date('2026-10-25T00:00:00.000Z');
    prisma.user.update.mockResolvedValue({
      id: 'u1',
      email: 'a@example.com',
      username: 'ana',
      role: Role.STUDENT,
      timezone: 'UTC',
      podiumHidden: true,
      bannedAt,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      dailyStreak: null,
    });
    prisma.studySession.aggregate.mockResolvedValue({
      _count: { _all: 0 },
      _max: { startedAt: null },
    });
    prisma.itemProgress.count.mockResolvedValue(0);
    prisma.itemProgress.aggregate.mockResolvedValue({
      _max: { updatedAt: null },
    });

    const row = await service.updateUser('u1', {
      podiumHidden: true,
      banned: true,
    });
    expect(row.podiumHidden).toBe(true);
    expect(row.bannedAt).toBe(bannedAt.toISOString());
    expect(row.lastActiveAt).toBeNull();
  });
});
