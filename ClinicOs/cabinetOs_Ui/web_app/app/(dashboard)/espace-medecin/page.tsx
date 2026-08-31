import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Clock,
  Coffee,
} from "lucide-react";

export default function MedecinDashboardPage() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          {today}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Bienvenue, Docteur
        </h1>
        <p className="mt-1.5 text-sm text-medos-slate">
          Gérez vos horaires et vos absences depuis votre espace personnel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/espace-medecin/planning"
          className="group rounded-2xl border border-medos-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
            <CalendarRange className="h-5 w-5 text-medos-teal" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-medos-navy">
            Mon planning hebdomadaire
          </h2>
          <p className="mt-1 text-sm text-medos-slate">
            Définissez vos jours de consultation, vos plages horaires et la
            durée des créneaux.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medos-teal transition-colors group-hover:text-medos-teal-dark">
            Gérer mon planning
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <article className="rounded-2xl border border-medos-line bg-white p-6 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
            <CalendarDays className="h-5 w-5 text-medos-teal" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-medos-navy">
            Mes absences
          </h2>
          <p className="mt-1 text-sm text-medos-slate">
            Déclarez vos congés, formations ou urgences directement depuis la
            page planning.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-medos-slate">
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-medos-teal" />
              Créneaux configurés en quelques clics
            </li>
            <li className="flex items-center gap-2">
              <Coffee className="h-3.5 w-3.5 text-medos-teal" />
              Pause déjeuner optionnelle par jour
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
