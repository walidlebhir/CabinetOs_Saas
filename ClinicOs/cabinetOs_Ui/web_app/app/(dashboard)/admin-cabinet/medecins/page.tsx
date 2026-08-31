import type { Metadata } from "next";
import { MedecinsManager } from "@/components/admin/medecins-manager";

export const metadata: Metadata = {
  title: "Médecins",
};

export default function MedecinsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Équipe
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Médecins
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Ajoutez les médecins du cabinet sélectionné et créez-leur un compte
          d&apos;accès en un clic.
        </p>
      </div>

      <MedecinsManager />
    </div>
  );
}
