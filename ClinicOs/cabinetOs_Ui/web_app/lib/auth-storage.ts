const ACCESS_TOKEN_KEY = "medos_access_token";
const REFRESH_TOKEN_KEY = "medos_refresh_token";

export type SessionUser = {
  email: string;
  role: string;
};

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const accessTokenStore = {
  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  getSnapshot(): string {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
  },
  getServerSnapshot(): string {
    return "";
  },
};

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getSessionUser(): SessionUser | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.sub || !payload.role) return null;
  return { email: payload.sub, role: payload.role };
}
