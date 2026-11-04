import {
  MINIGAME_IDS,
  STUDY_MODES,
  type AdminDailyPoint,
  type AdminKpi,
  type AdminMetrics,
  type AdminMinigameStat,
  type AdminModeStat,
  type AdminTimedExamStats,
  type StudyMode,
} from '@aps/shared';
import { civilDateInTz } from '../study/civil-day';

/** Owner dashboards are read in Mexico City time. */
export const METRICS_TIMEZONE = 'America/Mexico_City';
export const METRICS_DAYS = 28;
export const KPI_WINDOW_DAYS = 7;
/** 700/1000 on the real exam, as a percentage of the simulacro. */
export const TIMED_PASS_SCORE = 70;

interface MetricsSessionRow {
  userId: string;
  mode?: StudyMode;
  startedAt: Date;
  endedAt: Date | null;
  /** Null on a session that ended without finishing (abandoned). */
  score?: number | null;
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
    if (s.endedAt && s.score !== null) day.completedSessions += 1;
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

/** Per-mode usage over the last `KPI_WINDOW_DAYS` of `dates`, in STUDY_MODES order. */
export function buildModeStats(
  dates: string[],
  timeZone: string,
  sessions: MetricsSessionRow[],
): AdminModeStat[] {
  const window = new Set(dates.slice(-KPI_WINDOW_DAYS));
  const byMode = new Map(
    STUDY_MODES.map((mode) => [
      mode,
      {
        mode,
        sessions: 0,
        completedSessions: 0,
        students: new Set<string>(),
        answers: 0,
        correctAnswers: 0,
      },
    ]),
  );
  for (const s of sessions) {
    const stat = s.mode ? byMode.get(s.mode) : undefined;
    if (!stat || !window.has(civilDateInTz(s.startedAt, timeZone))) continue;
    stat.sessions += 1;
    if (s.endedAt && s.score != null) stat.completedSessions += 1;
    stat.students.add(s.userId);
    stat.answers += s.answeredCount;
    stat.correctAnswers += s.correctCount;
  }
  return STUDY_MODES.map((mode) => {
    const { students, ...stat } = byMode.get(mode)!;
    return { ...stat, students: students.size };
  });
}

/** Simulacros (EXAM_TIMED) among `sessions`; `score` is 0–100 once finished. */
export function buildTimedExamStats(
  sessions: MetricsSessionRow[],
): AdminTimedExamStats {
  const timed = sessions.filter((s) => s.mode === 'EXAM_TIMED');
  const scores = timed.flatMap((s) =>
    s.endedAt && s.score != null ? [s.score] : [],
  );
  return {
    started: timed.length,
    finished: scores.length,
    averageScore: scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10
      : null,
    passed: scores.filter((s) => s >= TIMED_PASS_SCORE).length,
    passScore: TIMED_PASS_SCORE,
  };
}

/**
 * Students per minigame from `<gameId>` / `<gameId>:<topicId>` result rows.
 * A student counts once per game no matter how many topics they played.
 */
export function buildMinigameStats(
  rows: { userId: string; resultId: string; status: 'PLAYED' | 'COMPLETED' }[],
): AdminMetrics['minigames'] {
  const games = new Map(
    MINIGAME_IDS.map((id) => [
      id as string,
      { players: new Set<string>(), completed: new Set<string>() },
    ]),
  );
  const players = new Set<string>();
  for (const row of rows) {
    const game = games.get(row.resultId.split(':')[0]);
    if (!game) continue;
    players.add(row.userId);
    game.players.add(row.userId);
    if (row.status === 'COMPLETED') game.completed.add(row.userId);
  }
  return {
    players: players.size,
    games: MINIGAME_IDS.map((id): AdminMinigameStat => ({
      id,
      players: games.get(id)!.players.size,
      completed: games.get(id)!.completed.size,
    })),
  };
}

/** Whole civil days from `today` to `date` (both YYYY-MM-DD). */
export function civilDaysBetween(today: string, date: string): number {
  return Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86_400_000,
  );
}

export { ratio as metricsRatio };
