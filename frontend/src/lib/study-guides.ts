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

const STUDY_GUIDES: StudyGuide[] = [
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

const MEANS_QUOTED = /significa\s+[“"']([^”"']+)[”"']/;
const MEANS_PLAIN = /significa\s+([^.:\n]+)/;
const TRADE_NAME = /es un nombre comercial, no una sigla/;

/**
 * Sigla o “Nombre comercial”, para mostrarla junto al nombre y no como párrafo.
 */
export function guideLabel(item: KnowledgeItem): string | null {
  const note = item.explanation?.trim() ?? "";
  const quoted = note.match(MEANS_QUOTED);
  if (quoted) return quoted[1].trim();
  const plain = note.match(MEANS_PLAIN);
  if (plain) return plain[1].trim();
  return null;
}

function stripNaming(note: string): string {
  return note
    .replace(/(?:^|\s)[^.!?]*significa\s+[“"'][^”"']+[”"']\.?\s*/g, " ")
    .replace(/(?:^|\s)[^.!?]*significa\s+[^.:]+[.:]\s*/g, " ")
    .replace(/(?:^|\s)[^.!?]*es un nombre comercial, no una sigla\.?\s*/g, " ");
}

function contentWords(text: string): string[] {
  return text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);
}

function sharedRatio(sentence: string, definition: string): number {
  const words = contentWords(sentence);
  const def = new Set(contentWords(definition));
  if (words.length < 4 || def.size < 3) return 0;
  let shared = 0;
  for (const word of words) if (def.has(word)) shared += 1;
  return shared / words.length;
}

/** Frases que solo reformulan la definición. */
function restatesDefinition(sentence: string, definition: string): boolean {
  const ratio = sharedRatio(sentence, definition);
  if (ratio >= 0.45) return true;
  const copula = /^\s*(?:el |la |los |las |un |una )?\S+\s+es\s+(?:un|una|el|la)\b/i.test(
    sentence,
  );
  return copula && ratio >= 0.25;
}

/**
 * Nota breve del concepto. Quita la definición repetida, la pista de la sigla
 * y las frases que solo reformulan lo mismo.
 */
export function guideNote(item: KnowledgeItem): string | null {
  const raw = item.explanation?.trim();
  if (!raw) return null;
  const definition = item.definition.trim().replace(/[.\s]+$/, "");
  let note = raw;
  if (definition) {
    const at = note.toLocaleLowerCase("es").indexOf(definition.toLocaleLowerCase("es"));
    if (at !== -1) {
      note = `${note.slice(0, at)} ${note.slice(at + definition.length).replace(/^[.\s]+/, "")}`;
    }
  }
  note = stripNaming(note).replace(/\s+/g, " ").trim().replace(/^[.\s]+/, "");

  const kept = note
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !restatesDefinition(sentence, item.definition));
  const text = kept.join(" ").trim();
  if (!text) return null;
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
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
