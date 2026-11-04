/** Daily-goal numbers for the progress overview (masteredToday, accuracy). */

import { countOnCivilDay } from './civil-day';

/** How many recent attempts feed `recentAccuracy`. */
export const RECENT_ACCURACY_SAMPLE = 200;
/** Below this many attempts the accuracy is too noisy to report. */
export const RECENT_ACCURACY_MIN = 10;

/** Items first mastered on the civil day of `now` in `timeZone`. */
export function countMasteredToday(
  masteredAt: Date[],
  now: Date,
  timeZone: string,
): number {
  return countOnCivilDay(masteredAt, now, timeZone);
}

/** Share of correct answers (0–1, two decimals), or null with too few. */
export function recentAccuracy(results: boolean[]): number | null {
  if (results.length < RECENT_ACCURACY_MIN) return null;
  const correct = results.filter(Boolean).length;
  return Math.round((correct / results.length) * 100) / 100;
}
