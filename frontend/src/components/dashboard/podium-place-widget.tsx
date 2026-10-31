"use client";

import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import type { PodiumResponse } from "@aps/shared";
import { Medal } from "@/components/shell/podium-trophy";
import { Skeleton } from "@/components/ui/spinner";
import { ofPlayers, standingLine } from "@/lib/podium-standing";
import { DashboardTile, TileLoading, tileLinkClass } from "./dashboard-tile";

export function PodiumPlaceWidget({
  podium,
  className,
}: {
  podium: PodiumResponse | null;
  className?: string;
}) {
  const rank = podium?.me.podiumHidden ? null : (podium?.me.rank ?? null);
  const medalRank = rank !== null && rank <= 3 ? (rank as 1 | 2 | 3) : null;

  return (
    <DashboardTile
      id="widget-podio"
      title="Tu lugar en el podio"
      icon={<Trophy aria-hidden />}
      className={className}
    >
      {!podium ? (
        <TileLoading label="Cargando tu lugar en el podio…">
          <div className="flex min-w-0 items-center gap-4">
            <Skeleton className="size-14 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="block h-7 w-28" />
              <Skeleton className="block h-4 w-40" />
            </div>
          </div>
          <Skeleton className="mt-4 block h-4 w-4/5" />
        </TileLoading>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--surface-elevated)]"
              aria-hidden
            >
              {medalRank ? (
                <Medal rank={medalRank} className="h-10 w-8" />
              ) : (
                <Trophy className="size-6 text-[var(--foreground-muted)]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
                {rank !== null ? (
                  <>
                    #{rank}{" "}
                    <span className="text-base font-semibold text-[var(--foreground-muted)]">
                      {ofPlayers(podium.totalRanked)}
                    </span>
                  </>
                ) : (
                  "Sin lugar aún"
                )}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">
                {podium.me.score === 1
                  ? "1 concepto dominado"
                  : `${podium.me.score} conceptos dominados`}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-snug text-[var(--foreground)]">
            {standingLine(podium)}
          </p>
          {podium.me.podiumHidden ? (
            <div className="mt-auto pt-4">
              <Link href="/cuenta" className={tileLinkClass}>
                Ir a Cuenta
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </div>
          ) : null}
        </>
      )}
    </DashboardTile>
  );
}
