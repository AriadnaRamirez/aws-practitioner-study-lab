import { MAX_MISS_REPEATS_PER_ITEM } from '@aps/shared';
import { emptyLedger, ledgerSummary, parseLedger, recordOutcome } from './miss-ledger';

describe('miss ledger', () => {
  it('re-queues a miss at most MAX_MISS_REPEATS_PER_ITEM times', () => {
    const ledger = emptyLedger();
    const requeues = Array.from(
      { length: MAX_MISS_REPEATS_PER_ITEM + 2 },
      () => recordOutcome(ledger, 'k1', false).requeue,
    );
    expect(requeues.filter(Boolean)).toHaveLength(MAX_MISS_REPEATS_PER_ITEM);
    expect(requeues.at(-1)).toBe(false);
  });

  it('counts first-try hits apart from cards resolved after a miss', () => {
    const ledger = emptyLedger();
    recordOutcome(ledger, 'a', true);
    recordOutcome(ledger, 'b', false);
    recordOutcome(ledger, 'b', true);
    recordOutcome(ledger, 'c', false);
    expect(ledgerSummary(ledger)).toEqual({ resolvedItems: 2, firstTryCorrect: 1 });
  });

  it('survives a JSON round trip and tolerates missing fields', () => {
    const ledger = emptyLedger();
    recordOutcome(ledger, 'a', false);
    const copy = parseLedger(JSON.parse(JSON.stringify(ledger)));
    expect(copy.missesByItem).toEqual({ a: 1 });
    expect(parseLedger(undefined)).toEqual(emptyLedger());
  });
});
