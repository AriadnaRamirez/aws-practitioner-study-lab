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
      "AWS se encarga de la seguridad DE la nube: centros de datos, hardware, red global, virtualización y los servicios que administra por ti.",
  },
  {
    id: "tu",
    label: "Tú",
    tag: "Seguridad EN la nube",
    summary:
      "Tú te encargas de la seguridad EN la nube: tus datos, identidades y permisos, la configuración de red y lo que instalas o programas.",
  },
];

/** Modelo de responsabilidad compartida: cada tarea tiene un solo dueño. */
const SCENARIOS: Scenario[] = [
  // AWS
  {
    prompt: "Vigilar el acceso físico a los centros de datos.",
    answer: "aws",
    clue: "acceso físico",
  },
  {
    prompt: "Reemplazar un disco duro dañado en un servidor de AWS.",
    answer: "aws",
    clue: "disco duro dañado",
  },
  {
    prompt:
      "Mantener la red global que conecta regiones y zonas de disponibilidad.",
    answer: "aws",
    clue: "red global",
  },
  {
    prompt: "Actualizar el hipervisor que ejecuta las instancias EC2.",
    answer: "aws",
    clue: "hipervisor",
    why: "El hipervisor es la capa de virtualización bajo tus instancias: tú nunca tienes acceso a ella.",
  },
  {
    prompt:
      "Aplicar parches al sistema operativo de los servidores de Amazon RDS.",
    answer: "aws",
    clue: "servidores de Amazon RDS",
    why: "RDS es un servicio administrado: AWS parchea el sistema operativo y el motor; tú solo eliges la ventana de mantenimiento.",
  },
  {
    prompt:
      "Parchear los servidores y el entorno de ejecución donde corre AWS Lambda.",
    answer: "aws",
    clue: "donde corre AWS Lambda",
    why: "En Lambda no administras servidores: AWS mantiene la infraestructura y los runtimes administrados.",
  },
  {
    prompt:
      "Guardar copias de los objetos de S3 en varias zonas de disponibilidad para que no se pierdan.",
    answer: "aws",
    clue: "para que no se pierdan",
    why: "La durabilidad de S3 es parte del servicio: AWS replica los objetos dentro de la región.",
  },
  {
    prompt: "Destruir de forma segura los discos que se retiran del servicio.",
    answer: "aws",
    clue: "discos que se retiran",
  },
  {
    prompt:
      "Asegurar la energía y la refrigeración de las zonas de disponibilidad.",
    answer: "aws",
    clue: "energía y la refrigeración",
  },
  {
    prompt: "Escalar y mantener los servidores que hay detrás de DynamoDB.",
    answer: "aws",
    clue: "servidores que hay detrás",
    why: "DynamoDB es serverless: tú no ves ni administras sus servidores.",
  },
  {
    prompt: "Mantener los routers y switches físicos de los centros de datos.",
    answer: "aws",
    clue: "routers y switches físicos",
  },
  {
    prompt:
      "Verificar los antecedentes del personal que trabaja en los centros de datos.",
    answer: "aws",
    clue: "personal que trabaja en los centros de datos",
  },
  {
    prompt:
      "Proteger los centros de datos contra incendios, inundaciones y cortes de luz.",
    answer: "aws",
    clue: "incendios, inundaciones y cortes de luz",
  },
  {
    prompt:
      "Mantener los servidores donde corren tus contenedores de AWS Fargate.",
    answer: "aws",
    clue: "servidores donde corren",
    why: "Con Fargate no administras servidores: AWS mantiene los hosts y tú solo defines los contenedores.",
  },
  {
    prompt:
      "Aislar entre sí las instancias de distintos clientes que comparten un mismo servidor físico.",
    answer: "aws",
    clue: "distintos clientes",
    why: "El aislamiento entre clientes lo garantiza la virtualización de AWS.",
  },
  {
    prompt:
      "Obtener certificaciones como ISO 27001 para la infraestructura de AWS.",
    answer: "aws",
    clue: "para la infraestructura de AWS",
    why: "AWS certifica su infraestructura y publica los informes en AWS Artifact; tus apps las certificas tú.",
  },
  {
    prompt: "Actualizar el firmware de los servidores físicos.",
    answer: "aws",
    clue: "servidores físicos",
  },
  {
    prompt:
      "Agregar servidores a Amazon SQS cuando envías millones de mensajes más.",
    answer: "aws",
    clue: "Agregar servidores a Amazon SQS",
    why: "SQS es administrado: escala solo y tú no ves sus servidores.",
  },
  {
    prompt:
      "Mantener el hardware de las ubicaciones de borde (edge locations) de CloudFront.",
    answer: "aws",
    clue: "hardware de las ubicaciones de borde",
  },
  {
    prompt:
      "Proteger la infraestructura de AWS contra ataques DDoS de red comunes (Shield Standard).",
    answer: "aws",
    clue: "Shield Standard",
    why: "Shield Standard viene activado sin costo para todos los clientes y lo opera AWS.",
  },
  {
    prompt:
      "Parchear el sistema operativo de los servidores que almacenan los objetos de S3.",
    answer: "aws",
    clue: "servidores que almacenan los objetos de S3",
  },
  {
    prompt:
      "Mantener disponibles los servidores que hacen funcionar el servicio de IAM.",
    answer: "aws",
    clue: "servidores que hacen funcionar",
    why: "IAM como servicio lo opera AWS; cómo lo usas (usuarios, políticas) es tuyo.",
  },
  // Tú
  {
    prompt: "Aplicar parches al sistema operativo de tu instancia EC2.",
    answer: "tu",
    clue: "tu instancia EC2",
    why: "En EC2 tú controlas el sistema operativo invitado, así que sus parches son tuyos.",
  },
  {
    prompt: "Configurar los security groups de tus instancias EC2.",
    answer: "tu",
    clue: "Configurar los security groups",
  },
  {
    prompt: "Crear usuarios de IAM y darles solo los permisos que necesitan.",
    answer: "tu",
    clue: "darles solo los permisos",
  },
  {
    prompt: "Activar MFA en el usuario raíz de tu cuenta.",
    answer: "tu",
    clue: "Activar MFA",
  },
  {
    prompt: "Decidir si un bucket de S3 es público o privado.",
    answer: "tu",
    clue: "Decidir si",
  },
  {
    prompt:
      "Activar el cifrado de tus datos y decidir quién puede usar las claves de KMS.",
    answer: "tu",
    clue: "decidir quién puede usar",
    why: "AWS ofrece las herramientas de cifrado, pero activarlas y controlar el acceso a las claves es tu decisión.",
  },
  {
    prompt: "Revisar el código de tu función Lambda y sus dependencias.",
    answer: "tu",
    clue: "el código de tu función",
    why: "AWS mantiene el entorno de Lambda, pero el código que subes es tuyo.",
  },
  {
    prompt:
      "Elegir en qué región se guardan tus datos para cumplir una ley local.",
    answer: "tu",
    clue: "Elegir en qué región",
  },
  {
    prompt: "Rotar las claves de acceso de tus usuarios de IAM.",
    answer: "tu",
    clue: "tus usuarios de IAM",
  },
  {
    prompt:
      "Instalar un antivirus en el sistema operativo de tu instancia EC2.",
    answer: "tu",
    clue: "tu instancia EC2",
  },
  {
    prompt: "Hacer snapshots de los volúmenes EBS de tu aplicación.",
    answer: "tu",
    clue: "Hacer snapshots",
    why: "AWS replica EBS dentro de la zona, pero los respaldos (snapshots) los programas tú.",
  },
  {
    prompt: "Configurar las tablas de rutas y las network ACL de tu VPC.",
    answer: "tu",
    clue: "de tu VPC",
  },
  {
    prompt: "Definir qué usuarios pueden leer una tabla de DynamoDB.",
    answer: "tu",
    clue: "qué usuarios pueden leer",
    why: "Aunque DynamoDB es administrado, los permisos de acceso a tus datos siempre son tuyos.",
  },
  {
    prompt: "Instalar y actualizar el software de tu aplicación en EC2.",
    answer: "tu",
    clue: "software de tu aplicación",
  },
  {
    prompt:
      "Elegir una contraseña fuerte para el usuario raíz y guardarla en un lugar seguro.",
    answer: "tu",
    clue: "contraseña fuerte",
  },
  {
    prompt:
      "Crear un trail de CloudTrail para guardar la actividad de tu cuenta más de 90 días.",
    answer: "tu",
    clue: "Crear un trail",
    why: "CloudTrail guarda 90 días de eventos por defecto; para conservar más, tú creas un trail.",
  },
  {
    prompt:
      "Usar HTTPS para cifrar el tráfico entre tus usuarios y tu aplicación.",
    answer: "tu",
    clue: "Usar HTTPS",
  },
  {
    prompt:
      "Decidir cuántos días se conservan los backups automáticos de tu base de datos RDS.",
    answer: "tu",
    clue: "Decidir cuántos días",
    why: "AWS ejecuta los backups de RDS, pero tú configuras cuánto tiempo se conservan.",
  },
  {
    prompt: "Darle a tu función Lambda un rol con los permisos justos.",
    answer: "tu",
    clue: "un rol con los permisos justos",
  },
  {
    prompt:
      "Clasificar tus datos según su sensibilidad (públicos, internos, confidenciales).",
    answer: "tu",
    clue: "Clasificar tus datos",
  },
  {
    prompt:
      "Eliminar los usuarios de IAM de personas que ya no trabajan en tu empresa.",
    answer: "tu",
    clue: "Eliminar los usuarios de IAM",
  },
  {
    prompt: "Configurar el firewall del sistema operativo de tu instancia EC2.",
    answer: "tu",
    clue: "firewall del sistema operativo",
  },
  {
    prompt:
      "Proteger tu aplicación web contra inyección SQL en el código que escribes.",
    answer: "tu",
    clue: "el código que escribes",
  },
  {
    prompt: "Decidir si tu base de datos RDS acepta conexiones desde internet.",
    answer: "tu",
    clue: "Decidir si",
    why: "El acceso público de RDS es una opción de configuración que eliges tú.",
  },
  {
    prompt:
      "Actualizar las librerías dentro de las imágenes de contenedor que despliegas en ECS.",
    answer: "tu",
    clue: "imágenes de contenedor que despliegas",
    why: "AWS mantiene la plataforma, pero lo que va dentro de tus contenedores es tuyo.",
  },
  {
    prompt:
      "Activar el versionado de un bucket de S3 para recuperar archivos borrados por error.",
    answer: "tu",
    clue: "Activar el versionado",
  },
  {
    prompt:
      "Activar Multi-AZ en tu base de datos RDS para que siga funcionando si falla una zona.",
    answer: "tu",
    clue: "Activar Multi-AZ",
    why: "AWS hace la conmutación automática, pero activar Multi-AZ es tu decisión.",
  },
  {
    prompt:
      "Evitar que las claves de acceso queden escritas en el código de un repositorio público.",
    answer: "tu",
    clue: "claves de acceso",
  },
];

export const RESPONSABILIDAD_QUESTIONS = scenarioQuestions(
  "resp",
  SCENARIOS,
  OPTIONS,
);
