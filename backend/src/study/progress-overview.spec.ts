import type { ContentService } from '../content/content.service';
import type { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { StudyStore } from './study.store';
import { StudyService } from './study.service';

const at = (iso: string) => new Date(iso);

function serviceWith(data: {
  masteredRows: {
    itemId: string;
    itemType: 'KNOWLEDGE' | 'EXAM_QUESTION';
    masteredAt: Date;
  }[];
  todayAttempts?: Date[];
  lastResults?: boolean[];
}) {
  const prisma = {
    knowledgeItem: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'k1', topicId: 't' },
        { id: 'k2', topicId: 't' },
        { id: 'k3', topicId: 't' },
      ]),
    },
    examQuestion: {
      findMany: jest.fn().mockResolvedValue([{ id: 'q1', topicId: 't' }]),
    },
    itemProgress: {
      findMany: jest.fn().mockResolvedValue(data.masteredRows),
      count: jest.fn().mockResolvedValue(0),
    },
    dailyStreak: { findUnique: jest.fn().mockResolvedValue(null) },
    studySession: { findMany: jest.fn().mockResolvedValue([]) },
    attempt: {
      findMany: jest.fn((args: { select: { correct?: boolean } }) =>
        Promise.resolve(
          args.select.correct
            ? (data.lastResults ?? []).map((correct) => ({ correct }))
            : (data.todayAttempts ?? []).map((createdAt) => ({ createdAt })),
        ),
      ),
    },
  };
  const flags = { isExamModesEnabled: jest.fn().mockResolvedValue(true) };
  return new StudyService(
    {} as StudyStore,
    {} as ContentService,
    prisma as unknown as PrismaService,
    flags as unknown as FeatureFlagsService,
  );
}

describe('StudyService.getProgressOverview (daily goal fields)', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(at('2026-10-28T23:00:00Z')); // 17:00 MX
  });
  afterEach(() => jest.useRealTimers());

  it('counts trackable items mastered today in the user timezone', async () => {
    const service = serviceWith({
      masteredRows: [
        {
          itemId: 'k1',
          itemType: 'KNOWLEDGE',
          masteredAt: at('2026-10-28T07:00:00Z'),
        },
        {
          itemId: 'k2',
          itemType: 'KNOWLEDGE',
          masteredAt: at('2026-10-28T05:00:00Z'),
        }, // yesterday local
        {
          itemId: 'q1',
          itemType: 'EXAM_QUESTION',
          masteredAt: at('2026-10-28T22:00:00Z'),
        },
        {
          itemId: 'gone',
          itemType: 'KNOWLEDGE',
          masteredAt: at('2026-10-28T22:00:00Z'),
        }, // unpublished
      ],
      todayAttempts: [at('2026-10-28T05:00:00Z'), at('2026-10-28T20:00:00Z')],
    });

    const overview = await service.getProgressOverview(
      'u1',
      'America/Mexico_City',
    );

    expect(overview.masteredItems).toBe(3);
    expect(overview.totalTrackableItems).toBe(4);
    expect(overview.masteredToday).toBe(2);
    expect(overview.answeredToday).toBe(1);
  });

  it('reports recent accuracy only with enough attempts', async () => {
    const few = serviceWith({ masteredRows: [], lastResults: [true, false] });
    expect(
      (await few.getProgressOverview('u1', 'UTC')).recentAccuracy,
    ).toBeNull();

    const many = serviceWith({
      masteredRows: [],
      lastResults: Array.from({ length: 20 }, (_, i) => i < 16),
    });
    const overview = await many.getProgressOverview('u1', 'UTC');
    expect(overview.recentAccuracy).toBe(0.8);
    expect(overview.masteredToday).toBe(0);
  });
});
