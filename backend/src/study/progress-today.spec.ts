import {
  RECENT_ACCURACY_MIN,
  countMasteredToday,
  recentAccuracy,
} from './progress-today';

const at = (iso: string) => new Date(iso);

describe('countMasteredToday', () => {
  const masteredAt = [
    at('2026-10-28T05:30:00Z'), // 23:30 Oct 27 in Mexico City
    at('2026-10-28T06:10:00Z'), // 00:10 Oct 28 local
    at('2026-10-28T20:00:00Z'),
    at('2026-10-29T05:59:00Z'), // 23:59 Oct 28 local
  ];

  it('counts masteries inside today in the user timezone', () => {
    const now = at('2026-10-29T05:59:30Z'); // 23:59:30 Oct 28 local
    expect(countMasteredToday(masteredAt, now, 'America/Mexico_City')).toBe(3);
  });

  it('uses the UTC day when the timezone is UTC', () => {
    expect(
      countMasteredToday(masteredAt, at('2026-10-28T12:00:00Z'), 'UTC'),
    ).toBe(3);
  });

  it('returns 0 without masteries', () => {
    expect(countMasteredToday([], at('2026-10-28T12:00:00Z'), 'UTC')).toBe(0);
  });
});

describe('recentAccuracy', () => {
  it('is null below the minimum sample', () => {
    expect(recentAccuracy([])).toBeNull();
    expect(
      recentAccuracy(
        Array.from({ length: RECENT_ACCURACY_MIN - 1 }, () => true),
      ),
    ).toBeNull();
  });

  it('returns the share of correct answers rounded to 2 decimals', () => {
    const results = [
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
    ];
    expect(recentAccuracy(results)).toBe(0.75);
    const nine = Array.from({ length: 9 }, () => true);
    expect(recentAccuracy([...nine, false, false, true])).toBe(0.83);
  });
});
