/**
 * Study categories → folder cards on the dashboard (?category= deep-links).
 */

export type StudyCategoryId =
  | "aws-services"
  | "linux"
  | "networking"
  | "cloud-concepts";

export type StudyCategory = {
  id: StudyCategoryId;
  /** Short title on the chip */
  title: string;
  /** One-line subtitle */
  subtitle: string;
  /** Match Topic.id values from the seed bank */
  topicIds: string[];
  /** Folder face color */
  tone: "orange" | "ink" | "slate" | "cream";
  glyph: "cloud" | "linux" | "network" | "book";
};

/**
 * Mazos de flashcards (grupos de conceptos).
 * No son modos de examen: son carpetas de KnowledgeItems (nombre ↔ definición).
 */
export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: "aws-services",
    title: "Servicios de AWS",
    subtitle: "EC2, S3, IAM, pricing…",
    topicIds: [
      "topic-compute",
      "topic-storage",
      "topic-security",
      "topic-billing",
    ],
    tone: "orange",
    glyph: "cloud",
  },
  {
    id: "linux",
    title: "Linux y CLI",
    subtitle: "AMI, SSH, user data",
    topicIds: ["topic-linux"],
    tone: "ink",
    glyph: "linux",
  },
  {
    id: "networking",
    title: "Redes",
    subtitle: "VPC, subnets, DNS, edge",
    topicIds: ["topic-networking"],
    tone: "slate",
    glyph: "network",
  },
  {
    id: "cloud-concepts",
    title: "Fundamentos cloud",
    subtitle: "Modelo y responsabilidad compartida",
    topicIds: ["topic-cloud-fundamentals"],
    tone: "cream",
    glyph: "book",
  },
];

export function categoryById(id: string | null | undefined): StudyCategory | null {
  if (!id) return null;
  return STUDY_CATEGORIES.find((c) => c.id === id) ?? null;
}

/** Topic ids for a category that exist in the current progress rows. */
export function resolveCategoryTopicIds(
  categoryId: string,
  availableTopicIds?: Iterable<string>,
): string[] {
  const cat = categoryById(categoryId);
  if (!cat) return [];
  if (!availableTopicIds) return [...cat.topicIds];
  const set = new Set(availableTopicIds);
  return cat.topicIds.filter((id) => set.has(id));
}
