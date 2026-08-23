import axios from "axios";
import type { ApiErrorResponse } from "../schema/types";

export function extractApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | string | undefined;
    if (typeof data === "string" && data.trim().length > 0) return data;
    if (data && typeof data === "object" && data.message) {
      return data.message;
    }
    if (error.code === "ERR_NETWORK") {
      return "Impossible de joindre le serveur. Vérifiez que le backend est démarré.";
    }
  }
  return fallback;
}
