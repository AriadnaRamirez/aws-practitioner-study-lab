/**
 * Contenido del minijuego "OSI vs TCP/IP". Solo datos: edita aquí fichas,
 * tarjetas de práctica y explicaciones sin tocar los componentes.
 *
 * Criterio: si algo vive en varias capas se marca ("capas 3–4") en la ficha y
 * nunca se usa como tarjeta de práctica.
 */

export type OsiLayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TcpIpLayerId = "aplicacion" | "transporte" | "internet" | "acceso";

export type FichaItem = {
  name: string;
  note?: string;
  /** Solo si vive en varias capas, p. ej. "capas 3–4". */
  span?: string;
};

export type OsiLayer = {
  number: OsiLayerNumber;
  name: string;
  /** "¿Qué hace?" en palabras simples, una línea. */
  does: string;
  pdu: string;
  physical: readonly FichaItem[];
  aws: readonly FichaItem[];
  /** Se muestra cuando no hay un servicio de AWS claro para la capa. */
  awsNone?: string;
  /** Palabra de la frase para recordar las capas (de 7 a 1). */
  mnemonic: string;
  tip: string;
};

export type TcpIpLayer = {
  id: TcpIpLayerId;
  /** Numeración de abajo hacia arriba (1 = Acceso a la red). */
  number: 1 | 2 | 3 | 4;
  name: string;
  summary: string;
  /** Capas OSI que cubre, de arriba hacia abajo. */
  osi: readonly OsiLayerNumber[];
  color: string;
};

export const MNEMONIC = "Algunas Personas Sí Toman Refresco En Fiestas";

/** De arriba (7) hacia abajo (1), como se dibuja el modelo. */
export const OSI_LAYERS: readonly OsiLayer[] = [
  {
    number: 7,
    name: "Aplicación",
    does: "Da servicios de red a tus apps: el navegador pide una página, el correo envía un mensaje.",
    pdu: "Datos",
    physical: [
      { name: "Navegador web" },
      { name: "HTTP / HTTPS" },
      { name: "DNS", note: "traduce nombres a IP" },
      { name: "Correo SMTP" },
      { name: "SSH" },
    ],
    aws: [
      { name: "Application Load Balancer (ALB)", note: "reparte según la URL o cabeceras HTTP" },
      { name: "Amazon API Gateway" },
      { name: "Amazon CloudFront", note: "CDN que entrega contenido HTTP" },
      { name: "AWS WAF", note: "filtra peticiones web" },
      { name: "Amazon Route 53", note: "DNS" },
    ],
    mnemonic: "Algunas",
    tip: "Si entiende URLs, cabeceras HTTP o nombres de dominio, es capa 7.",
  },
  {
    number: 6,
    name: "Presentación",
    does: "Pone los datos en un formato que ambos lados entiendan: los cifra, comprime y codifica.",
    pdu: "Datos",
    physical: [
      { name: "Cifrado TLS / SSL" },
      { name: "Compresión de datos" },
      { name: "Formatos JPEG / PNG" },
      { name: "Codificación UTF-8 / ASCII" },
    ],
    aws: [
      {
        name: "AWS Certificate Manager (ACM)",
        note: "emite los certificados TLS que usan ALB y CloudFront",
      },
    ],
    mnemonic: "Personas",
    tip: "Piensa en «cómo se ven los datos»: cifrados, comprimidos o en qué formato.",
  },
  {
    number: 5,
    name: "Sesión",
    does: "Abre, mantiene y cierra la conversación entre dos aplicaciones.",
    pdu: "Datos",
    physical: [
      { name: "Abrir, mantener y cerrar la conexión" },
      { name: "RPC", note: "llamadas a procedimientos remotos" },
    ],
    aws: [],
    awsNone:
      "No hay un servicio de AWS dedicado a esta capa. Lo más parecido son las sesiones persistentes (sticky sessions) del ALB, que mantienen a un usuario con el mismo servidor, aunque el ALB trabaja en capa 7. En TCP/IP esta capa queda dentro de Aplicación.",
    mnemonic: "Sí",
    tip: "Como una llamada telefónica: marcar, hablar y colgar.",
  },
  {
    number: 4,
    name: "Transporte",
    does: "Lleva los datos al programa correcto usando puertos. TCP confirma la entrega; UDP va rápido sin confirmar.",
    pdu: "Segmento (TCP) / datagrama (UDP)",
    physical: [
      { name: "Números de puerto", note: "80 web, 443 HTTPS, 22 SSH" },
      { name: "TCP" },
      { name: "UDP" },
    ],
    aws: [
      { name: "Network Load Balancer (NLB)", note: "reparte por IP y puerto, sin leer HTTP" },
      { name: "AWS Global Accelerator", note: "acelera tráfico TCP/UDP" },
      { name: "Security Groups", span: "capas 3–4", note: "filtran por protocolo, puerto e IP" },
    ],
    mnemonic: "Toman",
    tip: "Puerto = el «número de departamento» del programa dentro del equipo.",
  },
  {
    number: 3,
    name: "Red",
    does: "Elige el camino entre redes distintas usando direcciones IP.",
    pdu: "Paquete",
    physical: [
      { name: "Dirección IP" },
      { name: "Router" },
      { name: "ICMP / ping" },
    ],
    aws: [
      { name: "Amazon VPC", note: "tu red privada con su rango IP" },
      { name: "Subredes" },
      { name: "Tablas de rutas" },
      { name: "Internet Gateway" },
      { name: "Transit Gateway", note: "conecta muchas VPC y redes" },
      { name: "Elastic IP", note: "IP pública fija" },
      { name: "Network ACL (NACL)", span: "capas 3–4", note: "filtran por IP y puerto" },
    ],
    mnemonic: "Refresco",
    tip: "IP = la dirección postal; el router es el cartero que elige la ruta.",
  },
  {
    number: 2,
    name: "Enlace de datos",
    does: "Entrega los datos dentro de la misma red local usando direcciones MAC.",
    pdu: "Trama",
    physical: [
      { name: "Dirección MAC" },
      { name: "Tarjeta de red (NIC)", note: "tiene grabada la MAC" },
      { name: "Switch", note: "reenvía según la MAC" },
      { name: "Ethernet" },
      { name: "ARP", note: "averigua la MAC de una IP" },
    ],
    aws: [{ name: "Elastic Network Interface (ENI)", note: "la tarjeta de red virtual; tiene su MAC" }],
    mnemonic: "En",
    tip: "MAC = el «número de serie» de la tarjeta de red; el switch la lee.",
  },
  {
    number: 1,
    name: "Física",
    does: "Convierte los bits en señales: electricidad en el cable, luz en la fibra, ondas de radio en Wi-Fi.",
    pdu: "Bits",
    physical: [
      { name: "Cable de red (cobre)" },
      { name: "Fibra óptica" },
      { name: "Señal Wi-Fi", note: "ondas de radio" },
      { name: "Hub", note: "repite la señal a todos" },
      { name: "Puerto físico de la NIC" },
    ],
    aws: [
      {
        name: "Centros de datos de AWS",
        note: "cables, servidores y edificios; responsabilidad de AWS",
      },
      { name: "AWS Direct Connect", span: "capas 1–2", note: "fibra dedicada a AWS; usa VLAN (capa 2)" },
    ],
    mnemonic: "Fiestas",
    tip: "Si lo puedes tocar o es una señal (cable, luz, radio), es capa 1.",
  },
];

/** De arriba hacia abajo, alineadas con OSI_LAYERS. */
export const TCPIP_LAYERS: readonly TcpIpLayer[] = [
  {
    id: "aplicacion",
    number: 4,
    name: "Aplicación",
    summary: "Junta Aplicación, Presentación y Sesión de OSI.",
    osi: [7, 6, 5],
    color: "#e0a53a",
  },
  {
    id: "transporte",
    number: 3,
    name: "Transporte",
    summary: "Igual que la capa 4 de OSI: TCP y UDP.",
    osi: [4],
    color: "#20d1ed",
  },
  {
    id: "internet",
    number: 2,
    name: "Internet",
    summary: "Equivale a Red (capa 3) de OSI: IP y rutas.",
    osi: [3],
    color: "#a78bfa",
  },
  {
    id: "acceso",
    number: 1,
    name: "Acceso a la red",
    summary: "Junta Enlace de datos y Física de OSI.",
    osi: [2, 1],
    color: "#d2652f",
  },
];

export type ChipType = "funcion" | "fisico" | "aws";

export const CHIP_TYPE_LABEL: Record<ChipType, string> = {
  funcion: "Qué hace",
  fisico: "Sistema físico",
  aws: "AWS",
};

export type PlaceChip = {
  id: string;
  label: string;
  layer: OsiLayerNumber;
  /** Por qué va ahí, una línea. */
  why: string;
};

/**
 * Exactamente 7 tarjetas por tipo, una por capa. Nada que viva en varias capas
 * (Security Groups, NACLs): esos se explican en las fichas.
 */
export const PLACE_CHIPS: Record<ChipType, readonly PlaceChip[]> = {
  funcion: [
    {
      id: "f7",
      label: "Da servicios de red a tus apps (web, correo)",
      layer: 7,
      why: "Aplicación es la capa más cercana a ti: el navegador, el correo, el DNS.",
    },
    {
      id: "f6",
      label: "Cifra, comprime y da formato a los datos",
      layer: 6,
      why: "Presentación decide cómo se ven los datos para que ambos lados los entiendan.",
    },
    {
      id: "f5",
      label: "Abre, mantiene y cierra la conversación",
      layer: 5,
      why: "Sesión controla el diálogo entre dos aplicaciones, como una llamada.",
    },
    {
      id: "f4",
      label: "Entrega los datos al programa correcto usando puertos",
      layer: 4,
      why: "Transporte usa puertos (80, 443…) para llegar a la app dentro del equipo.",
    },
    {
      id: "f3",
      label: "Elige la ruta entre redes distintas",
      layer: 3,
      why: "Red enruta paquetes de una red a otra usando direcciones IP.",
    },
    {
      id: "f2",
      label: "Entrega los datos dentro de la misma red local",
      layer: 2,
      why: "Enlace de datos mueve tramas entre equipos vecinos usando la dirección MAC.",
    },
    {
      id: "f1",
      label: "Convierte los bits en señales (luz, electricidad, radio)",
      layer: 1,
      why: "Física transmite los bits por el cable, la fibra o el aire.",
    },
  ],
  fisico: [
    {
      id: "p7",
      label: "Navegador web y HTTP",
      layer: 7,
      why: "El navegador habla HTTP, un protocolo de Aplicación.",
    },
    {
      id: "p6",
      label: "Cifrado TLS y formato JPEG",
      layer: 6,
      why: "Cifrar y elegir el formato de los datos es tarea de Presentación.",
    },
    {
      id: "p5",
      label: "Abrir y cerrar una sesión remota (RPC)",
      layer: 5,
      why: "Iniciar, mantener y terminar el diálogo entre programas es Sesión.",
    },
    {
      id: "p4",
      label: "Puertos TCP y UDP",
      layer: 4,
      why: "Los puertos y los protocolos TCP/UDP son de Transporte.",
    },
    {
      id: "p3",
      label: "Dirección IP y router",
      layer: 3,
      why: "El router lee la dirección IP para elegir el camino: capa de Red.",
    },
    {
      id: "p2",
      label: "Dirección MAC y switch",
      layer: 2,
      why: "La MAC identifica la tarjeta de red y el switch reenvía según ella: Enlace de datos.",
    },
    {
      id: "p1",
      label: "Cable de red y fibra óptica",
      layer: 1,
      why: "Son el medio por donde viajan las señales: capa Física.",
    },
  ],
  aws: [
    {
      id: "a7",
      label: "Application Load Balancer (ALB)",
      layer: 7,
      why: "El ALB reparte según la URL y las cabeceras HTTP. CloudFront y Route 53 también son capa 7.",
    },
    {
      id: "a6",
      label: "AWS Certificate Manager (certificados TLS)",
      layer: 6,
      why: "ACM da los certificados TLS que permiten cifrar: Presentación.",
    },
    {
      id: "a5",
      label: "Sesiones persistentes (sticky sessions)",
      layer: 5,
      why: "Mantener la sesión de un usuario es la idea de la capa 5. Ojo: en AWS lo configura el ALB (capa 7); no hay un servicio dedicado a la capa 5.",
    },
    {
      id: "a4",
      label: "Network Load Balancer (NLB)",
      layer: 4,
      why: "El NLB reparte por IP y puerto, sin leer HTTP: capa 4.",
    },
    {
      id: "a3",
      label: "Amazon VPC y tablas de rutas",
      layer: 3,
      why: "Tu red privada con sus rangos IP y sus rutas: capa de Red.",
    },
    {
      id: "a2",
      label: "ENI (tarjeta de red virtual con dirección MAC)",
      layer: 2,
      why: "La ENI es la tarjeta de red de tu instancia y tiene su propia MAC: capa 2.",
    },
    {
      id: "a1",
      label: "Centros de datos de AWS (cables y servidores)",
      layer: 1,
      why: "Lo que se puede tocar (edificios, cables, servidores) es capa 1; lo cuida AWS.",
    },
  ],
};

export function osiLayer(n: OsiLayerNumber): OsiLayer {
  return OSI_LAYERS.find((l) => l.number === n)!;
}

export function tcpIpForOsi(n: OsiLayerNumber): TcpIpLayer {
  return TCPIP_LAYERS.find((l) => l.osi.includes(n))!;
}

export function tcpIpLayer(id: TcpIpLayerId): TcpIpLayer {
  return TCPIP_LAYERS.find((l) => l.id === id)!;
}
