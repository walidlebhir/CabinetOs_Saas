import { api } from "@/lib/api";
import type {
  Medecin,
  MedecinAccount,
  MedecinImportResult,
  MedecinPayload,
  MedecinUpdatePayload,
} from "../schema/types";

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

export async function getMedecinsByCabinet(
  cabinetId: string
): Promise<Medecin[]> {
  const response = await api.get<Medecin[]>(
    `/Admin/api/medecin/cabinet/${cabinetId}`
  );
  return Array.isArray(response.data)
    ? response.data.map(normalizeMedecin)
    : [];
}

export async function getMedecin(medecinId: string): Promise<Medecin> {
  const response = await api.get<Medecin>(`/Admin/api/medecin/${medecinId}`);
  return normalizeMedecin(response.data);
}

export async function getMyProfile(): Promise<Medecin> {
  const response = await api.get<Medecin>("/api/medecin/me");
  return normalizeMedecin(response.data);
}

export async function createMedecin(
  payload: MedecinPayload
): Promise<Medecin> {
  const response = await api.post<Medecin>(
    "/Admin/api/medecin/create",
    payload
  );
  return response.data;
}

export async function updateMedecin(
  payload: MedecinUpdatePayload
): Promise<string> {
  const response = await api.put<string>("/Admin/api/medecin/update", payload);
  return normalizeMessage(response.data);
}

export async function deleteMedecin(medecinId: string): Promise<string> {
  const response = await api.delete<string>(
    `/Admin/api/medecin/delete/${medecinId}`
  );
  return normalizeMessage(response.data);
}

export async function createMedecinAccount(input: {
  medecinId: string;
  email: string;
}): Promise<MedecinAccount> {
  const response = await api.post<MedecinAccount>(
    "/Admin/api/medecin/account/create",
    { medecinId: input.medecinId, email: input.email }
  );
  return response.data;
}

export async function setUserAccountActive(input: {
  accountId: string;
  active: boolean;
}): Promise<string> {
  const action = input.active ? "activate" : "deactivate";
  const response = await api.patch<string>(
    `/Admin/api/user/${action}/${input.accountId}`
  );
  return normalizeMessage(response.data);
}

export async function importMedecins(
  file: File,
  cabinetId: string
): Promise<MedecinImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cabinetId", cabinetId);
  const response = await api.post<MedecinImportResult>(
    "/Admin/api/medecin/import",
    formData
  );
  return response.data;
}

export async function exportMedecins(
  format: "csv" | "xlsx",
  cabinetId: string
): Promise<Blob> {
  const response = await api.get<Blob>("/Admin/api/medecin/export", {
    params: { format, cabinetId },
    responseType: "blob",
  });
  return response.data;
}
