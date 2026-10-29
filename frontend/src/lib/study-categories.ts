/**
 * Arquitectura de contenidos: dos grupos de temas (servicios de AWS y
 * conceptos por módulo). Los ids son estables: alimentan ?category= en URLs.
 */

export type StudyCategoryId =
  | "aws"
  | "concepts"
  | "compute"
  | "storage"
  | "databases"
  | "networking"
  | "security"
  | "management"
  | "cloud-concepts"
  | "linux"
  | "net-basics"
  | "sec-basics";

/** "aws" = Servicios de AWS; "module" = Conceptos por módulo de estudio. */
export type StudyCategoryGroup = "aws" | "module";

export type StudyCategory = {
  id: StudyCategoryId;
  group: StudyCategoryGroup;
  /** Nombre completo, p. ej. "Servicios de cómputo". */
  title: string;
  /** Etiqueta corta para chips bajo el encabezado del grupo. */
  shortTitle: string;
  /** One-line subtitle */
  subtitle: string;
  /** Match Topic.id values from the seed bank */
  topicIds: string[];
  /** Folder face color */
  tone: "orange" | "ink" | "slate" | "cream";
  glyph: "cloud" | "linux" | "network" | "book";
};

export type StudyGroup = {
  id: StudyCategoryGroup;
  title: string;
  shortTitle: string;
  /** Group-level category id (?category=). */
  categoryId: StudyCategoryId;
};

export const STUDY_GROUPS: StudyGroup[] = [
  {
    id: "aws",
    title: "Servicios de AWS",
    shortTitle: "Servicios",
    categoryId: "aws",
  },
  {
    id: "module",
    title: "Conceptos por módulo de estudio",
    shortTitle: "Conceptos",
    categoryId: "concepts",
  },
];

/** Temas de cartas, en el orden en que se muestran. */
export const STUDY_CATEGORIES: StudyCategory[] = [
  {
    id: "compute",
    group: "aws",
    title: "Servicios de cómputo",
    shortTitle: "Cómputo",
    subtitle: "EC2, AMI, Lambda",
    topicIds: ["topic-compute"],
    tone: "orange",
    glyph: "cloud",
  },
  {
    id: "storage",
    group: "aws",
    title: "Servicios de almacenamiento",
    shortTitle: "Almacenamiento",
    subtitle: "S3, EBS, EFS",
    topicIds: ["topic-storage"],
    tone: "ink",
    glyph: "cloud",
  },
  {
    id: "databases",
    group: "aws",
    title: "Servicios de bases de datos",
    shortTitle: "Bases de datos",
    subtitle: "DynamoDB, RDS",
    topicIds: ["topic-databases"],
    tone: "slate",
    glyph: "cloud",
  },
  {
    id: "networking",
    group: "aws",
    title: "Servicios de redes y entrega",
    shortTitle: "Redes y entrega",
    subtitle: "VPC, CloudFront, Route 53",
    topicIds: ["topic-networking"],
    tone: "cream",
    glyph: "network",
  },
  {
    id: "security",
    group: "aws",
    title: "Servicios de seguridad",
    shortTitle: "Seguridad",
    subtitle: "IAM, KMS, Shield, WAF, GuardDuty…",
    topicIds: ["topic-security"],
    tone: "orange",
    glyph: "cloud",
  },
  {
    id: "management",
    group: "aws",
    title: "Servicios de gestión y monitoreo",
    shortTitle: "Gestión y monitoreo",
    subtitle: "CloudWatch, CloudTrail, CLI, SNS…",
    topicIds: ["topic-management"],
    tone: "ink",
    glyph: "cloud",
  },
  {
    id: "cloud-concepts",
    group: "module",
    title: "Conceptos de la nube",
    shortTitle: "La nube",
    subtitle: "Modelo de responsabilidad compartida",
    topicIds: ["topic-cloud-fundamentals"],
    tone: "cream",
    glyph: "book",
  },
  {
    id: "linux",
    group: "module",
    title: "Conceptos de Linux",
    shortTitle: "Linux",
    subtitle: "Amazon Linux, AMI, SSH, user data",
    topicIds: ["topic-linux"],
    tone: "slate",
    glyph: "linux",
  },
  {
    id: "net-basics",
    group: "module",
    title: "Conceptos de redes",
    shortTitle: "Redes",
    subtitle: "OSI, IP, subredes, DNS, TCP/UDP",
    topicIds: ["topic-net-basics"],
    tone: "ink",
    glyph: "network",
  },
  {
    id: "sec-basics",
    group: "module",
    title: "Conceptos de seguridad",
    shortTitle: "Seguridad",
    subtitle: "Tríada CIA, MFA, cifrado, amenazas",
    topicIds: ["topic-sec-basics"],
    tone: "orange",
    glyph: "book",
  },
];

function topicIdsOfGroup(group: StudyCategoryGroup): string[] {
  return STUDY_CATEGORIES.filter((c) => c.group === group).flatMap(
    (c) => c.topicIds,
  );
}

/** Todos los servicios: los 6 tipos de servicio de AWS juntos. */
export const AWS_SERVICES_CATEGORY: StudyCategory = {
  id: "aws",
  group: "aws",
  title: "Servicios de AWS",
  shortTitle: "Todos los servicios",
  subtitle: "Los 6 tipos de servicio",
  topicIds: topicIdsOfGroup("aws"),
  tone: "orange",
  glyph: "cloud",
};

/** Todos los conceptos: los 4 módulos de estudio juntos. */
export const CONCEPTS_CATEGORY: StudyCategory = {
  id: "concepts",
  group: "module",
  title: "Conceptos por módulo de estudio",
  shortTitle: "Todos los conceptos",
  subtitle: "Nube, Linux, redes y seguridad",
  topicIds: topicIdsOfGroup("module"),
  tone: "ink",
  glyph: "book",
};

const GROUP_CATEGORIES = [AWS_SERVICES_CATEGORY, CONCEPTS_CATEGORY];

/** Partida rápida: todos los temas de ambos grupos. */
export const ALL_INICIO_TOPIC_IDS: string[] = Array.from(
  new Set(STUDY_CATEGORIES.flatMap((c) => c.topicIds)),
);

export function categoriesInGroup(group: StudyCategoryGroup): StudyCategory[] {
  return STUDY_CATEGORIES.filter((c) => c.group === group);
}

export function categoryById(id: string | null | undefined): StudyCategory | null {
  if (!id) return null;
  return (
    GROUP_CATEGORIES.find((c) => c.id === id) ??
    STUDY_CATEGORIES.find((c) => c.id === id) ??
    null
  );
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

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && [...sa].every((x) => sb.has(x));
}

export type StudyScope =
  | { kind: "all" }
  | { kind: "category"; category: StudyCategory }
  | { kind: "mixed"; categories: StudyCategory[] };

/**
 * Clasifica un conjunto de temas: todos, un grupo, un tipo/módulo o mezcla.
 * `knownTopicIds` limita la comparación a los temas que existen en el banco.
 */
export function scopeForTopicIds(
  topicIds: readonly string[],
  knownTopicIds?: Iterable<string>,
): StudyScope {
  const known = knownTopicIds ? new Set(knownTopicIds) : null;
  const visible = (ids: readonly string[]) =>
    known ? ids.filter((id) => known.has(id)) : [...ids];
  const picked = visible(topicIds);
  if (!picked.length || sameSet(picked, visible(ALL_INICIO_TOPIC_IDS))) {
    return { kind: "all" };
  }
  const exact = [...GROUP_CATEGORIES, ...STUDY_CATEGORIES].find((c) => {
    const ids = visible(c.topicIds);
    return ids.length > 0 && sameSet(picked, ids);
  });
  if (exact) return { kind: "category", category: exact };
  return {
    kind: "mixed",
    categories: STUDY_CATEGORIES.filter((c) =>
      c.topicIds.some((id) => picked.includes(id)),
    ),
  };
}

/** Título legible de un alcance, para encabezados de sesión. */
export function scopeTitle(scope: StudyScope): string {
  if (scope.kind === "all") return "Todos los temas";
  if (scope.kind === "category") return scope.category.title;
  return `Tu selección · ${scope.categories.length} temas`;
}

/** URL de inicio para un alcance; la partida rápida reparte por tema. */
export function studyStartHref(
  size: number,
  topicIds: readonly string[] | null,
  knownTopicIds?: Iterable<string>,
): string {
  const scope = topicIds ? scopeForTopicIds(topicIds, knownTopicIds) : null;
  if (!scope || scope.kind === "all") {
    return `/estudiar?quick=1&start=${size}`;
  }
  if (scope.kind === "category") {
    return `/estudiar?category=${scope.category.id}&start=${size}`;
  }
  const topics = topicIds!.map(encodeURIComponent).join(",");
  return `/estudiar?topics=${topics}&start=${size}`;
}
