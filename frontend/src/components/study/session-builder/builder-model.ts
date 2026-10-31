import { STUDY_SIZES, type StudySize, type TopicProgressRow } from "@aps/shared";
import {
  STUDY_CATEGORIES,
  resolveCategoryTopicIds,
  type StudyCategory,
} from "@/lib/study-categories";

/**
 * Builder layout, lg and up: 12 tracks with the page gap; the builder takes 8, "Tu partida" 4 (sticky).
 * ┌──────────────────────────┬────────────┐
 * │ Arma tu partida          │ Tu partida │
 * ├─────────────┬────────────┤            │
 * │ cuántas     │ reparto    │            │
 * ├─────────────┴────────────┤            │
 * │ temas (two columns)      │            │
 * └──────────────────────────┴────────────┘
 * Inner rows split in halves on the same gap, so they land on tracks 1-4 and 5-8.
 * Shared with BuilderSkeleton so the loading state keeps the same lines.
 */
export const BUILDER_GRID = "min-w-0 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6";
export const BUILDER_MAIN = "min-w-0 lg:col-span-8 [@media(max-height:500px)]:md:col-span-8";
export const BUILDER_HALVES = "grid sm:grid-cols-2";

export type Distribution = "balanced" | "random";

export type BuilderPreset = "all" | "services" | "concepts" | "weakest";

export const PRESETS: { id: BuilderPreset; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "services", label: "Solo servicios" },
  { id: "concepts", label: "Solo conceptos" },
  { id: "weakest", label: "Lo que menos domino" },
];

/** Temas que entran en el preset "Lo que menos domino". */
export const WEAKEST_COUNT = 3;

export type TopicOption = {
  cat: StudyCategory;
  topicIds: string[];
  /** null si no se pudo cargar el progreso. */
  total: number | null;
  mastered: number;
  pct: number;
};

/** Un tema por categoría con cartas publicadas, en orden de STUDY_CATEGORIES. */
export function buildTopicOptions(
  progressRows: TopicProgressRow[],
  knownTopicIds: string[],
): TopicOption[] {
  const byId = new Map(progressRows.map((r) => [r.topicId, r]));
  const hasProgress = progressRows.length > 0;
  return STUDY_CATEGORIES.flatMap((cat): TopicOption[] => {
    const topicIds = resolveCategoryTopicIds(cat.id, knownTopicIds);
    if (!topicIds.length) return [];
    if (!hasProgress) {
      return [{ cat, topicIds, total: null, mastered: 0, pct: 0 }];
    }
    let total = 0;
    let mastered = 0;
    for (const id of topicIds) {
      const row = byId.get(id);
      if (!row) continue;
      total += row.total;
      mastered += row.mastered;
    }
    if (!total) return [];
    return [{ cat, topicIds, total, mastered, pct: mastered / total }];
  });
}

export function presetCategoryIds(
  preset: BuilderPreset,
  options: TopicOption[],
): string[] {
  if (preset === "services") {
    return options.filter((o) => o.cat.group === "aws").map((o) => o.cat.id);
  }
  if (preset === "concepts") {
    return options.filter((o) => o.cat.group === "module").map((o) => o.cat.id);
  }
  if (preset === "weakest") {
    return options
      .filter((o) => o.total)
      .map((o, i) => ({ o, i }))
      .sort((a, b) => a.o.pct - b.o.pct || a.i - b.i)
      .slice(0, WEAKEST_COUNT)
      .map(({ o }) => o.cat.id);
  }
  return options.map((o) => o.cat.id);
}

export function sameIds(a: readonly string[], b: readonly string[]): boolean {
  const sb = new Set(b);
  return a.length === sb.size && a.every((x) => sb.has(x));
}

/** Arranca vía `?topics=…&start=N[&balanced=1]`, que lee flash-study-client. */
export function builderStartHref(
  size: StudySize,
  topicIds: readonly string[],
  distribution: Distribution,
): string {
  const topics = topicIds.map(encodeURIComponent).join(",");
  const balanced = distribution === "balanced" ? "&balanced=1" : "";
  return `/estudiar?topics=${topics}&start=${size}${balanced}`;
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/* —— Última partida armada (localStorage) —— */

const STORAGE_KEY = "aps:arma-tu-partida:v1";

export type BuilderPrefs = {
  categoryIds: string[];
  size: StudySize;
  distribution: Distribution;
  preset: BuilderPreset | null;
};

export function loadBuilderPrefs(): Partial<BuilderPrefs> {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!raw || typeof raw !== "object") return {};
    const out: Partial<BuilderPrefs> = {};
    if (
      Array.isArray(raw.categoryIds) &&
      raw.categoryIds.every((id: unknown) => typeof id === "string")
    ) {
      out.categoryIds = raw.categoryIds;
    }
    if ((STUDY_SIZES as readonly number[]).includes(raw.size)) {
      out.size = raw.size as StudySize;
    }
    if (raw.distribution === "balanced" || raw.distribution === "random") {
      out.distribution = raw.distribution;
    }
    if (PRESETS.some((p) => p.id === raw.preset)) {
      out.preset = raw.preset as BuilderPreset;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveBuilderPrefs(prefs: BuilderPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private mode / quota: the builder still works, it just won't remember.
  }
}
