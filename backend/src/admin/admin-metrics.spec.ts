import {
  buildDaily,
  buildKpis,
  buildMinigameStats,
  buildModeStats,
  buildTimedExamStats,
  civilDaysBetween,
  lastCivilDates,
} from './admin-metrics';

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

  it('splits the last 7 days by mode, counting only scored sessions as finished', () => {
    const now = new Date('2026-10-28T18:00:00Z');
    const dates = lastCivilDates(now, 14, TZ);
    const stats = buildModeStats(dates, TZ, [
      {
        userId: 'a',
        mode: 'FLASH_STUDY',
        startedAt: new Date('2026-10-28T15:00:00Z'),
        endedAt: new Date('2026-10-28T15:10:00Z'),
        score: 80,
        answeredCount: 10,
        correctCount: 8,
      },
      {
        userId: 'a',
        mode: 'FLASH_STUDY',
        startedAt: new Date('2026-10-27T15:00:00Z'),
        endedAt: new Date('2026-10-27T15:02:00Z'),
        score: null,
        answeredCount: 2,
        correctCount: 1,
      },
      {
        userId: 'b',
        mode: 'WEAK_REVIEW',
        startedAt: new Date('2026-10-26T15:00:00Z'),
        endedAt: new Date('2026-10-26T15:05:00Z'),
        score: 100,
        answeredCount: 5,
        correctCount: 5,
      },
      {
        userId: 'c',
        mode: 'FLASH_STUDY',
        startedAt: new Date('2026-10-18T15:00:00Z'),
        endedAt: null,
        answeredCount: 9,
        correctCount: 9,
      },
    ]);

    expect(stats.map((s) => s.mode)).toEqual([
      'FLASH_STUDY',
      'EXAM_STUDY',
      'EXAM_TIMED',
      'WEAK_REVIEW',
    ]);
    expect(stats[0]).toEqual({
      mode: 'FLASH_STUDY',
      sessions: 2,
      completedSessions: 1,
      students: 1,
      answers: 12,
      correctAnswers: 9,
    });
    expect(stats[1].sessions).toBe(0);
    expect(stats[3]).toMatchObject({ sessions: 1, completedSessions: 1 });
  });

  it('summarizes simulacros against the 70% reference', () => {
    const base = {
      userId: 'a',
      startedAt: new Date('2026-10-28T15:00:00Z'),
      answeredCount: 0,
      correctCount: 0,
    };
    const ended = new Date('2026-10-28T16:00:00Z');
    expect(
      buildTimedExamStats([
        { ...base, mode: 'EXAM_TIMED', endedAt: ended, score: 75 },
        { ...base, mode: 'EXAM_TIMED', endedAt: ended, score: 60 },
        { ...base, mode: 'EXAM_TIMED', endedAt: null, score: null },
        { ...base, mode: 'FLASH_STUDY', endedAt: ended, score: 100 },
      ]),
    ).toEqual({
      started: 3,
      finished: 2,
      averageScore: 67.5,
      passed: 1,
      passScore: 70,
    });
    expect(buildTimedExamStats([]).averageScore).toBeNull();
  });

  it('counts each student once per minigame across topics', () => {
    const stats = buildMinigameStats([
      { userId: 'a', resultId: 'crucigrama:cloud-concepts', status: 'PLAYED' },
      { userId: 'a', resultId: 'crucigrama:security', status: 'COMPLETED' },
      { userId: 'b', resultId: 'crucigrama:security', status: 'PLAYED' },
      { userId: 'b', resultId: 'cuanto-pagas', status: 'COMPLETED' },
      { userId: 'c', resultId: 'memorama', status: 'COMPLETED' },
    ]);
    expect(stats.players).toBe(2);
    expect(stats.games).toEqual([
      { id: 'crucigrama', players: 2, completed: 1 },
      { id: 'quien-se-encarga', players: 0, completed: 0 },
      { id: 'cuanto-pagas', players: 1, completed: 1 },
    ]);
  });

  it('counts civil days to an exam date', () => {
    expect(civilDaysBetween('2026-11-04', '2026-11-04')).toBe(0);
    expect(civilDaysBetween('2026-11-04', '2026-11-09')).toBe(5);
    expect(civilDaysBetween('2026-12-31', '2027-01-01')).toBe(1);
  });
});
