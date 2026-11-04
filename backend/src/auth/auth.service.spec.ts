import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { hashPassword, validatePasswordStrength } from './password.util';

describe('password.util', () => {
  it('rejects short or weak passwords', () => {
    expect(validatePasswordStrength('short').ok).toBe(false);
    expect(validatePasswordStrength('alllowercase1').ok).toBe(false);
    expect(validatePasswordStrength('ALLUPPERCASE1').ok).toBe(false);
    expect(validatePasswordStrength('NoNumberHere').ok).toBe(false);
    expect(validatePasswordStrength('password1').ok).toBe(false);
  });

  it('accepts a strong enough password', () => {
    const result = validatePasswordStrength('Segura123');
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('hashes and verifies with bcrypt', async () => {
    const { verifyPassword } = require('./password.util') as typeof import('./password.util');
    const hash = await hashPassword('Segura123');
    expect(hash).not.toBe('Segura123');
    await expect(verifyPassword('Segura123', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong', hash)).resolves.toBe(false);
  });
});

describe('AuthService', () => {
  const user = {
    id: 'user_1',
    email: 'ana@example.com',
    username: 'ana',
    passwordHash: '',
    role: Role.STUDENT,
    timezone: 'UTC',
    podiumHidden: false,
    examDate: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  let prisma: {
    user: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    passwordResetToken: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let jwt: { sign: jest.Mock };
  let guest: { markConverted: jest.Mock };
  let service: AuthService;

  beforeEach(async () => {
    user.passwordHash = await hashPassword('Segura123');
    prisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      passwordResetToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(async (ops: unknown) => ops),
    };
    jwt = { sign: jest.fn().mockReturnValue('jwt-token') };
    guest = { markConverted: jest.fn().mockResolvedValue(undefined) };
    service = new AuthService(
      prisma as never,
      jwt as unknown as JwtService,
      guest as never,
    );
  });

  it('registers a student and returns tokens', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);

    const result = await service.register({
      email: 'Ana@Example.com',
      username: 'ana',
      password: 'Segura123',
      confirmPassword: 'Segura123',
      timezone: 'America/Mexico_City',
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'ana@example.com',
          username: 'ana',
          role: Role.STUDENT,
        }),
      }),
    );
    expect(guest.markConverted).not.toHaveBeenCalled();
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('ana@example.com');
  });

  it('links guestProbeId on register for conversion analytics', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);

    await service.register({
      email: 'ana@example.com',
      username: 'ana',
      password: 'Segura123',
      confirmPassword: 'Segura123',
      guestProbeId: 'guest_abc',
    });

    expect(guest.markConverted).toHaveBeenCalledWith('guest_abc', user.id);
  });

  it('rejects register when passwords do not match', async () => {
    await expect(
      service.register({
        email: 'ana@example.com',
        username: 'ana',
        password: 'Segura123',
        confirmPassword: 'Other123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('logs in with email', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.login({
      identifier: 'ana@example.com',
      password: 'Segura123',
    });

    expect(result.user.username).toBe('ana');
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('logs in with username (case-insensitive)', async () => {
    prisma.user.findFirst.mockResolvedValue(user);

    const result = await service.login({
      identifier: 'Ana',
      password: 'Segura123',
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { username: { equals: 'Ana', mode: 'insensitive' } },
    });
    expect(result.tokens.tokenType).toBe('Bearer');
  });

  it('legacy updateProfile({ examDate }) upserts the CLF-C02 UserExam', async () => {
    const tx = {
      user: {
        update: jest
          .fn()
          .mockResolvedValue({ ...user, examDate: new Date('2026-11-07') }),
      },
      userExam: { upsert: jest.fn(), deleteMany: jest.fn() },
    };
    prisma.$transaction.mockImplementation(
      async (fn: (t: typeof tx) => unknown) => fn(tx),
    );

    const result = await service.updateProfile(user as never, {
      examDate: '2026-11-07',
    });

    expect(result.examDate).toBe('2026-11-07');
    expect(tx.userExam.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_examCode: { userId: 'user_1', examCode: 'CLF-C02' } },
      }),
    );
  });

  it('legacy updateProfile({ examDate: null }) removes the CLF-C02 UserExam', async () => {
    const tx = {
      user: { update: jest.fn().mockResolvedValue(user) },
      userExam: { upsert: jest.fn(), deleteMany: jest.fn() },
    };
    prisma.$transaction.mockImplementation(
      async (fn: (t: typeof tx) => unknown) => fn(tx),
    );

    await service.updateProfile(user as never, { examDate: null });

    expect(tx.userExam.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', examCode: 'CLF-C02' },
    });
  });

  describe('updateProfile({ username })', () => {
    beforeEach(() => {
      (prisma.user as Record<string, jest.Mock>).update = jest.fn(
        async ({ data }: { data: object }) => ({ ...user, ...data }),
      );
    });

    it('renames when the handle is free', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const result = await service.updateProfile(user as never, {
        username: ' ana_nueva ',
      });
      expect(prisma.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            username: { equals: 'ana_nueva', mode: 'insensitive' },
            NOT: { id: 'user_1' },
          },
        }),
      );
      expect(result.username).toBe('ana_nueva');
    });

    it('rejects a handle another user already has', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user_2' });
      await expect(
        service.updateProfile(user as never, { username: 'Diego' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('allows changing only the casing of your own handle', async () => {
      const result = await service.updateProfile(user as never, {
        username: 'Ana',
      });
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
      expect(result.username).toBe('Ana');
    });
  });

  describe('deleteAccount', () => {
    beforeEach(() => {
      const p = prisma as unknown as Record<string, Record<string, jest.Mock>>;
      p.user.delete = jest.fn().mockReturnValue('delete-op');
      p.guestProbe = { updateMany: jest.fn().mockReturnValue('unlink-op') };
    });

    it('deletes the user after checking the password', async () => {
      await service.deleteAccount(user as never, { password: 'Segura123' });
      expect(prisma.$transaction).toHaveBeenCalledWith([
        'unlink-op',
        'delete-op',
      ]);
    });

    it('rejects a wrong password without deleting', async () => {
      await expect(
        service.deleteAccount(user as never, { password: 'nope' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('refuses to delete an admin account', async () => {
      await expect(
        service.deleteAccount({ ...user, role: Role.ADMIN } as never, {
          password: 'Segura123',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  it('rejects bad login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ identifier: 'missing@example.com', password: 'x' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
