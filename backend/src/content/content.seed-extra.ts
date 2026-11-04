import {
  AI_TRACK_ID,
  DEFAULT_TRACK_ID,
  type ExamChoices,
  type ExamQuestion,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';

const now = '2026-10-24T12:00:00.000Z';

export type SeedFact = {
  topicId: string;
  key: string;
  stem: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
  trackId?: string;
};

export const EXTRA_CLF_FACTS: SeedFact[] = [
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'capex-opex',
    stem: 'Pasar de gasto de capital (CAPEX) a gasto operativo (OPEX) significa…',
    correct: 'Pagas por uso, en lugar de comprar el hardware por adelantado',
    wrong: [
      'Comprar más servidores propios',
      'Dejar de cifrar los datos',
      'Dejar de usar IAM',
    ],
    explanation:
      'En un centro de datos propio el gasto grande es al comprar (CAPEX). En AWS pagas por lo que usas (OPEX). La guía del examen lo llama el cambio de CAPEX a OPEX.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'economies-scale',
    stem: 'Economías de escala en AWS permiten…',
    correct: 'Precios más bajos por el volumen agregado de clientes',
    wrong: [
      'Licencias ilimitadas y gratis',
      'Quitar las zonas de disponibilidad',
      'Trabajar sin acuerdo de nivel de servicio',
    ],
    explanation:
      'AWS compra a escala enorme y por eso puede cobrar menos que si montaras el mismo centro de datos tú solo. Eso son las economías de escala.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'tradeoff',
    stem: 'Un equilibrio típico al diseñar en la nube es…',
    correct: 'Costo frente a rendimiento y disponibilidad',
    wrong: [
      'Elegir el logo de la cuenta',
      'Apagar todos los logs',
      'Usar una sola Región para todo el mundo',
    ],
    explanation:
      'Más disponibilidad o más rendimiento suele costar más. El examen espera que reconozcas ese equilibrio, no que haya una opción gratis y perfecta.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'design-principle',
    stem: 'Un principio del Marco de Buena Arquitectura (AWS Well-Architected) es…',
    correct: 'Automatizar para facilitar la excelencia operativa',
    wrong: [
      'Dejar secretos escritos en el código',
      'Usar siempre una sola Availability Zone',
      'Usar el root user en las aplicaciones',
    ],
    explanation:
      'El Marco de Buena Arquitectura (Well-Architected) pide automatizar lo repetible. Dejar secretos en el código o usar el root user en una aplicación va en contra.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-cost',
    stem: 'El pilar de optimización de costos (Cost Optimization) busca…',
    correct: 'Evitar costos innecesarios y elegir el modelo de precios que encaja',
    wrong: [
      'Comprar el máximo de hardware por adelantado',
      'Apagar el monitoreo',
      'No etiquetar los recursos',
    ],
    explanation:
      'El pilar de optimización de costos pide pagar solo por lo que aporta y elegir el modelo de precios que encaja. Esos nombres van en inglés: On-Demand, Reserved, Spot o Savings Plans.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-reliability',
    stem: 'El pilar de fiabilidad (Reliability) busca…',
    correct: 'Recuperarte de un fallo y mantener la carga disponible',
    wrong: [
      'Que la consola se vea bien',
      'Trabajar sin copias de seguridad',
      'Depender de una sola instancia para siempre',
    ],
    explanation:
      'Fiabilidad, en el Marco de Buena Arquitectura, es que el sistema siga o se recupere cuando falla una pieza. Una sola instancia, sin copias, no lo cumple.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-security',
    stem: 'El pilar de seguridad incluye…',
    correct: 'Identidad, detección, protección de datos y respuesta',
    wrong: [
      'Solo la campaña de marketing',
      'Guardar todo sin cifrar',
      'Abrir todos los puertos a internet',
    ],
    explanation:
      'Seguridad en AWS empieza por quién entra (IAM), cómo te enteras de un problema, cómo proteges los datos y cómo respondes.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-perf',
    stem: 'El pilar de eficiencia del rendimiento trata de…',
    correct: 'Usar recursos de cómputo/almacenamiento/red de forma eficiente',
    wrong: [
      'Pagar siempre el máximo On-Demand',
      'No usar caché',
      'Atender a todo el mundo desde una sola Región',
    ],
    explanation:
      'Eficiencia del rendimiento es usar el cómputo, el almacenamiento y la red del tamaño correcto, no el más grande por costumbre.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-ops',
    stem: 'El pilar de excelencia operativa se centra en…',
    correct: 'Ejecutar y monitorear sistemas para entregar valor de negocio',
    wrong: [
      'Quitar la integración y el despliegue continuos',
      'Cambiar producción a mano, sin revisión',
      'Operar sin métricas',
    ],
    explanation:
      'Excelencia operativa es operar con procedimientos claros, cambios revisados y métricas. El cambio a mano en producción, sin medición, se sale de ese pilar.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'pillar-sustain',
    stem: 'El pilar de sostenibilidad busca…',
    correct: 'Minimizar el impacto ambiental de las cargas en la nube',
    wrong: [
      'Dejar instancias EC2 encendidas sin trabajo',
      'Replicar a veinte Regiones sin necesidad',
      'Apagar el registro de actividad',
    ],
    explanation:
      'Sostenibilidad es usar menos recursos de los que la carga necesita: no dejar instancias encendidas sin trabajo ni replicar a regiones que no usas.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'az-isolation',
    stem: 'Las zonas de disponibilidad (Availability Zones) están…',
    correct:
      'Aisladas físicamente pero conectadas con baja latencia en una Región',
    wrong: [
      'En continentes distintos siempre',
      'Sin red entre sí',
      'Solo para S3',
    ],
    explanation:
      'Una Availability Zone (en inglés) es uno o más centros de datos aislados. Varias de la misma Region están cerca entre sí, con red de baja latencia, para que puedas repartir la carga.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'region-choice',
    stem: 'Eliges una Región de AWS según…',
    correct: 'Latencia, leyes que debes cumplir, servicios disponibles y precio',
    wrong: [
      'El idioma de la consola',
      'El orden alfabético del nombre',
      'Cuántas personas hay en tu equipo',
    ],
    explanation:
      'La Región define dónde viven los datos, qué tan lejos están de tus usuarios, qué servicios hay y cuánto cuestan. La documentación de la infraestructura global de AWS lista esos criterios.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'edge-loc',
    stem: 'Los puntos de presencia (edge locations) sirven sobre todo para…',
    correct: 'Acercar contenido, DNS y el firewall de aplicaciones al usuario',
    wrong: [
      'Alojar ahí la base de datos principal',
      'Guardar ahí el disco de arranque de una instancia',
      'Ejecutar ahí los flujos de orquestación',
    ],
    explanation:
      'Un punto de presencia acerca CloudFront, DNS y WAF a quien consulta. No es el lugar donde vive tu base de datos principal ni el disco de una instancia.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'cloud-value',
    stem: 'La elasticidad de la nube significa…',
    correct: 'Subir o bajar la capacidad según la demanda',
    wrong: [
      'Dejar la capacidad fija durante tres años',
      'Quedarte solo con servidores propios',
      'No medir el uso',
    ],
    explanation:
      'Elasticidad es subir o bajar la capacidad cuando cambia la demanda, y pagar en consecuencia. No es dejar la misma capacidad fija durante años.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'iac',
    stem: 'La infraestructura como código permite…',
    correct: 'Definir infraestructura en plantillas versionadas',
    wrong: [
      'Configurar todo a mano en la consola',
      'Cambiar la infraestructura sin revisión',
      'Pegar secretos en un chat',
    ],
    explanation:
      'Infrastructure as code (en inglés; en AWS, CloudFormation) describe los recursos en un archivo que puedes versionar y repetir. No es configurar todo a mano en la consola.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'loose-coupling',
    stem: 'Desacoplar componentes mejora…',
    correct: 'Que cada pieza aguante y escale por su cuenta, por ejemplo con colas',
    wrong: [
      'Que todo dependa de una sola conexión',
      'Obligar a un solo programa para todo',
      'No reintentar cuando algo falla',
    ],
    explanation:
      'Desacoplar es que una pieza pueda fallar o crecer sin tumbar a las demás. Una cola entre dos servicios es el ejemplo clásico.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'think-parallel',
    stem: 'Al diseñar en la nube conviene…',
    correct: 'Paralelizar trabajo y usar servicios gestionados',
    wrong: [
      'Hacer todo el trabajo en un solo proceso',
      'No usar grupos de autoescalado',
      'Bloquear las APIs',
    ],
    explanation:
      'La nube rinde cuando partes el trabajo y usas servicios que ya escalan, en lugar de un solo proceso que lo hace todo.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'test-scale',
    stem: 'Debes probar a escala porque…',
    correct: 'Los cuellos de botella aparecen bajo carga real',
    wrong: [
      'Porque la nube no falla',
      'Basta con probarlo en tu laptop',
      'Las métricas no importan',
    ],
    explanation:
      'Un sistema que va bien con un usuario puede atascarse con mil. Hay que probarlo con la carga que esperas, no solo en tu laptop.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'manage-as-code',
    stem: 'Automatiza cambios para…',
    correct: 'Reducir error humano y aumentar consistencia',
    wrong: [
      'Evitar las plantillas de infraestructura',
      'Entrar por SSH a producción a arreglar a mano',
      'No tener un flujo de despliegue',
    ],
    explanation:
      'Un cambio automático y revisado se puede repetir. Entrar por SSH a producción a arreglar algo a mano no se puede repetir ni auditar.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'measure',
    stem: 'Mide todo lo relevante porque…',
    correct: 'Sin métricas no puedes mejorar costo, rendimiento ni fiabilidad',
    wrong: [
      'AWS cobra siempre lo mismo',
      'Los logs sobran',
      'Las alarmas estorban',
    ],
    explanation:
      'Sin métricas no sabes si estás gastando de más, si algo va lento o si está a punto de caer. CloudWatch existe para eso.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'shared-controls',
    stem: 'En el shared responsibility model (en inglés), aplicar parches al sistema operativo de una instancia EC2 es…',
    correct: 'Responsabilidad del cliente',
    wrong: ['Solo de AWS siempre', 'De Route 53', 'De CloudFront'],
    explanation:
      'AWS parchea la infraestructura. El sistema operativo que instalaste en EC2 lo parcheas tú. Es el mismo corte que en la guía: seguridad de la nube frente a seguridad en la nube.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'managed-service',
    stem: 'Usar un servicio administrado por AWS reduce…',
    correct: 'El trabajo de parches y de alta disponibilidad del motor',
    wrong: [
      'La necesidad de IAM',
      'Todo el costo a cero',
      'La necesidad de cifrado',
    ],
    explanation:
      'En RDS, por ejemplo, AWS se encarga de los parches del motor y de la alta disponibilidad que configures. Tú sigues siendo responsable de los accesos, los datos y el cifrado.',
  },
];

export const AIF_FACTS: SeedFact[] = [
  {
    topicId: 'topic-aif-ml-basics',
    key: 'supervised',
    stem: 'El aprendizaje supervisado usa…',
    correct: 'Datos etiquetados para entrenar el modelo',
    wrong: [
      'Solo grupos de datos sin etiqueta',
      'Solo aprendizaje por recompensa',
      'Datos sin ninguna característica',
    ],
    explanation:
      'Supervisado significa que los ejemplos ya traen la respuesta correcta (la etiqueta) y el modelo aprende a imitarla.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-ml-basics',
    key: 'unsupervised',
    stem: 'Agrupar datos parecidos sin etiquetas (clustering) es típico de…',
    correct: 'Aprendizaje no supervisado',
    wrong: [
      'Solo regresión con etiquetas',
      'Solo aprendizaje por recompensa',
      'Solo mover datos de un sistema a otro',
    ],
    explanation:
      'Si nadie etiquetó los datos y el modelo busca grupos por su cuenta, es aprendizaje no supervisado.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-ml-basics',
    key: 'inference',
    stem: 'La inferencia es…',
    correct: 'Usar un modelo entrenado para predicciones',
    wrong: [
      'Solo recoger los datos en crudo',
      'Solo pagar por la GPU',
      'Solo guardar versiones del código',
    ],
    explanation:
      'Entrenar ajusta el modelo. Inferir es usarlo ya entrenado para obtener una respuesta nueva.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-ml-basics',
    key: 'training',
    stem: 'El entrenamiento es…',
    correct: 'Ajustar parámetros del modelo con datos',
    wrong: [
      'Solo publicar el modelo para que lo llamen',
      'Solo comprar una Reserved Instance',
      'Solo crear una red virtual',
    ],
    explanation:
      'Entrenar es mostrar datos al modelo para que ajuste sus parámetros. Desplegar el endpoint viene después.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-genai',
    key: 'foundation-model',
    stem: 'Un modelo fundacional (foundation model) es…',
    correct: 'Un modelo grande preentrenado adaptable a varias tareas',
    wrong: [
      'Una imagen de máquina para EC2',
      'Un bucket de almacenamiento',
      'Una política de permisos',
    ],
    explanation:
      'Un modelo fundacional ya viene preentrenado con muchísimos datos y se adapta a varias tareas. No es un recurso de EC2, S3 o IAM.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-genai',
    key: 'prompt',
    stem: 'Un prompt (la instrucción al modelo) es…',
    correct: 'La instrucción que le das a un modelo generativo',
    wrong: [
      'Un grupo de seguridad de la red',
      'Una puerta de salida a internet',
      'Un plan de ahorro de cómputo',
    ],
    explanation:
      'El prompt es el texto (o la entrada) con el que pides una respuesta. No tiene nada que ver con redes, seguridad ni precios.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-genai',
    key: 'hallucination',
    stem: 'Una alucinación en IA generativa es…',
    correct: 'Contenido plausible pero incorrecto inventado por el modelo',
    wrong: [
      'La caída de una Availability Zone',
      'La interrupción de una instancia Spot',
      'La consistencia eventual de un almacén de objetos',
    ],
    explanation:
      'El modelo responde con seguridad algo que suena bien y es falso. No es una caída de una Availability Zone ni un corte de Spot.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-genai',
    key: 'rag',
    stem: 'RAG (recuperación más generación) combina…',
    correct: 'Buscar en tus documentos y luego dejar que el modelo redacte la respuesta',
    wrong: [
      'Solo ajustar el modelo, sin documentos',
      'Solo una red de distribución de contenido',
      'Solo un grupo de autoescalado',
    ],
    explanation:
      'RAG busca primero en tus documentos y luego el modelo responde con ese contexto. Así reduces respuestas inventadas.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'bedrock',
    stem: 'Amazon Bedrock ofrece…',
    correct: 'Acceso administrado a modelos fundacionales por API',
    wrong: [
      'Solo servidores físicos dedicados',
      'Solo almacenamiento de archivo a largo plazo',
      'Solo resolución de nombres de dominio',
    ],
    explanation:
      'Bedrock te da modelos fundacionales por API, sin que tengas que montar ni entrenar la infraestructura. La documentación lo describe como un servicio administrado.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'sagemaker',
    stem: 'Amazon SageMaker sirve para…',
    correct: 'Construir, entrenar y desplegar tus propios modelos',
    wrong: [
      'Solo enviar correo',
      'Solo resolver nombres de dominio',
      'Solo ver el presupuesto',
    ],
    explanation:
      'SageMaker es el servicio para construir, entrenar y desplegar tus propios modelos. Bedrock, en cambio, te da modelos ya listos por API.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'rekognition',
    stem: 'Amazon Rekognition analiza…',
    correct: 'Imágenes y video: objetos, caras, texto',
    wrong: [
      'Registros de tráfico de la red',
      'Solo tablas de datos para consultar',
      'Solo permisos de la cuenta',
    ],
    explanation:
      'Rekognition entiende imágenes y video: objetos, caras, texto. No analiza logs de red ni archivos tabulares.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'comprehend',
    stem: 'Amazon Comprehend hace…',
    correct: 'Leer texto y sacar sentimiento, entidades e idioma',
    wrong: [
      'Guardar objetos en buckets',
      'Dar un disco a una instancia',
      'Repartir tráfico de red',
    ],
    explanation:
      'Comprehend lee texto y saca sentimiento, entidades e idioma. No guarda archivos ni balancea tráfico.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'textract',
    stem: 'Amazon Textract extrae…',
    correct: 'Texto y datos de documentos y escaneos',
    wrong: [
      'Métricas de un grupo de autoescalado',
      'El informe de costos',
      'Los registros de tráfico de red',
    ],
    explanation:
      'Textract lee documentos y escaneos y te devuelve el texto y los campos. No es un servicio de métricas ni de costos.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'transcribe',
    stem: 'Amazon Transcribe convierte…',
    correct: 'Audio a texto',
    wrong: [
      'Texto a voz (eso es Polly)',
      'Poner un pie de foto a una imagen',
      'Volcar la red virtual a un archivo',
    ],
    explanation:
      'Transcribe pasa de audio a texto. El camino contrario, de texto a voz, es Polly.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-aws',
    key: 'polly',
    stem: 'Amazon Polly convierte…',
    correct: 'Texto a voz sintetizada',
    wrong: [
      'Voz a texto',
      'Convertir una imagen en un vector',
      'Cambiar el formato de una tabla',
    ],
    explanation:
      'Polly lee un texto en voz alta. Si partes de un audio y quieres el texto, el servicio es Transcribe.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-responsible',
    key: 'bias',
    stem: 'El sesgo en aprendizaje automático puede venir de…',
    correct: 'Datos de entrenamiento no representativos',
    wrong: [
      'Solo el color del tablero',
      'Solo el nombre del bucket',
      'Solo la Availability Zone',
    ],
    explanation:
      'Si los datos de entrenamiento no representan a quien va a usar el sistema, el modelo hereda ese sesgo. No depende del color de un tablero ni de la Availability Zone.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-responsible',
    key: 'transparency',
    stem: 'Transparencia en IA implica…',
    correct: 'Explicar qué puede hacer el sistema, qué no, y cómo usa los datos',
    wrong: [
      'Ocultar siempre cómo funciona',
      'No guardar registros',
      'No revisar las salidas',
    ],
    explanation:
      'Transparencia es decir qué puede hacer el sistema, qué no, y cómo usa los datos. Ocultarlo no es una práctica responsable.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-responsible',
    key: 'privacy',
    stem: 'Privacidad en IA requiere…',
    correct: 'Proteger los datos personales del entrenamiento y de la inferencia',
    wrong: [
      'Publicar datos personales en un bucket abierto',
      'Apagar el cifrado de las claves',
      'Pegar llaves de administrador en el prompt',
    ],
    explanation:
      'Los datos personales del entrenamiento y de la inferencia hay que protegerlos. Publicarlos o pegar llaves en el prompt rompe esa práctica.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-responsible',
    key: 'human-loop',
    stem: 'Dejar a una persona en el circuito (human-in-the-loop) sirve para…',
    correct: 'Revisar las salidas críticas antes de aplicarlas',
    wrong: [
      'Quitar el monitoreo',
      'Dejar de evaluar el modelo',
      'Aprobar todo automáticamente',
    ],
    explanation:
      'Cuando una decisión es crítica, una persona revisa la salida del modelo antes de aplicarla.',
    trackId: AI_TRACK_ID,
  },
  {
    topicId: 'topic-aif-responsible',
    key: 'eval',
    stem: 'Evaluar modelos incluye…',
    correct: 'Métricas de calidad, robustez y riesgo según el caso',
    wrong: [
      'Solo mirar el logo',
      'Solo el precio de la GPU',
      'Solo el tamaño del prompt',
    ],
    explanation:
      'Evaluar un modelo es medir si responde bien, si aguanta casos raros y qué riesgo tiene. El precio de la GPU no dice nada de su calidad.',
    trackId: AI_TRACK_ID,
  },
];

export function buildAifTopics(): Topic[] {
  return [
    {
      id: 'topic-aif-ml-basics',
      trackId: AI_TRACK_ID,
      type: 'CONCEPT',
      name: 'Fundamentos ML',
      parentId: null,
      sortOrder: 110,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-aif-genai',
      trackId: AI_TRACK_ID,
      type: 'CONCEPT',
      name: 'IA generativa',
      parentId: null,
      sortOrder: 120,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-aif-aws',
      trackId: AI_TRACK_ID,
      type: 'CONCEPT',
      name: 'Servicios AI/ML en AWS',
      parentId: null,
      sortOrder: 130,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'topic-aif-responsible',
      trackId: AI_TRACK_ID,
      type: 'CONCEPT',
      name: 'IA responsable',
      parentId: null,
      sortOrder: 140,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function buildExtraKnowledge(): KnowledgeItem[] {
  return [
    {
      id: 'ki-bedrock',
      topicId: 'topic-aif-aws',
      trackId: AI_TRACK_ID,
      name: 'Amazon Bedrock',
      definition:
        'Servicio que te da modelos fundacionales por API, sin que montes la infraestructura.',
      distractors: [
        'Solo los cuadernos de SageMaker',
        'Análisis de imágenes de Rekognition',
        'Texto a voz de Polly',
      ],
      explanation:
        'Lo usas cuando quieres un modelo ya entrenado, no cuando vas a entrenar el tuyo.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'aif.ki-bedrock',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-sagemaker',
      topicId: 'topic-aif-aws',
      trackId: AI_TRACK_ID,
      name: 'Amazon SageMaker',
      definition:
        'Servicio para construir, entrenar y desplegar tus propios modelos de aprendizaje automático.',
      distractors: [
        'Solo el chat de Bedrock',
        'Solo el análisis de texto de Comprehend',
        'Solo la lectura de documentos de Textract',
      ],
      explanation:
        'A diferencia de Bedrock, aquí el modelo lo preparas tú: datos, entrenamiento y despliegue.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'aif.ki-sagemaker',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-rag',
      topicId: 'topic-aif-genai',
      trackId: AI_TRACK_ID,
      name: 'RAG',
      definition:
        'Técnica que busca en tus documentos y luego genera la respuesta con ese contexto.',
      distractors: [
        'Solo reentrenar el modelo',
        'Solo un prompt sin contexto',
        'Solo mover datos por lotes',
      ],
      explanation:
        'RAG significa Retrieval-Augmented Generation: recuperar y después generar. Sirve para que el modelo se apoye en tus datos y alucine menos.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'aif.ki-rag',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ki-fm',
      topicId: 'topic-aif-genai',
      trackId: AI_TRACK_ID,
      name: 'Modelo fundacional',
      definition:
        'Modelo grande ya preentrenado que se adapta a muchas tareas distintas.',
      distractors: [
        'Un modelo lineal de una sola variable',
        'Una regla fija de si y no',
        'Una tarea programada',
      ],
      explanation:
        'En la documentación de AWS se llama foundation model. No lo entrenas desde cero: lo adaptas.',
      allowedVariants: [
        'NAME_TO_DEFINITION',
        'DEFINITION_TO_NAME',
        'NAME_FOCUS',
      ],
      status: 'published',
      externalKey: 'aif.ki-fm',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

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

export function factsToQuestions(
  facts: SeedFact[],
  prefix: string,
): ExamQuestion[] {
  return facts.map((fact, i) => {
    const { choices, correctIndex } = rotateChoices(
      fact.correct,
      fact.wrong,
      i,
    );
    const trackId = fact.trackId ?? DEFAULT_TRACK_ID;
    return {
      id: `eq-${fact.key}`,
      topicId: fact.topicId,
      trackId,
      stem: fact.stem,
      choices,
      correctIndex,
      explanation: fact.explanation,
      status: 'published' as const,
      externalKey: `${prefix}.q.${fact.key}`,
      createdAt: now,
      updatedAt: now,
    };
  });
}
