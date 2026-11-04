import { sampleBalanced, type Rng } from "@/lib/minigames/random";

export type QuizOption = {
  id: string;
  label: string;
  /** Two or three words under the label: the trait that tells it apart. */
  tag: string;
  /** One line on what it is; shown as feedback for right and wrong picks. */
  summary: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** Id of the right option. */
  answer: string;
  options: readonly QuizOption[];
  /** Exact fragment of `prompt` that gives the answer away; "Pista" highlights it. */
  clue?: string;
  /** Extra reason when the option summary alone doesn't settle it. */
  why?: string;
};

/** Bank entry before its options are attached. */
export type Scenario = {
  prompt: string;
  answer: string;
  clue?: string;
  why?: string;
};

export function scenarioQuestions(
  prefix: string,
  scenarios: readonly Scenario[],
  options: readonly QuizOption[],
): QuizQuestion[] {
  return scenarios.map((s, i) => ({
    id: `${prefix}-${i}`,
    prompt: s.prompt,
    answer: s.answer,
    clue: s.clue,
    why: s.why,
    options,
  }));
}

/** A round where every right answer shows up before any repeats. */
export function quizRound(
  questions: readonly QuizQuestion[],
  size: number,
  rng: Rng = Math.random,
): QuizQuestion[] {
  return sampleBalanced(questions, size, (q) => q.answer, rng);
}
