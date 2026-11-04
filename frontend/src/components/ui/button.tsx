import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SpinnerIcon } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-[background-color,color,transform,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /** The one primary action on a screen. */
        default:
          "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]",
        /** Any other action. */
        secondary:
          "bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
        /** Small inline action inside a card ("Practicar", "Cambiar fecha"). */
        soft: "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        ghost:
          "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
        outline:
          "bg-[var(--glass)] text-[var(--foreground)] hover:bg-[var(--glass-strong)]",
        /** Irreversible actions (delete account, delete content). */
        danger:
          "bg-[var(--danger)] text-[var(--danger-fg)] hover:brightness-110",
        link: "rounded-none text-[var(--foreground)] underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-5 py-2",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Disables the button and adds an inline spinner; pair it with a specific label ("Guardando…"). */
    pending?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pending = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || pending}
        aria-busy={pending || undefined}
        {...props}
      >
        {pending ? <SpinnerIcon /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
