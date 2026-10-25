import {
  STUDY_MODE_LABELS,
  type StudyHistoryEntry,
  type StudyMode,
} from "@aps/shared";

export function modeLabel(mode: StudyMode): string {
  return STUDY_MODE_LABELS[mode] ?? mode;
}

export function formatSessionWhen(
  session: StudyHistoryEntry,
  timeZone?: string,
): string {
  const tz = timeZone || session.timezone || "UTC";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: tz,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(session.startedAt));
  } catch {
    return new Date(session.startedAt).toLocaleString("es-MX");
  }
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return "—";
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min < 60) return sec ? `${min}m ${sec}s` : `${min}m`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function formatScore(session: StudyHistoryEntry): string {
  if (session.scoreCorrect == null || session.scoreTotal == null) {
    return session.endedAt ? "—" : "En curso";
  }
  return `${session.scoreCorrect}/${session.scoreTotal}`;
}
