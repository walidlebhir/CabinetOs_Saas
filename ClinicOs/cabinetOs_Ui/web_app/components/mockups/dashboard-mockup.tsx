import {
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ArrowUpRight,
  BellRing,
  CalendarCheck,
  Activity,
} from "lucide-react";
import { SidebarPreview } from "@/components/mockups/sidebar-preview";
import { BarChart } from "@/components/mockups/charts";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const EVENT_DAYS = [8, 14, 21, 27];

const APPOINTMENTS = [
  {
    time: "09:00",
    name: "Sara Alaoui",
    reason: "Consultation générale",
    status: "Confirmé",
  },
  {
    time: "09:30",
    name: "Yassine El Amrani",
    reason: "Suivi tension",
    status: "En attente",
  },
  {
    time: "10:15",
    name: "Nadia Bennis",
    reason: "Contrôle annuel",
    status: "Confirmé",
  },
  {
    time: "11:00",
    name: "Omar Tazi",
    reason: "Première visite",
    status: "Confirmé",
  },
];

const NOTIFICATIONS = [
  {
    icon: BellRing,
    title: "Rappel automatique envoyé à Yassine E.",
    time: "il y a 5 min",
  },
  {
    icon: CalendarCheck,
    title: "Nouveau rendez-vous — Sara Alaoui",
    time: "il y a 22 min",
  },
];

function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[9px] font-semibold",
        status === "Confirmé"
          ? "bg-medos-cyan/15 text-medos-teal-dark"
          : "bg-amber-50 text-amber-700"
      )}
    >
      {status}
    </span>
  );
}

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-medos-line bg-white shadow-[0_24px_60px_-24px_rgba(6,59,92,0.35)]",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-medos-line bg-white px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]/70" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-medos-frost px-3 py-1 text-[10px] font-medium text-medos-slate">
          app.medos.fr/tableau-de-bord
        </span>
        <span className="w-10" />
      </div>

      <div className="flex bg-medos-mist">
        <SidebarPreview />

        <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-medos-navy sm:text-base">
                Tableau de bord
              </p>
              <p className="hidden text-[10px] text-medos-slate sm:block">
                Cabinet Nord — Aujourd&rsquo;hui
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-lg border border-medos-line bg-white px-3 py-1.5 text-[10px] text-medos-slate md:flex">
                <Search className="h-3 w-3" />
                Rechercher…
              </span>
              <span className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-medos-line bg-white">
                <Bell className="h-3.5 w-3.5 text-medos-navy" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-medos-teal" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-medos-teal text-[9px] font-bold text-white">
                AB
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "RDV aujourd'hui", value: "24", trend: "+12%" },
              { label: "Nouveaux patients", value: "12", trend: "+4%" },
              { label: "Taux de présence", value: "96%", trend: "+2%" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-medos-line bg-white p-2.5 sm:p-3"
              >
                <p className="truncate text-[9px] font-medium text-medos-slate sm:text-[10px]">
                  {kpi.label}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-base font-bold tabular-nums text-medos-navy sm:text-xl">
                    {kpi.value}
                  </span>
                  <span className="flex items-center text-[9px] font-semibold text-medos-teal-dark">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-3">
            <div className="rounded-xl border border-medos-line bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-medos-navy">
                  <CalendarDays className="h-3.5 w-3.5 text-medos-teal" />
                  Septembre
                </p>
                <span className="flex gap-1 text-medos-line">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((day, i) => (
                  <span
                    key={`${day}-${i}`}
                    className="text-[8px] font-semibold uppercase text-medos-slate"
                  >
                    {day}
                  </span>
                ))}
                {[...Array(6)].map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  const isEvent = EVENT_DAYS.includes(day);
                  const isActive = day === 14;
                  return (
                    <span key={day} className="flex flex-col items-center py-0.5">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-medium tabular-nums",
                          isActive
                            ? "bg-medos-teal font-bold text-white shadow-sm shadow-medos-teal/40"
                            : "text-medos-ink/75"
                        )}
                      >
                        {day}
                      </span>
                      {isEvent && !isActive && (
                        <span className="mt-0.5 h-1 w-1 rounded-full bg-medos-cyan" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-medos-line bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-medos-navy">
                  Prochains rendez-vous
                </p>
                <span className="text-[9px] font-medium text-medos-teal">
                  Tout voir
                </span>
              </div>
              <ul className="space-y-2">
                {APPOINTMENTS.map((appointment) => (
                  <li key={appointment.time} className="flex items-center gap-2">
                    <span className="rounded-md bg-medos-frost px-1.5 py-1 text-[9px] font-bold tabular-nums text-medos-teal-dark">
                      {appointment.time}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[10px] font-semibold text-medos-ink">
                        {appointment.name}
                      </span>
                      <span className="block truncate text-[9px] text-medos-slate">
                        {appointment.reason}
                      </span>
                    </span>
                    <StatusChip status={appointment.status} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-3">
            <div className="rounded-xl border border-medos-line bg-white p-3">
              <p className="mb-2 text-[11px] font-semibold text-medos-navy">
                Notifications automatiques
              </p>
              <ul className="space-y-2">
                {NOTIFICATIONS.map((notification) => (
                  <li key={notification.title} className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-medos-frost">
                      <notification.icon className="h-3 w-3 text-medos-teal" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[10px] font-medium text-medos-ink">
                        {notification.title}
                      </span>
                      <span className="block text-[9px] text-medos-slate">
                        {notification.time}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-medos-line bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-medos-navy">
                  <Activity className="h-3.5 w-3.5 text-medos-teal" />
                  Activité de la semaine
                </p>
              </div>
              <BarChart
                data={[42, 55, 38, 61, 74, 48, 66]}
                labels={["L", "M", "M", "J", "V", "S", "D"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
