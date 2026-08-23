import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  BarChart3,
  Settings,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Tableau de bord", icon: LayoutDashboard, active: true },
  { label: "Agenda", icon: CalendarDays, active: false },
  { label: "Patients", icon: Users, active: false },
  { label: "Dossiers médicaux", icon: FileText, active: false },
  { label: "Statistiques", icon: BarChart3, active: false },
];

export function SidebarPreview() {
  return (
    <aside className="hidden w-44 shrink-0 flex-col justify-between bg-medos-navy p-3 sm:flex">
      <div>
        <div className="flex items-center gap-2 px-1 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-medos-teal">
            <HeartPulse className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-bold tracking-tight text-white">
            Med<span className="text-medos-cyan">OS</span>
          </span>
        </div>
        <nav className="mt-4 space-y-1">
          {ITEMS.map(({ label, icon: Icon, active }) => (
            <span
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium",
                active
                  ? "bg-white/10 text-white"
                  : "text-cyan-100/55 transition-colors hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn("h-3.5 w-3.5", active && "text-medos-cyan")}
              />
              {label}
            </span>
          ))}
        </nav>
      </div>
      <div className="space-y-1">
        <span className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-cyan-100/55 transition-colors hover:bg-white/5 hover:text-white">
          <Settings className="h-3.5 w-3.5" />
          Paramètres
        </span>
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-medos-cyan text-[9px] font-bold text-white">
            AB
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold text-white">Dr. Amine B.</p>
            <p className="text-[9px] text-cyan-100/50">Cabinet Nord</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
