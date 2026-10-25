import type {
  AnswerStudyRequest,
  AnswerStudyResponse,
  StartStudySessionRequest,
  StudySessionSummary,
  StudySessionView,
} from "@aps/shared";
import { getApiUrl, getStoredToken } from "@/lib/api";

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      message?: string | string[];
      errors?: string[];
    };
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors.join(". ");
    }
    if (Array.isArray(body.message)) {
      return body.message.join(". ");
    }
    if (typeof body.message === "string") {
      return body.message;
    }
  } catch {
    /* ignore */
  }
  return `Error ${res.status}`;
}

async function studyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredToken();
  if (!token) {
    throw new Error("Necesitas iniciar sesión para estudiar");
  }
  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${getApiUrl()}${path}`, { ...init, headers });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<T>;
}

export function startStudySession(body: StartStudySessionRequest) {
  return studyFetch<StudySessionView>("/study/sessions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function answerStudy(
  sessionId: string,
  body: AnswerStudyRequest,
) {
  return studyFetch<AnswerStudyResponse>(
    `/study/sessions/${sessionId}/answer`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export function fetchStudySummary(sessionId: string) {
  return studyFetch<StudySessionSummary>(
    `/study/sessions/${sessionId}/summary`,
  );
}
