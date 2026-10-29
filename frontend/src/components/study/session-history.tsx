"use client";

import Link from "next/link";
import type { StudyHistoryEntry } from "@aps/shared";
import {
  formatDuration,
  formatScore,
  formatSessionWhen,
  modeLabel,
} from "@/lib/format-study";

type SessionHistoryProps = {
  sessions: StudyHistoryEntry[];
  timezone?: string;
  emptyHint?: string;
  showMasFalladasLink?: boolean;
  linkDetail?: boolean;
};

export function SessionHistory({
  sessions,
  timezone,
  emptyHint = "Aún no has estudiado.",
  showMasFalladasLink = true,
  linkDetail = false,
}: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg bg-[var(--surface-elevated)] px-4 py-8 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">{emptyHint}</p>
        {showMasFalladasLink ? (
          <p className="mt-3 text-sm">
            <Link
              href="/mas-falladas"
              className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              Más falladas
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1 overflow-hidden rounded-lg">
      {sessions.map((s) => {
        const body = (
          <>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {modeLabel(s.mode)}
                <span className="ml-2 font-normal text-[var(--foreground-muted)]">
                  · {s.size} conceptos
                </span>
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                {formatSessionWhen(s, timezone)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)] sm:text-right">
              <span>
                Puntaje{" "}
                <strong className="text-[var(--foreground)]">
                  {formatScore(s)}
                </strong>
              </span>
              <span>
                Tiempo{" "}
                <strong className="text-[var(--foreground)]">
                  {formatDuration(s.durationMs)}
                </strong>
              </span>
              <span>
                Racha máx.{" "}
                <strong className="text-[var(--foreground)]">
                  {s.maxStreak ?? "—"}
                </strong>
              </span>
            </div>
          </>
        );

        return (
          <li key={s.id} className="bg-[var(--surface-elevated)]">
            {linkDetail ? (
              <Link
                href={`/cuenta/historial/${s.id}`}
                className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between"
              >
                {body}
              </Link>
            ) : (
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
