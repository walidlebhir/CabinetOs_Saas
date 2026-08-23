import {
  Stethoscope,
  ClipboardList,
  UserCog,
  User,
  Check,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";

const ROLES = [
  {
    id: "cabinets",
    icon: Stethoscope,
    role: "Médecin",
    description:
      "Concentrez-vous sur vos patients pendant que la plateforme simplifie votre organisation.",
    features: [
      "Planning personnel",
      "Rendez-vous",
      "Patients",
      "Dossiers médicaux",
      "Statistiques",
    ],
  },
  {
    id: "cliniques",
    icon: ClipboardList,
    role: "Secrétaire",
    description:
      "Organisez les rendez-vous et la gestion quotidienne du cabinet sans effort.",
    features: [
      "Agenda partagé",
      "Réservation",
      "Patients",
      "Rappels",
      "Gestion administrative",
    ],
  },
  {
    id: undefined,
    icon: UserCog,
    role: "Administrateur",
    description:
      "Pilotez plusieurs cabinets et contrôlez l'activité de votre organisation.",
    features: [
      "Utilisateurs",
      "Cabinets",
      "Abonnements",
      "Statistiques",
      "Supervision",
    ],
  },
  {
    id: undefined,
    icon: User,
    role: "Patient",
    description:
      "Recherchez un médecin et gérez vos rendez-vous simplement, depuis le web ou le mobile.",
    features: [
      "Recherche médecin",
      "Disponibilités",
      "Réservation",
      "Historique",
      "Notifications",
    ],
  },
];

export function RolesSection() {
  return (
    <section
      id="utilisateurs"
      className="scroll-mt-24 bg-medos-mist py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pour chaque acteur"
          title="Une plateforme pensée pour"
          highlight="chaque acteur."
          description="Médecins, secrétaires, administrateurs et patients disposent chacun d'une expérience adaptée à leurs besoins."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ROLES.map((role, index) => (
            <Reveal key={role.role} delay={index * 90}>
              <article
                id={role.id}
                className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-medos-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
                  <role.icon className="h-6 w-6 text-medos-teal" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-medos-navy">
                  {role.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-medos-slate">
                  {role.description}
                </p>
                <ul className="mt-5 flex-1 space-y-2 border-t border-medos-line pt-5">
                  {role.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-[13px] font-medium text-medos-ink/85"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-medos-teal" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#commencer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-medos-teal transition-colors hover:text-medos-teal-dark"
                >
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
