import {
  DEFAULT_TRACK_ID,
  type ExamChoices,
  type ExamQuestion,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';
import {
  AIF_FACTS,
  EXTRA_CLF_FACTS,
  buildAifTopics,
  buildExtraKnowledge,
  factsToQuestions,
} from './content.seed-extra';
import { buildAwsGuideQuestions } from './content.seed-aws-guide';
import {
  buildApuntesKnowledge,
  buildApuntesTopics,
} from './content.seed-apuntes';

const now = '2026-10-24T12:00:00.000Z';

/** Seed bank consumed by prisma/seed.ts. CLF concepts come only from the course notes. */
export function buildSeedTopics(): Topic[] {
  return [...buildAifTopics(), ...buildApuntesTopics()];
}

export function buildSeedKnowledge(): KnowledgeItem[] {
  return [...buildExtraKnowledge(), ...buildApuntesKnowledge()];
}

type Fact = {
  topicId: string;
  key: string;
  stem: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
};

/** Curated cloud-fundamentals practice facts. */
const PRACTICE_FACTS: Fact[] = [
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'regions',
    stem: '¿Qué es una Región de AWS?',
    correct: 'Un área geográfica con múltiples Availability Zones',
    wrong: [
      'Un único datacenter físico',
      'Solo una cuenta de facturación',
      'Un tipo de instancia EC2',
    ],
    explanation: 'Región = geografía; AZ = datacenters aislados dentro.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'az',
    stem: '¿Qué aporta desplegar en varias Availability Zones?',
    correct: 'Mayor alta disponibilidad ante fallos de un datacenter',
    wrong: [
      'Reducir automáticamente el precio de S3',
      'Eliminar la necesidad de IAM',
      'Convertir EC2 en serverless',
    ],
    explanation: 'Multi-AZ mitiga fallos de una AZ.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'capex',
    stem: 'Pasar de datacenter propio a cloud suele reducir…',
    correct: 'CAPEX (inversión de capital) a favor de OPEX',
    wrong: [
      'Solo el ancho de banda de Internet en casa',
      'La necesidad de copias de seguridad',
      'El cifrado de datos',
    ],
    explanation: 'Cloud: pago por uso (OPEX) vs comprar hardware (CAPEX).',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'elasticity',
    stem: '¿Qué beneficio cloud describe ajustar recursos según demanda?',
    correct: 'Elasticidad / escalado',
    wrong: [
      'Vendor lock-in',
      'Cold storage obligatorio',
      'Root account sharing',
    ],
    explanation: 'Escalar up/down según carga es un valor cloud clave.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'well-architected',
    stem: 'El AWS Well-Architected Framework organiza buenas prácticas en…',
    correct:
      'Pilares (p. ej. seguridad, fiabilidad, rendimiento, coste, ops, sostenibilidad)',
    wrong: [
      'Solo regiones geográficas',
      'Tipos de instancia EC2',
      'Planes de soporte',
    ],
    explanation: 'WA Framework = pilares de diseño cloud.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'edge',
    stem: '¿Qué son las edge locations principalmente asociadas a CloudFront?',
    correct:
      'Puntos de presencia para cachear y entregar contenido cerca del usuario',
    wrong: [
      'Availability Zones dentro de una Región',
      'Cuentas de facturación',
      'Roles IAM',
    ],
    explanation:
      'Edge locations acercan contenido; no son AZs de cómputo típico.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'global-infra',
    stem: 'Regiones, AZs y edge locations forman parte de…',
    correct: 'La infraestructura global de AWS',
    wrong: [
      'Solo el Free Tier',
      'Únicamente AWS Outposts',
      'El modelo de precios Spot',
    ],
    explanation: 'Infra global: Regions, AZs, Points of Presence.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'reliability',
    stem: 'Diseñar para fallos y multi-AZ mejora principalmente el pilar de…',
    correct: 'Fiabilidad (Reliability)',
    wrong: [
      'Coste únicamente',
      'Sostenibilidad únicamente',
      'Operaciones de facturación',
    ],
    explanation: 'Reliability pillar: resiliencia ante fallos.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'opex',
    stem: 'El modelo de precios “pay-as-you-go” de AWS enfatiza…',
    correct: 'Pagar solo por lo que consumes',
    wrong: [
      'Contratos mínimos de 10 años siempre',
      'Hardware on-prem obligatorio',
      'Licencias perpetuas de hipervisor',
    ],
    explanation: 'Consumo bajo demanda = OPEX flexible.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'agility',
    stem: 'Desplegar recursos en minutos en lugar de comprar hardware ilustra…',
    correct: 'Agilidad / velocidad de innovación en cloud',
    wrong: [
      'Vendor lock-in inevitable',
      'Pérdida de elasticidad',
      'CAPEX obligatorio',
    ],
    explanation: 'Cloud acelera experimentación y entrega.',
  },
];

function rotateChoices(
  correct: string,
  wrong: [string, string, string],
  rotate: number,
): { choices: ExamChoices; correctIndex: 0 | 1 | 2 | 3 } {
  const all = [correct, ...wrong];
  const offset = rotate % 4;
  const choices = [
    all[(0 + offset) % 4],
    all[(1 + offset) % 4],
    all[(2 + offset) % 4],
    all[(3 + offset) % 4],
  ] as ExamChoices;
  const correctIndex = choices.indexOf(correct) as 0 | 1 | 2 | 3;
  return { choices, correctIndex };
}

export function buildSeedQuestions(): ExamQuestion[] {
  const base = PRACTICE_FACTS.map((fact, i) => {
    const { choices, correctIndex } = rotateChoices(
      fact.correct,
      fact.wrong,
      i,
    );
    return {
      id: `eq-${fact.key}`,
      topicId: fact.topicId,
      trackId: DEFAULT_TRACK_ID,
      stem: fact.stem,
      choices,
      correctIndex,
      explanation: fact.explanation,
      status: 'published' as const,
      externalKey: `clf.q.${fact.key}`,
      createdAt: now,
      updatedAt: now,
    };
  });
  return [
    ...buildAwsGuideQuestions(),
    ...base,
    ...factsToQuestions(EXTRA_CLF_FACTS, 'clf'),
    ...factsToQuestions(AIF_FACTS, 'aif'),
  ];
}
