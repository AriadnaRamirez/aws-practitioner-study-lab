import {
  DEFAULT_TRACK_ID,
  type ExamQuestion,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';

const now = '2026-10-24T12:00:00.000Z';

/** In-memory demo seed — EC2 / S3 style samples for Swagger + admin shell. */
export function buildSeedTopics(): Topic[] {
  return [
    {
      id: 'topic-compute',
      trackId: DEFAULT_TRACK_ID,
      type: 'SERVICE',
      name: 'Cómputo',
      parentId: null,
      sortOrder: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-storage',
      trackId: DEFAULT_TRACK_ID,
      type: 'SERVICE',
      name: 'Almacenamiento',
      parentId: null,
      sortOrder: 20,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-cloud-fundamentals',
      trackId: DEFAULT_TRACK_ID,
      type: 'CONCEPT',
      name: 'Fundamentos cloud',
      parentId: null,
      sortOrder: 30,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function buildSeedKnowledge(): KnowledgeItem[] {
  return [
    {
      id: 'ki-ec2',
      topicId: 'topic-compute',
      trackId: DEFAULT_TRACK_ID,
      name: 'EC2',
      definition:
        'Amazon Elastic Compute Cloud: capacidad de cómputo redimensionable en la nube (máquinas virtuales).',
      distractors: [
        'Servicio de almacenamiento de objetos ilimitado',
        'Base de datos relacional gestionada',
        'Red de entrega de contenido global (CDN)',
      ],
      explanation:
        'EC2 proporciona instancias (VMs) bajo demanda. No es almacenamiento (S3), ni RDS, ni CloudFront.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.ec2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-s3',
      topicId: 'topic-storage',
      trackId: DEFAULT_TRACK_ID,
      name: 'S3',
      definition:
        'Amazon Simple Storage Service: almacenamiento de objetos duradero, escalable y accesible vía API/HTTP.',
      distractors: [
        'Sistema de archivos compartido para instancias EC2',
        'Almacenamiento en bloque de alto rendimiento adjunto a una instancia',
        'Cola de mensajería entre microservicios',
      ],
      explanation:
        'S3 es object storage. EFS es archivo compartido; EBS es block storage; SQS es colas.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'clf.s3',
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

export function buildSeedQuestions(): ExamQuestion[] {
  return [
    {
      id: 'eq-ec2-use',
      topicId: 'topic-compute',
      trackId: DEFAULT_TRACK_ID,
      stem: '¿Qué servicio de AWS proporciona capacidad de cómputo virtual redimensionable?',
      choices: [
        'Amazon EC2',
        'Amazon S3',
        'Amazon Route 53',
        'Amazon SNS',
      ],
      correctIndex: 0,
      explanation:
        'EC2 = Elastic Compute Cloud (VMs). S3 es almacenamiento; Route 53 DNS; SNS notificaciones.',
      status: 'published',
      externalKey: 'clf.q.ec2-use',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'eq-s3-storage',
      topicId: 'topic-storage',
      trackId: DEFAULT_TRACK_ID,
      stem: 'Necesitas almacenar copias de seguridad de objetos con alta durabilidad y acceso vía HTTP. ¿Qué servicio encaja mejor?',
      choices: [
        'Amazon EBS',
        'Amazon S3',
        'Amazon EC2',
        'AWS Lambda',
      ],
      correctIndex: 1,
      explanation:
        'S3 es object storage durable. EBS es block adjunto a instancias; EC2/Lambda no son almacenes de objetos.',
      status: 'published',
      externalKey: 'clf.q.s3-storage',
      createdAt: now,
      updatedAt: now,
    },
  ];
}
