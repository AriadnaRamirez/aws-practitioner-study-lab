import { BadRequestException, UnauthorizedException } from '@nestjs/common';
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
    service = new AuthService(prisma as never, jwt as unknown as JwtService);
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
    expect(result.tokens.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('ana@example.com');
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

  it('rejects bad login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ identifier: 'missing@example.com', password: 'x' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
