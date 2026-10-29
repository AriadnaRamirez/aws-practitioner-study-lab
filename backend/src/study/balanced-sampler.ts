/** APS-24: partida rápida — reparto equitativo de cartas entre temas. */

export type Rng = () => number;

function shuffleWith<T>(items: readonly T[], rng: Rng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Round-robin across `topicIds`: shuffled topic order, shuffled cards per
 * topic, one card per topic per round until `size` or every pool runs out.
 * The result is shuffled again so topics interleave randomly.
 * Items whose topic is not in `topicIds` are ignored.
 */
export function sampleBalancedByTopic<T extends { id: string; topicId: string }>(
  pool: readonly T[],
  topicIds: readonly string[],
  size: number,
  rng: Rng = Math.random,
): T[] {
  const byTopic = new Map<string, T[]>();
  for (const topicId of topicIds) byTopic.set(topicId, []);
  const seen = new Set<string>();
  for (const item of pool) {
    const bucket = byTopic.get(item.topicId);
    if (!bucket || seen.has(item.id)) continue;
    seen.add(item.id);
    bucket.push(item);
  }

  const queues = shuffleWith([...byTopic.keys()], rng)
    .map((topicId) => shuffleWith(byTopic.get(topicId)!, rng))
    .filter((cards) => cards.length > 0);

  const picked: T[] = [];
  for (let round = 0; picked.length < size; round += 1) {
    let tookAny = false;
    for (const cards of queues) {
      if (picked.length >= size) break;
      if (round < cards.length) {
        picked.push(cards[round]);
        tookAny = true;
      }
    }
    if (!tookAny) break;
  }

  return shuffleWith(picked, rng);
}
