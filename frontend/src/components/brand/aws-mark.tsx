import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Height in px; width follows aspect of the official lockup. */
  height?: number;
  /**
   * `onDark` (default): official white wordmark + white smile for ink UIs.
   * `onLight`: charcoal wordmark + orange smile.
   * `onDarkColor`: white wordmark + orange smile (color accent on dark).
   */
  tone?: "onDark" | "onLight" | "onDarkColor";
};

const ASPECT: Record<NonNullable<Props["tone"]>, number> = {
  // white lockup crop 274×173
  onDark: 274 / 173,
  onDarkColor: 329 / 203,
  // charcoal + orange crop 329×203
  onLight: 329 / 203,
};

const SRC: Record<NonNullable<Props["tone"]>, string> = {
  onDark: "/partners/aws-logo-white.png",
  onDarkColor: "/partners/aws-logo-on-dark-color.png",
  onLight: "/partners/aws-logo.png",
};

/** Official AWS wordmark + smile (assets provided by product). */
export function AwsMark({ className, height = 28, tone = "onDark" }: Props) {
  const width = Math.round(height * ASPECT[tone]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[tone]}
      alt="AWS"
      width={width}
      height={height}
      className={cn("w-auto object-contain", className)}
      style={{ height }}
      decoding="async"
    />
  );
}
