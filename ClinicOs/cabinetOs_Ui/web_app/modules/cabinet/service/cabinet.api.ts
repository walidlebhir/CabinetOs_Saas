import { api } from "@/lib/api";
import type { AdminCabinet, CabinetPayload } from "../schema/types";

export async function getMyCabinets(): Promise<AdminCabinet[]> {
  const response = await api.get<AdminCabinet[]>("/config/cabinet/list");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getCabinetById(cabinetId: string): Promise<AdminCabinet> {
  const response = await api.get<AdminCabinet>(`/config/cabinet/${cabinetId}`);
  return response.data;
}

export async function createCabinet(
  payload: CabinetPayload
): Promise<string> {
  const response = await api.post<string>(
    "/config/cabinet/create",
    payload,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}

export async function updateCabinet(
  cabinetId: string,
  payload: CabinetPayload
): Promise<string> {
  const response = await api.put<string>(
    `/config/cabinet/${cabinetId}`,
    payload,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}

export async function activateCabinet(cabinetId: string): Promise<string> {
  const response = await api.patch<string>(
    `/config/cabinet/${cabinetId}/activate`,
    null,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}

export async function deactivateCabinet(cabinetId: string): Promise<string> {
  const response = await api.patch<string>(
    `/config/cabinet/${cabinetId}/deactivate`,
    null,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}
