import {
  planWeakReview,
  type ExamQuestion,
  type KnowledgeItem,
  type WeakItem,
} from '@aps/shared';
import type { User } from '@prisma/client';
import type { ContentService } from '../content/content.service';
import type { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { StudyStore } from './study.store';
import { StudyService } from './study.service';
import {
  STEM_PREVIEW,
  failureStatsByItem,
  knowledgeContent,
  questionContent,
  type FailedAttemptRow,
} from './weak-items';

const at = (iso: string) => new Date(iso);

const knowledge = (over: Partial<KnowledgeItem> = {}): KnowledgeItem => ({
  id: 'k1',
  topicId: 'topic-security',
  trackId: 'clf',
  name: 'WAF',
  definition: 'Filtra solicitudes HTTP hacia aplicaciones web.',
  distractors: ['a', 'b', 'c'],
  explanation: '  Protege contra inyección SQL y XSS. ',
  allowedVariants: ['NAME_TO_DEFINITION'],
  status: 'published',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...over,
});

const question = (over: Partial<ExamQuestion> = {}): ExamQuestion => ({
  id: 'q1',
  topicId: 'topic-storage',
  trackId: 'clf',
  stem: '¿Qué servicio guarda objetos?',
  choices: ['EBS', 'S3', 'EFS', 'RDS'],
  correctIndex: 1,
  explanation: '',
  status: 'published',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...over,
});

const failed = (
  itemId: string,
  iso: string,
  chosenText: string | null,
  variant: string | null = 'DEFINITION_TO_NAME',
): FailedAttemptRow => ({
  itemType: 'KNOWLEDGE',
  itemId,
  createdAt: at(iso),
  chosenText,
  variant,
});

describe('weak item content', () => {
  it('uses the definition as what to remember for flash cards', () => {
    expect(knowledgeContent(knowledge())).toEqual({
      title: 'WAF',
      subtitle: 'Filtra solicitudes HTTP hacia aplicaciones web.',
      topicId: 'topic-security',
      answer: 'Filtra solicitudes HTTP hacia aplicaciones web.',
      explanation: 'Protege contra inyección SQL y XSS.',
    });
  });

  it('uses the correct choice for exam questions and drops empty explanations', () => {
    const content = questionContent(question());
    expect(content.answer).toBe('S3');
    expect(content.explanation).toBeNull();
  });

  it('shortens long exam stems for the title', () => {
    const content = questionContent(question({ stem: 'x'.repeat(200) }));
    expect(content.title).toHaveLength(STEM_PREVIEW + 1);
    expect(content.title.endsWith('…')).toBe(true);
  });
});

describe('failureStatsByItem', () => {
  it('keeps the latest failure and the most frequent wrong pick', () => {
    const stats = failureStatsByItem([
      failed('k1', '2026-10-20T10:00:00Z', 'Shield'),
      failed('k1', '2026-10-27T10:00:00Z', 'GuardDuty'),
      failed('k1', '2026-10-22T10:00:00Z', 'Shield'),
      failed('k2', '2026-10-25T10:00:00Z', null),
    ]);
    expect(stats.get('KNOWLEDGE:k1')).toEqual({
      lastFailedAt: at('2026-10-27T10:00:00Z'),
      confusion: { text: 'Shield', variant: 'DEFINITION_TO_NAME', count: 2 },
    });
    expect(stats.get('KNOWLEDGE:k2')).toEqual({
      lastFailedAt: at('2026-10-25T10:00:00Z'),
      confusion: null,
    });
  });

  it('breaks ties with the most recent pick and keeps its variant', () => {
    const stats = failureStatsByItem([
      failed('k1', '2026-10-20T10:00:00Z', 'Shield'),
      failed(
        'k1',
        '2026-10-21T10:00:00Z',
        'Otra definición',
        'NAME_TO_DEFINITION',
      ),
    ]);
    expect(stats.get('KNOWLEDGE:k1')?.confusion).toEqual({
      text: 'Otra definición',
      variant: 'NAME_TO_DEFINITION',
      count: 1,
    });
  });
});

describe('planWeakReview', () => {
  const card = (
    id: string,
    failCount: number,
    consecutiveCorrect: number,
    lastFailedAt: string | null = null,
  ) => ({ id, failCount, consecutiveCorrect, lastFailedAt });

  it('puts every pending card first and tops up with mastered ones', () => {
    const items = [
      card('m-old', 5, 3, '2026-10-01T00:00:00Z'),
      card('p1', 4, 0),
      card('m-new', 5, 3, '2026-10-20T00:00:00Z'),
      card('p2', 2, 2),
      card('m-low', 1, 4),
    ];
    const plan = planWeakReview(items);
    expect(plan.queue.map((c) => c.id)).toEqual([
      'p1',
      'p2',
      'm-new',
      'm-old',
      'm-low',
    ]);
    expect(plan).toMatchObject({ pending: 2, refresh: 3 });
  });

  it('only tops up to the minimum round when there are few pending cards', () => {
    const items = [
      card('p1', 3, 0),
      ...Array.from({ length: 20 }, (_, i) => card(`m${i}`, 1, 3)),
    ];
    const plan = planWeakReview(items);
    expect(plan.queue).toHaveLength(10);
    expect(plan).toMatchObject({ pending: 1, refresh: 9 });
  });

  it('keeps all pending cards when they exceed the minimum round', () => {
    const items = [
      ...Array.from({ length: 12 }, (_, i) => card(`p${i}`, 2, 0)),
      card('m', 9, 3),
    ];
    const plan = planWeakReview(items);
    expect(plan.queue).toHaveLength(12);
    expect(plan.refresh).toBe(0);
  });

  it('respects an explicit limit', () => {
    const items = [card('p1', 3, 0), card('p2', 2, 1), card('m', 9, 3)];
    expect(planWeakReview(items, 1).queue.map((c) => c.id)).toEqual(['p1']);
    expect(planWeakReview(items, 3).queue.map((c) => c.id)).toEqual([
      'p1',
      'p2',
      'm',
    ]);
  });
});

describe('StudyService.listWeakItems', () => {
  function serviceWith() {
    const prisma = {
      itemProgress: {
        findMany: jest.fn().mockResolvedValue([
          {
            itemType: 'KNOWLEDGE',
            itemId: 'k1',
            failCount: 4,
            passCount: 1,
            consecutiveCorrect: 1,
            masteredAt: null,
          },
          {
            itemType: 'EXAM_QUESTION',
            itemId: 'q1',
            failCount: 1,
            passCount: 3,
            consecutiveCorrect: 3,
            masteredAt: at('2026-10-20T00:00:00Z'),
          },
          {
            itemType: 'KNOWLEDGE',
            itemId: 'gone',
            failCount: 1,
            passCount: 0,
            consecutiveCorrect: 0,
            masteredAt: null,
          },
        ]),
      },
      attempt: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            failed('k1', '2026-10-27T10:00:00Z', 'Shield'),
            failed('k1', '2026-10-26T10:00:00Z', 'Shield'),
          ]),
      },
      topic: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'topic-security', name: 'Servicios de seguridad' },
          { id: 'topic-storage', name: 'Servicios de almacenamiento' },
        ]),
      },
    };
    const content = {
      getKnowledge: jest.fn((id: string) =>
        id === 'k1'
          ? Promise.resolve(knowledge())
          : Promise.reject(new Error('not found')),
      ),
      getQuestion: jest.fn().mockResolvedValue(question()),
    };
    const service = new StudyService(
      {} as StudyStore,
      content as unknown as ContentService,
      prisma as unknown as PrismaService,
      {} as FeatureFlagsService,
    );
    return { service, prisma };
  }

  it('returns what to remember, topic, last failure and confusion per item', async () => {
    const { service, prisma } = serviceWith();
    const res = await service.listWeakItems('u1', 50);

    expect(res.total).toBe(3);
    expect(res.items[0]).toMatchObject({
      itemId: 'k1',
      failCount: 4,
      topicName: 'Servicios de seguridad',
      answer: 'Filtra solicitudes HTTP hacia aplicaciones web.',
      explanation: 'Protege contra inyección SQL y XSS.',
      lastFailedAt: '2026-10-27T10:00:00.000Z',
      confusedWith: 'Shield',
      confusedVariant: 'DEFINITION_TO_NAME',
      confusedCount: 2,
    });
    expect(res.items[1]).toMatchObject({
      itemId: 'q1',
      topicName: 'Servicios de almacenamiento',
      answer: 'S3',
      lastFailedAt: null,
      confusedWith: null,
      confusedCount: 0,
      masteredAt: '2026-10-20T00:00:00.000Z',
    });
    expect(res.items[2]).toMatchObject({
      title: 'gone',
      topicName: null,
      answer: null,
    });
    expect(prisma.attempt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 'u1',
          correct: false,
          itemId: { in: ['k1', 'q1', 'gone'] },
        },
      }),
    );
  });

  it('skips the extra queries when nothing has been failed', async () => {
    const { service, prisma } = serviceWith();
    prisma.itemProgress.findMany.mockResolvedValue([]);
    expect(await service.listWeakItems('u1')).toEqual({ items: [], total: 0 });
    expect(prisma.attempt.findMany).not.toHaveBeenCalled();
  });
});

describe('StudyService.startWeakReview', () => {
  const weak = (
    itemId: string,
    failCount: number,
    consecutiveCorrect: number,
  ) =>
    ({
      itemType: 'KNOWLEDGE',
      itemId,
      failCount,
      passCount: 0,
      consecutiveCorrect,
      masteredAt: null,
      title: itemId,
      topicId: 't',
      topicName: null,
      answer: null,
      explanation: null,
      lastFailedAt: null,
      confusedWith: null,
      confusedVariant: null,
      confusedCount: 0,
    }) satisfies WeakItem;

  it('queues pending cards before mastered ones', async () => {
    const created = {
      id: 's1',
      userId: 'u1',
      mode: 'WEAK_REVIEW',
      size: 0,
      timezone: 'UTC',
      scopeJson: '[]',
      stateJson: '{}',
      startedAt: at('2026-10-29T00:00:00Z'),
      endedAt: null,
      timeLimitSec: null,
      correctCount: 0,
      answeredCount: 0,
      maxSessionStreak: 0,
    };
    const prisma = {
      studySession: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue(created),
        update: jest.fn().mockResolvedValue(created),
      },
    };
    const content = {
      listKnowledge: jest
        .fn()
        .mockResolvedValue(
          ['a', 'b', 'c', 'd'].map((id) => knowledge({ id, name: id })),
        ),
      getKnowledge: jest.fn((id: string) =>
        Promise.resolve(knowledge({ id, name: id })),
      ),
    };
    const store = { sessions: new Map(), timedSessions: new Map() };
    const service = new StudyService(
      store,
      content as unknown as ContentService,
      prisma as unknown as PrismaService,
      {} as FeatureFlagsService,
    );
    jest.spyOn(service, 'listWeakItems').mockResolvedValue({
      items: [
        weak('m1', 6, 3),
        weak('p1', 4, 0),
        weak('m2', 2, 3),
        weak('p2', 1, 2),
      ],
      total: 4,
    });

    const detail = await service.startWeakReview(
      { id: 'u1', timezone: 'UTC' } as User,
      3,
    );

    expect(detail.queue.map((q) => q.itemId)).toEqual(['p1', 'p2', 'm1']);
    const session = store.sessions.get('s1') as {
      queue: { itemId: string }[];
    };
    expect(session.queue.map((q) => q.itemId)).toEqual(['p1', 'p2', 'm1']);
  });
});
