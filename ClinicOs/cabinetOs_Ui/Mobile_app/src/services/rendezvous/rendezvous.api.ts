import { api } from '@/lib/api';
import type {
  CreneauDisponibilite,
  Rendezvous,
  RendezvousRequest,
} from '@/types/rendezvous';

export async function getMyRendezvous(): Promise<Rendezvous[]> {
  const response = await api.get<Rendezvous[]>('/rendezvous/patient/me');
  return response.data;
}

export async function createRendezvous(
  payload: RendezvousRequest
): Promise<Rendezvous> {
  const response = await api.post<Rendezvous>(
    '/rendezvous/patient/create',
    payload
  );
  return response.data;
}

export async function getCreneaux(
  medecinId: string,
  date: string
): Promise<CreneauDisponibilite[]> {
  const response = await api.get<CreneauDisponibilite[]>(
    `/rendezvous/medecin/${medecinId}/creneaux`,
    { params: { date } }
  );
  return response.data;
}

export async function isCreneauLibre(params: {
  medecinId: string;
  date: string;
  heureDebut: string;
  heureFin: string;
}): Promise<boolean> {
  const response = await api.get<boolean>('/rendezvous/available', {
    params,
  });
  return response.data;
}
