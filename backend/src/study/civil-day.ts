/** Civil-date helpers in the user's IANA timezone (streak, daily goal). */

/** A civil day spans at most 25h (DST), so this window always covers "today". */
export const TODAY_LOOKBACK_MS = 26 * 60 * 60 * 1000;

/** `YYYY-MM-DD` of `date` in `timeZone` (UTC if the zone is invalid). */
export function civilDateInTz(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** How many timestamps fall on the same civil day as `now` in `timeZone`. */
export function countOnCivilDay(
  timestamps: Date[],
  now: Date,
  timeZone: string,
): number {
  const today = civilDateInTz(now, timeZone);
  return timestamps.filter((t) => civilDateInTz(t, timeZone) === today)
    .length;
}
