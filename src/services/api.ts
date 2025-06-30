export const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = "03e537d1-3d83-4dc8-988d-16899ae1b7e0";

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
  const rustVersion = response.headers.get("x-server-rust-version");
  if (builtTime || serverName || rustVersion) {
    setServerBuildInfo((prev) => ({
      ...prev,
      built_time: builtTime ?? prev.built_time,
      name: serverName ?? prev.name,
      rust_version: rustVersion ?? prev.rust_version,
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
