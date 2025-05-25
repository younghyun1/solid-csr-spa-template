export const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = "5f706c3c-5651-4d76-94a7-b999067b66aa";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

// Expose Vite-injected globals for build info headers
declare const __BUILD_TIMESTAMP__: string;
declare const __APP_NAME__: string;

import { setAuthenticated, setUser } from "../state/auth";
import { setServerBuildInfo } from "../app";

// Unified error-handling apiFetch, with client build info headers
export async function apiFetch(path: string, options: RequestInit = {}) {
  options.headers = {
    ...(options.headers || {}),
    "x-api-key": API_KEY,
  };
  const response = await fetch(apiUrl(path), options);

  // Update server build info from headers, if present
  const builtTime = response.headers.get("x-server-built-time");
  const serverName = response.headers.get("x-server-name");
  if (builtTime || serverName) {
    setServerBuildInfo((prev) => ({
      ...prev,
      built_time: builtTime ?? prev.built_time,
      name: serverName ?? prev.name,
    }));
  }

  if (response.status === 401 || response.status === 403) {
    setAuthenticated(false);
    setUser(null);
    // Use hard redirect for full reset (safe from anywhere), fallback if already on /login
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized – redirected to login");
  }

  return response;
}
