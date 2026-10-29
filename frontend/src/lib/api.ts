import type {
  AdminGuestRow,
  AdminUserRow,
  AuthResponse,
  CreateUserExamRequest,
  DeleteUserExamResponse,
  ForgotPasswordRequest,
  GuestProbe,
  LoginRequest,
  PodiumResponse,
  PodiumWindow,
  PublicUser,
  RegisterRequest,
  ResetPasswordRequest,
  StartWeakReviewRequest,
  StartWeakReviewResponse,
  StudyHistoryResponse,
  UpdateUserExamRequest,
  UsageSummary,
  UserExam,
  WeakItemsResponse,
} from '@aps/shared';
import { GUEST_PROBE_STORAGE_KEY } from '@aps/shared';

// Relative by default so Try Live / port-forward use the same host as the UI
// (Next rewrites /api/v1 → Nest). Override with NEXT_PUBLIC_API_URL if needed.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export const AUTH_TOKEN_KEY = 'aps_access_token';
export const AUTH_USER_KEY = 'aps_user';
/** Cookie mirror so previews / hard navigations keep the session. */
export const AUTH_COOKIE = 'aps_access_token';

const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? 'dev-admin-token';

export function getApiUrl() {
  return API_URL;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1)) || null;
}

function writeAuthCookie(token: string) {
  // 7d — same ballpark as JWT_EXPIRES_IN default
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return (
      window.localStorage.getItem(AUTH_TOKEN_KEY) ?? readCookie(AUTH_COOKIE)
    );
  } catch {
    return readCookie(AUTH_COOKIE);
  }
}

export function storeAuth(response: AuthResponse) {
  const token = response.tokens.accessToken;
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
  } catch {
    /* private mode / blocked storage — cookie still helps */
  }
  writeAuthCookie(token);
}

export function setStoredUser(user: PublicUser) {
  try {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearAuth() {
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    /* ignore */
  }
  clearAuthCookie();
}

export function getStoredUser(): PublicUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublicUser;
  } catch {
    return null;
  }
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

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      'No se pudo contactar la API. ¿Está corriendo el backend en :43124?',
    );
  }
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

export function updateProfile(body: {
  username?: string;
  timezone?: string;
  podiumHidden?: boolean;
  examDate?: string | null;
}) {
  return apiFetch<PublicUser>('/auth/me', {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(body),
  });
}

export function deleteAccount(body: { password: string }) {
  return apiFetch<{ message: string }>('/auth/me', {
    method: 'DELETE',
    auth: true,
    body: JSON.stringify(body),
  });
}

export function fetchMyExams() {
  return apiFetch<UserExam[]>('/me/exams', { auth: true });
}

export function createMyExam(body: CreateUserExamRequest) {
  return apiFetch<UserExam>('/me/exams', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(body),
  });
}

export function updateMyExam(id: string, body: UpdateUserExamRequest) {
  return apiFetch<UserExam>(`/me/exams/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(body),
  });
}

export function deleteMyExam(id: string) {
  return apiFetch<DeleteUserExamResponse>(
    `/me/exams/${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  );
}

export function changePassword(body: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}) {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(body),
  });
}

export function fetchProgressOverview() {
  return apiFetch<import('@aps/shared').ProgressOverview>(
    '/progress/overview',
    { auth: true },
  );
}

export function fetchTopicProgress() {
  return apiFetch<import('@aps/shared').TopicProgressResponse>(
    '/progress/by-topic',
    { auth: true },
  );
}

export function getStoredGuestProbeId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(GUEST_PROBE_STORAGE_KEY);
}

export function storeGuestProbeId(id: string) {
  window.localStorage.setItem(GUEST_PROBE_STORAGE_KEY, id);
}

export function clearGuestProbeId() {
  window.localStorage.removeItem(GUEST_PROBE_STORAGE_KEY);
}

export function createGuestProbe() {
  return apiFetch<GuestProbe>('/guest/probes', { method: 'POST' });
}

export function fetchGuestProbe(id: string) {
  return apiFetch<GuestProbe>(`/guest/probes/${id}`);
}

export function recordGuestSession(id: string) {
  return apiFetch<GuestProbe>(`/guest/probes/${id}/sessions`, {
    method: 'POST',
  });
}

async function adminFetch<T>(path: string): Promise<T> {
  return apiFetch<T>(path, {
    headers: { 'x-admin-token': ADMIN_TOKEN },
  });
}

export function fetchUsageSummary() {
  return adminFetch<UsageSummary>('/admin/usage');
}

export function fetchAdminUsers() {
  return adminFetch<AdminUserRow[]>('/admin/users');
}

export function fetchAdminGuests() {
  return adminFetch<AdminGuestRow[]>('/admin/guests');
}

export function fetchPodium(window: PodiumWindow = 'all') {
  return apiFetch<PodiumResponse>(`/podium?window=${window}`, { auth: true });
}

export function fetchWeakItems(limit = 50) {
  return apiFetch<WeakItemsResponse>(`/progress/weak-items?limit=${limit}`, {
    auth: true,
  });
}

export function fetchStudySessions(limit = 50) {
  return apiFetch<StudyHistoryResponse>(`/study/sessions?limit=${limit}`, {
    auth: true,
  });
}

export function fetchSessionHistoryDetail(sessionId: string) {
  return apiFetch<import('@aps/shared').StudyHistoryDetail>(
    `/study/sessions/${sessionId}/history`,
    { auth: true },
  );
}

export function startWeakReview(body: StartWeakReviewRequest = {}) {
  return apiFetch<StartWeakReviewResponse>('/study/sessions/weak-review', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(body),
  });
}
