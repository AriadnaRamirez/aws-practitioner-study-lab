import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Three levels, used the same way everywhere:
 * - raised: a section on the page (summary, form, widget).
 * - flat: an item inside a list or grid, or a card nested in a raised one.
 * - inset: a quiet box inside a card (an answer, a note, a stat).
 */
export const cardVariants = cva("min-w-0", {
  variants: {
    variant: {
      raised:
        "rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-raised)]",
      flat: "rounded-2xl bg-[var(--surface-elevated)]",
      inset: "rounded-xl bg-[var(--surface)]",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
    interactive: {
      true: "text-left transition-colors",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "raised",
      interactive: true,
      className: "hover:bg-[var(--surface-elevated)]",
    },
    {
      variant: "flat",
      interactive: true,
      className: "hover:bg-[var(--surface-hover)]",
    },
  ],
  defaultVariants: {
    variant: "raised",
    padding: "md",
    interactive: false,
  },
});

type CardProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    as?: "div" | "section" | "article" | "aside" | "li";
  };

export function Card({
  as: Tag = "div",
  variant,
  padding,
  interactive,
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
}

/** Small muted heading at the top of a card, optionally with an icon. */
export function CardLabel({
  icon,
  className,
  children,
  as: Tag = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  icon?: React.ReactNode;
  as?: "h2" | "h3" | "p";
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-2 text-sm font-semibold text-[var(--foreground-muted)] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--accent)]",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Tag>
  );
}
