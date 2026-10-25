import type { Metadata } from "next";
import { CuentaProgresoClient } from "@/components/study/cuenta-progreso-client";

export const metadata: Metadata = {
  title: "Cuenta",
};

export default function CuentaPage() {
  return <CuentaProgresoClient />;
}
