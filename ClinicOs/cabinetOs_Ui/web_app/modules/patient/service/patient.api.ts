import { api } from "@/lib/api";
import type { PatientInfo, PatientInfoPayload } from "../schema/types";

export async function getPatientInfo(): Promise<PatientInfo> {
  const response = await api.get<PatientInfo>("/patient/info");
  return response.data;
}

export async function addPatientInfo(
  payload: PatientInfoPayload
): Promise<string> {
  const response = await api.post<string>("/patient/info/add", payload, {
    responseType: "text",
  });
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}

export async function updatePatientInfo(
  payload: PatientInfoPayload
): Promise<string> {
  const response = await api.put<string>("/patient/info/update", payload, {
    responseType: "text",
  });
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}
