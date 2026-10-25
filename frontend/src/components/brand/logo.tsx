import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  /** Raster mark from brand kit, or crisp SVG fallback. */
  variant?: "png" | "svg";
  priority?: boolean;
  /** Show Study Lab wordmark beside the mark. */
  withWordmark?: boolean;
};

/** Study Lab logo — navy squircle, cyan eyes, orange arrow accent. */
export function Logo({
  className,
  size = 32,
  variant = "png",
  priority = false,
  withWordmark = false,
}: Props) {
  const mark =
    variant === "svg" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        width={size}
        height={size}
        fill="none"
        role="img"
        aria-label="Study Lab"
        className="shrink-0"
      >
        <rect width="128" height="128" rx="34" fill="#213146" />
        <path
          d="M28 74A20 20 0 0 0 64 74"
          stroke="#20D1ED"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M64 74A20 20 0 0 0 100 74"
          stroke="#20D1ED"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path d="M92 22 L112 18 L100 36 Z" fill="#EE9226" />
      </svg>
    ) : (
      <Image
        src="/brand/logo.png"
        alt={withWordmark ? "" : "Study Lab"}
        width={size}
        height={size}
        priority={priority}
        className="shrink-0 rounded-[22%]"
      />
    );

  if (!withWordmark) {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-2.5", className)}
    >
      {mark}
      <span className="font-display truncate text-sm font-semibold tracking-tight">
        Study Lab
      </span>
    </span>
  );
}
