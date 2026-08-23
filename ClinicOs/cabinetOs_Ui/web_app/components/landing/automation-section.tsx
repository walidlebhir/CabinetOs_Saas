import {
  BellRing,
  CalendarCheck,
  RefreshCw,
  Activity,
  Bell,
  BarChart3,
  CreditCard,
  HeartPulse,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const AUTOMATIONS = [
  {
    icon: BellRing,
    title: "Rappels de rendez-vous",
    description: "Vos patients sont prévenus avant chaque consultation.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Alertes internes pour l'équipe à chaque évolution d'agenda.",
  },
  {
    icon: CalendarCheck,
    title: "Confirmation de réservation",
    description: "Chaque créneau réservé est confirmé instantanément.",
  },
  {
    icon: RefreshCw,
    title: "Gestion des disponibilités",
    description: "Les plannings et indisponibilités se synchronisent en temps réel.",
  },
  {
    icon: Activity,
    title: "Suivi des rendez-vous",
    description: "Statuts, reports et annulations mis à jour automatiquement.",
  },
  {
    icon: BarChart3,
    title: "Statistiques automatiques",
    description: "Vos indicateurs d'activité se calculent en continu.",
  },
  {
    icon: CreditCard,
    title: "Gestion des abonnements",
    description: "Facturation et renouvellements suivis sans effort.",
  },
];

export function AutomationSection() {
  return (
    <section
      id="automatisation"
      className="scroll-mt-24 bg-medos-frost py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Automatisation"
          title="Automatisez ce qui vous fait"
          highlight="perdre du temps."
          description="MedOS prend en charge les tâches répétitives afin que votre équipe se concentre sur l'essentiel."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUTOMATIONS.map((automation, index) => (
            <Reveal key={automation.title} delay={(index % 4) * 80}>
              <article className="group h-full rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                  <automation.icon className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-medos-navy">
                  {automation.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-medos-slate">
                  {automation.description}
                </p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={280}>
            <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-medos-teal/30 bg-gradient-to-br from-medos-teal to-medos-cyan p-6 text-white shadow-md shadow-medos-teal/25">
              <HeartPulse className="h-6 w-6" />
              <p className="mt-4 text-lg font-bold leading-snug">
                Moins d&rsquo;administration.
                <br />
                Plus de temps pour vos patients.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
