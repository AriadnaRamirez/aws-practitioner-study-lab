import type { Metadata } from "next";
import { ExamRunner } from "@/components/exam/exam-runner";

export const metadata: Metadata = {
  title: "Modo Examen",
};

export default function ExamenPage() {
  return <ExamRunner />;
}
