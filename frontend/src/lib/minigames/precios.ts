import {
  scenarioQuestions,
  type QuizOption,
  type Scenario,
} from "@/lib/minigames/quiz";

export const PRECIOS_ROUND = 10;

const OPTIONS: QuizOption[] = [
  {
    id: "on-demand",
    label: "On-Demand",
    tag: "Sin compromiso",
    summary:
      "Pagas por segundo o por hora, sin compromiso ni pago por adelantado. Ideal para cargas cortas, impredecibles o de prueba que no pueden interrumpirse.",
  },
  {
    id: "reserved",
    label: "Reserved Instances",
    tag: "1 o 3 años · instancia fija",
    summary:
      "Compromiso de 1 o 3 años con un tipo de instancia a cambio de hasta 72 % de descuento. Las de zona reservan capacidad y las Standard se pueden revender en el Marketplace.",
  },
  {
    id: "savings-plans",
    label: "Savings Plans",
    tag: "1 o 3 años · gasto por hora",
    summary:
      "Te comprometes a gastar una cantidad por hora durante 1 o 3 años (hasta 72 % de descuento). Compute Savings Plans aplica el descuento aunque cambies de familia, de región o uses Fargate y Lambda.",
  },
  {
    id: "spot",
    label: "Spot",
    tag: "Hasta 90 % · interrumpible",
    summary:
      "Capacidad sobrante con hasta 90 % de descuento; AWS puede recuperarla con 2 minutos de aviso. Solo para cargas que toleran interrupciones.",
  },
  {
    id: "dedicated-hosts",
    label: "Dedicated Hosts",
    tag: "Servidor físico tuyo",
    summary:
      "Un servidor físico completo para ti, con visibilidad de sockets y núcleos. Útil para licencias por núcleo o socket (BYOL) y requisitos de cumplimiento.",
  },
];

const SCENARIOS: Scenario[] = [
  // On-Demand
  {
    prompt:
      "Vas a probar una app nueva durante 2 semanas y no sabes cuánta capacidad necesitarás.",
    answer: "on-demand",
    clue: "2 semanas",
    why: "Algo corto y sin uso estable no justifica un compromiso de 1 o 3 años.",
  },
  {
    prompt:
      "Esperas un pico de tráfico impredecible por una campaña de fin de semana y el servicio no puede cortarse.",
    answer: "on-demand",
    clue: "no puede cortarse",
    why: "Es temporal (descarta compromisos) y no tolera cortes (descarta Spot).",
  },
  {
    prompt:
      "Un desarrollador necesita un servidor unas horas para una demo y luego lo apagará.",
    answer: "on-demand",
    clue: "unas horas",
    why: "Pagas solo las horas que lo uses y lo apagas sin penalización.",
  },
  {
    prompt:
      "Una startup lanza su primer producto y aún no sabe si su uso será estable dentro de un año.",
    answer: "on-demand",
    clue: "aún no sabe si su uso será estable",
    why: "Primero se mide el uso con On-Demand; los compromisos llegan cuando el uso es predecible.",
  },
  {
    prompt:
      "Tienes un trabajo urgente de un solo día que no puede detenerse a la mitad.",
    answer: "on-demand",
    clue: "no puede detenerse a la mitad",
    why: "Un solo día descarta compromisos, y como no tolera interrupciones, Spot tampoco sirve.",
  },
  {
    prompt:
      "Quieres pagar solo los segundos que usas tu instancia Linux, sin pagos por adelantado ni contratos.",
    answer: "on-demand",
    clue: "sin pagos por adelantado ni contratos",
    why: "On-Demand cobra por segundo en Linux y no pide ningún compromiso.",
  },
  // Reserved Instances
  {
    prompt:
      "Necesitas garantizar capacidad de un tipo de instancia en una zona de disponibilidad concreta durante 1 año.",
    answer: "reserved",
    clue: "garantizar capacidad",
    why: "Las Reserved Instances de zona reservan capacidad; los Savings Plans dan descuento pero no reservan capacidad.",
  },
  {
    prompt:
      "Compraste una reserva de 3 años que ya no usarás y quieres vendérsela a otra empresa.",
    answer: "reserved",
    clue: "vendérsela a otra empresa",
    why: "Las Reserved Instances Standard se pueden vender en el Reserved Instance Marketplace; los Savings Plans no.",
  },
  {
    prompt:
      "Una app crítica debe poder lanzar 10 instancias c5 en us-east-1a aunque haya mucha demanda, y quieres descuento.",
    answer: "reserved",
    clue: "aunque haya mucha demanda",
    why: "Asegurar capacidad en una zona concreta con descuento es lo que hace una Reserved Instance de zona.",
  },
  {
    prompt:
      "Tu reserva Standard de 1 año sobra porque migraste la app; quieres recuperar parte de lo pagado.",
    answer: "reserved",
    clue: "recuperar parte de lo pagado",
    why: "Solo las Reserved Instances Standard se revenden en el Marketplace.",
  },
  // Savings Plans
  {
    prompt:
      "Tu uso de cómputo es estable, pero este año moverás cargas de EC2 a Fargate y Lambda.",
    answer: "savings-plans",
    clue: "de EC2 a Fargate y Lambda",
    why: "Compute Savings Plans cubre EC2, Fargate y Lambda; las Reserved Instances solo cubren EC2.",
  },
  {
    prompt:
      "Quieres comprometer un gasto fijo por hora y que el descuento siga aunque cambies de región o de familia de instancias.",
    answer: "savings-plans",
    clue: "gasto fijo por hora",
    why: "Te comprometes a un gasto ($/hora), no a una instancia concreta.",
  },
  {
    prompt:
      "Quieres un descuento por compromiso que también cubra tus funciones Lambda.",
    answer: "savings-plans",
    clue: "también cubra tus funciones Lambda",
    why: "Lambda no tiene Reserved Instances; el descuento por compromiso llega con Compute Savings Plans.",
  },
  {
    prompt:
      "Tu equipo cambia a menudo de tipo de instancia, pero el gasto total en cómputo es estable mes a mes.",
    answer: "savings-plans",
    clue: "cambia a menudo de tipo de instancia",
    why: "Una Reserved Instance te ata a un tipo de instancia; un Savings Plan sigue aplicando aunque cambies.",
  },
  {
    prompt:
      "Quieres ahorrar con un compromiso de 3 años sin tener que elegir hoy qué instancias usarás.",
    answer: "savings-plans",
    clue: "sin tener que elegir hoy qué instancias",
    why: "Con Compute Savings Plans solo eliges cuánto gastas por hora, no qué instancias.",
  },
  {
    prompt:
      "Tienes servidores en dos regiones y planeas pasar parte de ellos a contenedores en Fargate.",
    answer: "savings-plans",
    clue: "contenedores en Fargate",
    why: "Compute Savings Plans cubre varias regiones y también Fargate.",
  },
  // Spot
  {
    prompt:
      "Procesas miles de imágenes por lotes; si un servidor se interrumpe, el trabajo se reintenta después.",
    answer: "spot",
    clue: "se reintenta después",
    why: "Si el trabajo tolera interrupciones, Spot da el mayor descuento.",
  },
  {
    prompt:
      "Entrenas modelos de ML que guardan checkpoints y buscas el mayor descuento posible.",
    answer: "spot",
    clue: "guardan checkpoints",
    why: "Con checkpoints, si AWS recupera la instancia retomas desde el último punto guardado.",
  },
  {
    prompt:
      "Ejecutas pruebas de carga nocturnas que se pueden pausar y retomar sin problema.",
    answer: "spot",
    clue: "se pueden pausar y retomar",
    why: "Pausar y retomar sin problema es justo lo que pide Spot.",
  },
  {
    prompt:
      "Renderizas los fotogramas de una película animada; si un fotograma falla, se vuelve a generar.",
    answer: "spot",
    clue: "se vuelve a generar",
    why: "Cada fotograma es independiente: perder uno solo cuesta repetirlo.",
  },
  {
    prompt:
      "Analizas datos históricos sin fecha límite y quieres pagar lo menos posible.",
    answer: "spot",
    clue: "sin fecha límite",
    why: "Sin prisa, las interrupciones no importan y Spot es lo más barato (hasta 90 %).",
  },
  {
    prompt:
      "Tu integración continua (CI) ejecuta pruebas que se repiten solas si el servidor desaparece.",
    answer: "spot",
    clue: "se repiten solas",
    why: "Las tareas de CI que se reintentan solas son un caso clásico de Spot.",
  },
  // Dedicated Hosts
  {
    prompt:
      "Tu licencia de software se cobra por núcleo físico y quieres usar la que ya tienes.",
    answer: "dedicated-hosts",
    clue: "por núcleo físico",
    why: "Solo un Dedicated Host te deja ver los núcleos físicos para aplicar tu licencia (BYOL).",
  },
  {
    prompt:
      "Una norma exige que tus instancias corran en un servidor físico solo para tu empresa, donde puedas ver sus sockets y núcleos.",
    answer: "dedicated-hosts",
    clue: "ver sus sockets y núcleos",
    why: "Ver sockets y núcleos de un servidor físico propio es exclusivo de Dedicated Hosts.",
  },
  {
    prompt:
      "Quieres traer a AWS tus licencias de Windows Server, que se cobran por socket.",
    answer: "dedicated-hosts",
    clue: "se cobran por socket",
    why: "Las licencias por socket o núcleo necesitan un servidor físico visible: Dedicated Hosts.",
  },
  {
    prompt:
      "Una auditoría te pide controlar en qué servidor físico concreto se colocan tus instancias.",
    answer: "dedicated-hosts",
    clue: "en qué servidor físico concreto",
    why: "Con Dedicated Hosts eliges y ves el servidor físico donde corren tus instancias.",
  },
  {
    prompt:
      "Tu base de datos Oracle tiene una licencia que se paga según los núcleos del servidor físico.",
    answer: "dedicated-hosts",
    clue: "según los núcleos del servidor físico",
    why: "Licencia por núcleo físico = Dedicated Hosts.",
  },
];

export const PRECIOS_QUESTIONS = scenarioQuestions(
  "precio",
  SCENARIOS,
  OPTIONS,
);
