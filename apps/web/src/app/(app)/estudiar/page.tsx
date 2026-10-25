import type { Metadata } from "next";
import { ExamStudyPanel } from "@/components/study/exam-study-panel";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, var(--hero-mesh-a), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 10%, var(--hero-mesh-c), transparent 50%)",
        }}
      />
      <ExamStudyPanel />
    </div>
  );
}
