import type { ApuntesTopic } from './types';

/** "Servicios de AWS": only the services the course notes cover. */
export const SERVICE_TOPICS: ApuntesTopic[] = [
  {
    id: 'topic-compute',
    name: 'Servicios de cómputo',
    type: 'SERVICE',
    sortOrder: 10,
    concepts: [
      {
        key: 'ec2',
        id: 'ki-guide-ec2',
        name: 'EC2',
        long: 'Elastic Compute Cloud',
        definition:
          'Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.',
        confusedWith: ['lambda', 'ecs', 'ami'],
        note: 'Pagas por el tiempo que la instancia está encendida.',
      },
      {
        key: 'ami',
        id: 'ki-guide-ami',
        name: 'AMI',
        long: 'Amazon Machine Image',
        definition:
          'Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.',
        confusedWith: ['ec2', 'user-data', 'ebs'],
      },
      {
        key: 'lambda',
        id: 'ki-guide-lambda',
        name: 'Lambda',
        definition:
          'Servicio que ejecuta funciones de código sin administrar servidores; solo corre cuando ocurre un evento.',
        confusedWith: ['ec2', 'ecs'],
      },
      {
        key: 'ecs',
        name: 'ECS',
        long: 'Elastic Container Service',
        definition: 'Servicio que ejecuta y administra contenedores Docker.',
        confusedWith: ['lambda', 'ec2'],
      },
      {
        key: 'on-demand',
        name: 'On-Demand',
        definition:
          'Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.',
        confusedWith: ['reserved', 'spot'],
        note: 'El nombre va en inglés. 1 hora de uso, 1 hora de pago.',
      },
      {
        key: 'reserved',
        name: 'Reserved',
        definition:
          'Instancia con compromiso de uso de 1 o 3 años, a cambio de un descuento de hasta 72 % frente a On-Demand.',
        confusedWith: ['on-demand', 'spot'],
        note: 'El nombre va en inglés. Conviene cuando el uso es estable y predecible.',
      },
      {
        key: 'spot',
        name: 'Spot',
        definition:
          'Instancia que usa capacidad sobrante de AWS con hasta 90 % de descuento; AWS puede recuperarla con 2 minutos de aviso.',
        confusedWith: ['on-demand', 'reserved'],
        note: 'Solo sirve para trabajos que toleran interrupciones.',
      },
      {
        key: 'family-general',
        name: 'Propósito general',
        definition:
          'Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).',
        confusedWith: ['family-compute', 'family-memory', 'family-storage'],
      },
      {
        key: 'family-compute',
        name: 'Optimizada para cómputo',
        definition:
          'Familia de instancias con procesadores potentes, para servidores de video, juegos y machine learning (letra c).',
        confusedWith: ['family-accelerated', 'family-general', 'family-memory'],
      },
      {
        key: 'family-memory',
        name: 'Optimizada para memoria',
        definition:
          'Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).',
        confusedWith: ['family-storage', 'family-compute', 'family-general'],
      },
      {
        key: 'family-accelerated',
        name: 'Cómputo acelerado',
        definition:
          'Familia de instancias con procesadores gráficos (GPU), para gráficos y deep learning (letras p y g).',
        confusedWith: ['family-compute', 'family-memory', 'family-storage'],
      },
      {
        key: 'family-storage',
        name: 'Optimizada para almacenamiento',
        definition:
          'Familia de instancias con discos locales rápidos, para cargas con mucho acceso a disco (letras i y d).',
        confusedWith: ['family-memory', 'family-general', 'family-accelerated'],
      },
      {
        key: 'instance-naming',
        name: 'Nomenclatura',
        definition:
          'Forma de leer un tipo de instancia como t3.micro: la letra es la familia (t), el número la generación (3) y lo último el tamaño (micro).',
        confusedWith: ['family-general', 'ami'],
      },
    ],
  },
  {
    id: 'topic-storage',
    name: 'Servicios de almacenamiento',
    type: 'SERVICE',
    sortOrder: 20,
    concepts: [
      {
        key: 's3',
        id: 'ki-guide-s3',
        name: 'S3',
        long: 'Simple Storage Service',
        definition:
          'Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.',
        confusedWith: ['ebs', 'efs'],
      },
      {
        key: 'ebs',
        id: 'ki-guide-ebs',
        name: 'EBS',
        long: 'Elastic Block Store',
        definition:
          'Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.',
        confusedWith: ['efs', 's3'],
      },
      {
        key: 'efs',
        id: 'ki-guide-efs',
        name: 'EFS',
        long: 'Elastic File System',
        definition:
          'Sistema de archivos compartido que varias instancias EC2 pueden montar a la vez.',
        confusedWith: ['ebs', 's3'],
      },
      {
        key: 'bucket',
        name: 'Bucket',
        definition:
          'Contenedor donde S3 guarda los objetos; su nombre debe ser único en todo el mundo y cada cuenta empieza con 100, ampliables a 1000.',
        confusedWith: ['s3', 'ebs'],
      },
      {
        key: 'durability',
        name: 'Durabilidad',
        definition:
          'Probabilidad de que un objeto guardado no se pierda; en S3 es de 99.999999999 % (11 nueves).',
        confusedWith: ['availability', 's3-one-zone-ia'],
      },
      {
        key: 's3-standard',
        name: 'S3 Standard',
        definition:
          'Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.',
        confusedWith: [
          's3-standard-ia',
          's3-intelligent-tiering',
          's3-one-zone-ia',
        ],
      },
      {
        key: 's3-standard-ia',
        name: 'S3 Standard-IA',
        long: 'Standard-Infrequent Access',
        definition:
          'Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.',
        confusedWith: ['s3-one-zone-ia', 's3-standard', 'glacier-flexible'],
      },
      {
        key: 's3-one-zone-ia',
        name: 'S3 One Zone-IA',
        definition:
          'Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.',
        confusedWith: ['s3-standard-ia', 's3-standard', 'glacier-deep'],
      },
      {
        key: 's3-intelligent-tiering',
        name: 'S3 Intelligent-Tiering',
        definition:
          'Clase de S3 que mueve los objetos automáticamente entre niveles de acceso frecuente e infrecuente según cómo se usan.',
        confusedWith: ['s3-standard', 's3-standard-ia', 'glacier-flexible'],
      },
      {
        key: 'glacier-flexible',
        name: 'S3 Glacier Flexible Retrieval',
        definition:
          'Clase de archivo de bajo costo para datos que casi no se consultan; recuperar un archivo tarda de minutos a horas.',
        confusedWith: [
          'glacier-deep',
          's3-standard-ia',
          's3-intelligent-tiering',
        ],
      },
      {
        key: 'glacier-deep',
        name: 'S3 Glacier Deep Archive',
        definition:
          'La clase más barata de S3, para conservar datos durante años (hasta unos 10); recuperar un archivo tarda hasta 12 horas.',
        confusedWith: ['glacier-flexible', 's3-one-zone-ia', 's3-standard-ia'],
      },
      {
        key: 'snowcone',
        name: 'Snowcone',
        definition:
          'Dispositivo físico pequeño de la familia Snow para transportar datos a AWS (de 8 TB a 14 TB).',
        confusedWith: ['snowball', 'datasync'],
      },
      {
        key: 'snowball',
        name: 'Snowball',
        definition:
          'Dispositivo físico de la familia Snow para mover grandes volúmenes de datos a AWS (hasta 80 TB).',
        confusedWith: ['snowcone', 'datasync'],
      },
      {
        key: 'datasync',
        name: 'DataSync',
        definition:
          'Servicio que transfiere datos por la red entre tus servidores y servicios de AWS como S3.',
        confusedWith: ['snowball', 'dms', 'snowcone'],
      },
    ],
  },
  {
    id: 'topic-databases',
    name: 'Servicios de bases de datos',
    type: 'SERVICE',
    sortOrder: 22,
    concepts: [
      {
        key: 'rds',
        id: 'ki-guide-rds',
        name: 'RDS',
        long: 'Relational Database Service',
        definition:
          'Servicio administrado de bases de datos relacionales: tablas con relaciones que se consultan con SQL.',
        confusedWith: ['dynamodb', 'dms', 's3'],
      },
      {
        key: 'dynamodb',
        id: 'ki-guide-dynamodb',
        name: 'DynamoDB',
        definition:
          'Servicio administrado de bases de datos no relacionales (NoSQL) de clave-valor.',
        confusedWith: ['rds', 'dms', 's3'],
      },
      {
        key: 'dms',
        name: 'DMS',
        long: 'Database Migration Service',
        definition: 'Servicio que migra bases de datos hacia AWS.',
        confusedWith: ['datasync', 'rds', 'dynamodb'],
      },
    ],
  },
  {
    id: 'topic-networking',
    name: 'Servicios de redes y entrega',
    type: 'SERVICE',
    sortOrder: 24,
    concepts: [
      {
        key: 'vpc',
        id: 'ki-guide-vpc',
        name: 'VPC',
        long: 'Virtual Private Cloud',
        definition:
          'Red virtual privada y lógicamente aislada dentro de una región, que puede abarcar varias zonas de disponibilidad.',
        confusedWith: ['subnet', 'route-table', 'igw'],
        note: 'Equivale al centro de datos de la infraestructura tradicional; su bloque CIDR va de /16 (65 536 IP) a /28 (16 IP).',
      },
      {
        key: 'cloudfront',
        id: 'ki-guide-cloudfront',
        name: 'CloudFront',
        definition:
          'Red de entrega de contenido (CDN) que guarda copias del contenido en ubicaciones de borde, cerca de los usuarios.',
        confusedWith: ['route53', 'edge-location'],
      },
      {
        key: 'route53',
        id: 'ki-guide-route53',
        name: 'Route 53',
        definition:
          'Servicio de DNS de AWS: traduce nombres de dominio a direcciones IP y dirige el tráfico.',
        confusedWith: ['cloudfront', 'dns'],
      },
      {
        key: 'public-subnet',
        name: 'Public subnet',
        definition:
          'Subred cuya tabla de rutas envía el tráfico de internet al Internet Gateway.',
        confusedWith: ['private-subnet', 'igw'],
        note: 'El nombre va en inglés.',
      },
      {
        key: 'private-subnet',
        name: 'Private subnet',
        definition:
          'Subred sin ruta hacia un Internet Gateway, así que no tiene salida directa a internet.',
        confusedWith: ['public-subnet', 'nat-gateway'],
        note: 'El nombre va en inglés. Ahí se colocan, por ejemplo, las bases de datos.',
      },
      {
        key: 'igw',
        name: 'Internet Gateway',
        definition:
          'Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.',
        confusedWith: ['nat-gateway', 'route-table'],
        note: 'Se abrevia IGW.',
      },
      {
        key: 'nat-gateway',
        name: 'NAT Gateway',
        definition:
          'Permite que los recursos de una subred privada salgan a internet (por ejemplo, para actualizarse) sin aceptar conexiones entrantes.',
        confusedWith: ['igw', 'route-table'],
        note: 'Equivale al servidor NAT de la infraestructura tradicional.',
      },
      {
        key: 'route-table',
        name: 'Tabla de rutas',
        definition:
          'Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.',
        confusedWith: ['igw', 'nacl'],
        note: 'En inglés, route table.',
      },
      {
        key: 'security-group',
        name: 'Security Group',
        definition:
          'Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.',
        confusedWith: ['nacl', 'waf'],
        note: 'Por defecto bloquea todo lo entrante y permite todo lo saliente.',
      },
      {
        key: 'nacl',
        name: 'Network ACL',
        definition:
          'Firewall a nivel de subred y sin estado: admite reglas de permiso y de denegación, evaluadas en orden de menor a mayor número.',
        confusedWith: ['security-group', 'route-table'],
        note: 'Por defecto permite todo el tráfico; el de entrada y el de salida se configuran por separado.',
      },
      {
        key: 'reserved-ips',
        name: 'IP reservadas de subred',
        definition:
          'Las 5 direcciones de cada subred que AWS no deja usar: red (.0), enrutador (.1), DNS (.2), uso futuro (.3) y difusión (la última).',
        confusedWith: ['cidr', 'broadcast'],
      },
      {
        key: 'iot-core',
        name: 'IoT Core',
        definition:
          'Servicio para conectar y administrar millones de dispositivos del internet de las cosas.',
        confusedWith: ['workspaces'],
      },
      {
        key: 'workspaces',
        name: 'WorkSpaces',
        definition: 'Servicio de escritorios virtuales en la nube.',
        confusedWith: ['iot-core', 'ec2'],
      },
    ],
  },
  {
    id: 'topic-security',
    name: 'Servicios de seguridad',
    type: 'SERVICE',
    sortOrder: 26,
    concepts: [
      {
        key: 'iam',
        id: 'ki-guide-iam',
        name: 'IAM',
        long: 'Identity and Access Management',
        definition:
          'Servicio global que controla quién puede entrar a tu cuenta (autenticación) y qué puede hacer (autorización).',
        confusedWith: ['organizations', 'kms', 'cloudtrail'],
      },
      {
        key: 'root-user',
        name: 'Root user',
        definition:
          'Dueño de la cuenta, con permisos ilimitados; se protege con MFA, no se le crean access keys y solo se usa para tareas administrativas.',
        note: 'El nombre va en inglés.',
        confusedWith: ['iam-user', 'iam-role', 'iam-group'],
      },
      {
        key: 'iam-user',
        name: 'Usuario IAM',
        definition:
          'Identidad de una persona o servicio que solo hace lo que sus permisos le permiten.',
        confusedWith: ['root-user', 'iam-role', 'iam-group'],
      },
      {
        key: 'iam-group',
        name: 'Grupo IAM',
        definition:
          'Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.',
        confusedWith: ['iam-role', 'iam-user', 'iam-policy'],
      },
      {
        key: 'iam-role',
        name: 'Rol IAM',
        definition:
          'Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.',
        confusedWith: ['iam-user', 'iam-group', 'root-user'],
      },
      {
        key: 'iam-policy',
        name: 'Política IAM',
        definition:
          'Documento JSON con reglas (Version, Statement, Effect, Action, Resource, Condition) que permiten o niegan acciones.',
        confusedWith: ['scp', 'iam-role', 'iam-group'],
        note: 'La Version es "2012-10-17" y Resource se indica con un ARN.',
      },
      {
        key: 'policy-evaluation',
        name: 'Lógica de evaluación',
        definition:
          'Cómo decide IAM: todo está negado por defecto, un Allow explícito lo permite y un Deny explícito siempre gana.',
        confusedWith: ['least-privilege', 'iam-policy'],
      },
      {
        key: 'identity-policy',
        name: 'Política basada en identidad',
        definition:
          'Política que se adjunta a un usuario, grupo o rol y define qué puede hacer esa identidad.',
        confusedWith: ['resource-policy', 'scp'],
      },
      {
        key: 'resource-policy',
        name: 'Política basada en recursos',
        definition:
          'Política que se adjunta a un recurso, como un bucket, y define quién puede acceder a él.',
        confusedWith: ['identity-policy', 'scp'],
      },
      {
        key: 'access-keys',
        name: 'Access keys',
        definition:
          'Par Access Key ID y Secret Access Key que autentica a un usuario en la CLI o en los SDK.',
        confusedWith: ['console-password', 'iam-role'],
        note: 'El nombre va en inglés. Al root user no se le crean.',
      },
      {
        key: 'console-password',
        name: 'Contraseña de consola',
        definition:
          'Usuario y contraseña para entrar a la Consola de administración web.',
        confusedWith: ['access-keys', 'mfa'],
      },
      {
        key: 'kms',
        id: 'ki-guide-kms',
        name: 'KMS',
        long: 'Key Management Service',
        definition:
          'Servicio para crear y controlar las claves de cifrado de tus datos.',
        confusedWith: ['cloudhsm', 'secrets-manager', 'acm'],
      },
      {
        key: 'secrets-manager',
        name: 'Secrets Manager',
        definition:
          'Servicio para guardar, rotar y recuperar credenciales, como contraseñas de bases de datos.',
        confusedWith: ['kms', 'parameter-store'],
      },
      {
        key: 'acm',
        name: 'ACM',
        long: 'AWS Certificate Manager',
        definition: 'Servicio que emite y administra certificados SSL/TLS.',
        confusedWith: ['cloudhsm', 'kms'],
      },
      {
        key: 'cloudhsm',
        name: 'CloudHSM',
        definition:
          'Módulo de seguridad de hardware (HSM) dedicado en la nube para generar y guardar tus claves.',
        confusedWith: ['kms', 'acm'],
      },
      {
        key: 'shield',
        id: 'ki-guide-shield',
        name: 'Shield',
        definition:
          'Servicio de protección contra ataques DDoS; Standard viene incluido y Advanced agrega protección avanzada.',
        confusedWith: ['waf', 'guardduty'],
      },
      {
        key: 'waf',
        id: 'ki-guide-waf',
        name: 'WAF',
        long: 'Web Application Firewall',
        definition:
          'Firewall que filtra el tráfico HTTP/HTTPS de tus aplicaciones web y bloquea ataques como inyección SQL y XSS.',
        confusedWith: ['shield', 'security-group'],
      },
      {
        key: 'guardduty',
        id: 'ki-guide-guardduty',
        name: 'GuardDuty',
        definition:
          'Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.',
        confusedWith: ['inspector', 'securityhub'],
      },
      {
        key: 'inspector',
        id: 'ki-guide-inspector',
        name: 'Inspector',
        definition:
          'Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.',
        confusedWith: ['guardduty', 'trustedadvisor'],
      },
      {
        key: 'securityhub',
        id: 'ki-guide-securityhub',
        name: 'Security Hub',
        definition:
          'Panel central que reúne los hallazgos de seguridad de servicios como GuardDuty e Inspector.',
        confusedWith: ['guardduty', 'inspector'],
      },
    ],
  },
  {
    id: 'topic-management',
    name: 'Servicios de gestión y monitoreo',
    type: 'SERVICE',
    sortOrder: 28,
    concepts: [
      {
        key: 'cloudwatch',
        id: 'ki-guide-cloudwatch',
        name: 'CloudWatch',
        definition:
          'Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.',
        confusedWith: ['cloudtrail', 'sns'],
      },
      {
        key: 'cloudtrail',
        id: 'ki-guide-cloudtrail',
        name: 'CloudTrail',
        definition:
          'Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.',
        confusedWith: ['cloudwatch', 'artifact'],
      },
      {
        key: 'sns',
        id: 'ki-guide-sns',
        name: 'SNS',
        long: 'Simple Notification Service',
        definition:
          'Servicio de mensajería que envía notificaciones, como las alarmas de CloudWatch.',
        confusedWith: ['cloudwatch', 'cloudtrail'],
      },
      {
        key: 'artifact',
        id: 'ki-guide-artifact',
        name: 'Artifact',
        definition:
          'Portal donde descargas los informes de auditoría y cumplimiento de AWS, como los SOC o PCI.',
        confusedWith: ['trustedadvisor', 'cloudtrail'],
      },
      {
        key: 'cli',
        id: 'ki-guide-cli',
        name: 'AWS CLI',
        long: 'Command Line Interface',
        definition:
          'Herramienta para administrar los servicios de AWS con comandos desde la terminal.',
        confusedWith: ['console', 'sdk'],
      },
      {
        key: 'console',
        name: 'Management Console',
        definition:
          'Portal web para administrar los servicios de AWS con clics.',
        confusedWith: ['cli', 'sdk'],
        note: 'El nombre va en inglés.',
      },
      {
        key: 'sdk',
        name: 'SDK',
        long: 'Software Development Kit',
        definition:
          'Librerías para usar los servicios de AWS desde el código de una aplicación (.NET, Ruby, Go y otros lenguajes).',
        confusedWith: ['cli', 'console'],
      },
      {
        key: 'organizations',
        id: 'ki-guide-organizations',
        name: 'Organizations',
        definition:
          'Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.',
        confusedWith: ['scp', 'iam'],
      },
      {
        key: 'scp',
        name: 'SCP',
        long: 'Service Control Policy',
        definition:
          'Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.',
        confusedWith: ['iam-policy', 'identity-policy'],
      },
      {
        key: 'trustedadvisor',
        id: 'ki-guide-trustedadvisor',
        name: 'Trusted Advisor',
        definition:
          'Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.',
        confusedWith: ['cost-explorer', 'inspector'],
      },
      {
        key: 'cost-explorer',
        name: 'Cost Explorer',
        definition:
          'Herramienta para ver y analizar tus costos de AWS a lo largo del tiempo.',
        confusedWith: ['budgets', 'pricing-calculator'],
      },
      {
        key: 'budgets',
        name: 'Budgets',
        definition:
          'Servicio para definir presupuestos y recibir alertas cuando el gasto se acerca al límite o lo supera.',
        confusedWith: ['cost-explorer', 'pricing-calculator'],
      },
      {
        key: 'pricing-calculator',
        name: 'Pricing Calculator',
        definition:
          'Herramienta pública y gratuita para estimar cuánto costará una arquitectura antes de crearla.',
        confusedWith: ['budgets', 'cost-explorer'],
      },
      {
        key: 'systems-manager',
        name: 'Systems Manager',
        definition:
          'Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.',
        confusedWith: ['cloudformation', 'trustedadvisor'],
        note: 'Se abrevia SSM.',
      },
      {
        key: 'parameter-store',
        name: 'Parameter Store',
        definition:
          'Función de Systems Manager que guarda configuraciones y secretos, cifrados con KMS.',
        confusedWith: ['secrets-manager', 'session-manager'],
      },
      {
        key: 'session-manager',
        name: 'Session Manager',
        definition:
          'Función de Systems Manager que abre una terminal en tus instancias sin abrir el puerto SSH ni manejar llaves.',
        confusedWith: ['ssh', 'parameter-store'],
      },
      {
        key: 'cloudformation',
        name: 'CloudFormation',
        definition:
          'Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.',
        confusedWith: ['opsworks', 'systems-manager'],
      },
      {
        key: 'opsworks',
        name: 'OpsWorks',
        definition:
          'Servicio que automatiza la configuración de los servidores.',
        confusedWith: ['cloudformation', 'systems-manager'],
      },
    ],
  },
];
