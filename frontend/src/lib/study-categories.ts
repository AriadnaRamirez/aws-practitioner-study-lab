/**
 * Friendly study “shelves” — group bank topics into learner-facing categories.
 * Used by the blob category menu and deep-links (?category=…).
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
  /** Visual accent for the blob */
  tone: "orange" | "ink" | "slate" | "cream";
  glyph: "cloud" | "linux" | "network" | "book";
};

export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: "aws-services",
    title: "Servicios de AWS",
    subtitle: "Cómputo, storage, IAM y más",
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
    title: "Comandos de Linux",
    subtitle: "AMI, SSH y user data en EC2",
    topicIds: ["topic-linux"],
    tone: "ink",
    glyph: "linux",
  },
  {
    id: "networking",
    title: "Conceptos de redes",
    subtitle: "VPC, subnets, edge y DNS",
    topicIds: ["topic-networking"],
    tone: "slate",
    glyph: "network",
  },
  {
    id: "cloud-concepts",
    title: "Fundamentos cloud",
    subtitle: "Modelo, pilares y shared responsibility",
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
