import {
  DEFAULT_TRACK_ID,
  type ExamQuestion,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';
import {
  AWS_GUIDE_CONCEPTS,
  AWS_GUIDE_QUESTIONS,
  type AwsGuideConcept,
} from './aws-guide.data';

const now = '2026-10-28T12:00:00.000Z';

const GUIDE_TOPICS: { id: string; name: string; sortOrder: number }[] = [
  { id: 'topic-compute', name: 'Servicios de cómputo', sortOrder: 10 },
  { id: 'topic-storage', name: 'Servicios de almacenamiento', sortOrder: 20 },
  { id: 'topic-databases', name: 'Servicios de bases de datos', sortOrder: 22 },
  {
    id: 'topic-networking',
    name: 'Servicios de redes y entrega',
    sortOrder: 24,
  },
  { id: 'topic-security', name: 'Servicios de seguridad', sortOrder: 26 },
  {
    id: 'topic-management',
    name: 'Servicios de gestión y monitoreo',
    sortOrder: 28,
  },
];

export function buildAwsGuideTopics(): Topic[] {
  return GUIDE_TOPICS.map((t) => ({
    id: t.id,
    trackId: DEFAULT_TRACK_ID,
    type: 'SERVICE' as const,
    name: t.name,
    parentId: null,
    sortOrder: t.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));
}

function conceptExplanation(c: AwsGuideConcept): string {
  const naming = c.longName
    ? `${c.name} significa “${c.longName}”.`
    : `${c.name} es un nombre comercial, no una sigla.`;
  return `${naming} ${c.function}`;
}

export function buildAwsGuideKnowledge(): KnowledgeItem[] {
  return AWS_GUIDE_CONCEPTS.map((c) => ({
    id: `ki-guide-${c.key}`,
    topicId: c.topicId,
    trackId: DEFAULT_TRACK_ID,
    name: c.name,
    definition: c.function,
    distractors: [...c.wrongDefinitions],
    explanation: conceptExplanation(c),
    allowedVariants: ['NAME_TO_DEFINITION', 'DEFINITION_TO_NAME', 'NAME_FOCUS'],
    status: 'published' as const,
    externalKey: `guide.ki.${c.key}`,
    createdAt: now,
    updatedAt: now,
  }));
}

export function buildAwsGuideQuestions(): ExamQuestion[] {
  const topicByConcept = new Map(
    AWS_GUIDE_CONCEPTS.map((c) => [c.key, c.topicId]),
  );
  return AWS_GUIDE_QUESTIONS.map((q) => {
    const topicId = topicByConcept.get(q.conceptKey);
    if (!topicId) {
      throw new Error(
        `Guide question ${q.number}: unknown concept ${q.conceptKey}`,
      );
    }
    const number = String(q.number).padStart(3, '0');
    return {
      id: `eq-guide-${number}`,
      topicId,
      trackId: DEFAULT_TRACK_ID,
      stem: q.stem,
      choices: [...q.choices],
      correctIndex: q.correctIndex,
      explanation: q.optionExplanations
        .map((text, i) => `${'ABCD'[i]}. ${text}`)
        .join('\n'),
      status: 'published' as const,
      externalKey: `guide.q.${number}`,
      createdAt: now,
      updatedAt: now,
    };
  });
}
