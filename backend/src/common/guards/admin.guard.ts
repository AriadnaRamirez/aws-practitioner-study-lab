import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

type AuthedRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: unknown;
};

/** Placeholders shipped in old `.env.example` files: never valid secrets. */
const KNOWN_PLACEHOLDER_TOKENS = new Set(['dev-admin-token']);
export const MIN_STATIC_ADMIN_TOKEN_LENGTH = 24;

/**
 * Static `x-admin-token` for non-browser tooling (scripts, CI). Disabled unless
 * `ADMIN_TOKEN` is set to a non-placeholder secret of sufficient length.
 */
export function configuredStaticAdminToken(): string | null {
  const raw = process.env.ADMIN_TOKEN?.trim();
  if (!raw) return null;
  if (KNOWN_PLACEHOLDER_TOKENS.has(raw)) return null;
  if (raw.length < MIN_STATIC_ADMIN_TOKEN_LENGTH) return null;
  return raw;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Admin gate: Bearer JWT of an active user with role ADMIN (401 without a valid
 * session, 403 for non-admins), or the opt-in static `x-admin-token`.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();

    const staticToken = configuredStaticAdminToken();
    const headerToken = firstHeader(request.headers['x-admin-token']);
    if (staticToken && headerToken && safeEqual(headerToken, staticToken)) {
      return true;
    }

    const bearer = firstHeader(request.headers.authorization);
    if (!bearer?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Inicia sesión como administración.');
    }

    let sub: string | undefined;
    try {
      const payload = this.jwt.verify<{ sub?: string }>(
        bearer.slice('Bearer '.length).trim(),
        { secret: process.env.JWT_SECRET ?? 'dev-only-insecure-jwt-secret' },
      );
      sub = payload.sub;
    } catch {
      sub = undefined;
    }
    if (!sub) {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }
    if (user.role !== Role.ADMIN || user.bannedAt != null) {
      throw new ForbiddenException('Se requiere una cuenta de administración.');
    }

    request.user = user;
    return true;
  }
}

/** Swagger: document the opt-in static header next to Bearer auth. */
export const ApiAdminTokenHeader = () =>
  ApiHeader({
    name: 'x-admin-token',
    description:
      'Optional static secret for tooling (ADMIN_TOKEN, disabled when unset). Browsers use Bearer JWT with role ADMIN.',
    required: false,
  });
