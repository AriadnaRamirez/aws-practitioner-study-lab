import Image from "next/image";
import { cn } from "@/lib/utils";

export const MASCOT_POSES = {
  study: "/mascot/study.png",
  wave: "/mascot/wave.png",
  laptop: "/mascot/laptop.png",
  rocket: "/mascot/rocket.png",
  server: "/mascot/server.png",
  s3: "/mascot/s3.png",
  security: "/mascot/security.png",
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

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-20 w-28",
  md: "h-32 w-44",
  lg: "h-44 w-64",
  hero: "h-52 w-full max-w-xs sm:h-60",
};

/** Transparent PNG mascot poses (no background plate). */
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
        "relative",
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
        sizes="(max-width: 640px) 80vw, 360px"
        className="object-contain object-center drop-shadow-[0_18px_40px_rgba(232,80,2,0.28)]"
      />
    </div>
  );
}
