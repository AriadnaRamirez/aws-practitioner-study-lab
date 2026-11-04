import type { KnowledgeItem } from "@aps/shared";
import {
  playableCategories,
  type GameCategory,
} from "@/lib/minigames/categories";
import { shuffle, type Rng } from "@/lib/minigames/random";

/** Words placed per puzzle; a category needs `MIN_CROSSWORD_WORDS` usable answers. */
export const CROSSWORD_WORDS = 8;
export const MIN_CROSSWORD_WORDS = 6;
/** Letters only. The hyphen between words does not count toward this. */
const MAX_LETTERS = 12;
/** Grid edge, including the hyphen cells between words. */
const MAX_SIDE = 16;
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
  /** One sentence, so it fits on the bar above the grid. */
  clue: string;
  /** The same idea said another way, offered before revealing the word. */
  another: string | null;
  name: string;
  definition: string;
};

export type Crossword = {
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
};

/**
 * "Route 53" → "ROUTE-53", "Autenticación" → "AUTENTICACION",
 * "PCI-DSS" → "PCI-DSS". A hyphen marks each gap between words.
 */
export function crosswordAnswer(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function crosswordLetters(answer: string): number {
  return answer.replace(/-/g, "").length;
}

/** "7 letras" or "7 letras, dos palabras". */
export function crosswordCountLabel(answer: string): string {
  const letters = crosswordLetters(answer);
  const words = answer.split("-").filter(Boolean).length;
  const letterLabel = letters === 1 ? "1 letra" : `${letters} letras`;
  if (words <= 1) return letterLabel;
  if (words === 2) return `${letterLabel}, dos palabras`;
  return `${letterLabel}, ${words} palabras`;
}

export function isCrosswordable(item: KnowledgeItem): boolean {
  const answer = crosswordAnswer(item.name);
  const letters = crosswordLetters(answer);
  return (
    letters >= MIN_LEN && letters <= MAX_LETTERS && answer.length <= MAX_SIDE
  );
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

/** Hide the answer as a whole word, so "NIC" does not eat "único". */
function blankAnswer(text: string, name: string): string {
  const phrase = name.trim();
  if (phrase.length < 2) return text;
  return text.replace(
    new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`,
      "giu",
    ),
    "____",
  );
}

const PLAIN_PHRASES: readonly [RegExp, string][] = [
  [
    /RPO y RTO de milisegundos/gi,
    "casi sin perder datos y volviendo al instante",
  ],
  [
    /RPO y RTO de minutos/gi,
    "pierdes pocos minutos de datos y vuelves en minutos",
  ],
  [
    /RPO y RTO de horas/gi,
    "puedes perder horas de datos y tardar horas en volver",
  ],
  [
    /RPO y RTO de días/gi,
    "puedes perder días de datos y tardar días en volver",
  ],
];

function plainText(text: string): string {
  let out = text.replace(/;?\s*en la analogía de la cocina[^.;]*/gi, "");
  for (const [pattern, plain] of PLAIN_PHRASES)
    out = out.replace(pattern, plain);
  return out;
}

/** Trimmed, capitalised and closed with a period. */
function sentence(text: string): string {
  const out = text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:;,]+$/, "");
  if (!out) return "";
  const cased = out.charAt(0).toUpperCase() + out.slice(1);
  return /[!?]$/.test(cased) ? cased : `${cased}.`;
}

/** Long second clues get cut at the first sentence break. */
function shorten(text: string, max = 170): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max).lastIndexOf(". ");
  return cut > 50 ? text.slice(0, cut) : text.slice(0, max);
}

/**
 * Two ways to say the same thing: the bar above the grid shows the first, and
 * the second is there for when the first one does not land.
 */
function cluesFor(item: KnowledgeItem): {
  clue: string;
  another: string | null;
} {
  const text = plainText(item.definition);
  const clauses = text
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  const clue = sentence(blankAnswer(clauses[0] ?? text, item.name));

  const rest = clauses.slice(1).join(". ");
  const other = rest || plainText(item.explanation ?? "");
  const another = other ? sentence(shorten(blankAnswer(other, item.name))) : "";
  return { clue, another: another && another !== clue ? another : null };
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

/** Letters already on the grid when the puzzle opens. Hyphens are extra. */
export const HINT_LETTERS = 4;

/**
 * The grid opens almost empty. The only cells already filled are the hyphens
 * between two words, plus a few hint letters.
 */
export function hyphenCells(entries: readonly CrosswordEntry[]): Set<string> {
  const set = new Set<string>();
  for (const entry of entries) {
    for (const cell of entryCells(entry)) {
      if (cell.letter === "-") set.add(cellKey(cell.row, cell.col));
    }
  }
  return set;
}

/**
 * A few letters to start from: one per word, near the middle, so a short name
 * is not given away. The same cell is never picked twice.
 */
export function hintCells(entries: readonly CrosswordEntry[]): Set<string> {
  const picked = new Set<string>();
  const words = entries
    .map((entry) =>
      entryCells(entry)
        .filter((cell) => cell.letter !== "-")
        .map((cell) => cellKey(cell.row, cell.col)),
    )
    .filter((keys) => keys.length > 1);
  let round = 0;
  while (picked.size < HINT_LETTERS) {
    let added = 0;
    for (const keys of words) {
      if (picked.size >= HINT_LETTERS) break;
      const free = keys.filter((key) => !picked.has(key));
      if (free.length <= round) continue;
      const mid = Math.floor((free.length - 1) / 2);
      const step = Math.ceil(round / 2);
      const at =
        round === 0
          ? mid
          : round % 2 === 1
            ? Math.max(0, mid - step)
            : Math.min(free.length - 1, mid + step);
      picked.add(free[at]);
      added += 1;
    }
    if (!added) break;
    round += 1;
  }
  return picked;
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
      ...cluesFor(p.item),
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
