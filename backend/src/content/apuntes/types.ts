import type { TopicType } from '@aps/shared';

/** One card of the course notes (Apuntes_Nube_AWS), the source of truth for CLF concepts. */
export type ApuntesConcept = {
  /** Unique across every topic; `confusedWith` points at these. */
  key: string;
  /** Id of an existing card for the same concept, so its progress survives. */
  id?: string;
  name: string;
  /** What an acronym stands for. */
  long?: string;
  /** Main clause first: the crossword clue is the text before the first ";". */
  definition: string;
  /** Concepts it gets mixed up with; their definitions become the distractors. */
  confusedWith?: string[];
  /** Extra tip shown after answering. */
  note?: string;
};

export type ApuntesTopic = {
  id: string;
  name: string;
  type: TopicType;
  sortOrder: number;
  concepts: ApuntesConcept[];
};
