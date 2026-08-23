import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "../schema/types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/authentification/login",
    payload
  );
  return response.data;
}
