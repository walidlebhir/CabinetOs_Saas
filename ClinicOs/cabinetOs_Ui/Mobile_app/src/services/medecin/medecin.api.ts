import { api } from '@/lib/api';
import type { MedecinProfilDetail } from '@/types/cabinet';

export async function getMedecinProfil(
  medecinId: string
): Promise<MedecinProfilDetail> {
  const response = await api.get<MedecinProfilDetail>(
    `/home/medecins/${medecinId}`
  );
  return response.data;
}
