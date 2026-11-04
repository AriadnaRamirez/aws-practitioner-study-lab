import type { ApuntesTopic } from './types';

export const CLOUD_TOPIC: ApuntesTopic = {
  id: 'topic-cloud-fundamentals',
  name: 'Conceptos de la nube',
  type: 'CONCEPT',
  sortOrder: 30,
  concepts: [
    {
      key: 'cloud-computing',
      name: 'Computación en la nube',
      definition:
        'Entrega bajo demanda de potencia de cómputo, almacenamiento y otros recursos por internet, pagando solo por lo que usas.',
      confusedWith: ['virtualization', 'private-cloud'],
    },
    {
      key: 'server',
      name: 'Servidor',
      definition: 'Equipo que responde a las peticiones de los clientes.',
      confusedWith: ['host', 'node'],
    },
    {
      key: 'virtualization',
      name: 'Virtualización',
      definition:
        'Técnica que divide un equipo físico en varias máquinas virtuales.',
      confusedWith: ['cloud-computing', 'server'],
    },
    {
      key: 'latency',
      name: 'Latencia',
      definition:
        'Demora entre que haces una petición y el servidor la recibe.',
      confusedWith: ['bandwidth'],
    },
    {
      key: 'bandwidth',
      name: 'Ancho de banda',
      definition:
        'Cantidad de datos que la red puede transferir en un tiempo dado.',
      confusedWith: ['latency'],
    },
    {
      key: 'capex',
      name: 'CapEx',
      long: 'Capital Expenditure',
      definition:
        'Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.',
      confusedWith: ['opex', 'commit-discount'],
    },
    {
      key: 'opex',
      name: 'OpEx',
      long: 'Operational Expenditure',
      definition: 'Gasto operativo variable: pagas solo por lo que consumes.',
      confusedWith: ['capex', 'commit-discount'],
      note: 'Pasar de CapEx a OpEx es una de las ventajas de la nube.',
    },
    {
      key: 'public-cloud',
      name: 'Nube pública',
      definition:
        'Modelo de implementación en el que la infraestructura es del proveedor, como AWS.',
      confusedWith: ['private-cloud', 'hybrid-cloud'],
    },
    {
      key: 'private-cloud',
      name: 'Nube privada',
      definition:
        'Modelo de implementación en el que la infraestructura es de la propia empresa (on-premises).',
      confusedWith: ['public-cloud', 'hybrid-cloud'],
    },
    {
      key: 'hybrid-cloud',
      name: 'Nube híbrida',
      definition:
        'Modelo de implementación que combina infraestructura pública y privada.',
      confusedWith: ['public-cloud', 'private-cloud'],
    },
    {
      key: 'iaas',
      name: 'IaaS',
      long: 'Infraestructura como servicio',
      definition:
        'Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.',
      confusedWith: ['paas', 'saas'],
      note: 'EC2 es un ejemplo.',
    },
    {
      key: 'paas',
      name: 'PaaS',
      long: 'Plataforma como servicio',
      definition:
        'Modelo de servicio en el que solo controlas tus datos y aplicaciones; el proveedor administra la plataforma.',
      confusedWith: ['iaas', 'saas'],
    },
    {
      key: 'saas',
      name: 'SaaS',
      long: 'Software como servicio',
      definition:
        'Modelo de servicio en el que el usuario final solo usa el software terminado.',
      confusedWith: ['paas', 'iaas'],
    },
    {
      key: 'pay-as-you-go',
      name: 'Pago por uso',
      definition:
        'Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.',
      confusedWith: ['commit-discount', 'capex'],
      note: 'En inglés, pay-as-you-go.',
    },
    {
      key: 'commit-discount',
      name: 'Pagar menos al reservar',
      definition:
        'Principio de precios de AWS: pagas menos si te comprometes a usar un recurso durante 1 o 3 años.',
      confusedWith: ['pay-as-you-go', 'opex'],
      note: 'En inglés, pay less by making a commitment.',
    },
    {
      key: 'data-transfer-in',
      name: 'Transferencia entrante',
      definition: 'Datos que entran a AWS desde internet; no tienen costo.',
      confusedWith: ['data-transfer-out'],
    },
    {
      key: 'data-transfer-out',
      name: 'Transferencia saliente',
      definition:
        'Datos que salen de AWS hacia internet; se cobran por gigabyte.',
      confusedWith: ['data-transfer-in'],
      note: 'Entre servicios de la misma región es gratis o de muy bajo costo.',
    },
    {
      key: 'region',
      name: 'Región',
      definition:
        'Ubicación física en el mundo con varias zonas de disponibilidad; se elige por cumplimiento legal, latencia y servicios disponibles.',
      confusedWith: ['az', 'edge-location'],
      note: 'Es un límite geopolítico: los servicios y precios varían entre regiones.',
    },
    {
      key: 'az',
      name: 'Zona de disponibilidad',
      definition:
        'Uno o más centros de datos aislados dentro de una región; cada región tiene al menos 3 para tolerar fallos.',
      confusedWith: ['region', 'edge-location'],
    },
    {
      key: 'edge-location',
      name: 'Edge location',
      definition:
        'Punto de presencia de la red de AWS que CloudFront usa para entregar contenido cerca de los usuarios.',
      confusedWith: ['az', 'region'],
      note: 'En español, ubicación de borde o punto de presencia.',
    },
    {
      key: 'shared-responsibility',
      id: 'ki-shared-responsibility',
      name: 'Modelo de responsabilidad compartida',
      definition:
        'Reparto de la seguridad: AWS protege la nube (lo físico, el mantenimiento y la virtualización) y el cliente protege lo que pone en ella (datos, cifrado y accesos).',
      confusedWith: ['security-of', 'security-in', 'shared-controls'],
    },
    {
      key: 'security-of',
      name: 'Seguridad DE la nube',
      definition:
        'La parte que le toca a AWS: instalaciones físicas, hardware, mantenimiento, energía, climatización y virtualización.',
      confusedWith: ['security-in', 'inherited-controls'],
    },
    {
      key: 'security-in',
      name: 'Seguridad EN la nube',
      definition:
        'La parte que le toca al cliente: sus datos, el cifrado, los accesos, la configuración de su red y sus sistemas, y su código.',
      confusedWith: ['security-of', 'customer-controls'],
    },
    {
      key: 'inherited-controls',
      name: 'Controles heredados',
      definition:
        'Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.',
      confusedWith: ['shared-controls', 'customer-controls'],
    },
    {
      key: 'shared-controls',
      name: 'Controles compartidos',
      definition:
        'Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.',
      confusedWith: ['inherited-controls', 'customer-controls'],
      note: 'Ejemplo: AWS parchea su infraestructura y tú parcheas el sistema operativo de tus instancias.',
    },
    {
      key: 'customer-controls',
      name: 'Controles del cliente',
      definition:
        'Controles que dependen solo del cliente, como decidir quién tiene permisos sobre sus datos.',
      confusedWith: ['shared-controls', 'inherited-controls'],
      note: 'En tus apuntes: controles específicos del cliente.',
    },
    {
      key: 'cpu',
      name: 'CPU',
      definition:
        'Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.',
      confusedWith: ['ram', 'persistent-storage', 'nic'],
    },
    {
      key: 'ram',
      name: 'RAM',
      definition:
        'Memoria que da acceso rápido a los datos en uso; en la analogía de la cocina, es la mesa.',
      confusedWith: ['cpu', 'persistent-storage', 'nic'],
    },
    {
      key: 'persistent-storage',
      name: 'Almacenamiento persistente',
      definition:
        'Disco (HDD o SSD) que conserva los datos aunque el equipo se apague; en la analogía de la cocina, es el refrigerador.',
      confusedWith: ['ram', 'cpu', 'nic'],
    },
    {
      key: 'product-owner',
      name: 'Product Owner',
      definition: 'Rol que define los requisitos del proyecto.',
      confusedWith: ['scrum-master', 'cloud-architect', 'developer'],
    },
    {
      key: 'scrum-master',
      name: 'Scrum Master',
      definition:
        'Rol que guía al equipo para que logre los objetivos y requisitos del proyecto.',
      confusedWith: ['product-owner', 'qa', 'devops'],
    },
    {
      key: 'developer',
      name: 'Desarrollador',
      definition: 'Rol que diseña y escribe el código.',
      confusedWith: ['devops', 'qa', 'cloud-architect'],
    },
    {
      key: 'devops',
      name: 'DevOps',
      definition:
        'Rol encargado de la infraestructura donde corre el software en AWS.',
      confusedWith: ['cloud-architect', 'developer', 'sysops'],
    },
    {
      key: 'qa',
      name: 'QA',
      definition: 'Rol que hace pruebas y verifica que el programa funciona.',
      confusedWith: ['developer', 'scrum-master', 'product-owner'],
    },
    {
      key: 'cloud-architect',
      name: 'Arquitecto de nube',
      definition: 'Rol que diseña la infraestructura.',
      confusedWith: ['devops', 'product-owner', 'developer'],
    },
  ],
};

export const LINUX_TOPIC: ApuntesTopic = {
  id: 'topic-linux',
  name: 'Conceptos de Linux',
  type: 'CONCEPT',
  sortOrder: 55,
  concepts: [
    {
      key: 'kernel',
      name: 'Kernel',
      definition:
        'Corazón del sistema operativo, con privilegios máximos para controlar el hardware.',
      confusedWith: ['shell', 'daemon', 'distro'],
    },
    {
      key: 'daemon',
      name: 'Daemon',
      definition: 'Programa que se ejecuta en segundo plano, como sshd.',
      confusedWith: ['pid', 'kernel', 'cron'],
      note: 'En español, demonio. Una aplicación, en cambio, corre en primer plano.',
    },
    {
      key: 'distro',
      name: 'Distribución',
      definition:
        'Sistema Linux completo: el kernel más un conjunto de software, como Ubuntu, Red Hat, Debian o Amazon Linux.',
      confusedWith: ['kernel', 'shell'],
      note: 'Se abrevia distro.',
    },
    {
      key: 'amazon-linux',
      id: 'ki-amazon-linux',
      name: 'Amazon Linux',
      definition:
        'Distribución de Linux optimizada por AWS para sus instancias EC2.',
      confusedWith: ['distro', 'ami'],
    },
    {
      key: 'shell',
      name: 'Shell',
      definition:
        'Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.',
      confusedWith: ['kernel', 'cli-linux'],
      note: 'Tipos: sh (Bourne Shell, Unix), bash (Bourne-Again Shell, GNU) y ksh (Korn Shell).',
    },
    {
      key: 'cli-linux',
      name: 'Línea de comandos',
      definition:
        'Interfaz de texto (la consola) para controlar el sistema escribiendo comandos.',
      confusedWith: ['gui', 'shell'],
      note: 'Se abrevia CLI (Command Line Interface).',
    },
    {
      key: 'gui',
      name: 'GUI',
      long: 'Graphical User Interface',
      definition: 'Interfaz gráfica para usar el sistema con ventanas y clics.',
      confusedWith: ['cli-linux', 'shell'],
    },
    {
      key: 'prompt',
      name: 'Prompt',
      definition:
        'Texto antes del cursor, como user@hostname ~ $, que muestra el usuario, la máquina, la carpeta actual y el tipo de usuario ($ estándar, # root).',
      confusedWith: ['shell', 'cli-linux'],
    },
    {
      key: 'root-linux',
      name: 'Usuario root',
      definition: 'Usuario de Linux con permisos ilimitados sobre el sistema.',
      confusedWith: ['sudo', 'su', 'root-user'],
      note: 'Un usuario estándar solo tiene los permisos que root le otorga.',
    },
    {
      key: 'sudo',
      name: 'sudo',
      definition: 'Comando que ejecuta otro comando con privilegios de root.',
      confusedWith: ['su', 'chown'],
    },
    {
      key: 'su',
      name: 'su',
      definition:
        'Comando para cambiar de usuario, por ejemplo de un usuario estándar a root.',
      confusedWith: ['sudo', 'usermod'],
    },
    {
      key: 'passwd',
      name: 'passwd',
      definition: 'Comando para cambiar la contraseña de un usuario.',
      confusedWith: ['usermod', 'su'],
    },
    {
      key: 'usermod',
      name: 'usermod',
      definition:
        'Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.',
      confusedWith: ['chown', 'passwd'],
    },
    {
      key: 'permissions',
      name: 'Permisos rwx',
      definition:
        'Lectura (r), escritura (w) y ejecución (x), definidos para el dueño, el grupo y los demás.',
      confusedWith: ['octal', 'chmod'],
      note: 'ls -l los muestra; el primer carácter indica archivo (-), directorio (d) o enlace (l).',
    },
    {
      key: 'octal',
      name: 'Notación octal',
      definition:
        'Forma numérica de los permisos: r vale 4, w vale 2 y x vale 1; por ejemplo, rwxr-xr-- es 754.',
      confusedWith: ['permissions', 'chmod'],
    },
    {
      key: 'chmod',
      name: 'chmod',
      definition: 'Comando que cambia los permisos de un archivo.',
      confusedWith: ['chown', 'usermod'],
      note: 'Ejemplo: chmod 754 archivo.',
    },
    {
      key: 'chown',
      name: 'chown',
      definition:
        'Comando que cambia el dueño de un archivo; requiere ser root.',
      confusedWith: ['chmod', 'usermod'],
    },
    {
      key: 'man',
      name: 'man',
      definition: 'Comando que muestra el manual de otro comando.',
      confusedWith: ['find', 'cat'],
    },
    {
      key: 'cat',
      name: 'cat',
      definition:
        'Comando que imprime en la consola el contenido de un archivo.',
      confusedWith: ['head', 'touch'],
    },
    {
      key: 'touch',
      name: 'touch',
      definition: 'Comando que crea un archivo vacío.',
      confusedWith: ['cat', 'pwd'],
      note: 'Para crear carpetas se usa mkdir.',
    },
    {
      key: 'pwd',
      name: 'pwd',
      definition: 'Comando que muestra la ruta de la carpeta en la que estás.',
      confusedWith: ['touch', 'cat'],
      note: 'Para moverte entre carpetas se usa cd.',
    },
    {
      key: 'etc',
      name: '/etc',
      definition: 'Directorio con los archivos de configuración del sistema.',
      confusedWith: ['var-log', 'home', 'proc'],
    },
    {
      key: 'var-log',
      name: '/var/log',
      definition: 'Directorio donde se guardan los registros (logs).',
      confusedWith: ['etc', 'proc', 'home'],
    },
    {
      key: 'home',
      name: '/home',
      definition: 'Directorio con las carpetas y archivos de los usuarios.',
      confusedWith: ['etc', 'dev', 'var-log'],
    },
    {
      key: 'proc',
      name: '/proc',
      definition:
        'Directorio virtual con información del kernel y de los procesos en tiempo real.',
      confusedWith: ['dev', 'var-log', 'etc'],
    },
    {
      key: 'dev',
      name: '/dev',
      definition:
        'Directorio con los archivos que representan dispositivos, como los discos.',
      confusedWith: ['proc', 'etc', 'home'],
    },
    {
      key: 'find',
      name: 'find',
      definition:
        'Comando que busca archivos según condiciones, como su nombre o su tamaño.',
      confusedWith: ['diff', 'man'],
      note: 'Ejemplo: find / -name "*.log" busca desde la raíz todos los archivos .log.',
    },
    {
      key: 'tar',
      name: 'tar',
      definition:
        'Comando que empaqueta varios archivos en uno y los extrae: -cvf crea el paquete y -xf lo extrae.',
      confusedWith: ['cksum', 'diff'],
    },
    {
      key: 'cksum',
      name: 'cksum',
      definition:
        'Comando que calcula una suma de verificación para comprobar que un archivo está completo y sin cambios.',
      confusedWith: ['diff', 'tar'],
    },
    {
      key: 'diff',
      name: 'diff',
      definition: 'Comando que compara dos archivos y muestra sus diferencias.',
      confusedWith: ['cksum', 'find'],
    },
    {
      key: 'vim',
      name: 'Vim',
      definition:
        'Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).',
      confusedWith: ['nano'],
    },
    {
      key: 'nano',
      name: 'Nano',
      definition: 'Editor de texto de terminal sencillo, sin modos.',
      confusedWith: ['vim'],
      note: 'Gedit, en cambio, es un editor con interfaz gráfica.',
    },
    {
      key: 'pid',
      name: 'PID',
      long: 'Process ID',
      definition: 'Número que identifica a cada proceso.',
      confusedWith: ['fork', 'daemon'],
    },
    {
      key: 'fork',
      name: 'fork',
      definition:
        'Creación de un subproceso (proceso hijo) a partir de otro proceso.',
      confusedWith: ['pid', 'zombie'],
    },
    {
      key: 'zombie',
      name: 'Proceso zombie',
      definition:
        'Proceso que ya terminó pero sigue en la tabla de procesos porque su proceso padre no ha recogido su estado.',
      confusedWith: ['daemon', 'fork'],
      note: 'Estados de un proceso: start, ready, running, waiting, stopped y zombie.',
    },
    {
      key: 'ps',
      name: 'ps',
      definition: 'Comando que lista los procesos que se están ejecutando.',
      confusedWith: ['top', 'kill'],
      note: 'ps -ef muestra todos con su usuario, pstree los muestra por jerarquía y pidof da el PID de un programa, como pidof sshd.',
    },
    {
      key: 'top',
      name: 'top',
      definition:
        'Comando que muestra en tiempo real los procesos ordenados por consumo de recursos.',
      confusedWith: ['ps', 'free'],
    },
    {
      key: 'kill',
      name: 'kill',
      definition: 'Comando que detiene un proceso usando su PID.',
      confusedWith: ['ps', 'systemctl'],
    },
    {
      key: 'cron',
      name: 'cron',
      definition: 'Programador de tareas repetitivas.',
      confusedWith: ['at', 'daemon'],
    },
    {
      key: 'at',
      name: 'at',
      definition:
        'Comando que programa una tarea para ejecutarse una sola vez.',
      confusedWith: ['cron', 'systemctl'],
    },
    {
      key: 'systemctl',
      name: 'systemctl',
      definition:
        'Comando que consulta el estado de un servicio y lo inicia, detiene, reinicia o habilita al arrancar.',
      confusedWith: ['kill', 'cron'],
    },
    {
      key: 'yum',
      name: 'yum',
      definition:
        'Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.',
      confusedWith: ['wget', 'curl'],
    },
    {
      key: 'wget',
      name: 'wget',
      definition:
        'Comando que descarga archivos de la web y puede reanudar descargas interrumpidas, útil con conexiones inestables.',
      confusedWith: ['curl', 'yum'],
    },
    {
      key: 'curl',
      name: 'curl',
      definition:
        'Comando que transfiere datos a o desde una URL; se usa para descargar y para probar APIs.',
      confusedWith: ['wget', 'yum'],
    },
    {
      key: 'df',
      name: 'df',
      definition: 'Comando que muestra el espacio usado y libre de los discos.',
      confusedWith: ['du', 'free'],
      note: 'Con -h lo muestra en unidades legibles (GB, MB).',
    },
    {
      key: 'du',
      name: 'du',
      definition: 'Comando que muestra cuánto ocupa un archivo o directorio.',
      confusedWith: ['df', 'free'],
      note: 'Ejemplo: du -sh /var.',
    },
    {
      key: 'free',
      name: 'free',
      definition: 'Comando que muestra el consumo de memoria RAM.',
      confusedWith: ['df', 'top'],
      note: 'lscpu muestra la arquitectura de la CPU y vmstat el uso de memoria virtual.',
    },
    {
      key: 'log-levels',
      name: 'Niveles de severidad',
      definition:
        'Escala de 0 (Emergency: el sistema dejó de funcionar) a 7 (Debug: rastreo de datos) que clasifica los mensajes de los logs.',
      confusedWith: ['var-log', 'tail'],
      note: 'En orden: Emergency, Alert, Critical, Error, Warn, Notice, Info y Debug.',
    },
    {
      key: 'head',
      name: 'head',
      definition: 'Comando que muestra las primeras líneas de un archivo.',
      confusedWith: ['tail', 'cat'],
    },
    {
      key: 'tail',
      name: 'tail',
      definition: 'Comando que muestra las últimas líneas de un archivo.',
      confusedWith: ['head', 'cat'],
    },
    {
      key: 'shebang',
      name: 'Shebang',
      definition:
        'Primera línea de un script, como #!/bin/bash, que indica con qué intérprete se ejecuta.',
      confusedWith: ['shell', 'prompt'],
    },
    {
      key: 'ssh',
      id: 'ki-ssh-ec2',
      name: 'SSH',
      definition:
        'Protocolo cifrado para conectarse de forma remota a la terminal de una instancia.',
      confusedWith: ['session-manager', 'telnet'],
    },
    {
      key: 'user-data',
      id: 'ki-user-data',
      name: 'User data',
      definition:
        'Script con instrucciones de configuración que una instancia EC2 ejecuta al arrancar por primera vez.',
      confusedWith: ['ami', 'shebang'],
    },
    {
      key: 'hipaa',
      name: 'HIPAA',
      definition: 'Ley de EE. UU. que regula el tratamiento de datos de salud.',
      confusedWith: ['pci-dss', 'soc'],
    },
    {
      key: 'pci-dss',
      name: 'PCI-DSS',
      definition:
        'Estándar de seguridad para tratar datos de tarjetas de crédito.',
      confusedWith: ['hipaa', 'soc'],
    },
  ],
};
