/** Recorrido guiado — copys cortos, para el estudiante. */

export type TourStep = {
  id: string;
  title: string;
  body: string;
  /**
   * `data-tour` anchors to spotlight; the first one visible on screen wins.
   * No visible anchor (or none listed) → centered card.
   */
  anchors?: string[];
  /** Route where the anchors live; the tour navigates there first. */
  path?: string;
  /** Skip the step unless this anchor exists in the DOM (even if hidden). */
  requires?: string;
  /** Last step only: primary action that ends the tour and navigates. */
  cta?: { label: string; href: string };
};

/** Collapsed nav on phones: nav steps point at the "Menú" button instead. */
export const MENU_ANCHOR = "nav-menu";

export const TOUR_STEPS: TourStep[] = [
  {
    id: "bienvenida",
    title: "¡Hola! Te enseño cómo funciona",
    body: "Un recorrido de 30 segundos para preparar tu examen Cloud Practitioner. Puedes saltarlo y repetirlo desde Cuenta cuando quieras.",
    path: "/dashboard",
  },
  {
    id: "examen",
    title: "Tu examen, en cuenta regresiva",
    body: "Si ya sabes cuándo es tu examen, agéndalo aquí: verás cuántos días faltan y una meta diaria a tu medida.",
    anchors: ["exam-countdown"],
    path: "/dashboard",
  },
  {
    id: "partida",
    title: "Así se estudia: partidas de cartas",
    body: "Cada carta es un concepto del examen con 4 opciones. Si fallas, la carta vuelve a salir. Cuando aciertas la misma carta 3 veces seguidas, la dominas.",
    anchors: ["new-game"],
    path: "/dashboard",
  },
  {
    id: "menu",
    title: "Todo lo demás, en el menú",
    body: "Estudiar: arma partidas con los temas que quieras. Más falladas: repasa las cartas que se te resisten. Guías: lee cada tema o bájalo en PDF. Minijuegos: practica jugando.",
    anchors: ["nav-main", MENU_ANCHOR],
  },
  {
    id: "indicadores",
    title: "Tu avance, siempre a la vista",
    body: "Arriba ves tu % de conceptos dominados, tu racha de días seguidos y el podio. Tócalos para ver el detalle.",
    anchors: ["header-stats"],
  },
  {
    id: "listo",
    title: "¡Listo! Empieza jugando",
    body: "Tu primera partida es de 10 cartas de todos los temas: no necesitas saber nada antes, aprendes de cada respuesta. Tu perfil y este recorrido están en Cuenta.",
    path: "/dashboard",
    cta: { label: "Jugar mi primera partida", href: "/estudiar?quick=1&start=10" },
  },
];
