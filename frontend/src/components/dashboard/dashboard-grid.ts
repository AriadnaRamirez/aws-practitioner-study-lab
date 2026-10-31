/**
 * Inicio bento (tracks on `BentoGrid`). Phones stack the tiles in DOM order.
 *
 * lg+: 3·4·5 tracks
 * ┌───────────────────────────────────┬────────────────┐
 * │ greeting · mascot                 │ exam           │  one tile, the exam pane on the new-game track
 * ├───────────────────────────────────┼────────────────┤
 * │ goal                              │ new game       │
 * ├──────────────┬────────────────────┤ (+ sessions)   │
 * │ podium       │ weak topics        │                │
 * └──────────────┴────────────────────┴────────────────┘
 *
 * md: 1·1 tracks
 * ┌──────────────────────────────────────────────────┐
 * │ greeting · mascot / exam                          │  one tile, the exam pane under the greeting
 * ├─────────────────────────┬────────────────────────┤
 * │ goal                    │ new game               │
 * ├─────────────────────────┤                        │
 * │ podium                  │                        │
 * ├─────────────────────────┴────────────────────────┤
 * │ weak topics                                       │
 * └──────────────────────────────────────────────────┘
 *
 * The new game spans the goal and podium rows, so both columns always end on the same line. When the
 * podium or the weak topics are not shown, the other one takes the freed cells (or the goal spans both
 * rows), so no cell is ever empty.
 */
export const DASHBOARD_TRACKS =
  "md:grid-cols-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)_minmax(0,5fr)]";

/** Phone width of the deck and the progress tiles (the hero uses the full container). */
const NARROW = "mx-auto w-full max-w-md md:mx-0 md:max-w-none";

export const DASHBOARD_TILE = {
  hero: "md:col-[1/-1] md:row-[1]",
  newGame: `${NARROW} mt-8 md:col-[2] md:row-[2/4] md:mt-0 lg:col-[3]`,
} as const;

type Slots = { goal: string; podium: string; weak: string };

/** Literal class names (Tailwind scans them) for each combination of optional tiles. */
const SLOTS = {
  both: {
    goal: "md:col-[1] md:row-[2] lg:col-[1/3]",
    podium: "md:col-[1] md:row-[3]",
    weak: "md:col-[1/-1] md:row-[4] lg:col-[2] lg:row-[3]",
  },
  podiumOnly: {
    goal: "md:col-[1] md:row-[2] lg:col-[1/3]",
    podium: "md:col-[1] md:row-[3] lg:col-[1/3]",
    weak: "",
  },
  weakOnly: {
    goal: "md:col-[1] md:row-[2] lg:col-[1/3]",
    podium: "",
    weak: "md:col-[1] md:row-[3] lg:col-[1/3]",
  },
  goalOnly: {
    goal: "md:col-[1] md:row-[2/4] lg:col-[1/3]",
    podium: "",
    weak: "",
  },
} as const satisfies Record<string, Slots>;

/** Cells of the progress tiles, given which optional tiles are shown. */
export function dashboardSlots(showPodium: boolean, showWeak: boolean): Slots {
  const cells =
    showPodium && showWeak
      ? SLOTS.both
      : showPodium
        ? SLOTS.podiumOnly
        : showWeak
          ? SLOTS.weakOnly
          : SLOTS.goalOnly;
  return {
    goal: `${NARROW} mt-3 md:mt-0 ${cells.goal}`,
    podium: `${NARROW} mt-4 md:mt-0 ${cells.podium}`,
    weak: `${NARROW} mt-4 md:mt-0 ${cells.weak}`,
  };
}
