import type { Metadata } from "next";
import { EstudiarHub } from "@/components/study/estudiar-mode-tabs";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return <EstudiarHub />;
}
