import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "frost" | "light";
};

export function Badge({ children, className, tone = "frost" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide",
        tone === "frost"
          ? "border border-medos-line bg-white text-medos-teal shadow-sm"
          : "border border-white/20 bg-white/10 text-cyan-100 backdrop-blur",
        className
      )}
    >
      {children}
    </span>
  );
}
