import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold lowercase tracking-tight transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--keycap-accent-shadow)] hover:bg-[var(--accent-hover)] active:shadow-[var(--keycap-accent-shadow-active)]",
        secondary:
          "bg-[var(--keycap)] text-[var(--keycap-fg)] shadow-[var(--keycap-shadow)] hover:bg-[var(--surface-hover)] active:shadow-[var(--keycap-shadow-active)]",
        ghost:
          "rounded-lg text-[var(--foreground-muted)] shadow-none hover:bg-[var(--surface)] hover:text-[var(--foreground)] active:translate-y-0",
        outline:
          "border border-[var(--border-strong)] bg-transparent text-[var(--foreground)] shadow-none hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-0",
        link: "rounded-none text-[var(--accent)] shadow-none underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-14 rounded-2xl px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
