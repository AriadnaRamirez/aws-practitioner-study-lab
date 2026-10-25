import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import type { AuthResponse, PublicUser } from '@aps/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from './password.util';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const strength = validatePasswordStrength(dto.password);
    if (!strength.ok) {
      throw new BadRequestException({
        message: 'Contraseña no cumple los requisitos',
        errors: strength.errors,
      });
    }

    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();
    const usernameKey = username.toLowerCase();

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: { equals: usernameKey, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      if (existing.email === email) {
        throw new ConflictException('Ya existe una cuenta con ese email');
      }
      throw new ConflictException('Ese username ya está en uso');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role: Role.STUDENT,
        timezone: dto.timezone?.trim() || 'UTC',
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const identifier = dto.identifier.trim();
    if (!identifier || !dto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const user = await this.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await verifyPassword(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildAuthResponse(user);
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    const message =
      'Si el email existe, recibirás instrucciones para restablecer la contraseña';

    if (!user) {
      return { message };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const webBase =
      process.env.WEB_PUBLIC_URL ??
      process.env.WEB_ORIGIN ??
      'http://127.0.0.1:43123';
    const resetUrl = `${webBase.replace(/\/$/, '')}/forgot-password?token=${rawToken}`;

    // Dev-friendly: no email provider in MVP — log the one-time link
    // eslint-disable-next-line no-console
    console.log(`[auth:forgot-password] reset link for ${email}: ${resetUrl}`);

    return { message };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const strength = validatePasswordStrength(dto.password);
    if (!strength.ok) {
      throw new BadRequestException({
        message: 'Contraseña no cumple los requisitos',
        errors: strength.errors,
      });
    }

    const tokenHash = this.hashToken(dto.token.trim());
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const passwordHash = await hashPassword(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Sesión inválida');
    }
    return this.toPublicUser(user);
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private async findByIdentifier(identifier: string): Promise<User | null> {
    if (identifier.includes('@')) {
      return this.prisma.user.findUnique({
        where: { email: identifier.toLowerCase() },
      });
    }
    return this.prisma.user.findFirst({
      where: { username: { equals: identifier, mode: 'insensitive' } },
    });
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const expiresIn = this.parseExpiresInSeconds(
      process.env.JWT_EXPIRES_IN ?? '7d',
    );
    const accessToken = this.jwt.sign(payload);

    return {
      user: this.toPublicUser(user),
      tokens: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn,
      },
    };
  }

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      timezone: user.timezone,
      podiumHidden: user.podiumHidden,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  private parseExpiresInSeconds(value: string): number {
    const match = /^(\d+)([smhd])?$/.exec(value.trim());
    if (!match) return 7 * 24 * 60 * 60;
    const n = Number(match[1]);
    const unit = match[2] ?? 's';
    const mult =
      unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
    return n * mult;
  }
}
