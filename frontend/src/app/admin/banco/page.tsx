import { AdminPageHeader } from "@/components/admin/admin-ui";
import { QuestionsCrud } from "@/components/admin/questions-crud";
import type { ExamQuestion, Topic } from "@aps/shared";

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

export default async function AdminBancoPage() {
  const [topics, questions] = await Promise.all([
    adminGet<Topic>("/admin/topics"),
    adminGet<ExamQuestion>("/admin/exam-questions"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banco de preguntas"
        description="Preguntas de examen de opción múltiple con cuatro opciones. Las del track AIF dependen de su bandera de función."
      />
      <QuestionsCrud initial={questions} topics={topics} />
    </div>
  );
}
