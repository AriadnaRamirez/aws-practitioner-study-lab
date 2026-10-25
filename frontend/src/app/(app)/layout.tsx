import { OnboardingHost } from "@/components/onboarding/onboarding-host";
import { AppNav } from "@/components/shell/app-nav";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--background)]">
      <AppNav />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <OnboardingHost />
    </div>
  );
}
