import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  /** PNG cutout (default) or crisp SVG mark. */
  variant?: "png" | "svg";
  priority?: boolean;
  /** Hide text for icon-only placements. */
  withWordmark?: boolean;
};

/** Study Lab logo — navy face, cyan eyes, orange status dot. */
export function Logo({
  className,
  size = 32,
  variant = "svg",
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
        <rect width="128" height="128" rx="34" fill="#233249" />
        <path
          d="M28 76A18 18 0 0 0 64 76"
          stroke="#3DE0FF"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M64 76A18 18 0 0 0 100 76"
          stroke="#3DE0FF"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle cx="106" cy="22" r="11" fill="#E85002" />
      </svg>
    ) : (
      <Image
        src="/brand/logo.png"
        alt={withWordmark ? "" : "Study Lab"}
        width={size}
        height={size}
        priority={priority}
        className="shrink-0"
      />
    );

  if (!withWordmark) {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2.5",
        className,
      )}
    >
      {mark}
      <span className="font-display truncate text-sm font-semibold tracking-tight">
        Study Lab
      </span>
    </span>
  );
}
