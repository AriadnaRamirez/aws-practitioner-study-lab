import { MAX_MISS_REPEATS_PER_ITEM } from '@aps/shared';

/** Per-session tally behind the "quedan N" model and the end summary. */
export interface MissLedger {
  missesByItem: Record<string, number>;
  resolvedItemIds: string[];
  firstTryItemIds: string[];
}

export function emptyLedger(): MissLedger {
  return { missesByItem: {}, resolvedItemIds: [], firstTryItemIds: [] };
}

export function parseLedger(raw: unknown): MissLedger {
  const r = (raw ?? {}) as Partial<MissLedger>;
  return {
    missesByItem:
      r.missesByItem && typeof r.missesByItem === 'object'
        ? { ...r.missesByItem }
        : {},
    resolvedItemIds: Array.isArray(r.resolvedItemIds)
      ? [...r.resolvedItemIds]
      : [],
    firstTryItemIds: Array.isArray(r.firstTryItemIds)
      ? [...r.firstTryItemIds]
      : [],
  };
}

/**
 * Records one answer. Returns whether a miss should be re-queued: each card
 * gets at most `MAX_MISS_REPEATS_PER_ITEM` extra appearances per session.
 */
export function recordOutcome(
  ledger: MissLedger,
  itemId: string,
  correct: boolean,
): { requeue: boolean } {
  const misses = ledger.missesByItem[itemId] ?? 0;
  if (correct) {
    if (!ledger.resolvedItemIds.includes(itemId))
      ledger.resolvedItemIds.push(itemId);
    if (misses === 0 && !ledger.firstTryItemIds.includes(itemId)) {
      ledger.firstTryItemIds.push(itemId);
    }
    return { requeue: false };
  }
  ledger.missesByItem[itemId] = misses + 1;
  return { requeue: misses + 1 <= MAX_MISS_REPEATS_PER_ITEM };
}

export function ledgerSummary(ledger: MissLedger): {
  resolvedItems: number;
  firstTryCorrect: number;
} {
  return {
    resolvedItems: ledger.resolvedItemIds.length,
    firstTryCorrect: ledger.firstTryItemIds.length,
  };
}
