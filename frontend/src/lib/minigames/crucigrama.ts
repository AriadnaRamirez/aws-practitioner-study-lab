import type { KnowledgeItem } from "@aps/shared";
import {
  playableCategories,
  shortDefinition,
  type GameCategory,
} from "@/lib/minigames/categories";
import { shuffle, type Rng } from "@/lib/minigames/random";

/** Words placed per puzzle; a category needs `MIN_CROSSWORD_WORDS` usable answers. */
export const CROSSWORD_WORDS = 8;
export const MIN_CROSSWORD_WORDS = 6;
/** Keeps the grid playable on a phone. */
const MAX_SIDE = 12;
const MIN_LEN = 3;
const ATTEMPTS = 80;

export type Direction = "across" | "down";

export type CrosswordEntry = {
  id: string;
  number: number;
  dir: Direction;
  row: number;
  col: number;
  answer: string;
  clue: string;
  name: string;
  definition: string;
};

export type Crossword = {
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
};

/** "Route 53" → "ROUTE53", "Autenticación" → "AUTENTICACION". */
export function crosswordAnswer(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function isCrosswordable(item: KnowledgeItem): boolean {
  const len = crosswordAnswer(item.name).length;
  return len >= MIN_LEN && len <= MAX_SIDE;
}

/** Topics with enough short names to build a puzzle. */
export function crosswordTopics(
  items: readonly KnowledgeItem[],
): GameCategory[] {
  return playableCategories(items, MIN_CROSSWORD_WORDS, isCrosswordable);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The clue must not give the answer away. */
function clueFor(item: KnowledgeItem): string {
  return shortDefinition(item.definition).replace(
    new RegExp(escapeRegExp(item.name), "gi"),
    "____",
  );
}

export const cellKey = (row: number, col: number) => `${row},${col}`;

export function entryCells(
  e: Pick<CrosswordEntry, "row" | "col" | "dir" | "answer">,
) {
  return [...e.answer].map((letter, k) => ({
    row: e.dir === "down" ? e.row + k : e.row,
    col: e.dir === "across" ? e.col + k : e.col,
    letter,
  }));
}

/** Letters given per word: none for 3-letter answers, the first letter up to 7, two from 8. */
function hintTarget(length: number): number {
  if (length <= 3) return 0;
  return length <= 7 ? 1 : 2;
}

/**
 * Cells shown from the start. A word's first hint is its first letter, extras
 * are spread out; a hint on a crossing counts for both words.
 */
export function pickHints(
  entries: readonly CrosswordEntry[],
  rng: Rng = Math.random,
): Set<string> {
  const given = new Set<string>();
  for (const e of shuffle(entries, rng)) {
    const keys = entryCells(e).map((c) => cellKey(c.row, c.col));
    const target = hintTarget(keys.length);
    const count = () => keys.filter((k) => given.has(k)).length;
    if (count() < target) given.add(keys[0]);
    const nearGiven = (i: number) =>
      given.has(keys[i - 1] ?? "") || given.has(keys[i + 1] ?? "");
    const rest = shuffle(
      keys.map((_, i) => i).filter((i) => !given.has(keys[i])),
      rng,
    ).sort((a, b) => Number(nearGiven(a)) - Number(nearGiven(b)));
    for (const i of rest) {
      if (count() >= target) break;
      given.add(keys[i]);
    }
  }
  return given;
}

type Cell = { letter: string; across?: boolean; down?: boolean };
type Placed = {
  item: KnowledgeItem;
  word: string;
  row: number;
  col: number;
  dir: Direction;
};
type Bounds = { minR: number; maxR: number; minC: number; maxC: number };

/** Crossings for a valid placement, or -1 when it collides or touches side by side. */
function fit(
  grid: Map<string, Cell>,
  bounds: Bounds,
  word: string,
  row: number,
  col: number,
  dir: Direction,
): number {
  const [dr, dc] = dir === "across" ? [0, 1] : [1, 0];
  const end = {
    r: row + dr * (word.length - 1),
    c: col + dc * (word.length - 1),
  };
  if (
    Math.max(bounds.maxR, end.r) - Math.min(bounds.minR, row) + 1 > MAX_SIDE ||
    Math.max(bounds.maxC, end.c) - Math.min(bounds.minC, col) + 1 > MAX_SIDE
  ) {
    return -1;
  }
  if (grid.has(cellKey(row - dr, col - dc))) return -1;
  if (grid.has(cellKey(end.r + dr, end.c + dc))) return -1;

  let crossings = 0;
  for (let k = 0; k < word.length; k++) {
    const r = row + dr * k;
    const c = col + dc * k;
    const cell = grid.get(cellKey(r, c));
    if (cell) {
      if (cell.letter !== word[k] || cell[dir]) return -1;
      crossings++;
    } else if (
      dir === "across"
        ? grid.has(cellKey(r - 1, c)) || grid.has(cellKey(r + 1, c))
        : grid.has(cellKey(r, c - 1)) || grid.has(cellKey(r, c + 1))
    ) {
      return -1;
    }
  }
  return crossings;
}

function attempt(pool: readonly KnowledgeItem[], rng: Rng): Placed[] {
  const grid = new Map<string, Cell>();
  const bounds: Bounds = { minR: 0, maxR: 0, minC: 0, maxC: 0 };
  const placed: Placed[] = [];

  const put = (p: Placed) => {
    for (const { row, col, letter } of entryCells({ ...p, answer: p.word })) {
      const cell = grid.get(cellKey(row, col)) ?? { letter };
      cell[p.dir] = true;
      grid.set(cellKey(row, col), cell);
      bounds.minR = Math.min(bounds.minR, row);
      bounds.maxR = Math.max(bounds.maxR, row);
      bounds.minC = Math.min(bounds.minC, col);
      bounds.maxC = Math.max(bounds.maxC, col);
    }
    placed.push(p);
  };

  const words = shuffle(pool, rng).map((item) => ({
    item,
    word: crosswordAnswer(item.name),
  }));
  // A long first word gives the rest more letters to cross.
  words.sort((a, b) => b.word.length - a.word.length);
  const firstIndex = Math.floor(rng() * Math.min(3, words.length));
  const first = words[firstIndex];
  const rest = shuffle(
    words.filter((_, i) => i !== firstIndex),
    rng,
  );
  put({ ...first, row: 0, col: 0, dir: "across" });

  for (const { item, word } of rest) {
    if (placed.length >= CROSSWORD_WORDS) break;
    let best: { row: number; col: number; dir: Direction; score: number }[] =
      [];
    let bestScore = 0;
    for (const [key, cell] of grid) {
      const [r, c] = key.split(",").map(Number);
      const dir: Direction | null =
        cell.across && !cell.down
          ? "down"
          : cell.down && !cell.across
            ? "across"
            : null;
      if (!dir) continue;
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== cell.letter) continue;
        const row = dir === "down" ? r - i : r;
        const col = dir === "across" ? c - i : c;
        const score = fit(grid, bounds, word, row, col, dir);
        if (score < 1) continue;
        if (score > bestScore) {
          bestScore = score;
          best = [];
        }
        if (score === bestScore) best.push({ row, col, dir, score });
      }
    }
    if (best.length) {
      const pick = best[Math.floor(rng() * best.length)];
      put({ item, word, row: pick.row, col: pick.col, dir: pick.dir });
    }
  }
  return placed;
}

function area(placed: readonly Placed[]): number {
  const cells = placed.flatMap((p) => entryCells({ ...p, answer: p.word }));
  const rows = cells.map((c) => c.row);
  const cols = cells.map((c) => c.col);
  return (
    (Math.max(...rows) - Math.min(...rows) + 1) *
    (Math.max(...cols) - Math.min(...cols) + 1)
  );
}

/** Best of several random layouts: most words first, then the most compact grid. */
export function buildCrossword(
  items: readonly KnowledgeItem[],
  rng: Rng = Math.random,
): Crossword | null {
  const pool = items.filter(isCrosswordable);
  if (pool.length < 2) return null;

  let best: Placed[] = [];
  for (let i = 0; i < ATTEMPTS; i++) {
    const placed = attempt(pool, rng);
    if (
      placed.length > best.length ||
      (placed.length === best.length && area(placed) < area(best))
    ) {
      best = placed;
    }
  }
  if (best.length < Math.min(MIN_CROSSWORD_WORDS - 1, pool.length)) return null;

  const minR = Math.min(...best.map((p) => p.row));
  const minC = Math.min(...best.map((p) => p.col));
  const shifted = best.map((p) => ({
    ...p,
    row: p.row - minR,
    col: p.col - minC,
  }));

  const starts = [...new Set(shifted.map((p) => cellKey(p.row, p.col)))]
    .map((k) => k.split(",").map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([r, c]) => cellKey(r, c));

  const entries: CrosswordEntry[] = shifted
    .map((p) => ({
      id: `${p.item.id}:${p.dir}`,
      number: starts.indexOf(cellKey(p.row, p.col)) + 1,
      dir: p.dir,
      row: p.row,
      col: p.col,
      answer: p.word,
      clue: clueFor(p.item),
      name: p.item.name,
      definition: p.item.definition,
    }))
    .sort((a, b) => a.number - b.number || (a.dir === "across" ? -1 : 1));

  const cells = entries.flatMap(entryCells);
  return {
    rows: Math.max(...cells.map((c) => c.row)) + 1,
    cols: Math.max(...cells.map((c) => c.col)) + 1,
    entries,
  };
}
