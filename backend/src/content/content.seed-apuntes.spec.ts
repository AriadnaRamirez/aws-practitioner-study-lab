import {
  APUNTES_TOPICS,
  buildApuntesKnowledge,
  buildApuntesTopics,
} from './content.seed-apuntes';

function plain(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

describe('course-notes bank', () => {
  const knowledge = buildApuntesKnowledge();

  it('gives every card three distinct distractors that are not its definition', () => {
    for (const item of knowledge) {
      expect(item.distractors).toHaveLength(3);
      expect(new Set(item.distractors).size).toBe(3);
      expect(item.distractors).not.toContain(item.definition);
    }
  });

  it('keeps names unique within a topic', () => {
    for (const topic of APUNTES_TOPICS) {
      const names = topic.concepts.map((c) => plain(c.name));
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it('never spells the answer inside its own definition', () => {
    const leaks = knowledge.filter((item) => {
      const name = plain(item.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|[^a-z0-9])${name}([^a-z0-9]|$)`).test(
        plain(item.definition),
      );
    });
    expect(leaks.map((i) => i.name)).toEqual([]);
  });

  it('keeps the ids of cards that already had progress', () => {
    const ids = new Set(knowledge.map((k) => k.id));
    for (const id of [
      'ki-guide-ec2',
      'ki-guide-s3',
      'ki-shared-responsibility',
      'ki-amazon-linux',
      'ki-net-osi',
      'ki-sec-mfa',
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('explains the concept itself, without a rival contrast', () => {
    for (const item of knowledge) {
      expect(item.explanation.toLowerCase()).not.toContain('confundas');
      expect(item.explanation.trim().length).toBeGreaterThan(10);
    }
  });

  it('places every card in a known topic', () => {
    const topics = new Set(buildApuntesTopics().map((t) => t.id));
    for (const item of knowledge) expect(topics.has(item.topicId)).toBe(true);
  });
});
