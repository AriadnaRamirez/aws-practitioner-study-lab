import * as React from "react";
import { cn } from "@/lib/utils";

/** Gap between bento tiles; the same value inside a split tile so its panes stay on the page tracks. */
export const BENTO_GAP = "gap-4 md:gap-5 lg:gap-6";

/**
 * One grid per screen: pass the tracks (`md:grid-cols-2`, `lg:grid-cols-[…]`) and give each tile its
 * `col-span`/`row-span`. Tiles stretch to the row height, so a tile's content should be a flex column
 * with its action pushed down (`mt-auto`). `flowOnMobile` keeps phones in plain block flow (tiles set
 * their own top margins) and only turns the grid on from `md`.
 */
export function BentoGrid({
  flowOnMobile = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { flowOnMobile?: boolean }) {
  return (
    <div
      className={cn(
        flowOnMobile ? "md:grid md:gap-5 lg:gap-6" : cn("grid grid-cols-1", BENTO_GAP),
        className,
      )}
      {...props}
    />
  );
}
