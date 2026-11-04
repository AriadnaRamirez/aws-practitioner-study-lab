import type { SeedFact } from './content.seed-extra';

/**
 * Scenario questions for Estudio and Examen.
 * One correct answer. Facts follow the course notes and the public AWS docs
 * (support plans checked against the plan comparison, November 2026).
 */
export const CCP_PRACTICE_FACTS: SeedFact[] = [
  {
    topicId: 'topic-compute',
    key: 'ccp-ec2-guest-os',
    stem: 'Quieres una base de datos en AWS y vas a administrar tú el sistema operativo de esa máquina, incluidos parches y actualizaciones. ¿Qué servicio usas?',
    correct: 'Amazon EC2, e instalas la base tú',
    wrong: ['Amazon DynamoDB', 'Amazon Aurora', 'Amazon DocumentDB'],
    explanation:
      'En EC2 la máquina es tuya: el sistema operativo invitado, los parches y la base que instales. DynamoDB, Aurora y DocumentDB son administrados: AWS se encarga de ese sistema operativo.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-host-os',
    stem: 'En el shared responsibility model (en inglés), ¿quién parchea el sistema operativo del host de una instancia EC2, el que está debajo de tu máquina virtual?',
    correct: 'AWS',
    wrong: ['El cliente', 'AWS y el cliente, a medias', 'Ni AWS ni el cliente'],
    explanation:
      'AWS parchea el host: el hardware y la virtualización, la seguridad de la nube. El sistema operativo invitado, el que ves dentro de la instancia, lo parcheas tú.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-guest-os',
    stem: 'Tienes una instancia EC2 con Linux. Hay un parche de seguridad para ese Linux. ¿Quién lo aplica?',
    correct: 'Tú, porque es el sistema operativo invitado',
    wrong: [
      'AWS, porque toda instancia se parchea sola',
      'AWS, porque es el sistema operativo del host',
      'Nadie: EC2 no recibe parches',
    ],
    explanation:
      'El Linux que instalaste es el sistema invitado: seguridad en la nube, y te toca a ti. AWS parchea el host, no el sistema que corre dentro de tu instancia.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-artifact',
    stem: 'Para una auditoría te piden los informes de AWS: ISO, PCI y los SOC. ¿Dónde los descargas?',
    correct: 'AWS Artifact',
    wrong: [
      'AWS Certificate Manager',
      'AWS Security Token Service',
      'AWS Trusted Advisor',
    ],
    explanation:
      'Artifact es el portal de los informes de cumplimiento de AWS, como ISO, PCI y SOC. Certificate Manager emite certificados TLS. STS da credenciales temporales. Trusted Advisor recomienda mejoras; no entrega esos informes.',
  },
  {
    topicId: 'topic-networking',
    key: 'ccp-nlb',
    stem: 'Necesitas repartir tráfico TCP, UDP y TLS, con millones de peticiones por segundo y latencia muy baja. ¿Qué balanceador usas?',
    correct: 'Network Load Balancer',
    wrong: [
      'Application Load Balancer',
      'Gateway Load Balancer',
      'Amazon CloudFront',
    ],
    explanation:
      'El Network Load Balancer trabaja en la capa de transporte (TCP, UDP y TLS) y está hecho para mucho volumen con latencia muy baja. El Application Load Balancer mira HTTP y HTTPS. El Gateway Load Balancer reparte hacia appliances virtuales, como un firewall. CloudFront acerca contenido; no balancea así tu tráfico interno.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-regional',
    stem: '¿Cuál de estos pares son servicios regionales, es decir, los creas dentro de la Región que eliges?',
    correct: 'Amazon EC2 y Amazon EFS',
    wrong: [
      'AWS IAM y Amazon CloudFront',
      'Amazon Route 53 y Amazon CloudFront',
      'AWS IAM y Amazon Route 53',
    ],
    explanation:
      'EC2 y EFS viven en una Región. IAM vale para toda la cuenta. Route 53 y CloudFront usan la red global: DNS y puntos de presencia, no una sola Región.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-proserve',
    stem: 'Quieres contratar a AWS, de pago y por proyecto, para que un equipo especializado te ayude a adoptar la nube con un resultado de negocio concreto. ¿Qué canal es?',
    correct: 'AWS Professional Services',
    wrong: [
      'El soporte Concierge',
      'El plan Enterprise Support',
      'El Technical Account Manager',
    ],
    explanation:
      'Professional Services son proyectos de pago, en áreas de especialidad, para un resultado de adopción. El plan Enterprise es soporte. El TAM es la persona de contacto de ese plan. Concierge ayuda con la facturación dentro de Enterprise, no es un proyecto de adopción.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-capex-advantage',
    stem: '¿Cuál de estas es una ventaja de la computación en la nube?',
    correct: 'Cambiar gasto de capital por gasto variable',
    wrong: [
      'Cambiar gasto variable por gasto de capital',
      'Pagar menos en la tienda en línea de Amazon',
      'Tener economías de escala menores que un centro de datos propio',
    ],
    explanation:
      'Dejas de comprar servidores por adelantado y pagas por lo que usas. La nube suma la demanda de muchos clientes, así que la escala es mayor, no menor. La tienda de Amazon no descuenta tu factura de AWS.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-agility',
    stem: 'Una empresa tarda meses en comprar servidores antes de probar una idea. En AWS los lanza en minutos. ¿Qué ventaja es?',
    correct: 'Más velocidad y agilidad',
    wrong: [
      'Menos elasticidad',
      'Obligación de seguir comprando hardware',
      'Descuentos de la tienda Amazon.com',
    ],
    explanation:
      'Agilidad es pasar de la idea al recurso en minutos, sin esperar una compra. Elasticidad es otra ventaja: subes o bajas capacidad. No tiene que ver con la tienda de Amazon.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-economies',
    stem: 'Una empresa va a usar AWS para ampliar su centro de datos propio y atender clientes en varios países. ¿Qué beneficio obtiene de AWS?',
    correct: 'Economías de escala muy grandes',
    wrong: [
      'Cambiar un costo variable bajo por una inversión grande por adelantado',
      'Descuentos masivos en la tienda Amazon.com',
      'Cambiar un costo variable alto por comprar la infraestructura por adelantado',
    ],
    explanation:
      'AWS compra y opera a una escala que una empresa sola no alcanza, y ese costo menor se refleja en el precio. El movimiento es al revés del que dicen las otras opciones: de gasto de capital a gasto por uso.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-caf-people',
    stem: 'Una fábrica quiere reorganizar equipos para trabajar por producto, colaborar y alinearse con la estrategia. Según el Cloud Adoption Framework, ¿qué perspectiva cubre ese cambio de personas y de forma de trabajar?',
    correct: 'Perspectiva People',
    wrong: [
      'Perspectiva Platform',
      'Perspectiva Security',
      'Perspectiva Operations',
    ],
    explanation:
      'People es la perspectiva de negocio del CAF sobre el talento: cómo se organizan las personas y cómo trabajan. Platform son los planos técnicos. Security es identidad y protección. Operations es cómo se opera el día a día.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-caf-platform',
    stem: 'El mismo cambio incluye migrar y modernizar la infraestructura vieja, y armar la plataforma de datos. ¿Qué perspectiva del CAF es esa?',
    correct: 'Perspectiva Platform',
    wrong: [
      'Perspectiva People',
      'Perspectiva Business',
      'Perspectiva Governance',
    ],
    explanation:
      'Platform es la perspectiva técnica: la arquitectura, la migración y la plataforma. People cambia equipos y cultura. Business mira ingresos, costos y mercados. Governance mira que se cumplan las normas.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-caf-business',
    stem: 'La dirección quiere que la nube abra productos nuevos y otra forma de ingresar dinero. ¿Qué perspectiva del CAF es esa?',
    correct: 'Perspectiva Business',
    wrong: [
      'Perspectiva Platform',
      'Perspectiva Security',
      'Perspectiva Operations',
    ],
    explanation:
      'Business pide que la tecnología suba ingresos, baje costos o abra mercados. No diseña la plataforma ni opera los sistemas.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-elasticache',
    stem: 'Las consultas SQL de lectura se repiten y la base no da abasto. Quieres guardar esos resultados en memoria para que la aplicación responda más rápido. ¿Qué servicio usas?',
    correct: 'Amazon ElastiCache',
    wrong: [
      'Amazon DynamoDB Accelerator (DAX)',
      'Amazon CloudFront',
      'AWS IoT Greengrass',
    ],
    explanation:
      'ElastiCache es la caché en memoria (Redis o Memcached) delante de una base, incluidas las consultas SQL. DAX es solo la caché de DynamoDB. CloudFront acerca contenido web al usuario. Greengrass corre lógica en dispositivos, no cachea consultas.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-spot',
    stem: 'Quieres usar capacidad de EC2 que AWS no está usando en ese momento, y aceptar que te la puedan quitar, a cambio de un descuento grande frente a On-Demand. ¿Qué opción de compra es? El nombre va en inglés.',
    correct: 'Spot',
    wrong: [
      'Standard Reserved Instance',
      'Convertible Reserved Instance',
      'Dedicated Host',
    ],
    explanation:
      'Spot usa capacidad sobrante. En la guía del curso el descuento llega hasta el 90 % frente a On-Demand, y AWS puede recuperarla con aviso de 2 minutos. Reserved es un compromiso de 1 o 3 años. Dedicated Host es un servidor físico para ti, no un descuento por capacidad sobrante.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-business-plus',
    stem: 'Tienes el plan Business Support+. El sistema de producción se cayó y el negocio está muy afectado. ¿En cuánto busca responder AWS a ese primer contacto?',
    correct: 'En menos de 1 hora',
    wrong: [
      'En menos de 15 minutos',
      'En menos de 30 minutos',
      'En menos de 4 horas',
    ],
    explanation:
      'En Business Support+ y en Enterprise, «sistema de producción caído» tiene como meta menos de 1 hora para la primera respuesta. Menos de 30 minutos, en Business Support+, es «sistema crítico de negocio caído». Menos de 15 minutos es ese caso crítico en Enterprise. Menos de 4 horas es «sistema de producción degradado», no caído. Son metas de primer contacto, no de resolución.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-aurora',
    stem: 'Necesitas una base MySQL para transacciones del día a día (OLTP), compatible con MySQL y capaz de crecer mucho. ¿Qué servicio encaja?',
    correct: 'Amazon Aurora',
    wrong: ['Amazon Redshift', 'Amazon DynamoDB', 'Amazon Timestream'],
    explanation:
      'Aurora es relacional y compatible con MySQL y PostgreSQL, para la carga transaccional. Redshift es un almacén para análisis, no el OLTP del día a día. DynamoDB es NoSQL de clave-valor. Timestream es para series de tiempo.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-rds-engine',
    stem: 'La base está en Amazon RDS. Hay que parchear el motor de la base, no el sistema de una instancia que administras tú. ¿Quién hace ese parche del motor?',
    correct: 'AWS, dentro de la ventana que configures',
    wrong: [
      'Tú, igual que en una base instalada sobre EC2',
      'Nadie: RDS no se parchea',
      'El cliente, porque el motor es siempre suyo',
    ],
    explanation:
      'RDS es administrado: AWS parchea el motor. Tú sigues con los datos, los accesos, el esquema y las consultas. En EC2, si instalaste la base tú, el motor también es tuyo.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-shield-waf',
    stem: 'El sitio aguanta una avalancha de tráfico hecha para tumbarlo. No te piden filtrar el texto de cada petición. ¿Qué servicio cubre ese ataque de volumen?',
    correct: 'AWS Shield',
    wrong: ['AWS WAF', 'Amazon Inspector', 'AWS Artifact'],
    explanation:
      'Shield protege contra denegación de servicio. WAF bloquea peticiones HTTP por su contenido, como una inyección SQL. Inspector busca vulnerabilidades en lo que desplegaste. Artifact guarda informes de cumplimiento.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-cloudtrail-who',
    stem: 'Alguien borró un bucket ayer. Quieres el usuario, la hora y la llamada a la API. ¿Qué servicio guarda eso?',
    correct: 'AWS CloudTrail',
    wrong: ['Amazon CloudWatch', 'AWS Config', 'AWS Trusted Advisor'],
    explanation:
      'CloudTrail es el registro de auditoría: quién llamó a la API. CloudWatch mide y alarma. Config dice si el recurso sigue cumpliendo una regla. Trusted Advisor recomienda mejoras.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-organizations',
    stem: 'La empresa tiene varias cuentas de AWS y quiere una sola factura y políticas que limiten lo que esas cuentas pueden hacer. ¿Qué usas?',
    correct: 'AWS Organizations',
    wrong: [
      'AWS IAM, con un solo usuario para todas',
      'Amazon VPC Peering',
      'AWS Artifact',
    ],
    explanation:
      'Organizations agrupa cuentas, une la facturación y aplica políticas de control. IAM decide permisos dentro de una cuenta, no junta la factura de varias. VPC Peering conecta redes. Artifact entrega informes.',
  },
  {
    topicId: 'topic-architecture',
    key: 'ccp-cloudformation',
    stem: 'Quieres describir los servidores, la red y la base en un archivo versionado, y crearlos otra vez igual, sin configurarlos a mano. ¿Qué servicio usas?',
    correct: 'AWS CloudFormation',
    wrong: ['AWS CloudTrail', 'Amazon CloudWatch', 'AWS Trusted Advisor'],
    explanation:
      'CloudFormation es infrastructure as code (en inglés): una plantilla crea la pila de recursos. CloudTrail registra llamadas. CloudWatch mide. Trusted Advisor recomienda.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-sqs',
    stem: 'La web toma pedidos y otro proceso los prepara. Si ese proceso se cae, el pedido tiene que quedar guardado hasta que vuelva. ¿Qué servicio usas?',
    correct: 'Amazon SQS',
    wrong: ['Amazon SNS', 'Amazon SES', 'Amazon CloudFront'],
    explanation:
      'SQS es una cola: el mensaje espera a que un proceso lo tome. SNS avisa a varios a la vez y no guarda el trabajo para después. SES envía correo de tu aplicación. CloudFront acerca contenido.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-reserved',
    stem: 'La base corre todos los días, con el mismo tamaño, y así seguirá los próximos tres años. Quieres pagar menos que On-Demand a cambio de ese compromiso. ¿Qué opción de EC2 encaja? El nombre va en inglés.',
    correct: 'Reserved Instance',
    wrong: [
      'Spot',
      'On-Demand, porque el uso estable sale más barato así',
      'Dedicated Host, porque siempre es la opción más barata',
    ],
    explanation:
      'Reserved es el compromiso de 1 o 3 años para un uso estable. En la guía del curso el ahorro llega hasta el 72 % frente a On-Demand. Spot puede interrumpirse: no sirve para una base que no puede parar. Dedicated Host es un servidor físico aparte, no el descuento por uso predecible.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-iam-least',
    stem: 'Una persona nueva solo tiene que leer un bucket. No debe borrar objetos ni entrar a otras cuentas de servicio. ¿Qué principio aplicas en IAM? El nombre va en inglés.',
    correct: 'Least privilege: solo el permiso que necesita',
    wrong: [
      'Dar el root user y cambiar la contraseña después',
      'Una política que permita todo, y restringir más adelante',
      'Compartir las access keys del administrador',
    ],
    explanation:
      'Least privilege da solo lo necesario para la tarea. El root user y las claves compartidas abren de más. Una política que permite todo no es un permiso de lectura.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-lambda-event',
    stem: 'Cuando un archivo llega a un bucket quieres ejecutar un código corto y no dejar un servidor encendido esperando. ¿Qué servicio usas?',
    correct: 'AWS Lambda',
    wrong: [
      'Una instancia EC2 encendida todo el día',
      'Amazon EFS',
      'AWS Artifact',
    ],
    explanation:
      'Lambda corre el código cuando ocurre el evento y no administras un servidor. EC2 sería esa máquina encendida. EFS es un sistema de archivos compartido. Artifact guarda informes de cumplimiento.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-s3-backup',
    stem: 'Quieres guardar respaldos y los archivos de un sitio estático, como objetos, y leerlos cuando haga falta. ¿Qué servicio usas?',
    correct: 'Amazon S3',
    wrong: ['Amazon EBS', 'Amazon EFS', 'Amazon RDS'],
    explanation:
      'S3 guarda objetos en buckets: respaldos, archivos y el sitio estático. EBS es el disco de una instancia. EFS es un sistema de archivos que varias instancias Linux montan. RDS es una base relacional, no un almacén de archivos.',
  },
  {
    topicId: 'topic-cloud-fundamentals',
    key: 'ccp-multi-az',
    stem: 'Si un centro de datos de la Región falla, la aplicación tiene que seguir en otro centro de la misma Región. ¿Qué diseño lo consigue?',
    correct: 'Repartirla en varias zonas de disponibilidad',
    wrong: [
      'Dejarla en una sola instancia, en una sola zona',
      'Moverla a una edge location',
      'Apagar las copias de seguridad para que responda más rápido',
    ],
    explanation:
      'Una Availability Zone (en inglés) es uno o más centros de datos aislados dentro de la Region. Varias aguantan la caída de una. Una edge location acerca contenido; no sustituye ese diseño. Quitar las copias no da alta disponibilidad.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-case-ebs',
    stem: 'Tu tienda corre en una instancia EC2. El disco de esa máquina tiene que seguir ahí si la apagas, y solo esa instancia lo usa. ¿Qué almacenamiento pides?',
    correct: 'Amazon EBS, un disco para esa instancia',
    wrong: [
      'Amazon S3, como disco de la instancia',
      'Amazon EFS, aunque solo la use una máquina',
      'Amazon S3 Glacier, para leerlo en cada pedido',
    ],
    explanation:
      'EBS es el disco de una instancia: lo conserva si la detienes y no lo comparten otras. S3 guarda objetos, no es el disco del sistema. EFS lo montan varias instancias a la vez. Glacier es para archivos que casi no abres.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-case-efs',
    stem: 'Tres instancias Linux de la misma aplicación tienen que leer y escribir los mismos archivos al mismo tiempo. ¿Dónde los pones?',
    correct: 'Amazon EFS',
    wrong: [
      'Un disco EBS enganchado a las tres',
      'El disco local de una sola instancia',
      'Amazon RDS',
    ],
    explanation:
      'EFS es un sistema de archivos que varias instancias Linux montan a la vez. Un disco EBS se engancha a una instancia en una zona. El disco local se pierde con esa máquina. RDS guarda tablas, no esos archivos.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-case-s3-ia',
    stem: 'Guardas las facturas del año. Las abren una vez al mes, pero cuando las piden tienen que verse al momento. Quieres pagar menos que por archivos de uso diario. ¿Qué clase de S3 encaja?',
    correct: 'S3 Standard-Infrequent Access',
    wrong: [
      'S3 Standard, la de uso diario',
      'S3 Glacier, aunque tarde horas en entregarla',
      'Amazon EBS',
    ],
    explanation:
      'Standard-IA es para datos que se leen poco y aun así se entregan al momento, más barata de guardar que Standard. Glacier es más barata, pero la recuperación puede tardar. EBS es el disco de una instancia, no el archivo de facturas.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-case-glacier',
    stem: 'Un despacho guarda expedientes que la ley pide conservar años. Casi nadie los abre, y si los piden pueden esperar horas. Quieres el almacenamiento más barato. ¿Cuál usas?',
    correct: 'Amazon S3 Glacier',
    wrong: ['S3 Standard', 'Amazon EFS', 'Amazon EBS'],
    explanation:
      'Glacier es para archivos que casi no se consultan y pueden tardar en recuperarse. Standard y EFS cobran como si los usaras seguido. EBS es un disco enganchado a una instancia.',
  },
  {
    topicId: 'topic-storage',
    key: 'ccp-case-gateway',
    stem: 'La oficina sigue guardando archivos en sus servidores. Quieres que los respaldos terminen en S3 sin cambiar el programa que ya usan para copiar archivos. ¿Qué usas?',
    correct: 'AWS Storage Gateway',
    wrong: [
      'AWS Database Migration Service',
      'Amazon CloudFront',
      'AWS Direct Connect, por sí solo',
    ],
    explanation:
      'Storage Gateway presenta el almacenamiento de AWS como si fuera un disco o una carpeta local, y manda los datos a S3. DMS copia bases de datos, no carpetas de archivos. CloudFront entrega contenido a los usuarios. Direct Connect es el enlace de red, no el respaldo.',
  },
  {
    topicId: 'topic-networking',
    key: 'ccp-case-cloudfront',
    stem: 'La tienda está en una Región de Estados Unidos. Quienes compran desde México y España tardan en ver las fotos. Quieres guardar esas fotos cerca de ellos. ¿Qué usas?',
    correct: 'Amazon CloudFront',
    wrong: [
      'Una segunda instancia en la misma Availability Zone',
      'AWS Direct Connect',
      'Un NAT Gateway',
    ],
    explanation:
      'CloudFront copia el contenido en puntos de presencia cerca de quien lo pide. Otra instancia en la misma zona no acerca nada a otro país. Direct Connect une tu oficina con AWS. El NAT deja salir a internet a una subred privada.',
  },
  {
    topicId: 'topic-networking',
    key: 'ccp-case-route53',
    stem: 'Ya tienes la tienda en marcha. Quieres que www.tienda.com lleve a esa aplicación. ¿Qué servicio resuelve ese nombre?',
    correct: 'Amazon Route 53',
    wrong: ['Amazon CloudFront', 'AWS IAM', 'Amazon VPC'],
    explanation:
      'Route 53 es el DNS de AWS: traduce el nombre a la dirección de tu aplicación. CloudFront entrega el contenido, pero no es el registro del dominio. IAM da permisos. La VPC es tu red privada.',
  },
  {
    topicId: 'topic-networking',
    key: 'ccp-case-nat',
    stem: 'La instancia de la base de la aplicación está en una subred privada. Tiene que bajar actualizaciones de internet, pero nadie desde internet debe poder conectarse a ella. ¿Qué le pones?',
    correct: 'Un NAT Gateway en una public subnet',
    wrong: [
      'Una IP pública en esa misma instancia',
      'Un Internet Gateway directo a la private subnet',
      'Amazon CloudFront delante de la base',
    ],
    explanation:
      'El NAT deja salir el tráfico de la subred privada y no deja entrar conexiones nuevas desde internet. Una IP pública o un Internet Gateway en esa subred la dejan alcanzable. CloudFront es para contenido de cara al público.',
  },
  {
    topicId: 'topic-networking',
    key: 'ccp-case-vpn',
    stem: 'La oficina sigue con sus propios servidores. Quieres un túnel cifrado por internet hasta tu VPC, sin contratar un enlace dedicado. ¿Qué usas?',
    correct: 'AWS Site-to-Site VPN',
    wrong: ['AWS Direct Connect', 'VPC peering', 'Amazon CloudFront'],
    explanation:
      'Site-to-Site VPN cifra el tráfico entre tu red y la VPC usando internet. Direct Connect es un enlace privado y dedicado, no un túnel por internet. El peering une dos VPC, no tu oficina. CloudFront entrega contenido a usuarios.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-case-dynamodb',
    stem: 'El carrito busca cada producto por su clave, millones de veces, y tiene que responder en milisegundos. No hay joins y no quieres administrar un servidor de base. ¿Qué usas?',
    correct: 'Amazon DynamoDB',
    wrong: ['Amazon RDS', 'Amazon Redshift', 'Amazon Neptune'],
    explanation:
      'DynamoDB es una base de clave-valor, sin servidor, hecha para muchas lecturas por clave. RDS es relacional y la administras como motor. Redshift es para análisis de mucho historial. Neptune es para datos en grafo, como relaciones entre personas.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-case-redshift',
    stem: 'Finanzas quiere cruzar años de ventas para armar reportes. No es la base que cobra el pedido de hoy. ¿Qué servicio encaja?',
    correct: 'Amazon Redshift',
    wrong: [
      'Amazon RDS, como almacén de reportes históricos',
      'Amazon ElastiCache',
      'Amazon DynamoDB',
    ],
    explanation:
      'Redshift es el almacén de datos para consultas grandes de análisis. RDS atiende las transacciones del día. ElastiCache guarda en memoria lo que se repite. DynamoDB no está pensada para esos reportes con muchas columnas.',
  },
  {
    topicId: 'topic-databases',
    key: 'ccp-case-dms',
    stem: 'La base de la tienda sigue en el centro de datos y quieres pasarla a Amazon RDS mientras la tienda sigue vendiendo, con el corte más corto posible. ¿Qué usas?',
    correct: 'AWS Database Migration Service',
    wrong: [
      'AWS Application Migration Service',
      'Amazon S3 Glacier',
      'AWS CloudFormation',
    ],
    explanation:
      'DMS copia la base y puede seguir replicando los cambios hasta el momento del corte. Application Migration Service mueve servidores enteros, no la base en vivo. Glacier archiva archivos. CloudFormation crea infraestructura, no migra los datos.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-case-mgn',
    stem: 'Quieres mudar los servidores de la oficina a AWS tal como están, sin reescribir la aplicación. ¿Qué servicio hace ese traslado?',
    correct: 'AWS Application Migration Service',
    wrong: [
      'AWS Lambda, reescribiendo cada programa',
      'AWS Database Migration Service',
      'Amazon CloudFront',
    ],
    explanation:
      'Application Migration Service replica los servidores y los levanta en EC2 sin que cambies el programa. Lambda pide otro diseño, por funciones. DMS mueve bases, no el servidor completo. CloudFront solo entrega contenido.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-case-asg',
    stem: 'A mediodía el tráfico se triplica y en la noche casi desaparece. No quieres pagar todo el día los servidores del mediodía. ¿Qué configuras?',
    correct: 'Un grupo de Auto Scaling',
    wrong: [
      'Una instancia enorme encendida las 24 horas',
      'Solo instancias Spot, sin un mínimo',
      'Apagar la aplicación en las horas pico',
    ],
    explanation:
      'Auto Scaling agrega instancias cuando sube el tráfico y las quita cuando baja. Una instancia fija del tamaño del pico se paga aunque no haya nadie. Spot puede interrumpirse y, sin un mínimo, te puedes quedar sin capacidad. Apagar la tienda en la hora pico pierde ventas.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-case-beanstalk',
    stem: 'El equipo quiere subir la aplicación web y que AWS arme el balanceador, el escalado y los servidores. No quieren diseñar cada pieza a mano. ¿Qué usas?',
    correct: 'AWS Elastic Beanstalk',
    wrong: [
      'Armar a mano la VPC, el balanceador y cada instancia',
      'AWS Artifact',
      'Amazon S3 Glacier',
    ],
    explanation:
      'Elastic Beanstalk recibe tu aplicación y crea por ti el entorno: capacidad, balanceo y escalado. Hacerlo pieza por pieza sirve, pero es justo lo que este equipo no quiere. Artifact entrega informes de cumplimiento. Glacier guarda archivos.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-case-fargate',
    stem: 'La aplicación ya está en contenedores. Quieres correrlos y no encargarte de las instancias donde viven. ¿Qué opción encaja?',
    correct: 'AWS Fargate',
    wrong: [
      'EC2, y tú administras cada servidor del clúster',
      'Amazon S3',
      'AWS Artifact',
    ],
    explanation:
      'Fargate corre los contenedores sin que tú administres los servidores. En EC2 el clúster es tuyo: parches, capacidad y el sistema. S3 guarda objetos. Artifact guarda informes.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-role',
    stem: 'La aplicación en la instancia llama a un bucket. No quieres dejar una clave de acceso escrita en el código ni en la imagen. ¿Cómo le das permiso?',
    correct: 'Un rol de IAM asociado a la instancia',
    wrong: [
      'La clave del root user dentro del código',
      'Una clave de acceso guardada en la imagen de la instancia',
      'Hacer el bucket público',
    ],
    explanation:
      'El rol le da a la instancia credenciales temporales para ese bucket, y no quedan escritas en el código. La clave raíz o una clave dentro de la imagen se pueden filtrar. Un bucket público lo abre a cualquiera.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-mfa',
    stem: 'La contraseña del root user se filtró en un correo. Quieres que esa contraseña, sola, ya no alcance para entrar. ¿Qué activas? El nombre va en inglés.',
    correct: 'MFA on the root user',
    wrong: [
      'Borrar CloudTrail para que no quede registro',
      'Compartir la contraseña nueva con todo el equipo',
      'Dejar el root user en las aplicaciones',
    ],
    explanation:
      'MFA pide un segundo factor, así que la contraseña filtrada no basta. Borrar CloudTrail esconde el rastro. Compartir el root user o usarlo en las aplicaciones abre más la cuenta.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-secrets',
    stem: 'La contraseña de la base está en el repositorio. Quieres guardarla cifrada, rotarla y que la aplicación la pida al arrancar. ¿Dónde la pones?',
    correct: 'AWS Secrets Manager',
    wrong: [
      'En un comentario del código',
      'En un objeto público de S3',
      'En el nombre del bucket',
    ],
    explanation:
      'Secrets Manager guarda el secreto cifrado y puede rotarlo. La aplicación lo pide cuando lo necesita. En el código, en un objeto público o en un nombre, cualquiera lo puede leer.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-guardduty',
    stem: 'Quieres que te avisen si alguien llama a la API desde un país donde nadie trabaja, o si una instancia empieza a hablar con una dirección mala. ¿Qué servicio vigila eso?',
    correct: 'Amazon GuardDuty',
    wrong: ['AWS Shield', 'AWS WAF', 'AWS Artifact'],
    explanation:
      'GuardDuty busca actividad sospechosa: llamadas raras a la API y tráfico hacia destinos malos. Shield frena ataques de volumen. WAF filtra peticiones web según reglas que tú pones. Artifact entrega informes de cumplimiento.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-config',
    stem: 'Quieres una regla que marque un grupo de seguridad en cuanto queda abierto a todo internet, y ver cómo estaba configurado la semana pasada. ¿Qué usas?',
    correct: 'AWS Config',
    wrong: [
      'AWS CloudTrail, que solo dice quién llamó a la API',
      'Amazon CloudWatch, para la CPU',
      'AWS Artifact',
    ],
    explanation:
      'Config guarda cómo está cada recurso y puede avisar si deja de cumplir una regla. CloudTrail dice quién hizo la llamada, no si el grupo sigue abierto. CloudWatch mide, por ejemplo, la CPU. Artifact entrega informes.',
  },
  {
    topicId: 'topic-security',
    key: 'ccp-case-kms',
    stem: 'Los objetos del bucket tienen que ir cifrados con llaves que tú controlas, y quieres decidir qué rol puede usarlas. ¿Qué servicio administra esas llaves?',
    correct: 'AWS KMS',
    wrong: ['Un grupo de seguridad', 'AWS Shield', 'Amazon CloudFront'],
    explanation:
      'KMS crea y controla las llaves de cifrado, y con IAM decides quién puede usarlas. Un grupo de seguridad filtra tráfico de red, no cifra objetos. Shield frena ataques de volumen. CloudFront entrega contenido.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-case-cloudwatch',
    stem: 'Quieres un aviso cuando la CPU de la instancia pase de 80% durante cinco minutos. ¿Qué servicio mide eso y dispara la alarma?',
    correct: 'Amazon CloudWatch',
    wrong: ['AWS CloudTrail', 'AWS Config', 'AWS Artifact'],
    explanation:
      'CloudWatch recoge métricas, como la CPU, y dispara alarmas. CloudTrail registra llamadas a la API. Config vigila la configuración del recurso. Artifact entrega informes de cumplimiento.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-case-budgets',
    stem: 'Quieres un correo cuando el gasto del mes vaya a pasar de un monto que tú fijas, antes de que llegue la factura. ¿Qué configuras?',
    correct: 'AWS Budgets',
    wrong: [
      'AWS Cost Explorer, que muestra el historial',
      'AWS Artifact',
      'Amazon GuardDuty',
    ],
    explanation:
      'Budgets compara el gasto real o el previsto con un monto y te avisa. Cost Explorer te ayuda a ver en qué se fue el dinero, no a fijar esa alerta. Artifact entrega informes. GuardDuty vigila amenazas.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-case-explorer',
    stem: 'Finanzas pregunta qué servicio gastó más el mes pasado. ¿Dónde lo ves?',
    correct: 'AWS Cost Explorer',
    wrong: [
      'AWS Artifact',
      'Amazon CloudWatch, en la gráfica de CPU',
      'AWS Secrets Manager',
    ],
    explanation:
      'Cost Explorer desglosa el gasto por servicio y por tiempo. Artifact entrega informes de cumplimiento, no la factura. CloudWatch mide el uso, no el costo. Secrets Manager guarda contraseñas.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-case-optimizer',
    stem: 'Una instancia lleva semanas al 5% de CPU. Quieres que AWS te diga un tamaño más chico que alcance. ¿Qué servicio lo recomienda?',
    correct: 'AWS Compute Optimizer',
    wrong: ['AWS Budgets', 'AWS Artifact', 'Amazon GuardDuty'],
    explanation:
      'Compute Optimizer mira el uso y recomienda un tamaño de instancia que encaje. Budgets vigila el monto, no el tamaño. Artifact entrega informes. GuardDuty vigila amenazas, no el tamaño de la máquina.',
  },
  {
    topicId: 'topic-management',
    key: 'ccp-case-sns',
    stem: 'Cuando se cobra un pedido, el almacén, el correo al cliente y un tablero tienen que enterarse al mismo tiempo. ¿Qué servicio avisa a los tres?',
    correct: 'Amazon SNS',
    wrong: [
      'Amazon SQS, con un solo proceso leyendo la cola',
      'Amazon S3',
      'AWS CloudTrail',
    ],
    explanation:
      'SNS publica un aviso y lo reciben varios a la vez. Una cola SQS guarda el mensaje para un proceso que lo toma; no avisa a tres destinos por sí sola. S3 guarda el archivo. CloudTrail registra la llamada.',
  },
  {
    topicId: 'topic-compute',
    key: 'ccp-case-rekognition',
    stem: 'La app debe decir si una foto trae un producto o un rostro. No quieres entrenar un modelo ni administrar servidores. ¿Qué servicio usas?',
    correct: 'Amazon Rekognition',
    wrong: ['Amazon Comprehend', 'Amazon Polly', 'Amazon Transcribe'],
    explanation:
      'Rekognition analiza imágenes: objetos y rostros, sin que entrenes un modelo. Comprehend lee texto. Polly convierte texto en voz. Transcribe convierte audio en texto.',
  },
];
