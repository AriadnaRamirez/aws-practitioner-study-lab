import type {
  ExamQuestion,
  KnowledgeItem,
  StudyItemType,
  WeakItem,
} from '@aps/shared';

export const STEM_PREVIEW = 96;

export interface WeakItemContent {
  title: string;
  subtitle: string | null;
  topicId: string | null;
  answer: string | null;
  explanation: string | null;
}

export interface WeakProgressRow {
  itemType: string;
  itemId: string;
  failCount: number;
  passCount: number;
  consecutiveCorrect: number;
  masteredAt: Date | null;
}

export function knowledgeContent(k: KnowledgeItem): WeakItemContent {
  return {
    title: k.name,
    subtitle: k.definition,
    topicId: k.topicId,
    answer: k.definition,
    explanation: k.explanation?.trim() || null,
  };
}

export function questionContent(q: ExamQuestion): WeakItemContent {
  const title =
    q.stem.length > STEM_PREVIEW
      ? `${q.stem.slice(0, STEM_PREVIEW).trim()}…`
      : q.stem;
  return {
    title,
    subtitle: null,
    topicId: q.topicId,
    answer: q.choices[q.correctIndex] ?? null,
    explanation: q.explanation?.trim() || null,
  };
}

export function missingContent(itemId: string): WeakItemContent {
  return {
    title: itemId,
    subtitle: null,
    topicId: null,
    answer: null,
    explanation: null,
  };
}

export function weakItemKey(itemType: string, itemId: string): string {
  return `${itemType}:${itemId}`;
}

/** Candidates read before planning a weak-review round (pending + mastered). */
export const WEAK_REVIEW_CANDIDATES = 100;

export interface FailedAttemptRow {
  itemType: string;
  itemId: string;
  createdAt: Date;
  chosenText: string | null;
  variant: string | null;
}

export interface Confusion {
  text: string;
  variant: string | null;
  count: number;
}

export interface FailureStats {
  lastFailedAt: Date;
  confusion: Confusion | null;
}

/**
 * Per item (keyed by `weakItemKey`): latest failure and the most frequent
 * wrong pick (ties → the most recently picked one).
 */
export function failureStatsByItem(
  rows: FailedAttemptRow[],
): Map<string, FailureStats> {
  type Tally = { count: number; last: Date; variant: string | null };
  const picks = new Map<string, Map<string, Tally>>();
  const out = new Map<string, FailureStats>();

  for (const row of rows) {
    const key = weakItemKey(row.itemType, row.itemId);
    const prev = out.get(key);
    if (!prev || row.createdAt > prev.lastFailedAt) {
      out.set(key, { lastFailedAt: row.createdAt, confusion: null });
    }
    const text = row.chosenText?.trim();
    if (!text) continue;
    const byText = picks.get(key) ?? new Map<string, Tally>();
    const tally = byText.get(text);
    if (!tally) {
      byText.set(text, { count: 1, last: row.createdAt, variant: row.variant });
    } else {
      tally.count += 1;
      if (row.createdAt > tally.last) {
        tally.last = row.createdAt;
        tally.variant = row.variant;
      }
    }
    picks.set(key, byText);
  }

  for (const [key, byText] of picks) {
    let best: Confusion | null = null;
    let bestLast = 0;
    for (const [text, t] of byText) {
      const last = t.last.getTime();
      if (
        !best ||
        t.count > best.count ||
        (t.count === best.count && last > bestLast)
      ) {
        best = { text, variant: t.variant, count: t.count };
        bestLast = last;
      }
    }
    const stats = out.get(key);
    if (stats) stats.confusion = best;
  }
  return out;
}

export function toWeakItem(
  row: WeakProgressRow,
  content: WeakItemContent,
  extras: {
    topicName: string | null;
    lastFailedAt: Date | null;
    confusion?: Confusion | null;
  },
): WeakItem {
  return {
    itemType: row.itemType as StudyItemType,
    itemId: row.itemId,
    failCount: row.failCount,
    passCount: row.passCount,
    consecutiveCorrect: row.consecutiveCorrect,
    masteredAt: row.masteredAt?.toISOString() ?? null,
    title: content.title,
    subtitle: content.subtitle,
    topicId: content.topicId,
    topicName: extras.topicName,
    answer: content.answer,
    explanation: content.explanation,
    lastFailedAt: extras.lastFailedAt?.toISOString() ?? null,
    confusedWith: extras.confusion?.text ?? null,
    confusedVariant: extras.confusion?.variant ?? null,
    confusedCount: extras.confusion?.count ?? 0,
  };
}
