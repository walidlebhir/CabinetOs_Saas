import { api } from '@/lib/api';
import type { CabinetDetail, CabinetHome } from '@/types/cabinet';

export async function getCabinets(): Promise<CabinetHome[]> {
  const response = await api.get<CabinetHome[]>('/home/cabinets');
  return response.data;
}

export async function getCabinetDetail(
  cabinetId: string
): Promise<CabinetDetail> {
  const response = await api.get<CabinetDetail>(
    `/home/cabinets/${cabinetId}`
  );
  return response.data;
}
