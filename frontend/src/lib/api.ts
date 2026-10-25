import type {
  AdminGuestRow,
  AdminUserRow,
  AuthResponse,
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
  UsageSummary,
  WeakItemsResponse,
} from '@aps/shared';
import { GUEST_PROBE_STORAGE_KEY } from '@aps/shared';

// Relative by default so Try Live / port-forward use the same host as the UI
// (Next rewrites /api/v1 → Nest). Override with NEXT_PUBLIC_API_URL if needed.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export const AUTH_TOKEN_KEY = 'aps_access_token';

const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? 'dev-admin-token';

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

export function getStoredUser(): PublicUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('aps_user');
  if (!raw) return null;
  try {
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

export function startWeakReview(body: StartWeakReviewRequest = {}) {
  return apiFetch<StartWeakReviewResponse>('/study/sessions/weak-review', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(body),
  });
}
