import { api } from "@/lib/api";
import type { CabinetDetail, CabinetHome } from "../schema/types";

export async function getCabinets(): Promise<CabinetHome[]> {
  const response = await api.get<CabinetHome[]>("/home/cabinets");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getCabinetDetail(cabinetId: string): Promise<CabinetDetail> {
  const response = await api.get<CabinetDetail>(`/home/cabinets/${cabinetId}`);
  return response.data;
}
