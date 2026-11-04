import type { KnowledgeItem } from "@aps/shared";
import {
  AWS_SERVICES_CATEGORY,
  STUDY_CATEGORIES,
  type StudyCategory,
} from "@/lib/study-categories";

export type GameCategory = {
  category: StudyCategory;
  items: KnowledgeItem[];
};

/** Two cards with the same name and different definitions can't be told apart. */
function uniqueByName(items: readonly KnowledgeItem[]): KnowledgeItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** "Servicios de AWS" first, then every study category with at least `min` usable concepts. */
export function playableCategories(
  items: readonly KnowledgeItem[],
  min: number,
  accept: (item: KnowledgeItem) => boolean = () => true,
): GameCategory[] {
  return [AWS_SERVICES_CATEGORY, ...STUDY_CATEGORIES]
    .map((category) => {
      const topics = new Set(category.topicIds);
      return {
        category,
        items: uniqueByName(
          items.filter((i) => topics.has(i.topicId) && accept(i)),
        ),
      };
    })
    .filter((c) => c.items.length >= min);
}

export function categoryBadge(category: StudyCategory): string {
  return category.group === "aws" ? "Servicios" : "Conceptos";
}

/** Card face / clue: the definition up to its first ";" so it stays short. */
export function shortDefinition(definition: string): string {
  const cut = definition.split(";")[0].trim();
  return /[.!?]$/.test(cut) ? cut : `${cut}.`;
}
