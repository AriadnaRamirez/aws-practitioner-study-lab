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
  /** Soft orange backlight behind the cutout (default on). */
  glow?: boolean;
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-20 w-28",
  md: "h-32 w-44",
  lg: "h-44 w-64",
  hero: "h-52 w-full max-w-xs sm:h-60",
};

const SIZES_ATTR: Record<NonNullable<Props["size"]>, string> = {
  sm: "112px",
  md: "176px",
  lg: "256px",
  hero: "(max-width: 640px) 80vw, 320px",
};

/** Transparent PNG cutouts with optional orange backlight. */
export function Mascot({
  pose = "study",
  className,
  float = false,
  priority = false,
  size = "md",
  glow = true,
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
      {glow ? (
        <>
          {/* Soft plate + warm orange halo behind the character */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[8%] rounded-2xl bg-[radial-gradient(ellipse_70%_65%_at_50%_55%,rgba(232,80,2,0.38),rgba(232,80,2,0.12)_45%,transparent_72%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(241,96,1,0.45),transparent_68%)] blur-[2px]"
          />
        </>
      ) : null}
      <Image
        src={MASCOT_POSES[pose]}
        alt={ALT[pose]}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={85}
        sizes={SIZES_ATTR[size]}
        className={cn(
          "relative z-[1] object-contain object-center",
          glow
            ? "drop-shadow-[0_16px_36px_rgba(232,80,2,0.32)]"
            : "drop-shadow-[0_14px_32px_rgba(0,0,0,0.45)]",
        )}
      />
    </div>
  );
}
