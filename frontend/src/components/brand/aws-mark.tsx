import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Height in px; width follows aspect. */
  height?: number;
};

/** Official-style AWS wordmark + orange smile (transparent). */
export function AwsMark({ className, height = 28 }: Props) {
  const width = Math.round((height * 96) / 52);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/partners/aws-logo.svg"
      alt="AWS"
      width={width}
      height={height}
      className={cn("w-auto", className)}
      style={{ height }}
      decoding="async"
    />
  );
}
