import type { Metadata } from "next";
import { FlashStudyClient } from "@/components/study/flash-study-client";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return <FlashStudyClient />;
}
