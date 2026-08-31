import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Stethoscope,
  Users,
} from "lucide-react";

export default function SecretaireDashboardPage() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shortcuts = [
    {
      href: "/espace-secretaire/rendez-vous",
      icon: CalendarDays,
      title: "Gérer les rendez-vous",
      description:
        "Planifiez, confirmez, reportez ou annulez les rendez-vous du cabinet.",
    },
    {
      href: "/espace-secretaire/patients",
      icon: Users,
      title: "Fichier patients",
      description:
        "Retrouvez les coordonnées des patients et leur historique de visites.",
    },
    {
      href: "/espace-secretaire/medecins",
      icon: Stethoscope,
      title: "Comptes des médecins",
      description:
        "Activez ou désactivez le compte d'accès de chaque médecin du cabinet.",
    },
    {
      href: "/espace-secretaire/profil",
      icon: ArrowRight,
      title: "Mon profil",
      description:
        "Consultez vos informations personnelles et votre statut de compte.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
            {today}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Bienvenue
          </h1>
          <p className="mt-1.5 text-sm text-medos-slate">
            Votre espace pour l&apos;accueil et l&apos;organisation du cabinet.
          </p>
        </div>
        <Link
          href="/espace-secretaire/rendez-vous"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-medos-teal px-4 text-sm font-semibold text-white transition-colors hover:bg-medos-teal-dark"
        >
          <CalendarPlus className="h-4 w-4" />
          Nouveau rendez-vous
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-medos-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-medos-frost">
              <Icon className="h-5 w-5 text-medos-teal" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-medos-navy">{title}</h2>
            <p className="mt-1 text-sm text-medos-slate">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medos-teal transition-colors group-hover:text-medos-teal-dark">
              Ouvrir
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
