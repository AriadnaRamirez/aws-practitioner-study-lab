import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { ShootingStars } from "@/components/shell/shooting-stars";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "AWS Study Lab",
    template: "%s · AWS Study Lab",
  },
  applicationName: "AWS Study Lab",
  description:
    "Prepárate para AWS Cloud Practitioner con cartas, estudio y examen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`dark overflow-x-hidden ${syne.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh w-full max-w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ShootingStars />
        {children}
      </body>
    </html>
  );
}
