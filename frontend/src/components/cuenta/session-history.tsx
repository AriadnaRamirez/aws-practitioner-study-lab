"use client";

import Link from "next/link";
import type { StudyHistoryEntry } from "@aps/shared";
import { Card, cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import {
  formatDuration,
  formatScore,
  formatSessionWhen,
  modeLabel,
} from "@/lib/format-study";
import { cn } from "@/lib/utils";

type SessionHistoryProps = {
  sessions: StudyHistoryEntry[];
  timezone?: string;
  emptyHint?: string;
  showMasFalladasLink?: boolean;
  linkDetail?: boolean;
};

const rowClass =
  "flex h-full flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between";

/** Two columns from lg, split on the same gutter as the page grid. */
export const HISTORY_LIST = "grid gap-2 lg:grid-cols-2 lg:gap-x-6";

export function SessionHistory({
  sessions,
  timezone,
  emptyHint = "Aún no has estudiado.",
  showMasFalladasLink = true,
  linkDetail = false,
}: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <Card variant="flat" padding="none" className="px-4 py-8 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">{emptyHint}</p>
        {showMasFalladasLink ? (
          <p className="mt-3 text-sm">
            <Link
              href="/mas-falladas"
              className={cn(
                "rounded-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline",
                FOCUS_RING,
              )}
            >
              Más falladas
            </Link>
          </p>
        ) : null}
      </Card>
    );
  }

  return (
    <ul className={HISTORY_LIST}>
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
                <strong className="tabular-nums text-[var(--foreground)]">
                  {formatScore(s)}
                </strong>
              </span>
              <span>
                Tiempo{" "}
                <strong className="tabular-nums text-[var(--foreground)]">
                  {formatDuration(s.durationMs)}
                </strong>
              </span>
              <span>
                Racha máx.{" "}
                <strong className="tabular-nums text-[var(--foreground)]">
                  {s.maxStreak ?? "—"}
                </strong>
              </span>
            </div>
          </>
        );

        return (
          <li key={s.id}>
            {linkDetail ? (
              <Link
                href={`/cuenta/historial/${s.id}`}
                className={cn(
                  cardVariants({
                    variant: "flat",
                    padding: "none",
                    interactive: true,
                  }),
                  rowClass,
                  FOCUS_RING,
                )}
              >
                {body}
              </Link>
            ) : (
              <Card variant="flat" padding="none" className={rowClass}>
                {body}
              </Card>
            )}
          </li>
        );
      })}
    </ul>
  );
}
