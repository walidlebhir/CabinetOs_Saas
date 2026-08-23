import {
  CalendarX2,
  ClipboardList,
  FolderSearch,
  EyeOff,
  MessageSquareWarning,
  ArrowDown,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const PROBLEMS = [
  {
    icon: CalendarX2,
    title: "Planning dispersé",
    description:
      "Les disponibilités et rendez-vous sont difficiles à coordonner.",
  },
  {
    icon: ClipboardList,
    title: "Gestion manuelle",
    description:
      "Les tâches administratives consomment le temps du personnel.",
  },
  {
    icon: FolderSearch,
    title: "Informations dispersées",
    description:
      "Les informations patients sont réparties entre plusieurs outils.",
  },
  {
    icon: EyeOff,
    title: "Manque de visibilité",
    description:
      "Il est difficile de connaître les performances réelles du cabinet.",
  },
  {
    icon: MessageSquareWarning,
    title: "Communication complexe",
    description:
      "Les rappels et notifications sont souvent gérés manuellement.",
  },
];

export function ProblemSection() {
  return (
    <section id="probleme" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Le constat"
          title="Votre cabinet ne devrait pas fonctionner avec des"
          highlight="outils dispersés."
          description="Agendas papier, tableurs, messages, appels : la gestion traditionnelle fragmente l'activité médicale et fait perdre un temps précieux."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem, index) => (
            <Reveal key={problem.title} delay={index * 80}>
              <article className="group h-full rounded-2xl border border-medos-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 transition-colors group-hover:border-red-100">
                  <problem.icon className="h-5 w-5 text-red-400" />
                </span>
                <h3 className="mt-4 text-base font-bold text-medos-navy">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-medos-slate">
                  {problem.description}
                </p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={400} className="sm:col-span-2 lg:col-span-1">
            <div className="flex h-full flex-col items-start justify-center rounded-2xl bg-medos-navy p-6 text-white">
              <ArrowDown className="h-5 w-5 animate-bounce text-medos-cyan" />
              <p className="mt-4 text-lg font-bold leading-snug">
                MedOS centralise tout dans une{" "}
                <span className="text-medos-cyan">seule plateforme.</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-cyan-100/70">
                Un espace unique pour votre équipe, vos patients et vos données.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
