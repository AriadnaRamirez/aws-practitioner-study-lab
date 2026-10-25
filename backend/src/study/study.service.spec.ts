import { EXAM_TIMED_LIMIT_SEC, examTimedLimitSec } from '@aps/shared';
import { requeueMiss } from './study.service';

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

describe('examTimedLimitSec', () => {
  it('maps mock 65 to 90 minutes', () => {
    expect(examTimedLimitSec(65)).toBe(EXAM_TIMED_LIMIT_SEC[65]);
    expect(examTimedLimitSec(65)).toBe(90 * 60);
  });
});
