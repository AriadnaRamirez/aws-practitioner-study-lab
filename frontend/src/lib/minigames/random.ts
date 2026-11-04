export type Rng = () => number;

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Up to `n` items taken round-robin across `key` groups, so every group shows up. */
export function sampleBalanced<T>(
  items: readonly T[],
  n: number,
  key: (item: T) => string,
  rng: Rng = Math.random,
): T[] {
  const groups = new Map<string, T[]>();
  for (const item of shuffle(items, rng)) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  const queues = shuffle([...groups.values()], rng);
  const picked: T[] = [];
  while (picked.length < n && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next !== undefined && picked.length < n) picked.push(next);
    }
  }
  return shuffle(picked, rng);
}
