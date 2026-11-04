import type { Metadata } from "next";
import { ExamModesGate } from "@/components/exam/exam-modes-gate";
import { ExamRunner } from "@/components/exam/exam-runner";

export const metadata: Metadata = {
  title: "Modo Examen",
};

export default function ExamenPage() {
  return (
    <ExamModesGate>
      <ExamRunner />
    </ExamModesGate>
  );
}
