import type {
  ExamQuestion,
  KnowledgeItem,
  Topic,
} from "@aps/shared";
import { getStoredToken } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-users-api";
import { getApiUrl } from "@/lib/api";

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(". ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return `Error ${res.status}`;
}

/** Prefer JWT admin; fall back to x-admin-token. */
async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const jwt = getStoredToken();
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
  headers.set("x-admin-token", getAdminToken());

  const res = await fetch(`${getApiUrl()}${path}`, { ...init, headers });
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as T;
}

export function listAdminTopics() {
  return adminFetch<Topic[]>("/admin/topics");
}

export function createTopic(body: {
  trackId: string;
  type: Topic["type"];
  name: string;
  sortOrder?: number;
  parentId?: string | null;
}) {
  return adminFetch<Topic>("/admin/topics", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateTopic(
  id: string,
  body: Partial<{
    trackId: string;
    type: Topic["type"];
    name: string;
    sortOrder: number;
    parentId: string | null;
  }>,
) {
  return adminFetch<Topic>(`/admin/topics/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteTopic(id: string) {
  return adminFetch<void>(`/admin/topics/${id}`, { method: "DELETE" });
}

export function listAdminKnowledge() {
  return adminFetch<KnowledgeItem[]>("/admin/knowledge-items");
}

export function createKnowledge(
  body: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">,
) {
  return adminFetch<KnowledgeItem>("/admin/knowledge-items", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateKnowledge(
  id: string,
  body: Partial<Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">>,
) {
  return adminFetch<KnowledgeItem>(`/admin/knowledge-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteKnowledge(id: string) {
  return adminFetch<void>(`/admin/knowledge-items/${id}`, {
    method: "DELETE",
  });
}

export function listAdminQuestions() {
  return adminFetch<ExamQuestion[]>("/admin/exam-questions");
}

export function createQuestion(
  body: Omit<ExamQuestion, "id" | "createdAt" | "updatedAt">,
) {
  return adminFetch<ExamQuestion>("/admin/exam-questions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateQuestion(
  id: string,
  body: Partial<Omit<ExamQuestion, "id" | "createdAt" | "updatedAt">>,
) {
  return adminFetch<ExamQuestion>(`/admin/exam-questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteQuestion(id: string) {
  return adminFetch<void>(`/admin/exam-questions/${id}`, {
    method: "DELETE",
  });
}
