import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full rounded-lg border border-medos-line bg-white px-3 text-sm text-medos-ink placeholder:text-medos-slate/60 transition-colors focus:border-medos-teal focus:outline-2 focus:outline-offset-1 focus:outline-medos-teal/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type InputProps = VariantProps<typeof inputVariants> &
  Omit<ComponentProps<"input">, "size">;

export function Input({ className, size, ...props }: InputProps) {
  return (
    <input className={cn(inputVariants({ size }), className)} {...props} />
  );
}
