import { AdminPage } from "@/components/admin/admin-ui";
import { QuestionsCrud } from "@/components/admin/questions-crud";
import type { ExamQuestion, Topic } from "@aps/shared";
import { adminServerGet } from "@/lib/admin-server";

async function adminGet<T>(path: string): Promise<T[]> {
  return (await adminServerGet<T[]>(path)) ?? [];
}

export default async function AdminBancoPage() {
  const [topics, questions] = await Promise.all([
    adminGet<Topic>("/admin/topics"),
    adminGet<ExamQuestion>("/admin/exam-questions"),
  ]);

  return (
    <AdminPage
      title="Banco de preguntas"
      description="Preguntas de examen de opción múltiple con cuatro opciones. Las del track AIF dependen de su bandera de función."
    >
      <QuestionsCrud initial={questions} topics={topics} />
    </AdminPage>
  );
}
