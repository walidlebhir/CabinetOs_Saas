import {
  Building2,
  CalendarDays,
  CalendarCheck,
  Users,
  FileText,
  Stethoscope,
  Bell,
  BarChart3,
  CreditCard,
  Star,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const MODULES = [
  {
    icon: Building2,
    title: "Gestion du cabinet",
    description:
      "Structurez votre établissement, vos équipes et vos services.",
  },
  {
    icon: CalendarDays,
    title: "Planning médical",
    description:
      "Configurez les disponibilités de chaque médecin et visualisez l'agenda en temps réel.",
  },
  {
    icon: CalendarCheck,
    title: "Rendez-vous",
    description:
      "Centralisez les réservations, confirmations, annulations et reports.",
  },
  {
    icon: Users,
    title: "Patients",
    description:
      "Retrouvez toutes les informations patients depuis un espace centralisé.",
  },
  {
    icon: FileText,
    title: "Dossiers médicaux",
    description:
      "Historiques, documents et ordonnances regroupés par patient.",
  },
  {
    icon: Stethoscope,
    title: "Personnel",
    description: "Médecins, secrétaires et rôles gérés au même endroit.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Rappels et alertes envoyés automatiquement aux patients.",
  },
  {
    icon: BarChart3,
    title: "Statistiques",
    description:
      "Suivez votre activité grâce à des indicateurs clairs et exploitables.",
  },
  {
    icon: CreditCard,
    title: "Abonnements",
    description: "Gérez votre plan SaaS et vos facturations en toute simplicité.",
  },
  {
    icon: Star,
    title: "Avis patients",
    description: "Recueillez et suivez la satisfaction de vos patients.",
  },
];

export function SolutionSection() {
  return (
    <section
      id="fonctionnalites"
      className="scroll-mt-24 bg-medos-mist py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="La solution"
          title="Une seule plateforme pour piloter"
          highlight="toute votre activité."
          description="Chaque module est conçu pour un métier : ensemble, ils forment le système d'exploitation complet de votre établissement."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((module, index) => (
            <Reveal key={module.title} delay={(index % 5) * 80}>
              <article className="group h-full rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                  <module.icon className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-medos-navy">
                  {module.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-medos-slate">
                  {module.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
