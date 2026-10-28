import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Height in px; width follows aspect of the official lockup. */
  height?: number;
  /**
   * `onDark` (default): white wordmark + orange smile for ink backgrounds.
   * `onLight`: official charcoal wordmark + orange smile.
   */
  tone?: "onDark" | "onLight";
};

/** Official AWS wordmark + smile arrow (asset provided by product). */
export function AwsMark({ className, height = 28, tone = "onDark" }: Props) {
  const width = Math.round((height * 329) / 203);
  const src =
    tone === "onLight"
      ? "/partners/aws-logo.png"
      : "/partners/aws-logo-on-dark.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="AWS"
      width={width}
      height={height}
      className={cn("w-auto object-contain", className)}
      style={{ height }}
      decoding="async"
    />
  );
}
