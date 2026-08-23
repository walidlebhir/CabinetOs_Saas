import {
  TrendingUp,
  Users,
  CalendarX2,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";
import {
  AreaChart,
  DonutChart,
} from "@/components/mockups/charts";

const KPIS = [
  { icon: TrendingUp, label: "Rendez-vous cette semaine", value: "128", trend: "+9%" },
  { icon: Users, label: "Nouveaux patients", value: "36", trend: "+14%" },
  { icon: CalendarCheck, label: "Rendez-vous confirmés", value: "118", trend: "+6%" },
  { icon: CalendarX2, label: "Taux d'annulation", value: "4%", trend: "-1%" },
];

const DOCTORS = [
  { initials: "AB", name: "Dr. Amine Berrada", load: "32 RDV / semaine" },
  { initials: "LF", name: "Dr. Leila Fassi", load: "28 RDV / semaine" },
  { initials: "MB", name: "Dr. Mehdi Benali", load: "24 RDV / semaine" },
];

export function AnalyticsSection() {
  return (
    <section id="pilotage" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pilotage"
          title="Pilotez votre cabinet avec des données,"
          highlight="pas avec des suppositions."
          description="Un tableau de bord clair pour suivre l'activité de votre établissement et prendre de meilleures décisions, chaque jour."
        />

        <Reveal delay={120}>
          <div className="mt-14 rounded-3xl border border-medos-line bg-white p-5 shadow-[0_24px_60px_-28px_rgba(6,59,92,0.25)] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {KPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-medos-line bg-medos-mist p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      <kpi.icon className="h-4 w-4 text-medos-teal" />
                    </span>
                    <span
                      className={`flex items-center text-xs font-semibold ${
                        kpi.trend.startsWith("-")
                          ? "text-red-400"
                          : "text-medos-teal-dark"
                      }`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {kpi.trend.replace("-", "")}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-medos-navy">
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-medos-slate">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-medos-line p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-medos-navy">
                      Évolution hebdomadaire des rendez-vous
                    </h3>
                    <p className="text-xs text-medos-slate">
                      Toutes spécialités confondues
                    </p>
                  </div>
                  <span className="rounded-full bg-medos-frost px-3 py-1 text-[11px] font-semibold text-medos-teal-dark">
                    Cette semaine
                  </span>
                </div>
                <AreaChart
                  data={[18, 26, 22, 34, 30, 42, 38]}
                  labels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
                />
              </div>

              <div className="flex flex-col rounded-2xl border border-medos-line p-5">
                <DonutChart value={96} label="Rendez-vous honorés" />
                <ul className="mt-5 flex-1 space-y-3 border-t border-medos-line pt-5">
                  {DOCTORS.map((doctor) => (
                    <li key={doctor.name} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-medos-frost text-[10px] font-bold text-medos-teal-dark">
                        {doctor.initials}
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-xs font-semibold text-medos-ink">
                          {doctor.name}
                        </span>
                        <span className="block text-[11px] text-medos-slate">
                          {doctor.load}
                        </span>
                      </span>
                      <span className="h-2 w-2 shrink-0 rounded-full bg-medos-teal" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-medos-slate/70">
              Aperçu du tableau de bord — données de démonstration.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
