import type { ApuntesTopic } from './types';

export const NETWORKING_TOPIC: ApuntesTopic = {
  id: 'topic-net-basics',
  name: 'Conceptos de redes',
  type: 'CONCEPT',
  sortOrder: 60,
  concepts: [
    {
      key: 'network',
      name: 'Red',
      definition:
        'Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.',
      confusedWith: ['node', 'lan'],
    },
    {
      key: 'node',
      name: 'Nodo',
      definition:
        'Cualquier dispositivo conectado a la red que envía o recibe información.',
      confusedWith: ['host', 'server'],
    },
    {
      key: 'host',
      name: 'Host',
      definition:
        'Dispositivo con una IP fija porque ofrece algo que otros necesitan, como una impresora.',
      confusedWith: ['node', 'server'],
    },
    {
      key: 'nic',
      name: 'NIC',
      long: 'Network Interface Card',
      definition:
        'Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.',
      confusedWith: ['mac', 'switch', 'modem'],
    },
    {
      key: 'mac',
      id: 'ki-net-mac-address',
      name: 'Dirección MAC',
      definition:
        'Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).',
      confusedWith: ['ip', 'port'],
    },
    {
      key: 'ip',
      id: 'ki-net-ip-address',
      name: 'Dirección IP',
      definition:
        'Identificador numérico asignado a un dispositivo para comunicarse en una red (capa 3).',
      confusedWith: ['mac', 'port'],
    },
    {
      key: 'fiber',
      name: 'Fibra óptica',
      definition: 'Medio de transmisión por el que viajan pulsos de luz.',
      confusedWith: ['twisted-pair', 'coax'],
    },
    {
      key: 'twisted-pair',
      name: 'Par trenzado',
      definition:
        'Cable de cobre (Ethernet) por el que viajan impulsos eléctricos.',
      confusedWith: ['coax', 'fiber'],
    },
    {
      key: 'coax',
      name: 'Cable coaxial',
      definition:
        'Cable con un conductor central cubierto por capas de aislante y malla.',
      confusedWith: ['twisted-pair', 'fiber'],
    },
    {
      key: 'switch',
      id: 'ki-net-switch',
      name: 'Switch',
      definition:
        'Dispositivo que dirige la información de un equipo a otro dentro de la red local.',
      confusedWith: ['router', 'modem'],
      note: 'En español, conmutador. En AWS su equivalente es la subred.',
    },
    {
      key: 'router',
      id: 'ki-net-router',
      name: 'Router',
      definition:
        'Dispositivo que interconecta redes y decide el mejor camino para enviar la información.',
      confusedWith: ['switch', 'modem'],
      note: 'En español, enrutador. En AWS su equivalente es la tabla de rutas.',
    },
    {
      key: 'modem',
      name: 'Módem',
      definition:
        'Dispositivo que convierte señales digitales en analógicas y viceversa para dar acceso a internet.',
      confusedWith: ['router', 'switch'],
      note: 'En AWS su equivalente es el Internet Gateway.',
    },
    {
      key: 'physical-topology',
      name: 'Topología física',
      definition: 'Disposición real del cableado y de los equipos de una red.',
      confusedWith: ['logical-topology', 'bus'],
    },
    {
      key: 'logical-topology',
      name: 'Topología lógica',
      definition:
        'Forma en que viajan los datos por la red, sin importar cómo está el cableado.',
      confusedWith: ['physical-topology', 'star'],
    },
    {
      key: 'bus',
      name: 'Topología de bus',
      definition:
        'Topología en la que todos los equipos se conectan a un solo cable.',
      confusedWith: ['star', 'physical-topology'],
    },
    {
      key: 'star',
      name: 'Topología de estrella',
      definition:
        'Topología en la que todos los equipos se conectan a un nodo central.',
      confusedWith: ['bus', 'logical-topology'],
      note: 'La topología híbrida combina bus y estrella.',
    },
    {
      key: 'lan',
      name: 'LAN',
      long: 'Red de Área Local',
      definition:
        'Red que conecta equipos en un espacio pequeño, como una casa o una oficina.',
      confusedWith: ['wan', 'network'],
    },
    {
      key: 'wan',
      name: 'WAN',
      long: 'Red de Área Amplia',
      definition: 'Red a gran escala que conecta varias redes LAN.',
      confusedWith: ['lan', 'network'],
    },
    {
      key: 'client-server',
      name: 'Cliente-servidor',
      definition:
        'Modelo en el que un cliente consulta a un servidor central para obtener información.',
      confusedWith: ['p2p'],
    },
    {
      key: 'p2p',
      name: 'P2P',
      long: 'Peer-to-Peer',
      definition:
        'Modelo en el que la información está distribuida entre equipos que actúan a la vez como clientes y servidores.',
      confusedWith: ['client-server'],
    },
    {
      key: 'osi',
      id: 'ki-net-osi',
      name: 'Modelo OSI',
      definition:
        'Marco de referencia de 7 capas que describe cómo viajan los datos en una red.',
      confusedWith: ['handshake', 'tcp'],
      note: 'OSI significa Open System Interconnection.',
    },
    {
      key: 'layer-physical',
      name: 'Capa física',
      definition:
        'Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.',
      confusedWith: ['layer-link', 'layer-network'],
    },
    {
      key: 'layer-link',
      name: 'Capa de enlace',
      definition:
        'Capa 2 del modelo OSI: conecta equipos de la misma red mediante direcciones MAC; ahí trabajan las tarjetas de red y los switches.',
      confusedWith: ['layer-network', 'layer-physical'],
    },
    {
      key: 'layer-network',
      name: 'Capa de red',
      definition:
        'Capa 3 del modelo OSI: direcciona y enruta los paquetes con direcciones IP (IPv4, IPv6).',
      confusedWith: ['layer-link', 'layer-transport'],
    },
    {
      key: 'layer-transport',
      name: 'Capa de transporte',
      definition:
        'Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).',
      confusedWith: ['layer-network', 'layer-session'],
    },
    {
      key: 'layer-session',
      name: 'Capa de sesión',
      definition:
        'Capa 5 del modelo OSI: establece y controla la conexión entre dos dispositivos.',
      confusedWith: ['layer-transport', 'layer-presentation'],
    },
    {
      key: 'layer-presentation',
      name: 'Capa de presentación',
      definition:
        'Capa 6 del modelo OSI: da formato a los datos y los cifra (TLS/SSL).',
      confusedWith: ['layer-session', 'layer-application'],
    },
    {
      key: 'layer-application',
      name: 'Capa de aplicación',
      definition:
        'Capa 7 del modelo OSI: la interfaz con las aplicaciones, con protocolos como HTTP, HTTPS, SSH y DNS.',
      confusedWith: ['layer-presentation', 'layer-transport'],
    },
    {
      key: 'tcp',
      id: 'ki-net-tcp',
      name: 'TCP',
      long: 'Protocolo de Control de Transmisión',
      definition:
        'Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.',
      confusedWith: ['udp', 'handshake'],
    },
    {
      key: 'udp',
      id: 'ki-net-udp',
      name: 'UDP',
      long: 'Protocolo de Datagramas de Usuario',
      definition:
        'Protocolo sin conexión y muy rápido que envía mensajes sin verificar su entrega; su encabezado es de 8 bytes.',
      confusedWith: ['tcp', 'icmp'],
    },
    {
      key: 'handshake',
      name: 'Enlace de tres vías',
      definition:
        'Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.',
      confusedWith: ['udp', 'tls'],
    },
    {
      key: 'url',
      name: 'URL',
      long: 'Localizador Uniforme de Recursos',
      definition:
        'Dirección de un recurso web formada por el protocolo (https://), el dominio y la ruta con sus parámetros.',
      confusedWith: ['dns', 'ip'],
    },
    {
      key: 'ssl',
      name: 'SSL',
      long: 'Secure Sockets Layer',
      definition:
        'Protocolo criptográfico original para cifrar el tráfico; hoy es obsoleto.',
      confusedWith: ['tls', 'handshake'],
    },
    {
      key: 'tls',
      name: 'TLS',
      long: 'Transport Layer Security',
      definition:
        'Sucesor de SSL que cifra la comunicación cliente-servidor en tránsito, como en HTTPS.',
      confusedWith: ['ssl', 'handshake'],
    },
    {
      key: 'dns',
      id: 'ki-net-dns',
      name: 'DNS',
      long: 'Sistema de Nombres de Dominio',
      definition:
        'Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.',
      confusedWith: ['dhcp', 'url'],
    },
    {
      key: 'dhcp',
      id: 'ki-net-dhcp',
      name: 'DHCP',
      long: 'Protocolo de Configuración Dinámica de Host',
      definition:
        'Protocolo que asigna direcciones IP a los dispositivos de forma automática.',
      confusedWith: ['dns', 'gateway'],
    },
    {
      key: 'icmp',
      name: 'ICMP',
      long: 'Protocolo de Mensajes de Control de Internet',
      definition:
        'Protocolo de capa 3 que reporta errores de transmisión; lo usan herramientas como ping.',
      confusedWith: ['udp', 'dhcp'],
    },
    {
      key: 'traceroute',
      name: 'traceroute',
      definition:
        'Comando que muestra el camino (los saltos) de un nodo a otro.',
      confusedWith: ['mtr', 'nslookup'],
    },
    {
      key: 'mtr',
      name: 'mtr',
      definition:
        'Comando que combina ping y ruta: muestra cada salto hasta el destino y la pérdida de paquetes en cada uno.',
      confusedWith: ['traceroute', 'hping3'],
    },
    {
      key: 'nslookup',
      name: 'nslookup',
      definition:
        'Comando que consulta el DNS para comprobar a qué IP apunta un dominio.',
      confusedWith: ['traceroute', 'telnet'],
    },
    {
      key: 'hping3',
      name: 'hping3',
      definition:
        'Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.',
      confusedWith: ['telnet', 'mtr'],
    },
    {
      key: 'telnet',
      name: 'telnet',
      definition:
        'Comando que abre una conexión a una IP y un puerto para comprobar si acepta conexiones.',
      confusedWith: ['hping3', 'nslookup'],
    },
    {
      key: 'port',
      id: 'ki-net-port',
      name: 'Puerto',
      definition:
        'Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.',
      confusedWith: ['ip', 'mac'],
    },
    {
      key: 'ipv4',
      name: 'IPv4',
      definition:
        'Dirección de 32 bits escrita en 4 bloques de 8 bits (de 0 a 255), como 10.0.0.1.',
      confusedWith: ['ipv6', 'cidr'],
    },
    {
      key: 'ipv6',
      name: 'IPv6',
      definition:
        'Dirección de 128 bits escrita en 8 campos de 4 dígitos hexadecimales.',
      confusedWith: ['ipv4', 'mac'],
    },
    {
      key: 'public-ip',
      name: 'IP pública',
      definition:
        'Dirección visible en internet que asigna el proveedor de internet.',
      confusedWith: ['private-ip', 'loopback'],
    },
    {
      key: 'private-ip',
      name: 'IP privada',
      definition:
        'Dirección de la red interna, aislada de internet, que asigna tu DHCP.',
      confusedWith: ['public-ip', 'loopback'],
    },
    {
      key: 'network-address',
      name: 'Dirección de red',
      definition:
        'Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).',
      confusedWith: ['gateway', 'broadcast'],
    },
    {
      key: 'gateway',
      id: 'ki-net-default-gateway',
      name: 'Puerta de enlace predeterminada',
      definition:
        'IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).',
      confusedWith: ['network-address', 'broadcast'],
    },
    {
      key: 'broadcast',
      name: 'Dirección de difusión',
      definition:
        'Última dirección de un rango, que envía un mensaje a todos los equipos de la red.',
      confusedWith: ['network-address', 'gateway'],
      note: 'También se llama dirección de broadcast o de transmisión.',
    },
    {
      key: 'ip-classes',
      name: 'Clases de IP',
      definition:
        'Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.',
      confusedWith: ['cidr', 'ipv4'],
    },
    {
      key: 'loopback',
      name: 'Loopback',
      definition:
        'La dirección 127.0.0.1, que apunta al propio equipo para hacer pruebas.',
      confusedWith: ['private-ip', 'gateway'],
    },
    {
      key: 'cidr',
      id: 'ki-net-cidr',
      name: 'CIDR',
      long: 'Classless Inter-Domain Routing',
      definition:
        'Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.',
      confusedWith: ['subnet', 'ip-classes'],
    },
    {
      key: 'subnet',
      id: 'ki-net-subnet',
      name: 'Subred',
      definition:
        'División de una red en segmentos más pequeños; en AWS cada una vive en una sola zona de disponibilidad.',
      confusedWith: ['cidr', 'vpc'],
    },
  ],
};
