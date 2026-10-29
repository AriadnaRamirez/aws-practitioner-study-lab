"use client";

import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import type { PodiumResponse } from "@aps/shared";
import { Medal, openPodiumPanel } from "@/components/shell/podium-trophy";
import { ofPlayers, standingLine } from "@/lib/podium-standing";
import { DashboardTile, TileMessage, tileLinkClass } from "./dashboard-tile";

export function PodiumPlaceWidget({
  podium,
  error,
}: {
  podium: PodiumResponse | null;
  error: boolean;
}) {
  const rank = podium?.me.podiumHidden ? null : (podium?.me.rank ?? null);
  const medalRank = rank !== null && rank <= 3 ? (rank as 1 | 2 | 3) : null;

  return (
    <DashboardTile
      id="widget-podio"
      title="Tu lugar en el podio"
      icon={<Trophy className="size-4" />}
    >
      {error ? (
        <TileMessage>El podio no está disponible por ahora.</TileMessage>
      ) : !podium ? (
        <TileMessage>Cargando…</TileMessage>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]"
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
          <div className="mt-auto pt-4">
            {podium.me.podiumHidden ? (
              <Link href="/cuenta" className={tileLinkClass}>
                Ir a Cuenta
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                className={tileLinkClass}
                onClick={openPodiumPanel}
              >
                Ver podio
                <ChevronRight className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </>
      )}
    </DashboardTile>
  );
}
