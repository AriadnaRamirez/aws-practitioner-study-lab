import type { Metadata } from "next";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { MasFalladasClient } from "@/components/study/mas-falladas-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Más falladas",
};

export default function MasFalladasPage() {
  return (
    <RequireAuth>
      <div>
        <div className="mx-auto flex max-w-2xl justify-end px-4 pt-6 sm:px-6">
          <OpenTourButton />
        </div>
        <MasFalladasClient />
      </div>
    </RequireAuth>
  );
}
