export const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = "26918650-db83-4931-a08d-47661b4dcb51";

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
