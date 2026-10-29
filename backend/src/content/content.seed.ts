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
import {
  buildAwsGuideKnowledge,
  buildAwsGuideQuestions,
  buildAwsGuideTopics,
} from './content.seed-aws-guide';
import {
  buildModuleKnowledge,
  buildModuleTopics,
} from './content.seed-modules';

const now = '2026-10-24T12:00:00.000Z';

/** Seed bank consumed by prisma/seed.ts. AWS services come only from the study guide. */
export function buildSeedTopics(): Topic[] {
  return [
    ...buildAifTopics(),
    ...buildAwsGuideTopics(),
    ...buildModuleTopics(),
    {
      id: 'topic-cloud-fundamentals',
      trackId: DEFAULT_TRACK_ID,
      type: 'CONCEPT',
      name: 'Conceptos de la nube',
      parentId: null,
      sortOrder: 30,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-linux',
      trackId: DEFAULT_TRACK_ID,
      type: 'CONCEPT',
      name: 'Conceptos de Linux',
      parentId: null,
      sortOrder: 55,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function buildSeedKnowledge(): KnowledgeItem[] {
  return [
    ...buildExtraKnowledge(),
    ...buildAwsGuideKnowledge(),
    ...buildModuleKnowledge(),
    {
      id: 'ki-amazon-linux',
      topicId: 'topic-linux',
      trackId: DEFAULT_TRACK_ID,
      name: 'Amazon Linux',
      definition:
        'Distribución Linux mantenida por AWS, optimizada para ejecutarse en EC2 con integración a herramientas y repositorios de AWS.',
      distractors: [
        'Sistema operativo propietario solo para mainframes on‑prem',
        'Servicio de contenedores gestionados sin SO',
        'Base de datos relacional compatible con PostgreSQL',
      ],
      explanation:
        'Amazon Linux es un SO para instancias EC2. No es RDS ni un servicio de contenedores por sí solo.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.amazon-linux',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-ami',
      topicId: 'topic-linux',
      trackId: DEFAULT_TRACK_ID,
      name: 'AMI',
      definition:
        'Amazon Machine Image: plantilla que incluye SO (p. ej. Linux), apps y configuración para lanzar instancias EC2.',
      distractors: [
        'Política IAM que concede acceso root a S3',
        'Tipo de volumen de respaldo automático de RDS',
        'Regla de facturación por segundo en Lambda',
      ],
      explanation:
        'Una AMI define la imagen de arranque de EC2 (SO + software). No es una política IAM ni un volumen RDS.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.ami',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-ssh-ec2',
      topicId: 'topic-linux',
      trackId: DEFAULT_TRACK_ID,
      name: 'SSH a EC2',
      definition:
        'Acceso administrativo típico a instancias Linux en EC2 mediante clave privada (.pem) y el usuario del AMI (p. ej. ec2-user).',
      distractors: [
        'Único método permitido: consola RDP de Windows Server',
        'Solo se puede entrar con usuario root sin clave',
        'Se autentica siempre con token de CloudFront',
      ],
      explanation:
        'En Linux EC2 lo habitual es SSH con key pair. RDP aplica a Windows; CloudFront no autentica SSH.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.ssh-ec2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-user-data',
      topicId: 'topic-linux',
      trackId: DEFAULT_TRACK_ID,
      name: 'User data',
      definition:
        'Script o cloud-init que EC2 ejecuta al primer arranque para configurar la instancia (paquetes, servicios, archivos).',
      distractors: [
        'Política de bucket que lista objetos públicos',
        'Métrica de CloudWatch del uso de CPU',
        'Certificado TLS gestionado por ACM',
      ],
      explanation:
        'User data automatiza el bootstrap de la instancia. No es una política S3 ni una métrica.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.user-data',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-shared-responsibility',
      topicId: 'topic-cloud-fundamentals',
      trackId: DEFAULT_TRACK_ID,
      name: 'Modelo de responsabilidad compartida',
      definition:
        'AWS gestiona la seguridad *de* la nube; el cliente gestiona la seguridad *en* la nube (datos, identidad, configuración).',
      distractors: [
        'AWS es responsable de todo, incluido el cifrado de datos del cliente',
        'El cliente opera los hipervisores y el hardware físico',
        'Solo aplica a cuentas Enterprise Support',
      ],
      explanation:
        'División clásica CLF: AWS = infraestructura; cliente = uso, IAM, datos, SO en EC2, etc.',
      allowedVariants: ['NAME_TO_DEFINITION', 'DEFINITION_TO_NAME'],
      status: 'published',
      externalKey: 'clf.shared-responsibility',
      createdAt: now,
      updatedAt: now,
    },
  ];
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
    wrong: ['Un único datacenter físico', 'Solo una cuenta de facturación', 'Un tipo de instancia EC2'],
    explanation: 'Región = geografía; AZ = datacenters aislados dentro.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'az',
    stem: '¿Qué aporta desplegar en varias Availability Zones?',
    correct: 'Mayor alta disponibilidad ante fallos de un datacenter',
    wrong: ['Reducir automáticamente el precio de S3', 'Eliminar la necesidad de IAM', 'Convertir EC2 en serverless'],
    explanation: 'Multi-AZ mitiga fallos de una AZ.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'capex',
    stem: 'Pasar de datacenter propio a cloud suele reducir…',
    correct: 'CAPEX (inversión de capital) a favor de OPEX',
    wrong: ['Solo el ancho de banda de Internet en casa', 'La necesidad de copias de seguridad', 'El cifrado de datos'],
    explanation: 'Cloud: pago por uso (OPEX) vs comprar hardware (CAPEX).',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'elasticity',
    stem: '¿Qué beneficio cloud describe ajustar recursos según demanda?',
    correct: 'Elasticidad / escalado',
    wrong: ['Vendor lock-in', 'Cold storage obligatorio', 'Root account sharing'],
    explanation: 'Escalar up/down según carga es un valor cloud clave.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'well-architected',
    stem: 'El AWS Well-Architected Framework organiza buenas prácticas en…',
    correct: 'Pilares (p. ej. seguridad, fiabilidad, rendimiento, coste, ops, sostenibilidad)',
    wrong: ['Solo regiones geográficas', 'Tipos de instancia EC2', 'Planes de soporte'],
    explanation: 'WA Framework = pilares de diseño cloud.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'edge',
    stem: '¿Qué son las edge locations principalmente asociadas a CloudFront?',
    correct: 'Puntos de presencia para cachear y entregar contenido cerca del usuario',
    wrong: ['Availability Zones dentro de una Región', 'Cuentas de facturación', 'Roles IAM'],
    explanation: 'Edge locations acercan contenido; no son AZs de cómputo típico.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'global-infra',
    stem: 'Regiones, AZs y edge locations forman parte de…',
    correct: 'La infraestructura global de AWS',
    wrong: ['Solo el Free Tier', 'Únicamente AWS Outposts', 'El modelo de precios Spot'],
    explanation: 'Infra global: Regions, AZs, Points of Presence.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'reliability',
    stem: 'Diseñar para fallos y multi-AZ mejora principalmente el pilar de…',
    correct: 'Fiabilidad (Reliability)',
    wrong: ['Coste únicamente', 'Sostenibilidad únicamente', 'Operaciones de facturación'],
    explanation: 'Reliability pillar: resiliencia ante fallos.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'opex',
    stem: 'El modelo de precios “pay-as-you-go” de AWS enfatiza…',
    correct: 'Pagar solo por lo que consumes',
    wrong: ['Contratos mínimos de 10 años siempre', 'Hardware on-prem obligatorio', 'Licencias perpetuas de hipervisor'],
    explanation: 'Consumo bajo demanda = OPEX flexible.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'agility',
    stem: 'Desplegar recursos en minutos en lugar de comprar hardware ilustra…',
    correct: 'Agilidad / velocidad de innovación en cloud',
    wrong: ['Vendor lock-in inevitable', 'Pérdida de elasticidad', 'CAPEX obligatorio'],
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
    all[(0 + offset) % 4]!,
    all[(1 + offset) % 4]!,
    all[(2 + offset) % 4]!,
    all[(3 + offset) % 4]!,
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
