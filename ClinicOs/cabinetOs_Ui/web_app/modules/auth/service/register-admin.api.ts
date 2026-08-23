import { api } from "@/lib/api";
import type { AdminRegisterPayload } from "../schema/types";

export async function registerAdmin(
  payload: AdminRegisterPayload
): Promise<string> {
  const response = await api.post<string>(
    "/authentification/register/admin",
    payload,
    { responseType: "text" }
  );
  return typeof response.data === "string"
    ? response.data
    : String(response.data);
}
