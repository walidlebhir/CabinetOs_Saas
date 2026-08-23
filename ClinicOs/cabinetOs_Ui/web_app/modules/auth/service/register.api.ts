import { api } from "@/lib/api";
import type { PatientRegisterPayload } from "../schema/types";

export async function registerPatient(
  payload: PatientRegisterPayload
): Promise<string> {
  const response = await api.post<string>(
    "/authentification/register",
    payload,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}
