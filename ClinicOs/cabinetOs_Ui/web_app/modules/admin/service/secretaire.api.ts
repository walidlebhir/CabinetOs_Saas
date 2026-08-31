import { api } from "@/lib/api";
import type {
  Secretaire,
  SecretairePayload,
  SecretaireUpdatePayload,
} from "../schema/types";

function normalizeMessage(data: unknown): string {
  return typeof data === "string" ? data : String(data ?? "");
}

function asList(data: unknown): Secretaire[] {
  return Array.isArray(data) ? (data as Secretaire[]) : [];
}

export async function getSecretaire(secretaireId: string): Promise<Secretaire> {
  const response = await api.get<Secretaire>(
    `/Admin/api/secretaire/${secretaireId}`
  );
  return response.data;
}

export async function getAllSecretaires(): Promise<Secretaire[]> {
  const response = await api.get<Secretaire[]>("/Admin/api/secretaire/all");
  return asList(response.data);
}

export async function getMyProfile(): Promise<Secretaire> {
  const response = await api.get<Secretaire>("/api/secretaire/me");
  return response.data;
}

export async function getSecretairesByCabinet(
  cabinetId: string
): Promise<Secretaire[]> {
  const response = await api.get<Secretaire[]>(
    `/Admin/api/secretaire/cabinet/${cabinetId}`
  );
  return asList(response.data);
}

export async function searchSecretairesByNom(nom: string): Promise<Secretaire[]> {
  const response = await api.get<Secretaire[]>("/Admin/api/secretaire/search/nom", {
    params: { nom },
  });
  return asList(response.data);
}

export async function searchSecretairesByPrenom(
  prenom: string
): Promise<Secretaire[]> {
  const response = await api.get<Secretaire[]>(
    "/Admin/api/secretaire/search/prenom",
    { params: { prenom } }
  );
  return asList(response.data);
}

export async function searchSecretaires(
  nom: string,
  prenom: string
): Promise<Secretaire[]> {
  const response = await api.get<Secretaire[]>("/Admin/api/secretaire/search", {
    params: { nom, prenom },
  });
  return asList(response.data);
}

export async function createSecretaire(
  payload: SecretairePayload
): Promise<Secretaire> {
  const response = await api.post<Secretaire>(
    "/Admin/api/secretaire/create",
    payload
  );
  return response.data;
}

export async function updateSecretaire(
  payload: SecretaireUpdatePayload
): Promise<Secretaire> {
  const response = await api.put<Secretaire>(
    "/Admin/api/secretaire/update",
    payload
  );
  return response.data;
}

export async function deleteSecretaire(secretaireId: string): Promise<string> {
  const response = await api.delete<string>(
    `/Admin/api/secretaire/delete/${secretaireId}`,
    { responseType: "text" }
  );
  return normalizeMessage(response.data);
}

export async function restoreSecretaire(secretaireId: string): Promise<string> {
  const response = await api.patch<string>(
    `/Admin/api/secretaire/restore/${secretaireId}`,
    null,
    { responseType: "text" }
  );
  return normalizeMessage(response.data);
}

export async function createSecretaireAccount(input: {
  secretaireId: string;
  email: string;
}): Promise<string> {
  const response = await api.post<string>(
    "/Admin/api/secretaire/account/create",
    { id_secretaire: input.secretaireId, email: input.email },
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}
