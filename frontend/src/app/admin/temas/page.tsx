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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Temas</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          CRUD de taxonomía (CLF + AIF). Auth: JWT admin o{" "}
          <code className="text-xs">x-admin-token</code>.
        </p>
      </div>
      <TopicsCrud initial={data} />
    </div>
  );
}
