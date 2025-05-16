import { createSignal } from "solid-js";
import { MeResponse } from "../dtos/responses/auth";

export const [isAuthenticated, setAuthenticated] = createSignal<boolean | null>(
  null,
);
export const [user, setUser] = createSignal<MeResponse>(null);
