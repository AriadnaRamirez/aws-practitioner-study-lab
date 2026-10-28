/** Spanish copy aligned with documento maestro product rules. */

export type OnboardingStep = {
  id: "flash" | "miss-repeat" | "dominio" | "examen";
  eyebrow: string;
  title: string;
  body: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "flash",
    eyebrow: "Paso 1 · Repaso",
    title: "Flashcards de opción múltiple",
    body: "En Repaso / Memoriza cada concepto es una pregunta de 4 opciones sobre servicios y temas de AWS. El enunciado puede pedir la definición, el nombre o reconocer el servicio entre opciones parecidas.",
  },
  {
    id: "miss-repeat",
    eyebrow: "Paso 2 · Refuerzo",
    title: "Si fallas, vuelve a practicar",
    body: "En Repaso y en Estudio para examen, un fallo se vuelve a colar unas cartas más adelante en la misma sesión. Así practicas otra vez lo que aún no dominas, sin esperar al día siguiente.",
  },
  {
    id: "dominio",
    eyebrow: "Paso 3 · Memoria",
    title: "Dominio = 3 aciertos seguidos",
    body: "Un concepto queda dominado cuando lo aciertas 3 veces seguidas. Esas respuestas memorizadas son la métrica del podio — no el puntaje del examen cronometrado.",
  },
  {
    id: "examen",
    eyebrow: "Paso 4 · Examen",
    title: "Estudio vs examen cronometrado",
    body: "Estudio para examen: feedback al momento, explicación y refuerzo si fallas. Modo Examen: cronometrado (tamaños 10–50 y simulación 65/90), sin refuerzo ni rachas en vivo; el resultado y las explicaciones llegan al final.",
  },
];

export const ONBOARDING_TITLE = "Así funciona…";
