import type { AdminDailyPoint, AdminKpi, AdminMetrics } from '@aps/shared';
import { civilDateInTz } from '../study/civil-day';

/** Owner dashboards are read in Mexico City time. */
export const METRICS_TIMEZONE = 'America/Mexico_City';
export const METRICS_DAYS = 28;
export const KPI_WINDOW_DAYS = 7;

export interface MetricsSessionRow {
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
  answeredCount: number;
  correctCount: number;
}

/** The last `days` civil dates in `timeZone`, oldest first, ending today. */
export function lastCivilDates(
  now: Date,
  days: number,
  timeZone: string,
): string[] {
  const [y, m, d] = civilDateInTz(now, timeZone).split('-').map(Number);
  const todayUtc = Date.UTC(y, m - 1, d);
  return Array.from({ length: days }, (_, i) =>
    new Date(todayUtc - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10),
  );
}

export function buildDaily(
  dates: string[],
  timeZone: string,
  sessions: MetricsSessionRow[],
  newUserDates: Date[],
  masteredDates: Date[],
): AdminDailyPoint[] {
  const byDate = new Map<string, AdminDailyPoint & { users: Set<string> }>(
    dates.map((date) => [
      date,
      {
        date,
        sessions: 0,
        completedSessions: 0,
        activeUsers: 0,
        newUsers: 0,
        answers: 0,
        correctAnswers: 0,
        mastered: 0,
        users: new Set<string>(),
      },
    ]),
  );

  for (const s of sessions) {
    const day = byDate.get(civilDateInTz(s.startedAt, timeZone));
    if (!day) continue;
    day.sessions += 1;
    if (s.endedAt) day.completedSessions += 1;
    day.answers += s.answeredCount;
    day.correctAnswers += s.correctCount;
    day.users.add(s.userId);
  }
  for (const t of newUserDates) {
    const day = byDate.get(civilDateInTz(t, timeZone));
    if (day) day.newUsers += 1;
  }
  for (const t of masteredDates) {
    const day = byDate.get(civilDateInTz(t, timeZone));
    if (day) day.mastered += 1;
  }

  return dates.map((date) => {
    const { users, ...point } = byDate.get(date)!;
    return { ...point, activeUsers: users.size };
  });
}

function ratio(num: number, den: number): number {
  return den === 0 ? 0 : Math.round((num / den) * 1000) / 1000;
}

function sum(points: AdminDailyPoint[], key: keyof AdminDailyPoint): number {
  return points.reduce((acc, p) => acc + (p[key] as number), 0);
}

/** Last `KPI_WINDOW_DAYS` civil days vs the same span right before. */
export function buildKpis(
  daily: AdminDailyPoint[],
  sessions: MetricsSessionRow[],
  timeZone: string,
): AdminMetrics['kpis'] {
  const current = daily.slice(-KPI_WINDOW_DAYS);
  const previous = daily.slice(-2 * KPI_WINDOW_DAYS, -KPI_WINDOW_DAYS);
  const currentDates = new Set(current.map((p) => p.date));
  const previousDates = new Set(previous.map((p) => p.date));

  const currentUsers = new Set<string>();
  const previousUsers = new Set<string>();
  for (const s of sessions) {
    const date = civilDateInTz(s.startedAt, timeZone);
    if (currentDates.has(date)) currentUsers.add(s.userId);
    else if (previousDates.has(date)) previousUsers.add(s.userId);
  }

  const kpi = (fn: (pts: AdminDailyPoint[]) => number): AdminKpi => ({
    current: fn(current),
    previous: fn(previous),
  });

  return {
    activeUsers: { current: currentUsers.size, previous: previousUsers.size },
    sessions: kpi((pts) => sum(pts, 'sessions')),
    finishRate: kpi((pts) =>
      ratio(sum(pts, 'completedSessions'), sum(pts, 'sessions')),
    ),
    accuracy: kpi((pts) =>
      ratio(sum(pts, 'correctAnswers'), sum(pts, 'answers')),
    ),
    answers: kpi((pts) => sum(pts, 'answers')),
    newUsers: kpi((pts) => sum(pts, 'newUsers')),
    mastered: kpi((pts) => sum(pts, 'mastered')),
  };
}

export { ratio as metricsRatio };
