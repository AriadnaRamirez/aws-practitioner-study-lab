import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

const MINUTE = 60_000;

export interface RateRule {
  limit: number;
  windowMs: number;
}

export const AUTH_LIMITS = {
  loginPerIp: { limit: 20, windowMs: 15 * MINUTE },
  loginPerAccount: { limit: 10, windowMs: 15 * MINUTE },
  registerPerIp: { limit: 10, windowMs: 60 * MINUTE },
} satisfies Record<string, RateRule>;

/** Above this many keys, expired ones are swept before adding another. */
const SWEEP_AT = 5_000;

/**
 * Sliding-window counter in memory. Enough for a single instance (Render free);
 * with several instances each one would count on its own.
 */
@Injectable()
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly now: () => number = Date.now) {}

  /** Counts one attempt; throws 429 once `rule.limit` is exceeded inside the window. */
  consume(key: string, rule: RateRule): void {
    const now = this.now();
    const since = now - rule.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (recent.length >= rule.limit) {
      this.hits.set(key, recent);
      const waitMs = recent[0] + rule.windowMs - now;
      const minutes = Math.max(1, Math.ceil(waitMs / MINUTE));
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Demasiados intentos. Espera ${minutes === 1 ? '1 minuto' : `${minutes} minutos`} y vuelve a intentarlo.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!this.hits.has(key) && this.hits.size >= SWEEP_AT) this.sweep(now);
    recent.push(now);
    this.hits.set(key, recent);
  }

  private sweep(now: number) {
    const longest = Math.max(
      ...Object.values(AUTH_LIMITS).map((r) => r.windowMs),
    );
    for (const [key, times] of this.hits) {
      if (times[times.length - 1] <= now - longest) this.hits.delete(key);
    }
  }
}

type RequestLike = {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

/**
 * Client IP behind Render's proxies. The first X-Forwarded-For hop can be
 * spoofed, which is why login also limits per account.
 */
export function clientIp(req: RequestLike): string {
  const header = (name: string) => {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
  };
  const forwarded = header('cf-connecting-ip') ?? header('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

export const ClientIp = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    clientIp(ctx.switchToHttp().getRequest<RequestLike>()),
);
