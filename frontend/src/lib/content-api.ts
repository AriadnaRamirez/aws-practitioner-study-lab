import type { ExamQuestion, KnowledgeItem, Topic } from "@aps/shared";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined"
    ? "http://127.0.0.1:43124/api/v1"
    : "/api/v1");

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Fallback mocks if API is down — keeps /admin navigable offline. */
export const MOCK_TOPICS: Topic[] = [
  {
    id: "topic-compute",
    trackId: "CLF",
    type: "SERVICE",
    name: "Servicios de cómputo",
    parentId: null,
    sortOrder: 10,
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
  {
    id: "topic-storage",
    trackId: "CLF",
    type: "SERVICE",
    name: "Almacenamiento",
    parentId: null,
    sortOrder: 20,
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
  {
    id: "topic-cloud-fundamentals",
    trackId: "CLF",
    type: "CONCEPT",
    name: "Conceptos de la nube",
    parentId: null,
    sortOrder: 30,
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
];

export const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "ki-ec2",
    topicId: "topic-compute",
    trackId: "CLF",
    name: "EC2",
    definition: "Cómputo redimensionable (VMs) en la nube.",
    distractors: ["S3", "RDS", "CloudFront"],
    explanation: "EC2 = Elastic Compute Cloud.",
    allowedVariants: [
      "NAME_TO_DEFINITION",
      "DEFINITION_TO_NAME",
      "NAME_FOCUS",
    ],
    status: "published",
    externalKey: "clf.ec2",
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
  {
    id: "ki-s3",
    topicId: "topic-storage",
    trackId: "CLF",
    name: "S3",
    definition: "Almacenamiento de objetos durable.",
    distractors: ["EBS", "EFS", "SQS"],
    explanation: "S3 = Simple Storage Service.",
    allowedVariants: [
      "NAME_TO_DEFINITION",
      "DEFINITION_TO_NAME",
      "NAME_FOCUS",
    ],
    status: "published",
    externalKey: "clf.s3",
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
];

export const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: "eq-ec2-use",
    topicId: "topic-compute",
    trackId: "CLF",
    stem: "¿Qué servicio proporciona cómputo virtual redimensionable?",
    choices: ["Amazon EC2", "Amazon S3", "Amazon Route 53", "Amazon SNS"],
    correctIndex: 0,
    explanation: "EC2 = Elastic Compute Cloud.",
    status: "published",
    externalKey: "clf.q.ec2-use",
    createdAt: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
];

export async function getTopics(): Promise<{
  data: Topic[];
  source: "api" | "mock";
}> {
  const data = await fetchJson<Topic[]>("/topics");
  if (data) return { data, source: "api" };
  return { data: MOCK_TOPICS, source: "mock" };
}

export async function getKnowledgeItems(): Promise<{
  data: KnowledgeItem[];
  source: "api" | "mock";
}> {
  const data = await fetchJson<KnowledgeItem[]>("/knowledge-items");
  if (data) return { data, source: "api" };
  return { data: MOCK_KNOWLEDGE, source: "mock" };
}

export async function getExamQuestions(): Promise<{
  data: ExamQuestion[];
  source: "api" | "mock";
}> {
  const data = await fetchJson<ExamQuestion[]>("/exam-questions");
  if (data) return { data, source: "api" };
  return { data: MOCK_QUESTIONS, source: "mock" };
}
