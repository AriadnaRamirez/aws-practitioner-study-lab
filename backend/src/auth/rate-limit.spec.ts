import { HttpException, HttpStatus } from '@nestjs/common';
import { RateLimiter, clientIp } from './rate-limit';

describe('RateLimiter', () => {
  const rule = { limit: 3, windowMs: 60_000 };
  let now: number;
  let limiter: RateLimiter;

  beforeEach(() => {
    now = 1_000_000;
    limiter = new RateLimiter(() => now);
  });

  function status(fn: () => void): number | null {
    try {
      fn();
      return null;
    } catch (err) {
      return err instanceof HttpException ? err.getStatus() : -1;
    }
  }

  it('allows attempts up to the limit, then answers 429 in Spanish', () => {
    for (let i = 0; i < 3; i++) limiter.consume('login:ana', rule);
    try {
      limiter.consume('login:ana', rule);
      fail('expected 429');
    } catch (err) {
      expect((err as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
      expect((err as HttpException).getResponse()).toMatchObject({
        message: 'Demasiados intentos. Espera 1 minuto y vuelve a intentarlo.',
      });
    }
  });

  it('counts each key on its own', () => {
    for (let i = 0; i < 3; i++) limiter.consume('login:ana', rule);
    expect(status(() => limiter.consume('login:diego', rule))).toBeNull();
  });

  it('frees attempts as they leave the window', () => {
    for (let i = 0; i < 3; i++) limiter.consume('k', rule);
    now += 60_001;
    expect(status(() => limiter.consume('k', rule))).toBeNull();
  });
});

describe('clientIp', () => {
  it('prefers the first forwarded hop', () => {
    expect(
      clientIp({ headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' } }),
    ).toBe('203.0.113.7');
  });

  it('falls back to the socket address', () => {
    expect(
      clientIp({ headers: {}, socket: { remoteAddress: '127.0.0.1' } }),
    ).toBe('127.0.0.1');
  });
});
