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
    title: "¡Hola! Te enseño la app",
    body: "Son unos segundos. Puedes saltarlo y verlo otra vez desde Cuenta.",
    path: "/dashboard",
  },
  {
    id: "examen",
    title: "Cuántos días faltan",
    body: "Si ya tienes fecha de examen, ponla aquí. Arriba verás los días que faltan.",
    anchors: ["exam-countdown"],
    path: "/dashboard",
  },
  {
    id: "partida",
    title: "Estudias con cartas",
    body: "Cada carta tiene 4 opciones. Si fallas, vuelve a salir. Con 3 aciertos seguidos, ya la dominas.",
    anchors: ["new-game"],
    path: "/dashboard",
  },
  {
    id: "menu",
    title: "El menú",
    body: "Estudiar: cartas y las que más se te dificultan. Examen: contra el reloj. Guías: léelas o bájalas en PDF. Minijuegos: crucigramas.",
    anchors: ["nav-main", MENU_ANCHOR],
  },
  {
    id: "indicadores",
    title: "Tu avance, arriba",
    body: "Ves cuánto dominas, tu racha de días y el podio. Tócalos para ver más.",
    anchors: ["header-stats"],
  },
  {
    id: "listo",
    title: "¡Listo! Empieza",
    body: "Tu primera partida son 10 cartas de todos los temas. Aprendes con cada respuesta.",
    path: "/dashboard",
    cta: { label: "Jugar mi primera partida", href: "/estudiar?quick=1&start=10" },
  },
];
