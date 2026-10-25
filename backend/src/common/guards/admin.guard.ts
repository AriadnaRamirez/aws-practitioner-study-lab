import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

/**
 * Placeholder admin gate for Wave 1 content stubs (APS-6).
 *
 * Accepts header `x-admin-token` matching env `ADMIN_TOKEN`
 * (default `dev-admin-token` for local Swagger).
 *
 * TODO(APS-4 merge): replace body with JWT AuthGuard + role === ADMIN.
 * Keep this class name / `@UseGuards(AdminGuard)` so admin controllers stay stable.
 * Prefer composing JwtAuthGuard → RolesGuard(ADMIN) rather than deleting call sites.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const raw = request.headers['x-admin-token'];
    const token = Array.isArray(raw) ? raw[0] : raw;
    const expected = process.env.ADMIN_TOKEN ?? 'dev-admin-token';

    if (token && token === expected) {
      return true;
    }

    throw new UnauthorizedException(
      'Admin required. Send header x-admin-token (env ADMIN_TOKEN). ' +
        'TODO(APS-4): swap AdminGuard for JWT + role ADMIN.',
    );
  }
}

/** Apply on admin controllers so Swagger shows the header. */
export const ApiAdminTokenHeader = () =>
  ApiHeader({
    name: 'x-admin-token',
    description:
      'Placeholder admin secret (ADMIN_TOKEN). Replaced by Bearer JWT in APS-4.',
    required: true,
  });
