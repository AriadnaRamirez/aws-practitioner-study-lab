import { AdminPageHeader } from "@/components/admin/admin-ui";
import { KnowledgeCrud } from "@/components/admin/knowledge-crud";
import type { KnowledgeItem, Topic } from "@aps/shared";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:43124/api/v1";
const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
  process.env.ADMIN_TOKEN ??
  "dev-admin-token";

async function adminGet<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "x-admin-token": ADMIN_TOKEN },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

export default async function AdminFlashPage() {
  const [topics, knowledge] = await Promise.all([
    adminGet<Topic>("/admin/topics"),
    adminGet<KnowledgeItem>("/admin/knowledge-items"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cartas flash"
        description="Conceptos con definición, explicación y distractores. Solo las publicadas entran en las sesiones de estudio."
      />
      <KnowledgeCrud initial={knowledge} topics={topics} />
    </div>
  );
}
