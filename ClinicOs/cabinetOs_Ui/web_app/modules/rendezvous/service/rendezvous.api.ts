import { api } from "@/lib/api";
import type {
  Creneau,
  MedecinProfilDetail,
  Rendezvous,
  RendezvousCreatePayload,
} from "../schema/types";

function normalizeMessage(data: unknown): string {
  return typeof data === "string" ? data : String(data ?? "");
}

// Profil public d'un médecin (avec planning) — espace patient
export async function getMedecinProfil(medecinId: string): Promise<MedecinProfilDetail> {
  const response = await api.get<MedecinProfilDetail>(`/home/medecins/${medecinId}`);
  return response.data;
}

// Créneaux libres / réservés d'un médecin pour une date
export async function getCreneauxDuMedecin(
  medecinId: string,
  date: string
): Promise<Creneau[]> {
  const response = await api.get<Creneau[]>(`/rendezvous/medecin/${medecinId}/creneaux`, {
    params: { date },
  });
  return Array.isArray(response.data) ? response.data : [];
}

// Créer un rendez-vous (patient connecté)
export async function createRendezvousPatient(
  payload: RendezvousCreatePayload
): Promise<Rendezvous> {
  const response = await api.post<Rendezvous>("/rendezvous/patient/create", payload);
  return response.data;
}

// Créer un rendez-vous (secrétaire)
export async function createRendezvousSecretaire(
  payload: RendezvousCreatePayload
): Promise<Rendezvous> {
  const response = await api.post<Rendezvous>("/rendezvous/secretaire/create", payload);
  return response.data;
}

// Liste des rendez-vous du cabinet (admin-cabinet)
export async function getRdvCabinetAdmin(cabinetId: string): Promise<Rendezvous[]> {
  const response = await api.get<Rendezvous[]>("/rendezvous/cabinet/list", {
    params: { cabinetId },
  });
  return Array.isArray(response.data) ? response.data : [];
}

// Liste des rendez-vous du cabinet (secrétaire)
export async function getRdvCabinetSecretaire(): Promise<Rendezvous[]> {
  const response = await api.get<Rendezvous[]>("/rendezvous/secretaire/list");
  return Array.isArray(response.data) ? response.data : [];
}

// Liste des rendez-vous du médecin connecté
export async function getMesRdvMedecin(): Promise<Rendezvous[]> {
  const response = await api.get<Rendezvous[]>("/rendezvous/medecin/me");
  return Array.isArray(response.data) ? response.data : [];
}

// Liste des rendez-vous du patient connecté
export async function getMesRdvPatient(): Promise<Rendezvous[]> {
  const response = await api.get<Rendezvous[]>("/rendezvous/patient/me");
  return Array.isArray(response.data) ? response.data : [];
}

async function changerStatus(id: string, action: string): Promise<string> {
  const response = await api.patch<unknown>(`/rendezvous/${id}/${action}`);
  return normalizeMessage(response.data);
}

export const confirmerRdv = (id: string) => changerStatus(id, "confirmer");
export const annulerRdv = (id: string) => changerStatus(id, "annuler");
export const terminerRdv = (id: string) => changerStatus(id, "terminer");
export const marquerAbsentRdv = (id: string) => changerStatus(id, "absent");
export const remettreEnAttenteRdv = (id: string) => changerStatus(id, "attente");
