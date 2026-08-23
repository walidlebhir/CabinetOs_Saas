import type { Metadata } from "next";
import {
  CalendarCheck,
  Stethoscope,
  FileText,
  Receipt,
  Video,
  BellRing,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pour les cabinets — MedOS",
  description:
    "Découvrez les services MedOS pensés pour les cabinets médicaux : rendez-vous, planning, dossiers patients, facturation et pilotage de l'activité.",
};

const SERVICES = [
  {
    icon: CalendarCheck,
    title: "Gestion des rendez-vous",
    description:
      "Prise de rendez-vous en ligne, confirmations, reports et annulations centralisés au même endroit.",
  },
  {
    icon: Stethoscope,
    title: "Planning des praticiens",
    description:
      "Agenda par médecin avec disponibilités, vacations et salles configurable en quelques clics.",
  },
  {
    icon: FileText,
    title: "Dossiers médicaux",
    description:
      "Historique complet du patient : consultations, ordonnances, documents et examens regroupés.",
  },
  {
    icon: Receipt,
    title: "Facturation & caisse",
    description:
      "Factures, feuilles de soins et suivi des règlements générés automatiquement après chaque consultation.",
  },
  {
    icon: Video,
    title: "Téléconsultation",
    description:
      "Lancez des visioconférences sécurisées directement depuis l'agenda du praticien.",
  },
  {
    icon: BellRing,
    title: "Rappels automatiques",
    description:
      "SMS et emails envoyés aux patients pour réduire les rendez-vous non honorés.",
  },
  {
    icon: BarChart3,
    title: "Statistiques & pilotage",
    description:
      "Suivez l'activité du cabinet : fréquentation, recettes, taux d'occupation en temps réel.",
  },
  {
    icon: Users,
    title: "Équipe & rôles",
    description:
      "Médecins, secrétaires et assistants avec des droits d'accès adaptés à chaque rôle.",
  },
];

const BENEFITS = [
  "Moins de no-shows grâce aux rappels automatiques",
  "Zéro double saisie entre agenda et dossier patient",
  "Facturation conforme, prête pour les organismes",
  "Données hébergées et chiffrées en toute sécurité",
];

export default function CabinetPage() {
  return (
    <>
      <section className="bg-medos-mist pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
                Pour les cabinets
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-medos-navy sm:text-5xl">
                Tous les services de votre cabinet,{" "}
                <span className="text-medos-teal">réunis dans un seul outil.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-medos-slate sm:text-lg">
                MedOS structure chaque service essentiel de votre cabinet médical —
                accueil, agenda, dossiers, facturation et pilotage — pour que votre
                équipe se concentre sur les patients.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" href="/cabinet/register">
                  Créer un espace cabinet
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg" href="#services">
                  Découvrir les services
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Services"
            title="Les services inclus dans"
            highlight="votre cabinet."
            description="Chaque service est conçu pour le quotidien d'un cabinet médical : simple pour l'équipe, fluide pour les patients."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => (
              <Reveal key={service.title} delay={(index % 4) * 80}>
                <article className="group h-full rounded-2xl border border-medos-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost transition-colors group-hover:bg-medos-teal">
                    <service.icon className="h-5 w-5 text-medos-teal transition-colors group-hover:text-white" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-medos-navy">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-medos-slate">
                    {service.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-medos-navy py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-cyan">
                Pourquoi MedOS
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Un cabinet organisé,{" "}
                <span className="text-medos-cyan">des journées plus légères.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-cyan-100/70">
                De l&apos;accueil à la facturation, tous vos services travaillent
                ensemble dans une plateforme unique.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-medos-cyan" />
                    <span className="text-sm leading-relaxed text-cyan-100/90">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="#commencer" size="lg">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
