import { redirect } from "next/navigation";

export default function HistorialIndexPage() {
  redirect("/cuenta?tab=historial");
}
