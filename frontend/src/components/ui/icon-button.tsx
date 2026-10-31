import * as React from "react";
import { FOCUS_RING } from "@/components/ui/focus";
import { cn } from "@/lib/utils";

const SIZE = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-10 [&_svg]:size-4",
} as const;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: icon-only buttons need an accessible name. */
  "aria-label": string;
  size?: keyof typeof SIZE;
};

/** Round, quiet button that holds a single icon (close, previous, next). */
export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, size = "sm", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:pointer-events-none disabled:opacity-40",
        SIZE[size],
        FOCUS_RING,
        className,
      )}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
