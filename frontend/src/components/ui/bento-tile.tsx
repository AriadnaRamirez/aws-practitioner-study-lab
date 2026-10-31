import * as React from "react";
import { BENTO_GAP } from "@/components/ui/bento";
import { cn } from "@/lib/utils";

/**
 * 12 tracks from md up, one column below (tiles keep DOM order). Pass to `BentoGrid`'s className, or use
 * `BENTO_LIST` for a `<ul>`/`<dl>` grid.
 */
export const BENTO_12 = "md:grid-cols-12";
export const BENTO_LIST = cn("grid grid-cols-1", BENTO_GAP, BENTO_12);

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Rows = 1 | 2 | 3;
type Breakpoint = "md" | "lg" | "xl";

/** A number applies from md up; an object sets each breakpoint (later ones override earlier ones). */
export type BentoSpan<T> = T | Partial<Record<Breakpoint, T>>;

// Literal class names so Tailwind picks them up.
const COL_SPAN: Record<Breakpoint, Record<Cols, string>> = {
  md: {
    1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4",
    5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7", 8: "md:col-span-8",
    9: "md:col-span-9", 10: "md:col-span-10", 11: "md:col-span-11", 12: "md:col-span-12",
  },
  lg: {
    1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4",
    5: "lg:col-span-5", 6: "lg:col-span-6", 7: "lg:col-span-7", 8: "lg:col-span-8",
    9: "lg:col-span-9", 10: "lg:col-span-10", 11: "lg:col-span-11", 12: "lg:col-span-12",
  },
  xl: {
    1: "xl:col-span-1", 2: "xl:col-span-2", 3: "xl:col-span-3", 4: "xl:col-span-4",
    5: "xl:col-span-5", 6: "xl:col-span-6", 7: "xl:col-span-7", 8: "xl:col-span-8",
    9: "xl:col-span-9", 10: "xl:col-span-10", 11: "xl:col-span-11", 12: "xl:col-span-12",
  },
};

const ROW_SPAN: Record<Breakpoint, Record<Rows, string>> = {
  md: { 1: "md:row-span-1", 2: "md:row-span-2", 3: "md:row-span-3" },
  lg: { 1: "lg:row-span-1", 2: "lg:row-span-2", 3: "lg:row-span-3" },
  xl: { 1: "xl:row-span-1", 2: "xl:row-span-2", 3: "xl:row-span-3" },
};

function spanClasses<T extends number>(
  table: Record<Breakpoint, Record<T, string>>,
  span: BentoSpan<T> | undefined,
): string[] {
  if (span === undefined) return [];
  const bySize: Partial<Record<Breakpoint, T>> = typeof span === "number" ? { md: span } : span;
  return (Object.keys(bySize) as Breakpoint[]).map((bp) => table[bp][bySize[bp] as T]);
}

/** Places any element (a `Card`, a `<section>`) on the 12 tracks. Full width by default. */
export function bentoSpan(cols: BentoSpan<Cols> = 12, rows?: BentoSpan<Rows>): string {
  return cn("min-w-0", spanClasses(COL_SPAN, cols), spanClasses(ROW_SPAN, rows));
}

type PerRow = 1 | 2 | 3 | 4;

function fillCols(index: number, count: number, perRow: PerRow): Cols {
  const base = (12 / perRow) as Cols;
  const left = count % perRow;
  if (left === 0) return base;
  // 3-up with one left over: the last four tiles become two rows of two.
  if (perRow === 3 && left === 1 && count > 1) return index >= count - 4 ? 6 : base;
  return index >= count - left ? ((12 / left) as Cols) : base;
}

/**
 * Span for item `index` of `count` in an n-up list: the last row widens so it always ends flush
 * with the grid (no empty cells), e.g. 2 tiles in a 3-up row take 6 + 6.
 */
export function bentoFill(
  index: number,
  count: number,
  perRow: Partial<Record<Breakpoint, PerRow>>,
): string {
  const cols: Partial<Record<Breakpoint, Cols>> = {};
  for (const bp of Object.keys(perRow) as Breakpoint[]) {
    cols[bp] = fillCols(index, count, perRow[bp]!);
  }
  return bentoSpan(cols);
}

/** Wrapper tile; give its child card `h-full` so tiles in the same row match heights. */
export function BentoTile({
  as: Tag = "div",
  cols,
  rows,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "aside" | "li";
  cols?: BentoSpan<Cols>;
  rows?: BentoSpan<Rows>;
}) {
  return <Tag className={cn(bentoSpan(cols, rows), className)} {...props} />;
}
