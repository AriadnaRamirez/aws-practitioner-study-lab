import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GUEST_MAX_SESSIONS } from '@aps/shared';
import { GuestService } from './guest.service';

describe('GuestService', () => {
  const base = {
    id: 'guest_1',
    createdAt: new Date('2026-10-25T00:00:00.000Z'),
    sessionsCount: 0,
    convertedUserId: null as string | null,
  };

  let prisma: {
    guestProbe: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let service: GuestService;

  beforeEach(() => {
    prisma = {
      guestProbe: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new GuestService(prisma as never);
  });

  it('creates a probe with full sessions remaining', async () => {
    prisma.guestProbe.create.mockResolvedValue({ ...base });
    const probe = await service.createProbe();
    expect(probe.id).toBe('guest_1');
    expect(probe.sessionsCount).toBe(0);
    expect(probe.sessionsRemaining).toBe(GUEST_MAX_SESSIONS);
  });

  it('increments sessions until the soft cap', async () => {
    prisma.guestProbe.findUnique.mockResolvedValue({ ...base, sessionsCount: 1 });
    prisma.guestProbe.update.mockResolvedValue({
      ...base,
      sessionsCount: 2,
    });

    const probe = await service.recordSession('guest_1');
    expect(prisma.guestProbe.update).toHaveBeenCalled();
    expect(probe.sessionsCount).toBe(2);
    expect(probe.sessionsRemaining).toBe(GUEST_MAX_SESSIONS - 2);
  });

  it('does not increment past the soft cap', async () => {
    prisma.guestProbe.findUnique.mockResolvedValue({
      ...base,
      sessionsCount: GUEST_MAX_SESSIONS,
    });

    const probe = await service.recordSession('guest_1');
    expect(prisma.guestProbe.update).not.toHaveBeenCalled();
    expect(probe.sessionsRemaining).toBe(0);
  });

  it('rejects session on converted probe', async () => {
    prisma.guestProbe.findUnique.mockResolvedValue({
      ...base,
      convertedUserId: 'user_1',
    });
    await expect(service.recordSession('guest_1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when probe is missing', async () => {
    prisma.guestProbe.findUnique.mockResolvedValue(null);
    await expect(service.getProbe('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('marks conversion once', async () => {
    prisma.guestProbe.findUnique
      .mockResolvedValueOnce({ ...base })
      .mockResolvedValueOnce(null);
    prisma.guestProbe.update.mockResolvedValue({
      ...base,
      convertedUserId: 'user_1',
    });

    await service.markConverted('guest_1', 'user_1');
    expect(prisma.guestProbe.update).toHaveBeenCalledWith({
      where: { id: 'guest_1' },
      data: { convertedUserId: 'user_1' },
    });
  });
});
