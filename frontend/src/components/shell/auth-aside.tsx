import Link from "next/link";
import { Mascot, type MascotPose } from "@/components/brand/mascot";

/** Left column of the auth pages from `md` up (same layout as the login). */
export function AuthAside({
  pose,
  title,
  text,
}: {
  pose: MascotPose;
  title: string;
  text?: string;
}) {
  return (
    <aside className="hidden h-dvh flex-col self-start px-10 py-8 md:sticky md:top-0 md:flex lg:px-16 lg:py-12 [@media(max-height:500px)]:py-4">
      <Link
        href="/"
        className="font-display self-start text-sm font-semibold tracking-tight text-[var(--foreground)]"
      >
        AWS Study Lab
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Mascot
          pose={pose}
          size="hero"
          priority
          float
          className="!h-[min(26rem,52dvh)] !w-full !max-w-[26rem] [@media(max-height:500px)]:!h-[50dvh]"
        />
        <p className="mt-6 max-w-sm text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl [@media(max-height:500px)]:mt-2 [@media(max-height:500px)]:text-xl">
          {title}
        </p>
        {text ? (
          <p className="mt-2 max-w-xs text-sm text-[var(--foreground-muted)] [@media(max-height:500px)]:hidden">
            {text}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
