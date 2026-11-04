"use client";

import Link from "next/link";
import { ChevronRight, Clock, Gamepad2 } from "lucide-react";
import type { MinigameResults, MinigameStatus } from "@aps/shared";
import { GameStatusBadge } from "@/components/minigames/game-ui";
import { FOCUS_RING } from "@/components/ui/focus";
import { MINIGAMES } from "@/lib/minigames";
import { useGameResults } from "@/lib/minigames/progress";
import { cn } from "@/lib/utils";
import { DashboardTile, tileLinkClass } from "./dashboard-tile";

const SHOWN = 4;

/** One row per game; a wide tile lays them out two by two. */
const GAME_LIST =
  "space-y-2 @min-[34rem]:grid @min-[34rem]:grid-cols-2 @min-[34rem]:gap-2 @min-[34rem]:space-y-0";

/**
 * Games played per topic (the crossword) keep one result per topic. The tile
 * only says you have played it; the per-topic count lives in Minijuegos.
 */
function statusOf(
  slug: string,
  results: MinigameResults,
): MinigameStatus | undefined {
  const direct = results[slug];
  if (direct) return direct;
  const prefix = `${slug}:`;
  return Object.keys(results).some((id) => id.startsWith(prefix))
    ? "played"
    : undefined;
}

const RANK: Record<MinigameStatus | "new", number> = {
  new: 0,
  played: 1,
  completed: 2,
};

/** The ones you haven't finished first, so the tile always suggests something. */
export function MinigamesWidget({ className }: { className?: string }) {
  const results = useGameResults();
  const games = MINIGAMES.map((game) => ({
    game,
    status: statusOf(game.slug, results),
  }))
    .sort((a, b) => RANK[a.status ?? "new"] - RANK[b.status ?? "new"])
    .slice(0, SHOWN);

  return (
    <DashboardTile
      id="widget-minijuegos"
      title="Minijuegos"
      icon={<Gamepad2 aria-hidden />}
      className={cn("@container", className)}
    >
      <ul className={GAME_LIST}>
        {games.map(({ game, status }) => {
          const Icon = game.icon;
          return (
            <li key={game.slug}>
              <Link
                href={`/minijuegos/${game.slug}`}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--surface-hover)]",
                  FOCUS_RING,
                )}
              >
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--foreground)]">
                    {game.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                    <Clock className="size-3 shrink-0" aria-hidden />
                    {game.minutes} min · {game.format}
                  </span>
                </span>
                {status ? (
                  <GameStatusBadge status={status} />
                ) : (
                  <ChevronRight
                    className="size-4 shrink-0 text-[var(--foreground-muted)]"
                    aria-hidden
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-5">
        <Link href="/minijuegos" className={tileLinkClass}>
          Ver los crucigramas
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </DashboardTile>
  );
}
