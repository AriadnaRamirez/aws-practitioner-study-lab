import type { Metadata } from "next";
import { MasFalladasClient } from "@/components/mas-falladas/mas-falladas-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Más falladas",
};

export default function MasFalladasPage() {
  return (
    <RequireAuth>
      <MasFalladasClient />
    </RequireAuth>
  );
}
