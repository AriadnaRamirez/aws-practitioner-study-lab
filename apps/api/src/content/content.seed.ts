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
    {
      id: 'topic-security',
      trackId: DEFAULT_TRACK_ID,
      type: 'SERVICE',
      name: 'Seguridad / IAM',
      parentId: null,
      sortOrder: 40,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-networking',
      trackId: DEFAULT_TRACK_ID,
      type: 'SERVICE',
      name: 'Redes',
      parentId: null,
      sortOrder: 50,
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

type QSeed = Omit<
  ExamQuestion,
  'createdAt' | 'updatedAt' | 'trackId' | 'status'
> & { topicId: string };

function q(partial: QSeed): ExamQuestion {
  return {
    ...partial,
    trackId: DEFAULT_TRACK_ID,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  };
}

/** ~12 published CLF-style samples so size 10 sessions work in demos. */
export function buildSeedQuestions(): ExamQuestion[] {
  return [
    q({
      id: 'eq-ec2-use',
      topicId: 'topic-compute',
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
      externalKey: 'clf.q.ec2-use',
    }),
    q({
      id: 'eq-s3-storage',
      topicId: 'topic-storage',
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
      externalKey: 'clf.q.s3-storage',
    }),
    q({
      id: 'eq-lambda',
      topicId: 'topic-compute',
      stem: '¿Qué servicio ejecuta código sin aprovisionar ni gestionar servidores?',
      choices: [
        'Amazon EC2',
        'AWS Lambda',
        'Amazon Lightsail',
        'AWS Elastic Beanstalk',
      ],
      correctIndex: 1,
      explanation:
        'Lambda es serverless compute. EC2/Lightsail/Beanstalk implican más gestión de servidores o plataformas.',
      externalKey: 'clf.q.lambda',
    }),
    q({
      id: 'eq-ebs',
      topicId: 'topic-storage',
      stem: '¿Qué servicio ofrece volúmenes de almacenamiento en bloque para instancias EC2?',
      choices: [
        'Amazon S3',
        'Amazon EFS',
        'Amazon EBS',
        'Amazon Glacier',
      ],
      correctIndex: 2,
      explanation:
        'EBS = Elastic Block Store, volúmenes adjuntos a instancias. S3 es objetos; EFS es NFS compartido.',
      externalKey: 'clf.q.ebs',
    }),
    q({
      id: 'eq-iam',
      topicId: 'topic-security',
      stem: '¿Qué servicio gestiona identidades y permisos de acceso a recursos de AWS?',
      choices: [
        'Amazon CloudWatch',
        'AWS IAM',
        'AWS Config',
        'Amazon Inspector',
      ],
      correctIndex: 1,
      explanation:
        'IAM (Identity and Access Management) controla quién puede hacer qué sobre qué recurso.',
      externalKey: 'clf.q.iam',
    }),
    q({
      id: 'eq-vpc',
      topicId: 'topic-networking',
      stem: '¿Qué servicio te permite crear una red virtual aislada en AWS?',
      choices: [
        'Amazon CloudFront',
        'Amazon Route 53',
        'Amazon VPC',
        'AWS Direct Connect',
      ],
      correctIndex: 2,
      explanation:
        'VPC = Virtual Private Cloud. CloudFront es CDN; Route 53 DNS; Direct Connect enlace dedicado.',
      externalKey: 'clf.q.vpc',
    }),
    q({
      id: 'eq-shared-resp',
      topicId: 'topic-cloud-fundamentals',
      stem: 'Según el modelo de responsabilidad compartida, ¿de qué es responsable AWS?',
      choices: [
        'Cifrado de datos de la aplicación del cliente',
        'Seguridad de la infraestructura de la nube',
        'Gestión de usuarios IAM del cliente',
        'Parches del sistema operativo en cada instancia EC2 del cliente',
      ],
      correctIndex: 1,
      explanation:
        'AWS asegura la nube (hardware, regiones, hipervisor). El cliente asegura lo que pone en la nube.',
      externalKey: 'clf.q.shared-resp',
    }),
    q({
      id: 'eq-cloudfront',
      topicId: 'topic-networking',
      stem: '¿Qué servicio de AWS es una red de entrega de contenido (CDN) global?',
      choices: [
        'Amazon CloudFront',
        'Amazon VPC',
        'AWS Transit Gateway',
        'Amazon ElastiCache',
      ],
      correctIndex: 0,
      explanation:
        'CloudFront cachea contenido en edge locations para baja latencia.',
      externalKey: 'clf.q.cloudfront',
    }),
    q({
      id: 'eq-rds',
      topicId: 'topic-storage',
      stem: '¿Qué servicio ofrece bases de datos relacionales gestionadas?',
      choices: [
        'Amazon DynamoDB',
        'Amazon RDS',
        'Amazon S3',
        'Amazon Redshift Spectrum',
      ],
      correctIndex: 1,
      explanation:
        'RDS gestiona motores relacionales (MySQL, PostgreSQL, etc.). DynamoDB es NoSQL; S3 es objetos.',
      externalKey: 'clf.q.rds',
    }),
    q({
      id: 'eq-az',
      topicId: 'topic-cloud-fundamentals',
      stem: '¿Qué es una Availability Zone (AZ) en AWS?',
      choices: [
        'Un continente con varios países',
        'Un centro de datos aislado dentro de una región',
        'Una cuenta de facturación separada',
        'Un edge location de CloudFront',
      ],
      correctIndex: 1,
      explanation:
        'Una región tiene varias AZ: datacenters físicamente separados para alta disponibilidad.',
      externalKey: 'clf.q.az',
    }),
    q({
      id: 'eq-mfa',
      topicId: 'topic-security',
      stem: '¿Cuál es una buena práctica de seguridad para la cuenta root de AWS?',
      choices: [
        'Compartir las credenciales root con el equipo',
        'Usar la cuenta root para tareas diarias',
        'Habilitar MFA y no usarla en el día a día',
        'Desactivar CloudTrail para reducir coste',
      ],
      correctIndex: 2,
      explanation:
        'Root solo para tareas excepcionales; MFA obligatorio; trabajo diario con usuarios IAM / roles.',
      externalKey: 'clf.q.mfa',
    }),
    q({
      id: 'eq-payg',
      topicId: 'topic-cloud-fundamentals',
      stem: '¿Cuál es un beneficio económico típico del modelo cloud de AWS?',
      choices: [
        'CapEx fijo alto por adelantado',
        'Pagar solo por lo que usas (OpEx)',
        'Contratos mínimos de 5 años obligatorios',
        'Sin opción de escalar recursos',
      ],
      correctIndex: 1,
      explanation:
        'Pay-as-you-go convierte CapEx en OpEx variable según consumo.',
      externalKey: 'clf.q.payg',
    }),
  ];
}
