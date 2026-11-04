import { sampleBalancedByTopic } from './balanced-sampler';

type Card = { id: string; topicId: string };

/** Same shape as the Inicio bank: topic → published card count. */
const BANK: Record<string, number> = {
  'topic-cloud-fundamentals': 1,
  'topic-compute': 3,
  'topic-databases': 2,
  'topic-linux': 4,
  'topic-management': 7,
  'topic-net-basics': 15,
  'topic-networking': 3,
  'topic-sec-basics': 17,
  'topic-security': 7,
  'topic-storage': 3,
};
const TOPICS = Object.keys(BANK);

function makePool(counts: Record<string, number>): Card[] {
  return Object.entries(counts).flatMap(([topicId, n]) =>
    Array.from({ length: n }, (_, i) => ({ id: `${topicId}-${i}`, topicId })),
  );
}

function countByTopic(cards: Card[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const c of cards) out.set(c.topicId, (out.get(c.topicId) ?? 0) + 1);
  return out;
}

/** Deterministic LCG so failures are reproducible. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

describe('sampleBalancedByTopic', () => {
  const pool = makePool({
    ...BANK,
    'topic-aif-aws': 2,
    'topic-aif-genai': 2,
  });

  it('10 topics + size 10 → exactly one card per topic', () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const picked = sampleBalancedByTopic(pool, TOPICS, 10, seeded(seed));
      expect(picked).toHaveLength(10);
      const counts = countByTopic(picked);
      expect(counts.size).toBe(10);
      for (const t of TOPICS) expect(counts.get(t)).toBe(1);
    }
  });

  it('ignores topics outside the requested scope', () => {
    const picked = sampleBalancedByTopic(pool, TOPICS, 50);
    expect(picked.some((c) => c.topicId.startsWith('topic-aif'))).toBe(false);
  });

  it('size 20 → two per topic except the one-card topic, others fill', () => {
    const picked = sampleBalancedByTopic(pool, TOPICS, 20, seeded(7));
    expect(picked).toHaveLength(20);
    const counts = countByTopic(picked);
    expect(counts.get('topic-cloud-fundamentals')).toBe(1);
    for (const t of TOPICS) {
      if (t === 'topic-cloud-fundamentals') continue;
      expect(counts.get(t)).toBeGreaterThanOrEqual(2);
      expect(counts.get(t)).toBeLessThanOrEqual(3);
    }
  });

  it('exhausted small topics let the big ones fill the remainder', () => {
    const picked = sampleBalancedByTopic(pool, TOPICS, 50, seeded(3));
    expect(picked).toHaveLength(50);
    const counts = countByTopic(picked);
    for (const t of TOPICS) {
      expect(counts.get(t)).toBeLessThanOrEqual(BANK[t]);
    }
    expect(counts.get('topic-cloud-fundamentals')).toBe(1);
    expect(counts.get('topic-databases')).toBe(2);
    expect(counts.get('topic-compute')).toBe(3);
  });

  it('never returns duplicates, even if the pool repeats an item', () => {
    const dupPool = [...pool, ...pool.slice(0, 5)];
    for (let seed = 1; seed <= 20; seed += 1) {
      const picked = sampleBalancedByTopic(dupPool, TOPICS, 50, seeded(seed));
      expect(new Set(picked.map((c) => c.id)).size).toBe(picked.length);
    }
  });

  it('returns the whole scoped pool when it is smaller than size', () => {
    const small = makePool({ a: 2, b: 1, c: 3 });
    const picked = sampleBalancedByTopic(small, ['a', 'b', 'c'], 50);
    expect(picked).toHaveLength(6);
    expect(new Set(picked.map((c) => c.id))).toEqual(
      new Set(small.map((c) => c.id)),
    );
  });

  it('topics without cards and unknown ids are skipped', () => {
    const small = makePool({ a: 3 });
    const picked = sampleBalancedByTopic(small, ['a', 'ghost'], 10);
    expect(picked).toHaveLength(3);
    expect(sampleBalancedByTopic(small, ['ghost'], 10)).toEqual([]);
  });

  it('interleaves topics randomly (not grouped by topic order)', () => {
    const orders = new Set<string>();
    for (let seed = 1; seed <= 20; seed += 1) {
      const picked = sampleBalancedByTopic(pool, TOPICS, 10, seeded(seed));
      orders.add(picked.map((c) => c.topicId).join(','));
    }
    expect(orders.size).toBeGreaterThan(1);
  });
});
