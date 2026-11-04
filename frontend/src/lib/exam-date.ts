/** Civil calendar parts for `now` in a given IANA timezone (default es-MX). */
export function civilTodayInTz(
  timeZone = "America/Mexico_City",
  now = new Date(),
): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? NaN);
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Civil YYYY-MM-DD → days from today (user timezone midnight). */
export function daysUntilExam(
  examDate: string,
  now = new Date(),
  timeZone = "America/Mexico_City",
): number {
  const [y, m, d] = examDate.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const today = civilTodayInTz(timeZone, now);
  if (!today.y || !today.m || !today.d) return NaN;
  const targetUtc = Date.UTC(y, m - 1, d);
  const todayUtc = Date.UTC(today.y, today.m - 1, today.d);
  return Math.round((targetUtc - todayUtc) / 86_400_000);
}
