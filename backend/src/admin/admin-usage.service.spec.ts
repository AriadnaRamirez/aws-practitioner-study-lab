import { Role } from '@prisma/client';
import { AdminUsageService } from './admin-usage.service';

describe('AdminUsageService', () => {
  let prisma: {
    user: { count: jest.Mock; findMany: jest.Mock };
    guestProbe: {
      count: jest.Mock;
      aggregate: jest.Mock;
      findMany: jest.Mock;
    };
  };
  let service: AdminUsageService;

  beforeEach(() => {
    prisma = {
      user: { count: jest.fn(), findMany: jest.fn() },
      guestProbe: {
        count: jest.fn(),
        aggregate: jest.fn(),
        findMany: jest.fn(),
      },
    };
    service = new AdminUsageService(prisma as never);
  });

  it('computes usage summary with conversion rate', async () => {
    prisma.user.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(9)
      .mockResolvedValueOnce(1);
    prisma.guestProbe.count.mockResolvedValueOnce(4).mockResolvedValueOnce(1);
    prisma.guestProbe.aggregate.mockResolvedValue({
      _sum: { sessionsCount: 7 },
    });

    const summary = await service.getUsageSummary();
    expect(summary).toEqual({
      usersTotal: 10,
      usersStudents: 9,
      usersAdmins: 1,
      guestsTotal: 4,
      guestsConverted: 1,
      conversionRate: 0.25,
      guestSessionsTotal: 7,
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
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
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
    expect(guests[0]).toMatchObject({
      id: 'g1',
      sessionsCount: 2,
      converted: false,
    });
  });
});
