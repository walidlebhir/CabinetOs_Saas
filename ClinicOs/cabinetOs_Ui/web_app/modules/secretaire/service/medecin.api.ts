import { api } from "@/lib/api";
import type { Medecin } from "@/modules/admin/schema/types";

function normalizeMessage(data: unknown): string {
  return typeof data === "string" ? data : String(data ?? "");
}

function normalizeMedecin(medecin: Medecin): Medecin {
  const hasAccount =
    typeof medecin.hasAccount === "boolean"
      ? medecin.hasAccount
      : medecin.email != null;
  return {
    ...medecin,
    nom: medecin.nom ?? "",
    prenom: medecin.prenom ?? "",
    specialite: medecin.specialite ?? "",
    numeroOrder: medecin.numeroOrder ?? "",
    hasAccount,
    accountId: medecin.accountId ?? null,
    accountActive: hasAccount ? (medecin.accountActive ?? true) : null,
  };
}

export async function getMedecinsDeMonCabinet(): Promise<Medecin[]> {
  const response = await api.get<Medecin[]>("/api/secretaire/medecins");
  return Array.isArray(response.data)
    ? response.data.map(normalizeMedecin)
    : [];
}

export async function activateMedecinAccount(
  medecinId: string
): Promise<string> {
  const response = await api.patch<string>(
    `/api/secretaire/medecins/${medecinId}/activate`
  );
  return normalizeMessage(response.data);
}

export async function deactivateMedecinAccount(
  medecinId: string
): Promise<string> {
  const response = await api.patch<string>(
    `/api/secretaire/medecins/${medecinId}/deactivate`
  );
  return normalizeMessage(response.data);
}