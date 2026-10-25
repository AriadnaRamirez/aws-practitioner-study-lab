import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type AuthedRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: unknown;
};

/**
 * Admin gate: Bearer JWT with role ADMIN, or legacy `x-admin-token`.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();

    const rawHeader = request.headers['x-admin-token'];
    const headerToken = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const expected = process.env.ADMIN_TOKEN ?? 'dev-admin-token';
    if (headerToken && headerToken === expected) {
      return true;
    }

    const auth = request.headers.authorization;
    const bearer = Array.isArray(auth) ? auth[0] : auth;
    if (bearer?.startsWith('Bearer ')) {
      const token = bearer.slice('Bearer '.length).trim();
      try {
        const payload = this.jwt.verify<{ sub?: string; role?: string }>(
          token,
          {
            secret: process.env.JWT_SECRET ?? 'dev-only-insecure-jwt-secret',
          },
        );
        if (payload.sub) {
          const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
          });
          if (
            user &&
            user.role === Role.ADMIN &&
            user.bannedAt == null
          ) {
            request.user = user;
            return true;
          }
        }
      } catch {
        /* fall through */
      }
    }

    throw new UnauthorizedException(
      'Admin required. Use Bearer JWT (role ADMIN) or header x-admin-token.',
    );
  }
}

/** Swagger: document both admin auth styles. */
export const ApiAdminTokenHeader = () =>
  ApiHeader({
    name: 'x-admin-token',
    description:
      'Legacy admin secret (ADMIN_TOKEN). Prefer Bearer JWT with role ADMIN.',
    required: false,
  });
