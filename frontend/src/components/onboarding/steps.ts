/** Copys de onboarding — cortos, para el estudiante. */

export type OnboardingStep = {
  id: "flash" | "miss-repeat" | "dominio" | "examen";
  eyebrow: string;
  title: string;
  body: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "flash",
    eyebrow: "1 · Cartas",
    title: "Conceptos con 4 opciones",
    body: "Practica nombre y definición de servicios AWS. Rápido y al grano.",
  },
  {
    id: "miss-repeat",
    eyebrow: "2 · Refuerzo",
    title: "Si fallas, regresa",
    body: "La carta vuelve más adelante en la misma sesión para que la practiques otra vez.",
  },
  {
    id: "dominio",
    eyebrow: "3 · Dominio",
    title: "3 aciertos seguidos",
    body: "Así marcas un concepto como dominado. Eso cuenta en el podio.",
  },
  {
    id: "examen",
    eyebrow: "4 · Examen",
    title: "Estudio o simulacro",
    body: "En Estudio ves la respuesta al momento. En Examen, cronómetro y resultado al final.",
  },
];

export const ONBOARDING_TITLE = "Cómo estudiar aquí";
