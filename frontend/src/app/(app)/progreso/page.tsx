import type { Metadata } from "next";
import { ProgressClient } from "@/components/study/progress-client";

export const metadata: Metadata = {
  title: "Progreso",
};

export default function ProgresoPage() {
  return <ProgressClient />;
}
