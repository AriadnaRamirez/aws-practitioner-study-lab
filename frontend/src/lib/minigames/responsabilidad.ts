import {
  scenarioQuestions,
  type QuizOption,
  type Scenario,
} from "@/lib/minigames/quiz";

export const RESPONSABILIDAD_ROUND = 10;

const OPTIONS: QuizOption[] = [
  {
    id: "aws",
    label: "AWS",
    tag: "Seguridad DE la nube",
    summary:
      "AWS se encarga de la seguridad DE la nube: lo físico (centros de datos y hardware), su mantenimiento, la energía y la climatización, y la virtualización.",
  },
  {
    id: "tu",
    label: "Tú",
    tag: "Seguridad EN la nube",
    summary:
      "Tú te encargas de la seguridad EN la nube: tus datos y su cifrado, los usuarios y accesos, la configuración de tu red y de tus sistemas, y tu código.",
  },
];

/** Modelo de responsabilidad compartida, según los apuntes: cada tarea tiene un solo dueño. */
const SCENARIOS: Scenario[] = [
  // AWS
  {
    prompt: "Vigilar quién entra físicamente a los centros de datos.",
    answer: "aws",
    clue: "físicamente",
    why: "Es un control heredado: confías en que AWS cuida sus edificios.",
  },
  {
    prompt: "Reemplazar un disco duro dañado en un servidor de AWS.",
    answer: "aws",
    clue: "servidor de AWS",
    why: "El mantenimiento del hardware es parte de la seguridad DE la nube.",
  },
  {
    prompt: "Mantener el hipervisor que divide los servidores en instancias.",
    answer: "aws",
    clue: "hipervisor",
    why: "La virtualización es la capa bajo tus instancias: tú nunca tienes acceso a ella.",
  },
  {
    prompt: "Asegurar la energía eléctrica de los centros de datos.",
    answer: "aws",
    clue: "energía eléctrica",
  },
  {
    prompt: "Mantener la climatización de las salas de servidores.",
    answer: "aws",
    clue: "climatización",
  },
  {
    prompt:
      "Proteger los edificios de las zonas de disponibilidad contra incendios e inundaciones.",
    answer: "aws",
    clue: "edificios",
  },
  {
    prompt:
      "Aplicar parches al firmware de los servidores físicos donde corren las instancias.",
    answer: "aws",
    clue: "servidores físicos",
    why: "La gestión de parches es un control compartido: la infraestructura física la parchea AWS.",
  },
  {
    prompt:
      "Capacitar al personal de los centros de datos en sus procedimientos de seguridad.",
    answer: "aws",
    clue: "personal de los centros de datos",
    why: "La formación es un control compartido: AWS forma a su gente y tú a la tuya.",
  },
  {
    prompt: "Destruir de forma segura los discos que se retiran del servicio.",
    answer: "aws",
    clue: "discos que se retiran",
  },
  {
    prompt:
      "Mantener el cableado y los equipos de red que conectan los centros de datos.",
    answer: "aws",
    clue: "cableado y los equipos de red",
  },
  {
    prompt:
      "Aislar las instancias de distintos clientes que comparten el mismo servidor físico.",
    answer: "aws",
    clue: "mismo servidor físico",
    why: "Ese aislamiento lo da la virtualización, que administra AWS.",
  },
  {
    prompt:
      "Mantener los puntos de presencia que usa CloudFront para entregar contenido.",
    answer: "aws",
    clue: "puntos de presencia",
  },
  {
    prompt:
      "Renovar los servidores físicos cuando llegan al final de su vida útil.",
    answer: "aws",
    clue: "servidores físicos",
  },
  // Tú
  {
    prompt: "Cifrar los datos que guardas en tus buckets de S3.",
    answer: "tu",
    clue: "Cifrar los datos",
  },
  {
    prompt:
      "Decidir qué usuarios IAM pueden leer la base de datos de clientes.",
    answer: "tu",
    clue: "qué usuarios IAM pueden leer",
    why: "Es un control específico del cliente: tú das los permisos sobre tus datos.",
  },
  {
    prompt: "Activar MFA en el usuario raíz de tu cuenta.",
    answer: "tu",
    clue: "Activar MFA",
  },
  {
    prompt:
      "Aplicar los parches de seguridad al sistema operativo de tus instancias EC2.",
    answer: "tu",
    clue: "sistema operativo de tus instancias",
    why: "La gestión de parches es compartida: AWS parchea la infraestructura y tú el sistema operativo que instalaste.",
  },
  {
    prompt:
      "Crear tu VPC con sus subredes públicas y privadas y sus tablas de rutas.",
    answer: "tu",
    clue: "Crear tu VPC",
    why: "La gestión de configuración es compartida: configurar tu propia red te toca a ti.",
  },
  {
    prompt:
      "Abrir en un Security Group solo los puertos de HTTP y HTTPS de tu servidor web.",
    answer: "tu",
    clue: "Security Group",
  },
  {
    prompt:
      "Definir las reglas de permiso y denegación de las ACL de tus subredes.",
    answer: "tu",
    clue: "ACL de tus subredes",
  },
  {
    prompt:
      "Revisar que el código de tu aplicación no sea vulnerable a inyección SQL.",
    answer: "tu",
    clue: "código de tu aplicación",
  },
  {
    prompt:
      "Evitar que tus claves de acceso queden escritas en un repositorio público.",
    answer: "tu",
    clue: "claves de acceso",
  },
  {
    prompt:
      "Dar a cada empleado solo los permisos indispensables para su trabajo.",
    answer: "tu",
    clue: "permisos indispensables",
  },
  {
    prompt:
      "Capacitar a tu equipo para que reconozca malware y ataques de ingeniería social.",
    answer: "tu",
    clue: "Capacitar a tu equipo",
    why: "La formación es compartida: la de tu equipo te toca a ti.",
  },
  {
    prompt:
      "Configurar el cifrado TLS de la conexión entre tu app y tus usuarios.",
    answer: "tu",
    clue: "cifrado TLS",
  },
  {
    prompt: "Decidir si un bucket de S3 puede ser público o no.",
    answer: "tu",
    clue: "Decidir si",
  },
  {
    prompt: "Agrupar a tus desarrolladores en un grupo IAM con sus permisos.",
    answer: "tu",
    clue: "grupo IAM",
  },
  {
    prompt:
      "Cambiar los permisos de los archivos dentro de tu instancia Linux.",
    answer: "tu",
    clue: "dentro de tu instancia",
  },
  {
    prompt: "Rotar la contraseña de la base de datos que usa tu aplicación.",
    answer: "tu",
    clue: "Rotar la contraseña",
  },
  {
    prompt:
      "Elegir una región cuyas leyes permitan guardar los datos de tus clientes.",
    answer: "tu",
    clue: "Elegir una región",
    why: "La región define qué leyes se cumplen; elegir dónde viven tus datos es tu decisión.",
  },
];

export const RESPONSABILIDAD_QUESTIONS = scenarioQuestions(
  "resp",
  SCENARIOS,
  OPTIONS,
);
