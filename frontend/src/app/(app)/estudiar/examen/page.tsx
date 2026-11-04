import { redirect } from "next/navigation";

/** El examen dejó de ser una pestaña de Estudiar. */
export default async function ExamenMovidoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (value) for (const part of value) query.append(key, part);
  }
  const q = query.toString();
  redirect(q ? `/examen?${q}` : "/examen");
}
