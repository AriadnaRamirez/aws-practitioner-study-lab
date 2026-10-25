import type {
  AdminResetPasswordResponse,
  AdminUpdateUserRequest,
  AdminUserRow,
} from "@aps/shared";
import { getApiUrl } from "@/lib/api";

export const ADMIN_TOKEN_KEY = "aps_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "dev-admin-token";
  return (
    window.localStorage.getItem(ADMIN_TOKEN_KEY) ??
    process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
    "dev-admin-token"
  );
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

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

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("x-admin-token", getAdminToken());
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${getApiUrl()}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as T;
}

export function updateAdminUser(
  id: string,
  body: AdminUpdateUserRequest,
): Promise<AdminUserRow> {
  return adminFetch<AdminUserRow>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function resetAdminUserPassword(
  id: string,
): Promise<AdminResetPasswordResponse> {
  return adminFetch<AdminResetPasswordResponse>(
    `/admin/users/${id}/reset-password`,
    { method: "POST" },
  );
}
