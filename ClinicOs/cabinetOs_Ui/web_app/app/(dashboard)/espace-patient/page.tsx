import Link from "next/link";
import {
  CalendarPlus,
  ArrowRight,
  Building2,
  CalendarCheck,
} from "lucide-react";
import { CabinetsCatalog } from "@/components/patient/cabinets-catalog";

export default function EspacePatientHomePage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-medos-line bg-medos-navy p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-cyan">
          Bienvenue
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Votre espace santé MedOS
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cyan-100/80">
          Retrouvez les cabinets médicaux partenaires, prenez vos rendez-vous
          et suivez vos consultations en un seul endroit.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/espace-patient/rendez-vous"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-medos-navy transition-colors hover:bg-medos-frost"
          >
            <CalendarPlus className="h-4 w-4" />
            Mes rendez-vous
          </Link>
          <Link
            href="/espace-patient/cabinets"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            <Building2 className="h-4 w-4" />
            Tous les cabinets
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-medos-navy">
              Cabinets médicaux
            </h2>
            <p className="text-sm text-medos-slate">
              Découvrez les cabinets disponibles et leurs équipes.
            </p>
          </div>
          <Link
            href="/espace-patient/cabinets"
            className="inline-flex items-center gap-1 text-sm font-medium text-medos-teal transition-colors hover:text-medos-teal-dark"
          >
            Tout voir
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <CabinetsCatalog limit={6} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Building2,
            title: "Choisir un cabinet",
            description: "Comparez les cabinets par spécialité et ville.",
          },
          {
            icon: CalendarCheck,
            title: "Réserver un rendez-vous",
            description: "Sélectionnez le médecin et le créneau qui vous vont.",
          },
          {
            icon: ArrowRight,
            title: "Suivre vos visites",
            description: "Historique de vos consultations au même endroit.",
          },
        ].map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost">
              <step.icon className="h-5 w-5 text-medos-teal" />
            </span>
            <h3 className="mt-3.5 text-sm font-bold text-medos-navy">
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-medos-slate">
              {step.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
