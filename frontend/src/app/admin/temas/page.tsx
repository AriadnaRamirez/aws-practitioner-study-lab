import { AdminPage } from "@/components/admin/admin-ui";
import { TopicsCrud } from "@/components/admin/topics-crud";
import type { Topic } from "@aps/shared";
import { adminServerGet } from "@/lib/admin-server";

async function loadTopics(): Promise<Topic[]> {
  return (await adminServerGet<Topic[]>("/admin/topics")) ?? [];
}

export default async function AdminTemasPage() {
  const data = await loadTopics();

  return (
    <AdminPage
      title="Temas"
      description="Taxonomía de los tracks CLF y AIF. Cada tema agrupa cartas flash y preguntas del banco."
    >
      <TopicsCrud initial={data} />
    </AdminPage>
  );
}
