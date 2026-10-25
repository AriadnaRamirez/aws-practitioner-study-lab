import type { KnowledgeItem } from '@aps/shared';
import { pickVariant, renderFlashVariant } from './flash-render';

const base = (overrides: Partial<KnowledgeItem> = {}): KnowledgeItem => ({
  id: 'ki-a',
  topicId: 't1',
  trackId: 'CLF',
  name: 'EC2',
  definition: 'Cómputo redimensionable',
  distractors: ['Def falsa A', 'Def falsa B', 'Def falsa C'],
  explanation: 'Porque es EC2',
  allowedVariants: [
    'NAME_TO_DEFINITION',
    'DEFINITION_TO_NAME',
    'NAME_FOCUS',
  ],
  status: 'published',
  externalKey: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const pool: KnowledgeItem[] = [
  base(),
  base({
    id: 'ki-b',
    name: 'S3',
    definition: 'Almacenamiento de objetos',
    distractors: ['X', 'Y', 'Z'],
  }),
  base({
    id: 'ki-c',
    name: 'RDS',
    definition: 'Base de datos relacional gestionada',
    distractors: ['X', 'Y', 'Z'],
  }),
  base({
    id: 'ki-d',
    name: 'Lambda',
    definition: 'Cómputo serverless',
    distractors: ['X', 'Y', 'Z'],
  }),
];

describe('flash-render', () => {
  it('NAME_TO_DEFINITION uses name stem and definition as correct', () => {
    const item = pool[0]!;
    const card = renderFlashVariant(item, 'NAME_TO_DEFINITION', pool);
    expect(card.stem).toContain('EC2');
    expect(card.choices).toHaveLength(4);
    expect(card.choices[card.correctIndex]).toBe(item.definition);
  });

  it('DEFINITION_TO_NAME uses definition stem and name as correct', () => {
    const item = pool[0]!;
    const card = renderFlashVariant(item, 'DEFINITION_TO_NAME', pool);
    expect(card.stem).toBe(item.definition);
    expect(card.choices[card.correctIndex]).toBe(item.name);
  });

  it('NAME_FOCUS yields 4 name choices', () => {
    const item = pool[0]!;
    const card = renderFlashVariant(item, 'NAME_FOCUS', pool);
    expect(card.stem.toLowerCase()).toContain('identifica');
    expect(card.choices[card.correctIndex]).toBe(item.name);
    expect(new Set(card.choices).size).toBe(4);
  });

  it('pickVariant respects allowedVariants', () => {
    const item = base({ allowedVariants: ['NAME_TO_DEFINITION'] });
    for (let i = 0; i < 8; i++) {
      expect(pickVariant(item)).toBe('NAME_TO_DEFINITION');
    }
  });
});
