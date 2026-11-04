import {
  TODAY_LOOKBACK_MS,
  civilDateInTz,
  countOnCivilDay,
} from './civil-day';

const at = (iso: string) => new Date(iso);

describe('civilDateInTz', () => {
  it('uses the civil date of the timezone, not UTC', () => {
    // 03:00 UTC is still the previous evening in Mexico City (UTC-6).
    const d = at('2026-10-29T03:00:00Z');
    expect(civilDateInTz(d, 'UTC')).toBe('2026-10-29');
    expect(civilDateInTz(d, 'America/Mexico_City')).toBe('2026-10-28');
    expect(civilDateInTz(d, 'Asia/Tokyo')).toBe('2026-10-29');
  });

  it('falls back to the UTC date for an invalid timezone', () => {
    expect(civilDateInTz(at('2026-10-29T03:00:00Z'), 'Not/AZone')).toBe(
      '2026-10-29',
    );
  });
});

describe('countOnCivilDay', () => {
  const attempts = [
    at('2026-10-28T05:59:59Z'), // 23:59:59 Oct 27 in Mexico City
    at('2026-10-28T06:00:00Z'), // 00:00:00 Oct 28 in Mexico City
    at('2026-10-28T18:00:00Z'),
    at('2026-10-29T05:59:59Z'), // 23:59:59 Oct 28 in Mexico City
    at('2026-10-29T06:00:00Z'), // 00:00:00 Oct 29 in Mexico City
  ];

  it('counts only attempts inside the local midnight boundaries', () => {
    const now = at('2026-10-29T05:30:00Z'); // 23:30 Oct 28 local
    expect(countOnCivilDay(attempts, now, 'America/Mexico_City')).toBe(3);
  });

  it('rolls over at local midnight, not UTC midnight', () => {
    const justAfterLocalMidnight = at('2026-10-29T06:00:01Z');
    expect(
      countOnCivilDay(attempts, justAfterLocalMidnight, 'America/Mexico_City'),
    ).toBe(1);
    // Same instants in UTC: Oct 28 has the first three.
    expect(countOnCivilDay(attempts, at('2026-10-28T23:00:00Z'), 'UTC')).toBe(
      3,
    );
  });

  it('handles positive offsets (day starts before UTC midnight)', () => {
    // Tokyo is UTC+9: Oct 29 local starts at 15:00 UTC Oct 28.
    const now = at('2026-10-28T15:30:00Z');
    expect(countOnCivilDay(attempts, now, 'Asia/Tokyo')).toBe(3);
  });

  it('handles a DST change day (25h civil day)', () => {
    // New York leaves DST on 2026-11-01: midnight is 04:00Z, next is 05:00Z.
    const ny = [
      at('2026-11-01T03:59:59Z'), // Oct 31 local
      at('2026-11-01T04:00:00Z'), // Nov 1 00:00 EDT
      at('2026-11-02T04:59:59Z'), // Nov 1 23:59:59 EST
      at('2026-11-02T05:00:00Z'), // Nov 2 local
    ];
    const now = at('2026-11-02T04:30:00Z');
    expect(countOnCivilDay(ny, now, 'America/New_York')).toBe(2);
  });

  it('the lookback window covers the start of a 25h civil day', () => {
    const now = at('2026-11-02T04:59:59Z');
    const startOfDay = at('2026-11-01T04:00:00Z');
    expect(now.getTime() - startOfDay.getTime()).toBeLessThan(
      TODAY_LOOKBACK_MS,
    );
  });

  it('returns 0 without attempts', () => {
    expect(countOnCivilDay([], at('2026-10-28T12:00:00Z'), 'UTC')).toBe(0);
  });
});
