import { createSignal } from "solid-js";
import { MeResponse } from "../services/auth/dtos/check_auth_response";

// Ideally, fetch from BE on app load to verify session, don't trust local signals at reload!
export const [isAuthenticated, setAuthenticated] = createSignal<boolean | null>(
  null,
);
export const [user, setUser] = createSignal<MeResponse>(null);
