import Link from "next/link";
import {
  CalendarDays,
  Users,
  Stethoscope,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Plus,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  {
    label: "Rendez-vous aujourd'hui",
    value: "24",
    trend: "+12% vs hier",
    icon: CalendarDays,
  },
  {
    label: "Patients actifs",
    value: "182",
    trend: "+8 ce mois-ci",
    icon: Users,
  },
  {
    label: "Médecins du cabinet",
    value: "6",
    trend: "2 disponibles",
    icon: Stethoscope,
  },
  {
    label: "Revenus du mois",
    value: "48 200 DH",
    trend: "+5,2% vs mois dernier",
    icon: Wallet,
  },
];

const UPCOMING_APPOINTMENTS = [
  {
    patient: "Amina Benali",
    medecin: "Dr. El Amrani",
    motif: "Contrôle annuel",
    heure: "09:00",
    statut: "Confirmé",
  },
  {
    patient: "Karim Idrissi",
    medecin: "Dr. Naciri",
    motif: "Détartrage",
    heure: "09:30",
    statut: "En attente",
  },
  {
    patient: "Salma Chraibi",
    medecin: "Dr. El Amrani",
    motif: "Consultation",
    heure: "10:15",
    statut: "Confirmé",
  },
  {
    patient: "Omar Tazi",
    medecin: "Dr. Bennis",
    motif: "Suivi post-opératoire",
    heure: "11:00",
    statut: "Annulé",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmé: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "En attente": "bg-amber-50 text-amber-700 border-amber-200",
  Annulé: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminCabinetDashboardPage() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
            {today}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
            Tableau de bord
          </h1>
          <p className="mt-1.5 text-sm text-medos-slate">
            Vue d&apos;ensemble de l&apos;activité de votre cabinet.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" href="/admin-cabinet/rendez-vous">
            <CalendarPlus className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
          <Button size="sm" href="/admin-cabinet/medecins">
            <Plus className="h-4 w-4" />
            Ajouter un médecin
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-medos-teal/40 hover:shadow-md hover:shadow-medos-navy/5"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medos-frost">
                <stat.icon className="h-5 w-5 text-medos-teal" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-medos-teal" />
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-medos-navy">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-medos-ink">{stat.label}</p>
            <p className="mt-0.5 text-xs text-medos-slate">{stat.trend}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-medos-line bg-white shadow-sm lg:col-span-2">
          <header className="flex items-center justify-between border-b border-medos-line px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-medos-navy">
                Rendez-vous à venir
              </h2>
              <p className="text-xs text-medos-slate">Prochaines consultations</p>
            </div>
            <Link
              href="/admin-cabinet/rendez-vous"
              className="flex items-center gap-1 text-sm font-medium text-medos-teal transition-colors hover:text-medos-teal-dark"
            >
              Tout voir
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-medos-line bg-medos-mist/60 text-xs uppercase tracking-wide text-medos-slate">
                  <th className="px-5 py-3 font-semibold">Heure</th>
                  <th className="px-5 py-3 font-semibold">Patient</th>
                  <th className="px-5 py-3 font-semibold">Médecin</th>
                  <th className="px-5 py-3 font-semibold">Motif</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {UPCOMING_APPOINTMENTS.map((appointment) => (
                  <tr
                    key={`${appointment.patient}-${appointment.heure}`}
                    className="border-b border-medos-line/60 last:border-0 transition-colors hover:bg-medos-frost/50"
                  >
                    <td className="px-5 py-3.5 font-semibold text-medos-navy">
                      {appointment.heure}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-medos-ink">
                      {appointment.patient}
                    </td>
                    <td className="px-5 py-3.5 text-medos-slate">
                      {appointment.medecin}
                    </td>
                    <td className="px-5 py-3.5 text-medos-slate">
                      {appointment.motif}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          STATUS_STYLES[appointment.statut]
                        }`}
                      >
                        {appointment.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <article className="rounded-2xl border border-medos-line bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-medos-navy">
              Occupation des praticiens
            </h2>
            <ul className="mt-4 space-y-4">
              {[
                { nom: "Dr. El Amrani", taux: 86 },
                { nom: "Dr. Naciri", taux: 64 },
                { nom: "Dr. Bennis", taux: 42 },
              ].map((praticien) => (
                <li key={praticien.nom}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-medos-ink">{praticien.nom}</span>
                    <span className="text-medos-slate">{praticien.taux}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-medos-frost">
                    <div
                      className="h-full rounded-full bg-medos-teal"
                      style={{ width: `${praticien.taux}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-medos-line bg-medos-navy p-5 shadow-sm">
            <h2 className="text-base font-bold text-white">Configuration cabinet</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-cyan-100/80">
              Finalisez la configuration de votre espace : informations du
              cabinet, spécialité, ville et abonnement.
            </p>
            <Link
              href="/admin-cabinet/parametres"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-medos-navy transition-colors hover:bg-medos-frost"
            >
              Configurer mon cabinet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>
      </div>
    </div>
  );
}
