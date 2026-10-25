import Image from "next/image";
import { cn } from "@/lib/utils";

export const MASCOT_POSES = {
  study: "/mascot/study.webp",
  wave: "/mascot/wave.webp",
  laptop: "/mascot/laptop.webp",
  rocket: "/mascot/rocket.webp",
  server: "/mascot/server.webp",
  s3: "/mascot/s3.webp",
  security: "/mascot/security.webp",
} as const;

export type MascotPose = keyof typeof MASCOT_POSES;

const ALT: Record<MascotPose, string> = {
  study: "Mascot Study Lab con libro AWS",
  wave: "Mascot Study Lab saludando",
  laptop: "Mascot Study Lab en la laptop",
  rocket: "Mascot Study Lab en cohete AWS",
  server: "Mascot Study Lab con servidor",
  s3: "Mascot Study Lab con bucket S3",
  security: "Mascot Study Lab de seguridad",
};

type Props = {
  pose?: MascotPose;
  className?: string;
  float?: boolean;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
};

/** Landscape plates (~16:9) on ink #0a0f1a — no cutout fringe. */
const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-16 w-28",
  md: "h-28 w-48",
  lg: "h-36 w-64",
  hero: "aspect-[16/9] w-full max-w-md",
};

const SIZES_ATTR: Record<NonNullable<Props["size"]>, string> = {
  sm: "112px",
  md: "192px",
  lg: "256px",
  hero: "(max-width: 640px) 92vw, 448px",
};

/** Dark-plate mascot WebPs — background matches site ink. */
export function Mascot({
  pose = "study",
  className,
  float = false,
  priority = false,
  size = "md",
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--brand-ink)]",
        SIZE[size],
        float && "animate-mascot-float",
        className,
      )}
    >
      <Image
        src={MASCOT_POSES[pose]}
        alt={ALT[pose]}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={82}
        sizes={SIZES_ATTR[size]}
        className="object-cover object-center"
      />
    </div>
  );
}
