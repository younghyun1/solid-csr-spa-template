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

// Post-login redirect/replay bootstrap (runs on module load)
(() => {
  try {
    if (typeof window === "undefined") return;
    const ready = sessionStorage.getItem("post_login_ready");
    if (ready !== "1") return;
    const redirectTo = sessionStorage.getItem("post_login_redirect") || "";
    // Only run on the intended page
    const here =
      window.location.pathname + window.location.search + window.location.hash;
    if (redirectTo && here !== redirectTo) return;

    const raw = sessionStorage.getItem("post_login_request");
    sessionStorage.removeItem("post_login_ready");
    if (!raw) {
      sessionStorage.removeItem("post_login_redirect");
      return;
    }
    let replay: {
      path: string;
      method: string;
      headers?: Record<string, string>;
      body?: string | null;
      credentials?: RequestCredentials;
    } | null = null;
    try {
      replay = JSON.parse(raw);
    } catch {
      replay = null;
    }
    if (!replay || !replay.path || !replay.method) {
      sessionStorage.removeItem("post_login_request");
      sessionStorage.removeItem("post_login_redirect");
      return;
    }
    // Fire-and-forget; ignore errors
    setTimeout(() => {
      apiFetch(replay!.path, {
        method: replay!.method,
        headers: replay!.headers,
        body: replay!.body ?? undefined,
        credentials: replay!.credentials,
      }).finally(() => {
        sessionStorage.removeItem("post_login_request");
        sessionStorage.removeItem("post_login_redirect");
      });
    }, 0);
  } catch {
    // noop
  }
})();

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

  // If this was a successful login, redirect back and trigger optional replay
  if (path.startsWith("/api/auth/login") && response.ok) {
    try {
      const redirectTo = sessionStorage.getItem("post_login_redirect");
      if (redirectTo && !redirectTo.startsWith("/login")) {
        // Mark ready so next load can replay the saved request (if any)
        sessionStorage.setItem("post_login_ready", "1");
        // Navigate back to where the user was
        window.location.replace(redirectTo);
      }
    } catch {}
  }
  if (response.status === 401 || response.status === 403) {
    setAuthenticated(false);
    setUser(null);
    try {
      const currentUrl =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      sessionStorage.setItem("post_login_redirect", currentUrl);
      // Save a replayable request only for GET or small JSON POST
      const method = (options.method || "GET").toUpperCase();
      let contentType: string | undefined;
      const hdrs = options.headers as
        | Headers
        | Record<string, string>
        | undefined;
      if (hdrs instanceof Headers) {
        contentType =
          hdrs.get("Content-Type") ?? hdrs.get("content-type") ?? undefined;
      } else if (hdrs) {
        contentType =
          (hdrs["Content-Type"] as string) || (hdrs["content-type"] as string);
      }
      const MAX_REPLAY_BODY = 64 * 1024; // 64KB
      if (method === "GET") {
        sessionStorage.setItem(
          "post_login_request",
          JSON.stringify({
            path,
            method: "GET",
            credentials: options.credentials,
          }),
        );
      } else if (
        method === "POST" &&
        typeof contentType === "string" &&
        contentType.includes("application/json") &&
        typeof options.body === "string" &&
        (options.body as string).length <= MAX_REPLAY_BODY
      ) {
        sessionStorage.setItem(
          "post_login_request",
          JSON.stringify({
            path,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: options.body as string,
            credentials: options.credentials,
          }),
        );
      }
    } catch {}
    // Use hard redirect for full reset (safe from anywhere), fallback if already on /login
    if (!window.location.pathname.startsWith("/login")) {
      const currentUrl =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`;
    }
    throw new Error("Unauthorized – redirected to login");
  }

  return response;
}
