import type { Metadata } from "next";
import { SecretairesManager } from "@/components/admin/secretaires-manager";

export const metadata: Metadata = {
  title: "Secrétaires",
};

export default function SecretairesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-medos-teal">
          Équipe
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-medos-navy sm:text-3xl">
          Secrétaires
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-medos-slate">
          Ajoutez les secrétaires du cabinet sélectionné et créez-leur un compte
          d&apos;accès à l&apos;accueil et à l&apos;agenda.
        </p>
      </div>

      <SecretairesManager />
    </div>
  );
}
