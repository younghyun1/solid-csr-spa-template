import {
  isAuthenticated,
  setAuthenticated,
  setUser,
  user,
} from "../../state/auth";
import { apiFetch, apiUrl } from "../api";
import { MeResponse } from "./dtos/check_auth_response";

export async function checkAuth() {
  const res = await apiFetch("/api/auth/me", { credentials: "include" });
  if (res.ok) {
    const userData: MeResponse = await res.json();
    setAuthenticated(true);
    setUser(userData);
  } else {
    setAuthenticated(false);
    setUser(null);
  }
}

export function useAuth() {
  return { isAuthenticated, user, checkAuth };
}

// For login/logout, call BE endpoints and then update state
export async function login(email: string, pw: string) {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email: email, user_password: pw }),
  });
  if (!res.ok) throw new Error("Login failed");
  await checkAuth();
}

export async function logout() {
  await fetch(apiUrl("/api/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
  setAuthenticated(false);
  setUser(null);
}
