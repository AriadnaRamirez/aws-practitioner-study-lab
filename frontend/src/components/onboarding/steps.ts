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
    title: "Flashcards MCQ, no flip",
    body: "En Repaso / Memoriza cada ítem es una pregunta de 4 opciones sobre servicios y conceptos. El enunciado puede pedir la definición, el nombre o reconocer el servicio entre distractores cercanos.",
  },
  {
    id: "miss-repeat",
    eyebrow: "Paso 2 · Refuerzo",
    title: "Si fallas, vuelve (miss-repeat)",
    body: "En Repaso y en Modo Estudio para examen, un fallo se reencola unas cartas más adelante en la misma sesión. Así practicas otra vez lo que aún no dominas, sin esperar al día siguiente.",
  },
  {
    id: "dominio",
    eyebrow: "Paso 3 · Memoria",
    title: "Dominio = 3 aciertos seguidos",
    body: "Un ítem queda dominado cuando lo aciertas 3 veces seguidas. Esas respuestas memorizadas son la métrica del podio — no el score del examen cronometrado.",
  },
  {
    id: "examen",
    eyebrow: "Paso 4 · Examen",
    title: "Estudio vs Examen cronometrado",
    body: "Modo Estudio para examen: feedback inmediato, explicación y miss-repeat. Modo Examen: cronometrado (tamaños 10–50 y mock 65/90), sin miss-repeat ni rachas en vivo; el resultado y las explicaciones llegan al final.",
  },
];

export const ONBOARDING_TITLE = "Así funciona…";
