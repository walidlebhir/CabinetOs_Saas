"use client";

import { useParams } from "next/navigation";
import { MedecinProfil } from "@/components/patient/medecin-profil";

export default function MedecinProfilPage() {
  const params = useParams<{ cabinetId: string; medecinId: string }>();
  const medecinId = params?.medecinId;
  const cabinetId = params?.cabinetId;

  if (!medecinId || !cabinetId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <MedecinProfil medecinId={medecinId} cabinetId={cabinetId} />
    </div>
  );
}
