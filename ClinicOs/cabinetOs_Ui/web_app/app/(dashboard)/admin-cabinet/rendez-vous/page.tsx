"use client";

import { RendezvousList } from "@/components/rendezvous/rendezvous-list";
import { useSelectedCabinet } from "@/components/admin/use-selected-cabinet";

export default function RendezVousPage() {
  const cabinet = useSelectedCabinet();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Agenda
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Rendez-vous
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Consultez, planifiez et suivez tous les rendez-vous du cabinet :
          confirmations, reports et annulations.
        </p>
      </div>

      <RendezvousList mode="admin" cabinetId={cabinet?.id ?? undefined} />
    </div>
  );
}
