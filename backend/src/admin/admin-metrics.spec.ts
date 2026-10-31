import { buildDaily, buildKpis, lastCivilDates } from './admin-metrics';

const TZ = 'America/Mexico_City';

describe('admin metrics', () => {
  it('lists the last civil dates in the timezone, ending today', () => {
    // 03:00 UTC on Oct 29 is still Oct 28 in Mexico City.
    const now = new Date('2026-10-29T03:00:00.000Z');
    expect(lastCivilDates(now, 3, TZ)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
    ]);
  });

  it('buckets sessions, sign-ups and masteries per civil day', () => {
    const dates = ['2026-10-27', '2026-10-28'];
    const daily = buildDaily(
      dates,
      TZ,
      [
        {
          userId: 'a',
          startedAt: new Date('2026-10-28T15:00:00Z'),
          endedAt: new Date('2026-10-28T15:10:00Z'),
          answeredCount: 10,
          correctCount: 7,
        },
        {
          userId: 'a',
          startedAt: new Date('2026-10-28T18:00:00Z'),
          endedAt: null,
          answeredCount: 4,
          correctCount: 1,
        },
        {
          userId: 'b',
          startedAt: new Date('2026-10-28T02:00:00Z'),
          endedAt: new Date('2026-10-28T02:05:00Z'),
          answeredCount: 5,
          correctCount: 5,
        },
        {
          userId: 'c',
          startedAt: new Date('2026-10-01T12:00:00Z'),
          endedAt: null,
          answeredCount: 9,
          correctCount: 9,
        },
      ],
      [new Date('2026-10-27T20:00:00Z')],
      [new Date('2026-10-28T16:00:00Z'), new Date('2026-10-28T17:00:00Z')],
    );

    expect(daily[0]).toMatchObject({
      date: '2026-10-27',
      sessions: 1,
      completedSessions: 1,
      activeUsers: 1,
      newUsers: 1,
      answers: 5,
      correctAnswers: 5,
      mastered: 0,
    });
    expect(daily[1]).toMatchObject({
      date: '2026-10-28',
      sessions: 2,
      completedSessions: 1,
      activeUsers: 1,
      answers: 14,
      correctAnswers: 8,
      mastered: 2,
    });
  });

  it('compares the last 7 days with the 7 before', () => {
    const now = new Date('2026-10-28T18:00:00Z');
    const dates = lastCivilDates(now, 14, TZ);
    const sessions = [
      {
        userId: 'a',
        startedAt: new Date('2026-10-28T15:00:00Z'),
        endedAt: new Date('2026-10-28T15:10:00Z'),
        answeredCount: 10,
        correctCount: 8,
      },
      {
        userId: 'b',
        startedAt: new Date('2026-10-25T15:00:00Z'),
        endedAt: null,
        answeredCount: 10,
        correctCount: 2,
      },
      {
        userId: 'a',
        startedAt: new Date('2026-10-18T15:00:00Z'),
        endedAt: new Date('2026-10-18T15:10:00Z'),
        answeredCount: 4,
        correctCount: 4,
      },
    ];
    const daily = buildDaily(dates, TZ, sessions, [], []);
    const kpis = buildKpis(daily, sessions, TZ);

    expect(kpis.activeUsers).toEqual({ current: 2, previous: 1 });
    expect(kpis.sessions).toEqual({ current: 2, previous: 1 });
    expect(kpis.finishRate).toEqual({ current: 0.5, previous: 1 });
    expect(kpis.accuracy).toEqual({ current: 0.5, previous: 1 });
    expect(kpis.answers).toEqual({ current: 20, previous: 4 });
  });
});
