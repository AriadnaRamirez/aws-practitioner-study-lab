/**
 * Inicio bento (tracks on `BentoGrid`). Phones stack the tiles in DOM order.
 *
 * lg+: 5·4·3 tracks
 * ┌────────────────────────────────────────────────────┐
 * │ greeting · mascot · exam                            │  one tile, its own 7·5 split
 * ├────────────────┬───────────────────────────────────┤
 * │ new game       │ minigames                         │
 * │ (+ sessions)   ├───────────────────────────────────┤
 * │                │ weak topics                       │
 * └────────────────┴───────────────────────────────────┘
 *
 * md: 1·1 tracks
 * ┌──────────────────────────────────────────────────┐
 * │ greeting · mascot / exam                          │  one tile, the exam pane under the greeting
 * ├─────────────────────────┬────────────────────────┤
 * │ new game                │ minigames              │
 * │                         ├────────────────────────┤
 * │                         │ weak topics            │
 * └─────────────────────────┴────────────────────────┘
 *
 * The new game spans the minigames and weak topics rows, so both columns always end on the same
 * line. When the weak topics are not shown, the minigames span both rows, so no cell is ever empty.
 */
export const DASHBOARD_TRACKS =
  "md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]";

/** Phone width of the deck and the progress tiles (the hero uses the full container). */
const NARROW = "mx-auto w-full max-w-md md:mx-0 md:max-w-none";

export const DASHBOARD_TILE = {
  hero: "md:col-[1/-1] md:row-[1]",
  newGame: `${NARROW} mt-8 md:col-[1] md:row-[2/4] md:mt-0`,
} as const;

type Slots = { games: string; weak: string };

/** Literal class names (Tailwind scans them) with and without the weak topics tile. */
const SLOTS = {
  withWeak: {
    games: "md:col-[2] md:row-[2] lg:col-[2/4]",
    weak: "md:col-[2] md:row-[3] lg:col-[2/4]",
  },
  gamesOnly: {
    games: "md:col-[2] md:row-[2/4] lg:col-[2/4]",
    weak: "",
  },
} as const satisfies Record<string, Slots>;

/** Cells of the side tiles, given whether the weak topics tile is shown. */
export function dashboardSlots(showWeak: boolean): Slots {
  const cells = showWeak ? SLOTS.withWeak : SLOTS.gamesOnly;
  return {
    games: `${NARROW} mt-8 md:mt-0 ${cells.games}`,
    weak: `${NARROW} mt-4 md:mt-0 ${cells.weak}`,
  };
}
