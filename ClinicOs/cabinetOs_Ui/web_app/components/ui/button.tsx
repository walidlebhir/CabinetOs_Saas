import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medos-teal disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-medos-teal text-white hover:bg-medos-teal-dark",
        secondary:
          "border border-medos-line bg-white text-medos-navy hover:border-medos-teal/40 hover:bg-medos-frost",
        navy: "bg-medos-navy text-white hover:bg-medos-navy-deep",
        outlineLight:
          "border border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/15",
        link: "text-medos-teal hover:text-medos-teal-dark underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function Button({
  href,
  className,
  variant,
  size,
  children,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link
        href={href}
        aria-disabled={disabled || undefined}
        className={cn(classes, disabled && "pointer-events-none opacity-50")}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
