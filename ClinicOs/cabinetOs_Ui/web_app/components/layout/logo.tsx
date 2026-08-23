import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  dark?: boolean;
  className?: string;
};

export function Logo({ dark = false, className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-teal shadow-sm shadow-medos-teal/30">
        <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-xl font-bold tracking-tight",
            dark ? "text-white" : "text-medos-navy"
          )}
        >
          Med<span className="text-medos-teal">OS</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            dark ? "text-cyan-100/70" : "text-medos-slate"
          )}
        >
          Medical Operating System
        </span>
      </span>
    </span>
  );
}
