import type { FlashVariant, KnowledgeItem } from '@aps/shared';
import { FLASH_VARIANTS } from '@aps/shared';

export type ExamChoicesTuple = [string, string, string, string];

export interface RenderedFlash {
  variant: FlashVariant;
  stem: string;
  choices: ExamChoicesTuple;
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickThree(pool: string[], exclude: string): string[] {
  const uniq = [...new Set(pool.map((s) => s.trim()).filter(Boolean))].filter(
    (s) => s !== exclude,
  );
  shuffleInPlace(uniq);
  return uniq.slice(0, 3);
}

function padDistractors(
  base: string[],
  fallbackPool: string[],
  exclude: string,
  need = 3,
): string[] {
  const out = [...base];
  for (const s of fallbackPool) {
    if (out.length >= need) break;
    const t = s.trim();
    if (!t || t === exclude || out.includes(t)) continue;
    out.push(t);
  }
  while (out.length < need) {
    out.push(`Opción alternativa ${out.length + 1}`);
  }
  return out.slice(0, need);
}

function packChoices(
  correct: string,
  distractors: string[],
): { choices: ExamChoicesTuple; correctIndex: 0 | 1 | 2 | 3 } {
  const slots: string[] = [correct, ...distractors.slice(0, 3)];
  shuffleInPlace(slots);
  const correctIndex = slots.indexOf(correct) as 0 | 1 | 2 | 3;
  return {
    choices: slots as ExamChoicesTuple,
    correctIndex,
  };
}

/** Same-topic names make plausible distractors; fall back to the whole pool. */
function otherNames(item: KnowledgeItem, pool: KnowledgeItem[]): string[] {
  const others = pool.filter((k) => k.id !== item.id);
  const sameTopic = others.filter((k) => k.topicId === item.topicId);
  return (sameTopic.length >= 3 ? sameTopic : others).map((k) => k.name);
}

export function pickVariant(item: KnowledgeItem): FlashVariant {
  const allowed = item.allowedVariants.filter((v) =>
    (FLASH_VARIANTS as readonly string[]).includes(v),
  );
  const list = allowed.length ? allowed : [...FLASH_VARIANTS];
  return list[Math.floor(Math.random() * list.length)]!;
}

/**
 * Canonical KnowledgeItem → MCQ 4 choices for one flash variant (maestro §4.1).
 */
export function renderFlashVariant(
  item: KnowledgeItem,
  variant: FlashVariant,
  pool: KnowledgeItem[],
): RenderedFlash {
  switch (variant) {
    case 'NAME_TO_DEFINITION': {
      const distractors = padDistractors(
        pickThree(item.distractors, item.definition),
        pool.filter((k) => k.id !== item.id).map((k) => k.definition),
        item.definition,
      );
      const packed = packChoices(item.definition, distractors);
      return {
        variant,
        stem: `¿Qué es ${item.name}?`,
        explanation: item.explanation,
        ...packed,
      };
    }
    case 'DEFINITION_TO_NAME': {
      const distractors = padDistractors(
        pickThree(otherNames(item, pool), item.name),
        item.distractors,
        item.name,
      );
      const packed = packChoices(item.name, distractors);
      return {
        variant,
        stem: item.definition,
        explanation: item.explanation,
        ...packed,
      };
    }
    case 'NAME_FOCUS': {
      const distractors = padDistractors(
        pickThree(otherNames(item, pool), item.name),
        item.distractors,
        item.name,
      );
      const packed = packChoices(item.name, distractors);
      return {
        variant,
        stem: `Identifica el nombre correcto: «${item.definition.trim()}»`,
        explanation: item.explanation,
        ...packed,
      };
    }
    default: {
      const _exhaustive: never = variant;
      throw new Error(`Unknown flash variant: ${_exhaustive}`);
    }
  }
}
