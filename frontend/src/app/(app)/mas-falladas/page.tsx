import { redirect } from "next/navigation";

/** Antigua pestaña: ahora es un modo dentro de Estudiar. */
export default function MasFalladasPage() {
  redirect("/estudiar?mode=repaso");
}
