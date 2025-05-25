export const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = "5f706c3c-5651-4d76-94a7-b999067b66aa";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

// Generic fetch wrapper that includes the API key header
import { setAuthenticated, setUser } from "../state/auth";

// Unified error-handling apiFetch
export async function apiFetch(path: string, options: RequestInit = {}) {
  options.headers = {
    ...(options.headers || {}),
    "x-api-key": API_KEY,
  };
  const response = await fetch(apiUrl(path), options);

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
