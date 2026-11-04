import { DEFAULT_TRACK_ID, type KnowledgeItem, type Topic } from '@aps/shared';
import { CLOUD_TOPIC, LINUX_TOPIC } from './apuntes/cloud-linux';
import { NETWORKING_TOPIC } from './apuntes/networking';
import {
  ARCHITECTURE_TOPIC,
  OPERATIONS_TOPIC,
} from './apuntes/operations-architecture';
import { SECURITY_TOPIC } from './apuntes/security';
import { SERVICE_TOPICS } from './apuntes/services';
import type { ApuntesConcept, ApuntesTopic } from './apuntes/types';

const now = '2026-11-03T12:00:00.000Z';

/** Cloud Practitioner topics, in display order. Every card comes from the course notes. */
export const APUNTES_TOPICS: ApuntesTopic[] = [
  ...SERVICE_TOPICS,
  CLOUD_TOPIC,
  LINUX_TOPIC,
  NETWORKING_TOPIC,
  SECURITY_TOPIC,
  OPERATIONS_TOPIC,
  ARCHITECTURE_TOPIC,
];

const DISTRACTORS = 3;

export function buildApuntesTopics(): Topic[] {
  return APUNTES_TOPICS.map((t) => ({
    id: t.id,
    trackId: DEFAULT_TRACK_ID,
    type: t.type,
    name: t.name,
    parentId: null,
    sortOrder: t.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));
}

function firstClause(definition: string): string {
  return definition
    .split(';')[0]
    .trim()
    .replace(/[.\s]+$/, '');
}

/** "Servicio que…" → "servicio que…", but "IDS de red" stays as is. */
function lowerFirst(text: string): string {
  const [first, second] = text;
  if (!first || !second || second !== second.toLowerCase()) return text;
  return first.toLowerCase() + text.slice(1);
}

function explanationFor(
  concept: ApuntesConcept,
  contrast: ApuntesConcept,
): string {
  return [
    concept.long ? `${concept.name} significa “${concept.long}”.` : '',
    concept.note ?? '',
    `No lo confundas con ${contrast.name}: ${lowerFirst(firstClause(contrast.definition))}.`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function buildApuntesKnowledge(): KnowledgeItem[] {
  const byKey = new Map<string, ApuntesConcept>();
  const ids = new Set<string>();
  for (const topic of APUNTES_TOPICS) {
    for (const c of topic.concepts) {
      if (byKey.has(c.key)) throw new Error(`Duplicate concept key ${c.key}`);
      byKey.set(c.key, c);
      const id = c.id ?? `ki-ap-${c.key}`;
      if (ids.has(id)) throw new Error(`Duplicate knowledge id ${id}`);
      ids.add(id);
    }
  }

  return APUNTES_TOPICS.flatMap((topic) =>
    topic.concepts.map((c, index) => {
      const confused = (c.confusedWith ?? []).map((key) => {
        const other = byKey.get(key);
        if (!other || other === c) {
          throw new Error(`Concept ${c.key}: bad confusedWith ${key}`);
        }
        return other;
      });
      // Same-topic neighbours fill whatever confusedWith leaves open.
      const siblings = topic.concepts
        .slice(index + 1)
        .concat(topic.concepts.slice(0, index));
      const rivals = [
        ...new Set([...confused, ...siblings, ...byKey.values()]),
      ].filter((o) => o.definition !== c.definition);
      if (rivals.length < DISTRACTORS) {
        throw new Error(`Concept ${c.key}: needs ${DISTRACTORS} distractors`);
      }
      return {
        id: c.id ?? `ki-ap-${c.key}`,
        topicId: topic.id,
        trackId: DEFAULT_TRACK_ID,
        name: c.name,
        definition: c.definition,
        distractors: rivals.slice(0, DISTRACTORS).map((o) => o.definition),
        explanation: explanationFor(c, rivals[0]),
        allowedVariants: [
          'NAME_TO_DEFINITION',
          'DEFINITION_TO_NAME',
          'NAME_FOCUS',
        ],
        status: 'published' as const,
        externalKey: `apuntes.${c.key}`,
        createdAt: now,
        updatedAt: now,
      };
    }),
  );
}
