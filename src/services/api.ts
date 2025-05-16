export const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = "5f706c3c-5651-4d76-94a7-b999067b66aa";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

// Generic fetch wrapper that includes the API key header
export async function apiFetch(path: string, options: RequestInit = {}) {
  options.headers = {
    ...(options.headers || {}),
    "x-api-key": API_KEY,
  };
  return fetch(apiUrl(path), options);
}
