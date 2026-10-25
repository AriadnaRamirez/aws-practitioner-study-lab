import Image from "next/image";
import { cn } from "@/lib/utils";

export const MASCOT_POSES = {
  study: "/mascot/study.jpg",
  wave: "/mascot/wave.jpg",
  laptop: "/mascot/laptop.jpg",
  rocket: "/mascot/rocket.jpg",
  server: "/mascot/server.jpg",
  s3: "/mascot/s3.jpg",
  security: "/mascot/security.jpg",
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
  /** Soft float motion */
  float?: boolean;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-20 w-36",
  md: "h-28 w-48",
  lg: "h-40 w-72",
  hero: "h-48 w-full max-w-sm sm:h-56",
};

/**
 * AWS Study Lab mascot — navy blob with Amazon smile.
 * Poses live in /public/mascot.
 */
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
        "relative overflow-hidden rounded-[1.75rem]",
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
        sizes="(max-width: 640px) 90vw, 420px"
        className="object-cover object-center"
      />
    </div>
  );
}
