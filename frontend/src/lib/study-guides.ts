import type { KnowledgeItem } from "@aps/shared";
import { getApiUrl } from "@/lib/api";
import {
  AWS_SERVICES_CATEGORY,
  categoriesInGroup,
  categoryById,
  type StudyCategory,
  type StudyCategoryGroup,
  type StudyCategoryId,
} from "@/lib/study-categories";

/**
 * Guías imprimibles: una para todos los servicios de AWS y una por módulo de
 * conceptos. Los ids son estables: forman la URL /guias/<id>.
 */
export type StudyGuideId =
  | "servicios-aws"
  | "conceptos-nube"
  | "conceptos-linux"
  | "conceptos-redes"
  | "conceptos-seguridad";

export type StudyGuide = {
  id: StudyGuideId;
  group: StudyCategoryGroup;
  categoryId: StudyCategoryId;
  title: string;
  subtitle: string;
  /** Secciones del documento, en el orden de study-categories. */
  sections: StudyCategory[];
};

function moduleGuide(id: StudyGuideId, categoryId: StudyCategoryId): StudyGuide {
  const category = categoryById(categoryId);
  if (!category) throw new Error(`Unknown study category ${categoryId}`);
  return {
    id,
    group: category.group,
    categoryId,
    title: category.title,
    subtitle: category.subtitle,
    sections: [category],
  };
}

export const STUDY_GUIDES: StudyGuide[] = [
  {
    id: "servicios-aws",
    group: "aws",
    categoryId: AWS_SERVICES_CATEGORY.id,
    title: AWS_SERVICES_CATEGORY.title,
    subtitle: AWS_SERVICES_CATEGORY.subtitle,
    sections: categoriesInGroup("aws"),
  },
  moduleGuide("conceptos-nube", "cloud-concepts"),
  moduleGuide("conceptos-linux", "linux"),
  moduleGuide("conceptos-redes", "net-basics"),
  moduleGuide("conceptos-seguridad", "sec-basics"),
];

export function guideById(id: string): StudyGuide | null {
  return STUDY_GUIDES.find((g) => g.id === id) ?? null;
}

export function guidesInGroup(group: StudyCategoryGroup): StudyGuide[] {
  return STUDY_GUIDES.filter((g) => g.group === group);
}

export type GuideSection = {
  category: StudyCategory;
  items: KnowledgeItem[];
};

/** Conceptos de la guía agrupados por sección; respeta el orden del banco. */
export function guideSections(
  guide: StudyGuide,
  items: readonly KnowledgeItem[],
): GuideSection[] {
  return guide.sections.map((category) => {
    const topics = new Set(category.topicIds);
    return {
      category,
      items: items.filter((i) => topics.has(i.topicId)),
    };
  });
}

export function guideConceptCount(
  guide: StudyGuide,
  items: readonly KnowledgeItem[],
): number {
  return guideSections(guide, items).reduce((n, s) => n + s.items.length, 0);
}

/**
 * Nota breve del concepto. Muchas explicaciones repiten la definición tras
 * la pista del nombre ("S3 significa…. <definición>"); solo queda lo nuevo.
 */
export function guideNote(item: KnowledgeItem): string | null {
  const note = item.explanation?.trim();
  if (!note) return null;
  const definition = item.definition.trim().replace(/[.\s]+$/, "");
  if (!definition) return note;
  const at = note.toLocaleLowerCase("es").indexOf(definition.toLocaleLowerCase("es"));
  if (at === -1) return note;
  const rest = `${note.slice(0, at)} ${note.slice(at + definition.length).replace(/^[.\s]+/, "")}`
    .replace(/\s+/g, " ")
    .trim();
  return rest || null;
}

export function guidePrintTitle(guide: StudyGuide): string {
  return `AWS Study Lab - ${guide.title}`;
}

/** Todos los conceptos publicados (una sola petición para todas las guías). */
export async function fetchGuideKnowledge(): Promise<KnowledgeItem[]> {
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}/knowledge-items`, { cache: "no-store" });
  } catch {
    throw new Error("No se pudo contactar la API. Intenta de nuevo.");
  }
  if (!res.ok) throw new Error(`No se pudieron cargar los conceptos (${res.status})`);
  return (await res.json()) as KnowledgeItem[];
}
