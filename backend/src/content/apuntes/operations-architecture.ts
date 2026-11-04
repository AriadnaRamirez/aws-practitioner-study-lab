import type { ApuntesTopic } from './types';

export const OPERATIONS_TOPIC: ApuntesTopic = {
  id: 'topic-sysops',
  name: 'Conceptos de operaciones del sistema',
  type: 'CONCEPT',
  sortOrder: 70,
  concepts: [
    {
      key: 'sysops',
      name: 'SysOps',
      definition:
        'Operaciones de sistemas: garantizar que los sistemas sigan funcionando, como el intendente de un edificio.',
      confusedWith: ['devops', 'cloud-architect'],
      note: 'Los planos del edificio los hacen el arquitecto de nube y el desarrollador.',
    },
    {
      key: 'error-reduction',
      name: 'Reducción de errores',
      definition:
        'Beneficio de automatizar: cambiar tareas hechas a mano por estándares y plantillas.',
      confusedWith: ['repeatable-admin', 'realtime-visibility'],
    },
    {
      key: 'repeatable-admin',
      name: 'Administración repetible',
      definition:
        'Beneficio de automatizar: administrar todo con las mismas instrucciones para obtener siempre el mismo resultado.',
      confusedWith: ['error-reduction', 'realtime-visibility'],
    },
    {
      key: 'realtime-visibility',
      name: 'Visibilidad en tiempo real',
      definition:
        'Beneficio de automatizar: monitorear de forma continua para detectar y evitar errores.',
      confusedWith: ['repeatable-admin', 'error-reduction'],
    },
    {
      key: 'systems-lifecycle',
      name: 'Ciclo de vida de los sistemas',
      definition:
        'Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.',
      confusedWith: ['troubleshooting', 'pdar'],
    },
    {
      key: 'shell-script',
      name: 'Script de shell',
      definition:
        'Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.',
      confusedWith: ['declarative-template', 'iac'],
    },
    {
      key: 'declarative-template',
      name: 'Plantilla declarativa',
      definition:
        'Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.',
      confusedWith: ['shell-script', 'iac'],
    },
    {
      key: 'json',
      name: 'JSON',
      definition:
        'Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.',
      confusedWith: ['yaml', 'declarative-template'],
    },
    {
      key: 'yaml',
      name: 'YAML',
      definition:
        'Formato de texto basado en la indentación, usado en plantillas de infraestructura.',
      confusedWith: ['json', 'shell-script'],
    },
    {
      key: 'iac',
      name: 'Infraestructura como código',
      definition:
        'Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.',
      confusedWith: ['declarative-template', 'shell-script'],
      note: 'Se abrevia IaC; en AWS se hace con CloudFormation.',
    },
    {
      key: 'aws-configure',
      name: 'aws configure',
      definition:
        'Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.',
      confusedWith: ['aws-help', 'cli-syntax'],
    },
    {
      key: 'access-key-id',
      name: 'Access Key ID',
      definition: 'Identificador público de tus claves de acceso para la CLI.',
      confusedWith: ['secret-access-key', 'default-region'],
    },
    {
      key: 'secret-access-key',
      name: 'Secret Access Key',
      definition: 'Parte privada de tus claves de acceso; nunca se comparte.',
      confusedWith: ['access-key-id', 'default-region'],
    },
    {
      key: 'default-region',
      name: 'Región predeterminada',
      definition:
        'Región donde se ejecutan los comandos de la CLI cuando no indicas otra.',
      confusedWith: ['output-format', 'access-key-id'],
    },
    {
      key: 'output-format',
      name: 'Formato de salida',
      definition:
        'Cómo muestra la CLI los resultados: json (predeterminado), table (tabla) o text (texto separado por tabulaciones).',
      confusedWith: ['default-region', 'json'],
    },
    {
      key: 'cli-syntax',
      name: 'Sintaxis de la CLI',
      definition:
        'Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.',
      confusedWith: ['aws-help', 'aws-configure'],
    },
    {
      key: 'aws-help',
      name: 'aws help',
      definition:
        'Comando que muestra la ayuda de la CLI con todos sus servicios.',
      confusedWith: ['aws-configure', 'cli-syntax'],
      note: 'También se pide por servicio u operación, como aws ec2 help.',
    },
    {
      key: 'run-instances',
      name: 'run-instances',
      definition: 'Operación de la CLI de EC2 que crea instancias.',
      confusedWith: ['describe-instances', 'create-volume'],
    },
    {
      key: 'describe-instances',
      name: 'describe-instances',
      definition:
        'Operación de la CLI de EC2 que lista tus instancias y sus datos.',
      confusedWith: ['run-instances', 's3-ls'],
    },
    {
      key: 'create-volume',
      name: 'create-volume',
      definition:
        'Operación de la CLI de EC2 que crea un volumen de disco (EBS).',
      confusedWith: ['create-snapshot', 'run-instances'],
    },
    {
      key: 'create-vpc',
      name: 'create-vpc',
      definition: 'Operación de la CLI de EC2 que crea una red virtual.',
      confusedWith: ['create-volume', 'run-instances'],
    },
    {
      key: 'create-snapshot',
      name: 'create-snapshot',
      definition:
        'Operación de la CLI de EC2 que crea una copia instantánea de un volumen.',
      confusedWith: ['create-volume', 's3-cp'],
    },
    {
      key: 's3-ls',
      name: 'aws s3 ls',
      definition: 'Comando que lista tus buckets o el contenido de uno.',
      confusedWith: ['s3-cp', 'describe-instances'],
    },
    {
      key: 's3-cp',
      name: 'aws s3 cp',
      definition: 'Comando que copia archivos hacia, desde o entre buckets.',
      confusedWith: ['s3-ls', 'create-snapshot'],
    },
    {
      key: 'put-parameter',
      name: 'put-parameter',
      definition:
        'Operación de la CLI de Systems Manager que crea un parámetro, como una contraseña cifrada de tipo SecureString.',
      confusedWith: ['create-snapshot', 'aws-configure'],
    },
    {
      key: 'troubleshooting',
      name: 'Solución de problemas',
      definition:
        'Método de 8 pasos: identificar y priorizar, categoría, descripción, síntomas, causa raíz, posibles soluciones, herramientas de validación y recomendaciones.',
      confusedWith: ['systems-lifecycle', 'root-cause'],
    },
    {
      key: 'root-cause',
      name: 'Causa raíz',
      definition: 'El origen real de un problema, no solo su síntoma.',
      confusedWith: ['troubleshooting', 'systems-lifecycle'],
    },
  ],
};

export const ARCHITECTURE_TOPIC: ApuntesTopic = {
  id: 'topic-architecture',
  name: 'Conceptos de arquitectura de AWS',
  type: 'CONCEPT',
  sortOrder: 75,
  concepts: [
    {
      key: 'caf',
      name: 'CAF',
      long: 'Cloud Adoption Framework',
      definition:
        'Guía de AWS con metodología y buenas prácticas para adoptar la nube, organizada en perspectivas de negocio y técnicas.',
      confusedWith: ['well-architected', 'caf-platform'],
    },
    {
      key: 'caf-business',
      name: 'Perspectiva Business',
      definition:
        'Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.',
      confusedWith: ['caf-people', 'caf-governance', 'caf-platform'],
    },
    {
      key: 'caf-people',
      name: 'Perspectiva People',
      definition:
        'Perspectiva de negocio del CAF: preparar al talento humano para la nube.',
      confusedWith: ['caf-business', 'caf-operations', 'caf-governance'],
    },
    {
      key: 'caf-governance',
      name: 'Perspectiva Governance',
      definition:
        'Perspectiva de negocio del CAF: asegurar que se cumplan las normas.',
      confusedWith: ['caf-security', 'caf-business', 'caf-people'],
    },
    {
      key: 'caf-platform',
      name: 'Perspectiva Platform',
      definition:
        'Perspectiva técnica del CAF: los planos de la arquitectura de TI.',
      confusedWith: ['caf-operations', 'caf-security', 'caf-business'],
    },
    {
      key: 'caf-security',
      name: 'Perspectiva Security',
      definition:
        'Perspectiva técnica del CAF: el control de las identidades y la protección.',
      confusedWith: ['caf-governance', 'caf-platform', 'caf-operations'],
    },
    {
      key: 'caf-operations',
      name: 'Perspectiva Operations',
      definition:
        'Perspectiva técnica del CAF: definir las actividades de operación de cada persona.',
      confusedWith: ['caf-people', 'caf-platform', 'caf-security'],
    },
    {
      key: 'well-architected',
      name: 'Well-Architected Framework',
      definition:
        'Conjunto de principios de diseño y 6 pilares que ayudan a evaluar una arquitectura; no se impone.',
      confusedWith: ['caf', 'iac'],
    },
    {
      key: 'stop-guessing',
      name: 'Dejar de suponer capacidad',
      definition:
        'Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.',
      confusedWith: ['production-scale', 'evolutionary-architecture'],
    },
    {
      key: 'production-scale',
      name: 'Probar a escala de producción',
      definition:
        'Principio de diseño: clonar la arquitectura completa para probarla con carga real y pagar solo el tiempo de la prueba.',
      confusedWith: ['game-day', 'stop-guessing'],
    },
    {
      key: 'automate-experiment',
      name: 'Automatizar para experimentar',
      definition:
        'Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.',
      confusedWith: ['evolutionary-architecture', 'data-driven'],
    },
    {
      key: 'evolutionary-architecture',
      name: 'Arquitectura evolutiva',
      definition:
        'Principio de diseño: desacoplar los servicios para poder reemplazar componentes como piezas intercambiables.',
      confusedWith: ['automate-experiment', 'stop-guessing'],
    },
    {
      key: 'data-driven',
      name: 'Arquitectura basada en datos',
      definition:
        'Principio de diseño: recopilar métricas y logs (por ejemplo, con CloudWatch) para tomar decisiones y prevenir cortes.',
      confusedWith: ['game-day', 'automate-experiment'],
    },
    {
      key: 'game-day',
      name: 'Game day',
      definition:
        'Principio de diseño: simular caídas en un entorno seguro y crear scripts que respondan al evento.',
      confusedWith: ['production-scale', 'data-driven'],
      note: 'En español, día de pruebas.',
    },
    {
      key: 'operational-excellence',
      name: 'Excelencia operativa',
      definition:
        'Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.',
      confusedWith: [
        'reliability',
        'performance-efficiency',
        'cost-optimization',
      ],
    },
    {
      key: 'security-pillar',
      name: 'Pilar de seguridad',
      definition:
        'Pilar que protege la información: identidades, detección, infraestructura, datos y respuesta ante incidentes.',
      confusedWith: ['reliability', 'operational-excellence', 'caf-security'],
    },
    {
      key: 'reliability',
      name: 'Fiabilidad',
      definition:
        'Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.',
      confusedWith: [
        'high-availability',
        'performance-efficiency',
        'operational-excellence',
      ],
      note: 'Un sistema fiable es aquel en el que no aparecen fallos en sus componentes.',
    },
    {
      key: 'performance-efficiency',
      name: 'Eficiencia del rendimiento',
      definition:
        'Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.',
      confusedWith: [
        'cost-optimization',
        'reliability',
        'operational-excellence',
      ],
    },
    {
      key: 'cost-optimization',
      name: 'Optimización de costos',
      definition:
        'Pilar que busca que el sistema funcione al menor costo: modelo de consumo, medir la eficiencia y analizar gastos con etiquetas.',
      confusedWith: [
        'performance-efficiency',
        'sustainability',
        'operational-excellence',
      ],
    },
    {
      key: 'sustainability',
      name: 'Sostenibilidad',
      definition:
        'Pilar que reduce el impacto ambiental de las cargas de trabajo.',
      confusedWith: [
        'cost-optimization',
        'performance-efficiency',
        'reliability',
      ],
    },
    {
      key: 'high-availability',
      name: 'Alta disponibilidad',
      definition:
        'Que el sistema siga funcionando aunque falle un componente; se apoya en tolerancia a errores, escalabilidad y capacidad de recuperación.',
      confusedWith: ['reliability', 'fault-tolerance', 'scalability'],
    },
    {
      key: 'fault-tolerance',
      name: 'Tolerancia a errores',
      definition:
        'Capacidad de completar una tarea por caminos distintos si uno falla.',
      confusedWith: ['scalability', 'recoverability', 'high-availability'],
    },
    {
      key: 'scalability',
      name: 'Escalabilidad',
      definition:
        'Capacidad de ampliar la infraestructura cuando crece la demanda.',
      confusedWith: ['fault-tolerance', 'recoverability', 'stop-guessing'],
    },
    {
      key: 'recoverability',
      name: 'Capacidad de recuperación',
      definition:
        'Procedimientos para restablecer el servicio después de una falla.',
      confusedWith: ['fault-tolerance', 'scalability', 'reliability'],
    },
    {
      key: 'stack',
      name: 'Pila',
      definition:
        'Conjunto de recursos que CloudFormation crea y administra como una sola unidad a partir de una plantilla.',
      confusedWith: ['iac', 'declarative-template'],
      note: 'En inglés, stack: los recursos se crean en orden, de abajo hacia arriba.',
    },
    {
      key: 'support-basic',
      name: 'Plan Basic',
      definition:
        'Plan de soporte incluido para todos: solo foros y documentación.',
      confusedWith: [
        'support-developer',
        'support-business',
        'support-enterprise',
      ],
    },
    {
      key: 'support-developer',
      name: 'Plan Developer',
      definition:
        'Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.',
      confusedWith: ['support-basic', 'support-business', 'support-enterprise'],
    },
    {
      key: 'support-business',
      name: 'Plan Business',
      definition:
        'Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.',
      confusedWith: [
        'support-enterprise',
        'support-developer',
        'support-basic',
      ],
    },
    {
      key: 'support-enterprise',
      name: 'Plan Enterprise',
      definition:
        'Plan de soporte 24/7 con un TAM asignado y respuesta en menos de 15 minutos.',
      confusedWith: ['support-business', 'support-developer', 'support-basic'],
    },
    {
      key: 'tam',
      name: 'TAM',
      long: 'Technical Account Manager',
      definition:
        'Contacto técnico dedicado que AWS asigna en el plan de soporte más alto.',
      confusedWith: ['apn', 'support-business'],
    },
    {
      key: 'apn',
      name: 'APN',
      long: 'AWS Partner Network',
      definition:
        'Red de empresas socias de AWS que ofrecen consultoría especializada.',
      confusedWith: ['tam', 'support-developer'],
    },
  ],
};
