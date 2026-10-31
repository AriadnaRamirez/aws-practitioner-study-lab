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
};

/** Collapsed nav on phones: nav steps point at the "Menú" button instead. */
export const MENU_ANCHOR = "nav-menu";

export const TOUR_STEPS: TourStep[] = [
  {
    id: "bienvenida",
    title: "¡Hola! Te enseño cómo funciona",
    body: "Un recorrido de un minuto por AWS Study Lab para preparar tu examen Cloud Practitioner. Puedes saltarlo y repetirlo desde Cuenta cuando quieras.",
  },
  {
    id: "examen",
    title: "Tu examen, en cuenta regresiva",
    body: "Agenda la fecha de tu examen y aquí verás cuántos días faltan. Toca la tarjeta para cambiarla cuando quieras.",
    anchors: ["exam-countdown"],
    path: "/dashboard",
  },
  {
    id: "partida",
    title: "Empieza una partida",
    body: "Elige cuántas cartas quieres y, si gustas, personaliza los temas. Cada carta es un concepto con 4 opciones: acierta 3 veces seguidas para dominarlo.",
    anchors: ["new-game"],
    path: "/dashboard",
  },
  {
    id: "estudiar",
    title: "Estudiar",
    body: "Juega partidas de cartas a tu ritmo. Si fallas una carta, regresa más adelante en la misma partida para que la practiques otra vez.",
    anchors: ["nav-estudiar", MENU_ANCHOR],
  },
  {
    id: "mas-falladas",
    title: "Más falladas",
    body: "Reúne las cartas que se te resisten y con cuáles las confundes. Repásalas aquí hasta que salgan solas.",
    anchors: ["nav-mas-falladas", MENU_ANCHOR],
  },
  {
    id: "guias",
    title: "Guías",
    body: "Lee cada tema con calma o descárgalo en PDF para estudiar sin pantalla.",
    anchors: ["nav-guias", MENU_ANCHOR],
  },
  {
    id: "minijuegos",
    title: "Minijuegos",
    body: "Repasa conceptos de otra forma, en ratos cortos y sin presión.",
    anchors: ["nav-minijuegos", MENU_ANCHOR],
    requires: "nav-minijuegos",
  },
  {
    id: "indicadores",
    title: "Tus indicadores",
    body: "Arriba ves tu % de conceptos dominados, tu racha de días seguidos y el trofeo con el podio. Tócalos para ver el detalle.",
    anchors: ["header-stats"],
  },
  {
    id: "cuenta",
    title: "Cuenta",
    body: "Tu perfil, la fecha de tu examen, tu progreso por tema y tu historial. Desde aquí puedes repetir este recorrido cuando quieras.",
    anchors: ["nav-cuenta", MENU_ANCHOR],
  },
];
