import type {
  AdminGuestRow,
  AdminMetrics,
  AdminUserRow,
} from "@aps/shared";
import { adminServerGet } from "@/lib/admin-server";

export async function getAdminMetrics(): Promise<AdminMetrics | null> {
  return adminServerGet<AdminMetrics>("/admin/metrics");
}

export async function getAdminUsers(): Promise<{
  data: AdminUserRow[];
  source: "api" | "unavailable";
}> {
  const data = await adminServerGet<AdminUserRow[]>("/admin/users");
  if (data) return { data, source: "api" };
  return { data: [], source: "unavailable" };
}

export async function getAdminGuests(): Promise<{
  data: AdminGuestRow[];
  source: "api" | "unavailable";
}> {
  const data = await adminServerGet<AdminGuestRow[]>("/admin/guests");
  if (data) return { data, source: "api" };
  return { data: [], source: "unavailable" };
}
