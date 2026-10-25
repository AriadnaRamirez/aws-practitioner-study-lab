import { BadRequestException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { ContentStore } from '../content/content.store';
import { requeueMiss, StudyService } from './study.service';
import { StudyStore } from './study.store';

describe('requeueMiss', () => {
  it('inserts the miss offset slots ahead', () => {
    const queue = [
      { queueItemId: 'a', itemId: '1' },
      { queueItemId: 'b', itemId: '2' },
      { queueItemId: 'c', itemId: '3' },
      { queueItemId: 'd', itemId: '4' },
    ];
    const miss = { queueItemId: 'm', itemId: 'x' };
    const next = requeueMiss(queue, miss, 3);
    expect(next.map((e) => e.queueItemId)).toEqual([
      'a',
      'b',
      'c',
      'm',
      'd',
    ]);
  });

  it('clamps to end when queue is shorter than offset', () => {
    const queue = [{ queueItemId: 'a', itemId: '1' }];
    const miss = { queueItemId: 'm', itemId: 'x' };
    const next = requeueMiss(queue, miss, 3);
    expect(next.map((e) => e.queueItemId)).toEqual(['a', 'm']);
  });
});

describe('StudyService EXAM_STUDY', () => {
  let service: StudyService;

  beforeEach(() => {
    const contentStore = new ContentStore();
    const content = new ContentService(contentStore);
    service = new StudyService(new StudyStore(), content);
  });

  function drainSession(sessionId: string, userId: string) {
    const known = new Map<string, 0 | 1 | 2 | 3>();
    let summary;
    for (let i = 0; i < 500; i += 1) {
      const view = service.getSession(sessionId, userId);
      if (view.status === 'completed' || !view.current) {
        summary = service.getSummary(sessionId, userId);
        break;
      }
      const prompt = view.current;
      const choice = known.get(prompt.itemId) ?? 0;
      const res = service.answer(sessionId, userId, prompt.queueItemId, choice);
      if (!res.correct) {
        known.set(prompt.itemId, res.correctIndex);
      }
      if (res.finished && res.summary) {
        summary = res.summary;
        break;
      }
    }
    return summary;
  }

  it('starts EXAM_STUDY from ExamQuestion bank', () => {
    const session = service.startSession({
      userId: 'user-1',
      mode: 'EXAM_STUDY',
      size: 10,
    });
    expect(session.mode).toBe('EXAM_STUDY');
    expect(session.status).toBe('active');
    expect(session.current).not.toBeNull();
    expect(session.uniqueItems).toBeGreaterThan(0);
    expect(session.uniqueItems).toBeLessThanOrEqual(10);
    expect(session.current!.choices).toHaveLength(4);
  });

  it('returns explanation and requeues on miss', () => {
    const session = service.startSession({
      userId: 'user-1',
      mode: 'EXAM_STUDY',
      size: 10,
    });
    const prompt = session.current!;
    const remainingBefore = session.remaining;

    const res = service.answer(
      session.sessionId,
      'user-1',
      prompt.queueItemId,
      0,
    );
    expect(res.explanation.length).toBeGreaterThan(0);

    if (res.correct) {
      expect(res.sessionStreak).toBe(1);
      expect(res.remaining).toBe(remainingBefore - 1);
      return;
    }

    expect(res.sessionStreak).toBe(0);
    // Dequeue + requeue → remaining unchanged
    expect(res.remaining).toBe(remainingBefore);
  });

  it('rejects non-EXAM_STUDY modes in APS-9 stub', () => {
    expect(() =>
      service.startSession({
        userId: 'user-1',
        mode: 'FLASH_STUDY',
        size: 10,
      }),
    ).toThrow(BadRequestException);
  });

  it('completes with summary after clearing the queue', () => {
    const session = service.startSession({
      userId: 'user-1',
      mode: 'EXAM_STUDY',
      size: 10,
    });
    const summary = drainSession(session.sessionId, 'user-1');
    expect(summary).toBeDefined();
    expect(summary!.uniqueItems).toBe(session.uniqueItems);
    expect(summary!.correctAnswers).toBeGreaterThan(0);
    expect(summary!.accuracyPct).toBeGreaterThanOrEqual(0);
  });
});
