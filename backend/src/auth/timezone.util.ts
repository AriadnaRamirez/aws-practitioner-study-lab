/** Returns `raw` if it is a valid IANA timezone, otherwise `fallback`. */
export function normalizeTimezone(
  raw: string | undefined | null,
  fallback = 'UTC',
): string {
  const tz = raw?.trim();
  if (!tz) return fallback;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return fallback;
  }
}
