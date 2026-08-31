import { api } from "@/lib/api";
import type {
  Disponibilite,
  DisponibiliteMeUpdatePayload,
  Indisponibilite,
  IndisponibiliteMeUpdatePayload,
  PlanningCreatePayload,
  PlanningResponse,
} from "../schema/types";

function normalizeMessage(data: unknown): string {
  return typeof data === "string" ? data : String(data ?? "");
}

export async function getDisponibilitesByMedecin(
  medecinId: string
): Promise<Disponibilite[]> {
  const response = await api.get<Disponibilite[]>(
    `/api/planning/disponibilite/medecin/${medecinId}`
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function getIndisponibilitesByMedecin(
  medecinId: string
): Promise<Indisponibilite[]> {
  const response = await api.get<Indisponibilite[]>(
    `/api/planning/indisponibilite/medecin/${medecinId}`
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function createPlanning(
  payload: PlanningCreatePayload
): Promise<PlanningResponse> {
  const response = await api.post<PlanningResponse>(
    "/api/planning/me/create",
    payload
  );
  return response.data;
}

export async function updateMyDisponibilite(
  payload: DisponibiliteMeUpdatePayload
): Promise<string> {
  const response = await api.put<string>(
    "/api/planning/disponibilite/me/update",
    payload
  );
  return normalizeMessage(response.data);
}

export async function deleteMyDisponibilite(id: number): Promise<string> {
  const response = await api.delete<string>(
    `/api/planning/disponibilite/me/delete/${id}`
  );
  return normalizeMessage(response.data);
}

export async function updateMyIndisponibilite(
  payload: IndisponibiliteMeUpdatePayload
): Promise<string> {
  const response = await api.put<string>(
    "/api/planning/indisponibilite/me/update",
    payload
  );
  return normalizeMessage(response.data);
}

export async function deleteMyIndisponibilite(id: number): Promise<string> {
  const response = await api.delete<string>(
    `/api/planning/indisponibilite/me/delete/${id}`
  );
  return normalizeMessage(response.data);
}
