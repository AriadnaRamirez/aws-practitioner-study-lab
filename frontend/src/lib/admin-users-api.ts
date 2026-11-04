import type {
  AdminResetPasswordResponse,
  AdminUpdateUserRequest,
  AdminUserRow,
} from "@aps/shared";
import { getApiUrl, getStoredToken } from "@/lib/api";

/** Admin calls authenticate as the signed-in user; the API requires role ADMIN. */
export function adminAuthHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  const jwt = getStoredToken();
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
  return headers;
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
  const headers = adminAuthHeaders(init?.headers);
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
