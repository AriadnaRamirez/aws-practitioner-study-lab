import {
  DEFAULT_TRACK_ID,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';

const now = '2026-10-28T12:00:00.000Z';

type ModuleConcept = {
  key: string;
  name: string;
  definition: string;
  /** Three wrong definitions (usually another concept's job). */
  wrong: [string, string, string];
  explanation: string;
};

const MODULE_TOPICS: { id: string; name: string; sortOrder: number }[] = [
  { id: 'topic-net-basics', name: 'Conceptos de redes', sortOrder: 60 },
  { id: 'topic-sec-basics', name: 'Conceptos de seguridad', sortOrder: 65 },
];

const NETWORKING: ModuleConcept[] = [
  {
    key: 'osi',
    name: 'Modelo OSI',
    definition:
      'Modelo de referencia de 7 capas (física, enlace, red, transporte, sesión, presentación y aplicación) que describe cómo viajan los datos en una red.',
    wrong: [
      'Protocolo que asigna direcciones IP automáticamente a los dispositivos de una red',
      'Sistema que traduce nombres de dominio a direcciones IP',
      'Estándar que cifra el tráfico web entre el navegador y el servidor',
    ],
    explanation:
      'OSI es un modelo conceptual de 7 capas para entender y diagnosticar redes. No asigna IPs (eso es DHCP) ni resuelve nombres (eso es DNS).',
  },
  {
    key: 'tcp-ip-model',
    name: 'Modelo TCP/IP',
    definition:
      'Modelo práctico de 4 capas (acceso a la red, internet, transporte y aplicación) en el que se basa Internet.',
    wrong: [
      'Protocolo sin conexión que envía datos sin confirmar su entrega',
      'Dispositivo que conecta equipos dentro de la misma red local',
      'Rango de direcciones IP escrito con una barra, como /24',
    ],
    explanation:
      'TCP/IP agrupa las funciones de red en 4 capas y es el modelo que usa Internet. OSI tiene 7 capas y es sobre todo de referencia.',
  },
  {
    key: 'ip-address',
    name: 'Dirección IP',
    definition:
      'Identificador numérico que se asigna a cada dispositivo para enviarle y recibir datos en una red.',
    wrong: [
      'Identificador físico grabado de fábrica en la tarjeta de red',
      'Número que identifica una aplicación o servicio dentro de un equipo',
      'Nombre legible, como ejemplo.com, que apunta a un servidor',
    ],
    explanation:
      'La IP ubica a un dispositivo en la red (capa de red). La MAC identifica la tarjeta física y el puerto identifica el servicio.',
  },
  {
    key: 'mac-address',
    name: 'Dirección MAC',
    definition:
      'Identificador físico único de la tarjeta de red, asignado por el fabricante y usado dentro de la red local.',
    wrong: [
      'Identificador numérico que se asigna a cada dispositivo para comunicarse entre redes',
      'Número que identifica un servicio, como 443 para HTTPS',
      'Rango de direcciones IP escrito con una barra, como /16',
    ],
    explanation:
      'La MAC trabaja en la capa de enlace y sirve dentro de la red local. Para llegar a otras redes se usa la dirección IP.',
  },
  {
    key: 'subnet',
    name: 'Subred',
    definition:
      'División de una red en segmentos más pequeños para organizar las direcciones IP, mejorar el rendimiento y aislar el tráfico.',
    wrong: [
      'Conexión cifrada que une dos redes a través de Internet',
      'Servidor que reparte el tráfico entre varios equipos',
      'Dispositivo que permite o bloquea tráfico según reglas',
    ],
    explanation:
      'Una subred es un rango de IPs dentro de una red mayor. En AWS, las VPC se dividen en subredes públicas y privadas.',
  },
  {
    key: 'cidr',
    name: 'Notación CIDR',
    definition:
      'Forma de escribir un rango de direcciones IP con una barra que indica cuántos bits son de red, por ejemplo 10.0.0.0/16.',
    wrong: [
      'Identificador físico grabado de fábrica en la tarjeta de red',
      'Técnica que traduce IPs privadas a una IP pública',
      'Lista de puertos abiertos en un servidor',
    ],
    explanation:
      'En CIDR, /16 deja 16 bits para la red y el resto para equipos; cuanto mayor el número tras la barra, más pequeño el rango.',
  },
  {
    key: 'default-gateway',
    name: 'Puerta de enlace predeterminada',
    definition:
      'Dirección del router al que un equipo envía el tráfico destinado a redes fuera de la suya.',
    wrong: [
      'Sistema que traduce nombres de dominio a direcciones IP',
      'Protocolo que asigna direcciones IP automáticamente',
      'Dispositivo que conecta equipos de la misma red local usando MAC',
    ],
    explanation:
      'Si el destino no está en la red local, el equipo manda el paquete a su puerta de enlace (normalmente el router).',
  },
  {
    key: 'router',
    name: 'Router',
    definition:
      'Dispositivo que conecta redes distintas y decide por qué ruta enviar cada paquete según la dirección IP de destino.',
    wrong: [
      'Dispositivo que conecta equipos de la misma red local usando direcciones MAC',
      'Servidor que guarda copias de páginas web para servirlas más rápido',
      'Protocolo que asigna direcciones IP automáticamente',
    ],
    explanation:
      'El router trabaja con IPs (capa 3) y une redes. El switch trabaja con MAC (capa 2) dentro de una misma red.',
  },
  {
    key: 'switch',
    name: 'Switch',
    definition:
      'Dispositivo que conecta equipos dentro de la misma red local y reenvía los datos usando direcciones MAC.',
    wrong: [
      'Dispositivo que conecta redes distintas y elige rutas según la IP de destino',
      'Sistema que permite o bloquea tráfico según reglas',
      'Protocolo que garantiza la entrega ordenada de los datos',
    ],
    explanation:
      'El switch reparte tráfico dentro de la LAN (capa 2). Para salir a otras redes se necesita un router.',
  },
  {
    key: 'dns',
    name: 'DNS',
    definition:
      'Sistema que traduce nombres de dominio legibles, como ejemplo.com, a direcciones IP.',
    wrong: [
      'Protocolo que asigna direcciones IP automáticamente a los dispositivos',
      'Técnica que traduce IPs privadas a una IP pública',
      'Protocolo para transferir archivos entre equipos',
    ],
    explanation:
      'DNS significa Domain Name System: es la “agenda” de Internet. En AWS, Route 53 es el servicio de DNS.',
  },
  {
    key: 'dhcp',
    name: 'DHCP',
    definition:
      'Protocolo que asigna automáticamente dirección IP, máscara, puerta de enlace y DNS a los dispositivos de una red.',
    wrong: [
      'Sistema que traduce nombres de dominio a direcciones IP',
      'Protocolo que cifra la conexión remota a un servidor',
      'Técnica que traduce IPs privadas a una IP pública',
    ],
    explanation:
      'DHCP significa Dynamic Host Configuration Protocol: evita configurar a mano la red de cada equipo.',
  },
  {
    key: 'nat',
    name: 'NAT',
    definition:
      'Técnica que traduce direcciones IP privadas a una IP pública para que varios equipos salgan a Internet.',
    wrong: [
      'Sistema que traduce nombres de dominio a direcciones IP',
      'División de una red en segmentos más pequeños',
      'Conexión cifrada que une dos redes a través de Internet',
    ],
    explanation:
      'NAT significa Network Address Translation. En AWS, un NAT gateway deja que subredes privadas salgan a Internet sin ser accesibles desde fuera.',
  },
  {
    key: 'tcp',
    name: 'TCP',
    definition:
      'Protocolo de transporte orientado a conexión que garantiza que los datos lleguen completos y en orden.',
    wrong: [
      'Protocolo de transporte sin conexión, rápido y sin confirmación de entrega',
      'Protocolo que asigna direcciones IP automáticamente',
      'Protocolo para pedir y mostrar páginas web',
    ],
    explanation:
      'TCP confirma cada entrega y reordena los datos; por eso lo usan la web, el correo o SSH.',
  },
  {
    key: 'udp',
    name: 'UDP',
    definition:
      'Protocolo de transporte sin conexión, rápido y sin confirmación de entrega; se usa en streaming, voz o consultas DNS.',
    wrong: [
      'Protocolo orientado a conexión que garantiza entrega completa y en orden',
      'Protocolo seguro para navegar sitios web',
      'Dispositivo que conecta redes distintas',
    ],
    explanation:
      'UDP sacrifica fiabilidad por velocidad: si se pierde un paquete, no se reenvía.',
  },
  {
    key: 'port',
    name: 'Puerto',
    definition:
      'Número que identifica un servicio dentro de un equipo, como 22 para SSH, 80 para HTTP o 443 para HTTPS.',
    wrong: [
      'Identificador numérico de un dispositivo en la red',
      'Identificador físico de la tarjeta de red',
      'Ruta que sigue un paquete entre dos redes',
    ],
    explanation:
      'La IP lleva el paquete al equipo; el puerto lo entrega a la aplicación correcta. Los grupos de seguridad de AWS abren o cierran puertos.',
  },
];

const SECURITY: ModuleConcept[] = [
  {
    key: 'cia-triad',
    name: 'Tríada CIA',
    definition:
      'Modelo base de la seguridad de la información formado por confidencialidad, integridad y disponibilidad.',
    wrong: [
      'Proceso de comprobar que alguien es quien dice ser',
      'Estrategia de varias capas de controles de seguridad',
      'Norma que obliga a cifrar todos los datos con la misma clave',
    ],
    explanation:
      'CIA viene del inglés Confidentiality, Integrity, Availability. Casi cualquier control de seguridad protege uno de estos tres pilares.',
  },
  {
    key: 'confidentiality',
    name: 'Confidencialidad',
    definition:
      'Garantizar que solo las personas autorizadas puedan ver la información.',
    wrong: [
      'Garantizar que la información no se modifique sin autorización',
      'Garantizar que los sistemas estén accesibles cuando se necesitan',
      'Registrar quién accedió a un sistema y cuándo',
    ],
    explanation:
      'Se protege con cifrado y control de acceso. Una filtración de datos rompe la confidencialidad.',
  },
  {
    key: 'integrity',
    name: 'Integridad',
    definition:
      'Garantizar que la información no se modifique sin autorización y se mantenga exacta.',
    wrong: [
      'Garantizar que solo las personas autorizadas puedan ver la información',
      'Garantizar que los sistemas estén accesibles cuando se necesitan',
      'Ocultar los datos con una clave para que no se puedan leer',
    ],
    explanation:
      'Se verifica con hashes, firmas digitales y control de cambios. Alterar un registro sin permiso rompe la integridad.',
  },
  {
    key: 'availability',
    name: 'Disponibilidad',
    definition:
      'Garantizar que los sistemas y los datos estén accesibles para los usuarios autorizados cuando los necesitan.',
    wrong: [
      'Garantizar que solo las personas autorizadas puedan ver la información',
      'Garantizar que la información no se modifique sin autorización',
      'Dar a cada usuario solo los permisos mínimos',
    ],
    explanation:
      'Se protege con redundancia, copias de seguridad y defensas contra DDoS. Una caída del servicio afecta la disponibilidad.',
  },
  {
    key: 'authentication',
    name: 'Autenticación',
    definition:
      'Proceso de comprobar que alguien es quien dice ser, por ejemplo con usuario y contraseña.',
    wrong: [
      'Proceso de decidir qué recursos puede usar una identidad ya verificada',
      'Convertir datos en texto ilegible sin la clave',
      'Revisar registros para detectar actividad sospechosa',
    ],
    explanation:
      'Autenticación responde “¿quién eres?”. Autorización responde “¿qué puedes hacer?”.',
  },
  {
    key: 'authorization',
    name: 'Autorización',
    definition:
      'Proceso de decidir qué acciones o recursos puede usar una identidad ya verificada.',
    wrong: [
      'Proceso de comprobar que alguien es quien dice ser',
      'Pedir dos o más factores para iniciar sesión',
      'Convertir datos en una huella de longitud fija',
    ],
    explanation:
      'Primero te autenticas y después se te autoriza. En AWS, las políticas de IAM definen la autorización.',
  },
  {
    key: 'mfa',
    name: 'MFA',
    definition:
      'Método que pide dos o más factores para iniciar sesión, como la contraseña más un código del teléfono.',
    wrong: [
      'Usar la misma contraseña en todos los servicios para no olvidarla',
      'Dar a cada usuario solo los permisos necesarios',
      'Sistema que bloquea tráfico de red según reglas',
    ],
    explanation:
      'MFA significa Multi-Factor Authentication: combina algo que sabes, algo que tienes o algo que eres. Se recomienda siempre para el usuario raíz de AWS.',
  },
  {
    key: 'least-privilege',
    name: 'Principio de mínimo privilegio',
    definition:
      'Dar a cada usuario o sistema solo los permisos necesarios para su tarea, y nada más.',
    wrong: [
      'Dar permisos de administrador a todos para evitar bloqueos',
      'Combinar varias capas de controles de seguridad',
      'Pedir dos o más factores para iniciar sesión',
    ],
    explanation:
      'Reduce el daño si una cuenta se ve comprometida. Es una buena práctica central de IAM.',
  },
  {
    key: 'defense-in-depth',
    name: 'Defensa en profundidad',
    definition:
      'Estrategia que combina varias capas de controles (red, sistema, aplicación y datos) para que un solo fallo no lo exponga todo.',
    wrong: [
      'Dar a cada usuario solo los permisos necesarios',
      'Confiar en un único firewall perimetral como protección',
      'Ataque que satura un servicio con tráfico',
    ],
    explanation:
      'Si una capa falla, otra sigue protegiendo. En AWS se combinan, por ejemplo, NACL, grupos de seguridad, IAM y cifrado.',
  },
  {
    key: 'symmetric-encryption',
    name: 'Cifrado simétrico',
    definition: 'Cifrado que usa la misma clave para cifrar y descifrar los datos.',
    wrong: [
      'Cifrado que usa una clave pública y otra privada',
      'Función que convierte datos en una huella irreversible',
      'Compresión de archivos para que ocupen menos espacio',
    ],
    explanation:
      'Es rápido y se usa para grandes volúmenes de datos (por ejemplo AES). El reto es compartir la clave de forma segura.',
  },
  {
    key: 'asymmetric-encryption',
    name: 'Cifrado asimétrico',
    definition:
      'Cifrado que usa un par de claves: una pública para cifrar y una privada para descifrar.',
    wrong: [
      'Cifrado que usa la misma clave para cifrar y descifrar',
      'Función que convierte datos en una huella irreversible',
      'Método que pide dos o más factores para iniciar sesión',
    ],
    explanation:
      'Permite intercambiar información sin compartir la clave privada. Lo usan HTTPS (TLS) y las claves SSH.',
  },
  {
    key: 'hash',
    name: 'Función hash',
    definition:
      'Función que convierte datos en una huella de longitud fija que no se puede revertir; sirve para verificar integridad o guardar contraseñas.',
    wrong: [
      'Cifrado que usa la misma clave para cifrar y descifrar',
      'Cifrado que usa una clave pública y otra privada',
      'Copia de seguridad cifrada que se guarda fuera del sitio',
    ],
    explanation:
      'Un hash no se “descifra”: si cambia un solo carácter, la huella cambia por completo. Por eso detecta alteraciones.',
  },
  {
    key: 'firewall',
    name: 'Firewall',
    definition:
      'Sistema que permite o bloquea tráfico de red según reglas definidas (IP, puerto y protocolo).',
    wrong: [
      'Programa que detecta y elimina virus en un equipo',
      'Dispositivo que conecta redes distintas',
      'Conexión cifrada que une dos redes a través de Internet',
    ],
    explanation:
      'El firewall filtra tráfico; no elimina virus. En AWS, los grupos de seguridad y las NACL cumplen ese papel.',
  },
  {
    key: 'phishing',
    name: 'Phishing',
    definition:
      'Engaño, normalmente por correo o mensaje, que se hace pasar por alguien confiable para robar credenciales o datos.',
    wrong: [
      'Ataque que satura un servicio con tráfico desde muchos equipos',
      'Software malicioso que daña o espía un sistema',
      'Debilidad en un software que un atacante podría aprovechar',
    ],
    explanation:
      'El phishing ataca a las personas, no a la tecnología. MFA y la capacitación reducen su impacto.',
  },
  {
    key: 'malware',
    name: 'Malware',
    definition:
      'Software malicioso diseñado para dañar, espiar o tomar control de un sistema, como virus, troyanos o ransomware.',
    wrong: [
      'Engaño por correo que se hace pasar por alguien confiable',
      'Debilidad en un software que un atacante podría aprovechar',
      'Sistema que bloquea tráfico de red según reglas',
    ],
    explanation:
      'Malware es el programa dañino en sí. El ransomware, por ejemplo, cifra tus archivos y pide un rescate.',
  },
  {
    key: 'ddos',
    name: 'Ataque DDoS',
    definition:
      'Ataque que satura un servicio con tráfico desde muchos equipos para dejarlo fuera de servicio.',
    wrong: [
      'Engaño por correo que se hace pasar por alguien confiable',
      'Software malicioso que cifra archivos y pide rescate',
      'Acceso no autorizado usando contraseñas robadas',
    ],
    explanation:
      'DDoS significa Distributed Denial of Service y ataca la disponibilidad. En AWS, Shield protege contra DDoS.',
  },
  {
    key: 'vulnerability',
    name: 'Vulnerabilidad',
    definition:
      'Debilidad en un sistema, configuración o software que un atacante podría aprovechar.',
    wrong: [
      'Ataque que ya ocurrió y causó pérdida de datos',
      'Software malicioso que daña o espía un sistema',
      'Método que pide dos o más factores para iniciar sesión',
    ],
    explanation:
      'Una vulnerabilidad es el punto débil; el ataque es quien la aprovecha. En AWS, Inspector busca vulnerabilidades.',
  },
];

export function buildModuleTopics(): Topic[] {
  return MODULE_TOPICS.map((t) => ({
    id: t.id,
    trackId: DEFAULT_TRACK_ID,
    type: 'CONCEPT' as const,
    name: t.name,
    parentId: null,
    sortOrder: t.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));
}

function toKnowledge(
  topicId: string,
  prefix: string,
  concepts: ModuleConcept[],
): KnowledgeItem[] {
  return concepts.map((c) => ({
    id: `ki-${prefix}-${c.key}`,
    topicId,
    trackId: DEFAULT_TRACK_ID,
    name: c.name,
    definition: c.definition,
    distractors: [...c.wrong],
    explanation: c.explanation,
    allowedVariants: ['NAME_TO_DEFINITION', 'DEFINITION_TO_NAME', 'NAME_FOCUS'],
    status: 'published' as const,
    externalKey: `module.${prefix}.${c.key}`,
    createdAt: now,
    updatedAt: now,
  }));
}

export function buildModuleKnowledge(): KnowledgeItem[] {
  return [
    ...toKnowledge('topic-net-basics', 'net', NETWORKING),
    ...toKnowledge('topic-sec-basics', 'sec', SECURITY),
  ];
}
