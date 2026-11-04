import type { FlashVariant, KnowledgeItem } from '@aps/shared';
import { FLASH_VARIANTS } from '@aps/shared';

export type ExamChoicesTuple = [string, string, string, string];

interface RenderedFlash {
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

/** Topic id → taxonomy kind (SERVICE / CONCEPT); undefined when unknown. */
export type TopicTypeOf = (topicId: string) => string | undefined;

/**
 * Three plausible wrong names: same topic first, then same kind of topic,
 * then anything. A service never competes only against concepts.
 */
function rankedNames(
  item: KnowledgeItem,
  pool: KnowledgeItem[],
  topicTypeOf?: TopicTypeOf,
): string[] {
  const others = pool.filter((k) => k.id !== item.id && k.name.trim() !== item.name.trim());
  const kind = topicTypeOf?.(item.topicId);
  const sameTopic = others.filter((k) => k.topicId === item.topicId);
  const sameKind = others.filter(
    (k) => k.topicId !== item.topicId && kind != null && topicTypeOf?.(k.topicId) === kind,
  );
  const rest = others.filter((k) => !sameTopic.includes(k) && !sameKind.includes(k));
  const ranked = [
    ...shuffleInPlace([...sameTopic]),
    ...shuffleInPlace([...sameKind]),
    ...shuffleInPlace([...rest]),
  ].map((k) => k.name.trim());
  return [...new Set(ranked)].slice(0, 3);
}

/**
 * Every variant already shows the definition (stem or correct choice), so
 * drop it from the explanation instead of reading it twice.
 */
export function flashExplanation(item: KnowledgeItem): string {
  const definition = item.definition.trim();
  const full = item.explanation.trim();
  if (!definition || !full.includes(definition)) return full;
  const rest = full.replace(definition, '').replace(/\s{2,}/g, ' ').trim();
  return rest.length >= 12 ? rest : full;
}

/** What the wrong pick actually is, so the miss teaches a contrast. */
export function describeWrongChoice(
  chosen: string,
  item: KnowledgeItem,
  pool: KnowledgeItem[],
): string | null {
  const text = chosen.trim();
  if (!text) return null;
  const others = pool.filter((k) => k.id !== item.id);
  const byName = others.find((k) => k.name.trim() === text);
  if (byName) return `${byName.name}: ${byName.definition.trim()}`;
  const byDefinition = others.find((k) => k.definition.trim() === text);
  if (byDefinition) return `Esa descripción es de ${byDefinition.name}.`;
  return null;
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
  topicTypeOf?: TopicTypeOf,
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
        explanation: flashExplanation(item),
        ...packed,
      };
    }
    case 'DEFINITION_TO_NAME': {
      const distractors = padDistractors(
        rankedNames(item, pool, topicTypeOf),
        item.distractors,
        item.name,
      );
      const packed = packChoices(item.name, distractors);
      return {
        variant,
        stem: item.definition,
        explanation: flashExplanation(item),
        ...packed,
      };
    }
    case 'NAME_FOCUS': {
      const distractors = padDistractors(
        rankedNames(item, pool, topicTypeOf),
        item.distractors,
        item.name,
      );
      const packed = packChoices(item.name, distractors);
      return {
        variant,
        stem: `Identifica el nombre correcto: «${item.definition.trim()}»`,
        explanation: flashExplanation(item),
        ...packed,
      };
    }
    default: {
      const _exhaustive: never = variant;
      throw new Error(`Unknown flash variant: ${_exhaustive}`);
    }
  }
}
