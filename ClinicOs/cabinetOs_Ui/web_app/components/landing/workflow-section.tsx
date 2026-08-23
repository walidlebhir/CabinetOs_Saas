import {
  Search,
  CalendarClock,
  CalendarCheck,
  BellRing,
  Stethoscope,
  FileText,
  Zap,
  BarChart3,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    icon: Search,
    title: "Le patient recherche un médecin",
  },
  {
    icon: CalendarClock,
    title: "Il consulte les disponibilités",
  },
  {
    icon: CalendarCheck,
    title: "Il réserve un créneau",
  },
  {
    icon: BellRing,
    title: "Le cabinet reçoit le rendez-vous",
  },
  {
    icon: Stethoscope,
    title: "Le médecin réalise la consultation",
  },
  {
    icon: FileText,
    title: "Le dossier médical est mis à jour",
  },
  {
    icon: Zap,
    title: "La plateforme automatise les notifications",
  },
  {
    icon: BarChart3,
    title: "Le cabinet analyse son activité",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="De la prise de rendez-vous au"
          highlight="pilotage du cabinet."
          description="Un flux continu qui couvre l'intégralité du cycle de vie d'un rendez-vous, de la recherche du patient à l'analyse de votre activité."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={(index % 4) * 90}>
              <li className="group relative flex h-full flex-col rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost">
                    <step.icon className="h-5 w-5 text-medos-teal" />
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-medos-line transition-colors group-hover:text-medos-teal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold leading-snug text-medos-ink">
                  {step.title}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-sm font-medium text-medos-slate">
            Un seul outil, du premier contact du patient jusqu&rsquo;au pilotage
            de votre établissement.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
