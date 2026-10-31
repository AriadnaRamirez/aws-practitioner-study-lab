import { AdminPage } from "@/components/admin/admin-ui";
import { KnowledgeCrud } from "@/components/admin/knowledge-crud";
import type { KnowledgeItem, Topic } from "@aps/shared";
import { adminServerGet } from "@/lib/admin-server";

async function adminGet<T>(path: string): Promise<T[]> {
  return (await adminServerGet<T[]>(path)) ?? [];
}

export default async function AdminFlashPage() {
  const [topics, knowledge] = await Promise.all([
    adminGet<Topic>("/admin/topics"),
    adminGet<KnowledgeItem>("/admin/knowledge-items"),
  ]);

  return (
    <AdminPage
      title="Cartas flash"
      description="Conceptos con definición, explicación y distractores. Solo las publicadas entran en las sesiones de estudio."
    >
      <KnowledgeCrud initial={knowledge} topics={topics} />
    </AdminPage>
  );
}
