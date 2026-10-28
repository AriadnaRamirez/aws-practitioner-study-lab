import { SiteCredits } from "@/components/shell/site-credits";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div
        aria-hidden
        className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-[var(--border)] to-transparent lg:max-w-6xl"
      />
      <SiteCredits compact />
    </footer>
  );
}
