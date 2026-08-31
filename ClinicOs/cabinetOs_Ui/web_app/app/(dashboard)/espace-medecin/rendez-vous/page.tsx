"use client";

import { RendezvousList } from "@/components/rendezvous/rendezvous-list";

export default function MedecinRendezVousPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Agenda
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Mes rendez-vous
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Consultez et suivez vos rendez-vous : confirmations, reports et annulations.
        </p>
      </div>

      <RendezvousList mode="medecin" />
    </div>
  );
}
