import { api } from "@/lib/api";
import type {
  Disponibilite,
  DisponibilitePayload,
  DisponibiliteUpdatePayload,
  Indisponibilite,
  IndisponibilitePayload,
  IndisponibiliteUpdatePayload,
  PlanningCreatePayload,
  PlanningResponse,
} from "@/modules/admin/schema/types";

export type MyDisponibilitePayload = Omit<DisponibilitePayload, "medecinId">;
export type MyDisponibiliteUpdatePayload = Omit<
  DisponibiliteUpdatePayload,
  "medecinId"
>;
export type MyIndisponibilitePayload = Omit<IndisponibilitePayload, "medecinId">;
export type MyIndisponibiliteUpdatePayload = Omit<
  IndisponibiliteUpdatePayload,
  "medecinId"
>;

function normalizeMessage(data: unknown): string {
  return typeof data === "string" ? data : String(data ?? "");
}

export async function getMyDisponibilites(): Promise<Disponibilite[]> {
  const response = await api.get<Disponibilite[]>(
    "/api/planning/disponibilite/me"
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function createMyPlanning(
  payload: PlanningCreatePayload
): Promise<PlanningResponse> {
  const response = await api.post<PlanningResponse>(
    "/api/planning/me/create",
    payload
  );
  return response.data;
}

export async function createMyDisponibilite(
  payload: MyDisponibilitePayload
): Promise<Disponibilite> {
  const response = await api.post<Disponibilite>(
    "/api/planning/disponibilite/me/create",
    payload
  );
  return response.data;
}

export async function updateMyDisponibilite(
  payload: MyDisponibiliteUpdatePayload
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

export async function getMyIndisponibilites(): Promise<Indisponibilite[]> {
  const response = await api.get<Indisponibilite[]>(
    "/api/planning/indisponibilite/me"
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function createMyIndisponibilite(
  payload: MyIndisponibilitePayload
): Promise<Indisponibilite> {
  const response = await api.post<Indisponibilite>(
    "/api/planning/indisponibilite/me/create",
    payload
  );
  return response.data;
}

export async function updateMyIndisponibilite(
  payload: MyIndisponibiliteUpdatePayload
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
