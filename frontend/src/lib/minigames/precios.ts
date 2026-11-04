import {
  scenarioQuestions,
  type QuizOption,
  type Scenario,
} from "@/lib/minigames/quiz";

export const PRECIOS_ROUND = 10;

/** Las tres formas de pagar EC2 que cubren los apuntes del curso. */
const OPTIONS: QuizOption[] = [
  {
    id: "on-demand",
    label: "Bajo demanda",
    tag: "Sin compromiso",
    summary:
      "Pagas por hora de uso, sin compromiso ni pago por adelantado. Ideal para cargas cortas, impredecibles o de prueba que no pueden interrumpirse.",
  },
  {
    id: "reserved",
    label: "Reservada",
    tag: "1 o 3 años · hasta 72 %",
    summary:
      "Te comprometes a usar la instancia 1 o 3 años y pagas hasta 72 % menos que bajo demanda. Conviene cuando el uso es estable y predecible.",
  },
  {
    id: "spot",
    label: "Spot",
    tag: "Hasta 90 % · interrumpible",
    summary:
      "Usas capacidad sobrante de AWS con hasta 90 % de descuento, pero no es tuya: AWS puede recuperarla con 2 minutos de aviso. Solo para trabajos que toleran interrupciones.",
  },
];

const SCENARIOS: Scenario[] = [
  // Bajo demanda
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
    why: "Es temporal (descarta la reserva) y no tolera cortes (descarta Spot).",
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
    why: "Primero se mide el uso; la reserva llega cuando el uso es predecible.",
  },
  {
    prompt:
      "Tienes un trabajo urgente de un solo día que no puede detenerse a la mitad.",
    answer: "on-demand",
    clue: "no puede detenerse a la mitad",
    why: "Un solo día descarta la reserva, y como no tolera interrupciones, Spot tampoco sirve.",
  },
  {
    prompt:
      "Quieres pagar solo las horas que usas tu instancia, sin pagos por adelantado ni contratos.",
    answer: "on-demand",
    clue: "sin pagos por adelantado ni contratos",
    why: "Bajo demanda es el pago por uso puro: 1 hora de uso, 1 hora de pago.",
  },
  {
    prompt:
      "Clonas toda tu arquitectura durante 1 hora para una prueba de estrés y después la borras.",
    answer: "on-demand",
    clue: "durante 1 hora",
    why: "Probar a escala de producción sale barato porque pagas solo el tiempo de la prueba.",
  },
  {
    prompt:
      "Atenderás a los clientes de un evento de 3 días y una interrupción haría perder ventas.",
    answer: "on-demand",
    clue: "evento de 3 días",
    why: "Es corto y crítico: sin compromiso y sin riesgo de que AWS recupere la instancia.",
  },
  // Reservada
  {
    prompt:
      "Tu servidor web atiende tráfico estable las 24 horas y seguirá así al menos 3 años.",
    answer: "reserved",
    clue: "al menos 3 años",
    why: "Uso estable y largo: comprometerte 3 años da el mayor descuento (hasta 72 %).",
  },
  {
    prompt:
      "La base de datos de tu empresa corre todo el día, todos los días, y no cambiará en el próximo año.",
    answer: "reserved",
    clue: "no cambiará en el próximo año",
    why: "Un uso continuo y predecible durante 1 año es el caso ideal para reservar.",
  },
  {
    prompt:
      "Ya mediste tu uso durante meses: siempre necesitas 4 instancias encendidas y quieres pagar menos.",
    answer: "reserved",
    clue: "siempre necesitas 4 instancias encendidas",
    why: "Cuando el uso mínimo es conocido, la reserva convierte esa base en descuento.",
  },
  {
    prompt:
      "Tu sistema de nómina debe estar disponible sin interrupciones los próximos 3 años y buscas ahorrar.",
    answer: "reserved",
    clue: "los próximos 3 años",
    why: "No tolera interrupciones (descarta Spot) y es de largo plazo (reserva).",
  },
  {
    prompt:
      "Finanzas acepta pagar por adelantado un año de uso a cambio de un descuento grande.",
    answer: "reserved",
    clue: "pagar por adelantado un año",
    why: "Comprometerte por adelantado es justo lo que premia la instancia reservada.",
  },
  {
    prompt:
      "Una app interna que usan todos los empleados corre sin parar y lleva años con el mismo tamaño.",
    answer: "reserved",
    clue: "lleva años con el mismo tamaño",
    why: "Uso constante y sin cambios: el descuento por compromiso es puro ahorro.",
  },
  {
    prompt:
      "Tu web corporativa tiene una carga base constante que no se ha movido en dos años.",
    answer: "reserved",
    clue: "carga base constante",
    why: "La carga base estable se reserva; los picos ocasionales se cubren bajo demanda.",
  },
  {
    prompt:
      "Firmaste un contrato de 3 años con un cliente que exige el servicio siempre encendido.",
    answer: "reserved",
    clue: "siempre encendido",
    why: "Sabes que lo usarás 3 años sin parar: reservarlo cuesta mucho menos que bajo demanda.",
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
      "Entrenas modelos de machine learning que guardan su avance y buscas el mayor descuento posible.",
    answer: "spot",
    clue: "guardan su avance",
    why: "Si AWS recupera la instancia, retomas desde el último punto guardado.",
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
      "Tus pruebas automáticas se repiten solas si el servidor desaparece a la mitad.",
    answer: "spot",
    clue: "se repiten solas",
    why: "Las tareas que se reintentan solas son un caso clásico de Spot.",
  },
  {
    prompt:
      "Un trabajo de cálculo puede correr de 5:30 a 7:00 a. m. o cuando haya capacidad; si lo apagan con 2 minutos de aviso, no pasa nada.",
    answer: "spot",
    clue: "con 2 minutos de aviso, no pasa nada",
    why: "Spot avisa con 2 minutos antes de recuperar la instancia; si eso no te afecta, es lo más barato.",
  },
  {
    prompt:
      "Conviertes videos a otros formatos en una cola; si una conversión se corta, vuelve a la cola.",
    answer: "spot",
    clue: "vuelve a la cola",
    why: "Una cola que reintenta tolera interrupciones: Spot ahorra hasta 90 %.",
  },
];

export const PRECIOS_QUESTIONS = scenarioQuestions(
  "precio",
  SCENARIOS,
  OPTIONS,
);
