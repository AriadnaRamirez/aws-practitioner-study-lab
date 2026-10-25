import { MASTERY_STREAK, MISS_REPEAT_OFFSET } from '@aps/shared';

describe('study engine constants (maestro §4.1)', () => {
  it('mastery requires 3 consecutive', () => {
    expect(MASTERY_STREAK).toBe(3);
  });

  it('miss-repeat offsets a few cards ahead', () => {
    expect(MISS_REPEAT_OFFSET).toBeGreaterThanOrEqual(2);
    expect(MISS_REPEAT_OFFSET).toBeLessThanOrEqual(5);
  });
});
