import { MASTERY_STREAK, type WeakItem } from "@aps/shared";

export function isMastered(item: WeakItem): boolean {
  return item.consecutiveCorrect >= MASTERY_STREAK;
}

export function hitsToMastery(item: WeakItem): number {
  return Math.max(MASTERY_STREAK - item.consecutiveCorrect, 0);
}

/** The wrong pick was another card's name (vs. a definition in NAME_TO_DEFINITION). */
export function confusedWithName(item: WeakItem): boolean {
  return Boolean(item.confusedWith) && item.confusedVariant !== "NAME_TO_DEFINITION";
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** "A", "A y B", "A, B y C", "A, B y 2 más". */
export function joinNames(names: string[], max = 3): string {
  if (names.length <= max) {
    return names.length <= 1
      ? (names[0] ?? "")
      : `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
  }
  return `${names.slice(0, max).join(", ")} y ${names.length - max} más`;
}

export function cardAnchor(item: WeakItem): string {
  return `carta-${item.itemType}-${item.itemId}`.replace(/[^\w-]/g, "-");
}

export function topicPracticeHref(topicId: string): string {
  return `/estudiar?topics=${encodeURIComponent(topicId)}&start=10`;
}

export function statusLine(item: WeakItem): string {
  const fails = `La fallaste ${plural(item.failCount, "vez", "veces")}`;
  const hits =
    item.passCount > 0
      ? ` y acertaste ${item.passCount}`
      : " y aún no la aciertas";
  const left = hitsToMastery(item);
  if (left === 0) return `${fails}${hits}. Ya la dominas.`;
  if (item.masteredAt) {
    return `${fails}${hits}. La habías dominado, pero se te olvidó: te ${left === 1 ? "falta" : "faltan"} ${plural(left, "acierto seguido", "aciertos seguidos")}.`;
  }
  if (left === 1) return `${fails}${hits}. Ya casi: 1 acierto más y la dominas.`;
  return `${fails}${hits}. Te faltan ${left} aciertos seguidos para dominarla.`;
}

/** Explanation without the part that repeats the answer; null if nothing is left. */
export function extraExplanation(item: WeakItem): string | null {
  const explanation = item.explanation?.trim();
  if (!explanation) return null;
  const answer = item.answer?.trim();
  const rest = (answer ? explanation.replace(answer, "") : explanation)
    .replace(/^[\s.,;:]+/, "")
    .trim();
  return rest.length > 2 ? rest : null;
}

const DAY_MS = 86_400_000;

/** "hoy", "ayer", "hace 3 días", "hace 2 semanas", "hace 1 mes". */
export function relativeDay(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.max(
    Math.round((startOf(now) - startOf(then)) / DAY_MS),
    0,
  );
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  if (days < 30) {
    return `hace ${plural(Math.floor(days / 7), "semana", "semanas")}`;
  }
  return `hace ${plural(Math.floor(days / 30), "mes", "meses")}`;
}

export function failedWithinDays(
  item: WeakItem,
  days: number,
  now = new Date(),
): boolean {
  if (!item.lastFailedAt) return false;
  return now.getTime() - new Date(item.lastFailedAt).getTime() <= days * DAY_MS;
}

export type TopicTally = {
  topicId: string;
  topicName: string;
  cards: number;
  fails: number;
};

/** Topic with the most failed cards (ties: more fails, then name). */
export function hardestTopic(items: WeakItem[]): TopicTally | null {
  const byTopic = new Map<string, TopicTally>();
  for (const item of items) {
    if (!item.topicId || !item.topicName) continue;
    const t = byTopic.get(item.topicId) ?? {
      topicId: item.topicId,
      topicName: item.topicName,
      cards: 0,
      fails: 0,
    };
    t.cards += 1;
    t.fails += item.failCount;
    byTopic.set(item.topicId, t);
  }
  return (
    [...byTopic.values()].sort(
      (a, b) =>
        b.cards - a.cards ||
        b.fails - a.fails ||
        a.topicName.localeCompare(b.topicName, "es"),
    )[0] ?? null
  );
}
