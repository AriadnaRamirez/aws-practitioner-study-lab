import { AdminPageHeader } from "@/components/admin/admin-ui";
import { TopicsCrud } from "@/components/admin/topics-crud";
import type { Topic } from "@aps/shared";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:43124/api/v1";
const ADMIN_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
  process.env.ADMIN_TOKEN ??
  "dev-admin-token";

async function loadTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${API_URL}/admin/topics`, {
      headers: { "x-admin-token": ADMIN_TOKEN },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Topic[];
  } catch {
    return [];
  }
}

export default async function AdminTemasPage() {
  const data = await loadTopics();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Temas"
        description="Taxonomía de los tracks CLF y AIF. Cada tema agrupa cartas flash y preguntas del banco."
      />
      <TopicsCrud initial={data} />
    </div>
  );
}
