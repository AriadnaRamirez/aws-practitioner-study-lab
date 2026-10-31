import type { Metadata } from "next";
import { GuidesIndexClient } from "@/components/guides/guides-index-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Guías",
};

export default function GuiasPage() {
  return (
    <RequireAuth>
      <GuidesIndexClient />
    </RequireAuth>
  );
}
