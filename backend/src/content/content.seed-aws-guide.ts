import { DEFAULT_TRACK_ID, type ExamQuestion } from '@aps/shared';
import {
  AWS_GUIDE_CONCEPTS,
  AWS_GUIDE_QUESTIONS,
  type AwsGuideConcept,
} from './aws-guide.data';

const now = '2026-10-28T12:00:00.000Z';

/** What the generated "se utiliza principalmente para…" line actually means. */
const USED_FOR: Record<string, string> = {
  'administración de claves criptográficas': 'crear y cuidar claves de cifrado',
  'administración mediante comandos': 'operar AWS desde la terminal',
  'administración multicuenta': 'agrupar y gobernar varias cuentas',
  'almacenamiento de archivos compartidos': 'compartir archivos entre varios servidores',
  'almacenamiento de objetos': 'guardar archivos y respaldos en buckets',
  'almacenamiento en bloques': 'dar un disco a una instancia',
  'base de datos nosql': 'guardar datos NoSQL',
  'base de datos relacional': 'operar una base de datos relacional',
  'centralización de hallazgos de seguridad': 'reunir hallazgos de seguridad en un solo lugar',
  cómputo: 'ejecutar servidores virtuales',
  'cómputo sin servidor': 'ejecutar código sin administrar servidores',
  'detección de amenazas': 'detectar actividad sospechosa en la cuenta',
  'distribución de contenido': 'acercar el contenido a quien lo consulta',
  'dns y enrutamiento de dominio': 'resolver nombres de dominio',
  'documentación de cumplimiento': 'consultar informes de cumplimiento',
  'evaluación de vulnerabilidades': 'buscar vulnerabilidades en lo que despliegas',
  'filtrado de tráfico web': 'filtrar tráfico web malicioso',
  'identidades y permisos': 'decidir quién puede hacer qué',
  'monitoreo y observabilidad': 'ver métricas, logs y alarmas',
  'notificaciones y mensajería pub/sub': 'enviar notificaciones',
  'plantilla para ec2': 'definir la plantilla con la que se lanza una instancia',
  'protección contra ddos': 'absorber ataques de denegación de servicio',
  'recomendaciones de optimización': 'recomendarte cómo mejorar costo, seguridad y rendimiento',
  'red virtual': 'definir tu red privada en AWS',
  'registro de actividad y auditoría': 'registrar quién hizo qué en la cuenta',
};

const ORG_PREFIX = 'Una organización necesita lo siguiente: ';

function officialName(raw: string): string {
  const key = raw.trim().toLowerCase();
  const hit = AWS_GUIDE_CONCEPTS.find(
    (c) => c.officialName.toLowerCase() === key,
  );
  return hit?.officialName ?? raw.trim();
}

/** The generated bank asks the right idea with broken Spanish. This is the voice students read. */
export function polishGuideQuestion(
  question: (typeof AWS_GUIDE_QUESTIONS)[number],
  concept: AwsGuideConcept,
): {
  stem: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  optionExplanations: [string, string, string, string];
} {
  const brokenName = question.choices.some(
    (choice) =>
      choice.includes('No aplica') || choice.includes('herramienta de terceros'),
  );
  if (brokenName) {
    const notThis = `No. Eso es otro servicio. ${concept.name} no hace eso.`;
    return {
      stem: `¿Para qué sirve ${concept.officialName}?`,
      choices: [
        concept.function,
        concept.wrongDefinitions[0],
        concept.wrongDefinitions[1],
        concept.wrongDefinitions[2],
      ],
      correctIndex: 0,
      optionExplanations: [`Sí. ${concept.function}`, notThis, notThis, notThis],
    };
  }

  let stem = question.stem;
  if (stem.startsWith(ORG_PREFIX)) {
    const need = stem
      .slice(ORG_PREFIX.length)
      .replace(/\s*¿Qué servicio o concepto debería considerar\?\s*$/, '')
      .replace(/\.\s*$/, '');
    stem = `${need}. ¿Qué servicio de AWS usas?`;
  } else if (stem.startsWith('¿Cuál es el nombre oficial en inglés')) {
    stem = `¿Cómo aparece ${concept.name} en la documentación de AWS?`;
  }

  return {
    stem,
    choices: question.choices,
    correctIndex: question.correctIndex,
    optionExplanations: question.optionExplanations.map(polishExplanation) as [
      string,
      string,
      string,
      string,
    ],
  };
}

function polishExplanation(text: string): string {
  const usedFor = text.match(
    /^Incorrecta: Se utiliza principalmente para ([^,]+), no para el objetivo descrito\.$/,
  );
  if (usedFor) {
    const plain = USED_FOR[usedFor[1]] ?? usedFor[1];
    return `No. Ese servicio sirve para ${plain}.`;
  }

  const functionOf = text.match(/^Incorrecta: Esa es la función de ([^.]+)\.$/i);
  if (functionOf) {
    return `No. Esa es la función de ${officialName(functionOf[1])}.`;
  }

  return text
    .replaceAll('nombre desarrollado', 'nombre completo')
    .replace(/^Correcta:\s*/, 'Sí. ')
    .replace(/^Incorrecta:\s*/, 'No. ')
    .replace(/:\s*Correcta\.\s*/, ': sí. ')
    .replace(/:\s*Incorrecta\.\s*/, ': no. ');
}

/** Practice questions from the AWS study guide; its concepts only map each question to a topic. */
export function buildAwsGuideQuestions(): ExamQuestion[] {
  const conceptByKey = new Map(AWS_GUIDE_CONCEPTS.map((c) => [c.key, c]));
  return AWS_GUIDE_QUESTIONS.map((q) => {
    const concept = conceptByKey.get(q.conceptKey);
    if (!concept) {
      throw new Error(
        `Guide question ${q.number}: unknown concept ${q.conceptKey}`,
      );
    }
    const polished = polishGuideQuestion(q, concept);
    const number = String(q.number).padStart(3, '0');
    return {
      id: `eq-guide-${number}`,
      topicId: concept.topicId,
      trackId: DEFAULT_TRACK_ID,
      stem: polished.stem,
      choices: [...polished.choices],
      correctIndex: polished.correctIndex,
      explanation: polished.optionExplanations
        .map((text, i) => `${'ABCD'[i]}. ${text}`)
        .join('\n'),
      status: 'published' as const,
      externalKey: `guide.q.${number}`,
      createdAt: now,
      updatedAt: now,
    };
  });
}
