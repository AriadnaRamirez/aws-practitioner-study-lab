import type {
  AnswerStudyRequest,
  AnswerStudyResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  PublicUser,
  RegisterRequest,
  ResetPasswordRequest,
  StartStudySessionRequest,
  StudySessionSummary,
  StudySessionView,
  Topic,
} from '@aps/shared';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:43124/api/v1';

export const AUTH_TOKEN_KEY = 'aps_access_token';

export function getApiUrl() {
  return API_URL;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeAuth(response: AuthResponse) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, response.tokens.accessToken);
  window.localStorage.setItem('aps_user', JSON.stringify(response.user));
}

export function clearAuth() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem('aps_user');
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      message?: string | string[];
      errors?: string[];
    };
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors.join('. ');
    }
    if (Array.isArray(body.message)) {
      return body.message.join('. ');
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    /* ignore */
  }
  return `Error ${res.status}`;
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (init?.auth) {
    const token = getStoredToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<T>;
}

export function register(body: RegisterRequest) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function login(body: LoginRequest) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function forgotPassword(body: ForgotPasswordRequest) {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function resetPassword(body: ResetPasswordRequest) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchMe() {
  return apiFetch<PublicUser>('/auth/me', { auth: true });
}

export function fetchTopics() {
  return apiFetch<Topic[]>('/topics');
}

export function startFlashSession(body: StartStudySessionRequest) {
  return apiFetch<StudySessionView>('/study/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
    auth: true,
  });
}

export function getStudySession(sessionId: string) {
  return apiFetch<StudySessionView>(`/study/sessions/${sessionId}`, {
    auth: true,
  });
}

export function answerStudy(sessionId: string, body: AnswerStudyRequest) {
  return apiFetch<AnswerStudyResponse>(
    `/study/sessions/${sessionId}/answer`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      auth: true,
    },
  );
}

export function getStudySummary(sessionId: string) {
  return apiFetch<StudySessionSummary>(
    `/study/sessions/${sessionId}/summary`,
    { auth: true },
  );
}
