import { redirect } from "next/navigation";

export default function ProgresoPage() {
  redirect("/cuenta?tab=progreso");
}
