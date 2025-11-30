import {
  Suspense,
  type Component,
  onMount,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";

import { A, useLocation } from "@solidjs/router";

import TopBar from "./components/TopBar";

import { theme, applyTheme } from "./state/theme"; // <-- import theme for dynamic color

import { authApi } from "./services/all_api";

import { setAuthenticated, setUser } from "./state/auth";

import { fetchHealthState, type HealthStateResponse } from "./services/api";

// Expose build info injected by Vite

declare const __BUILD_TIMESTAMP__: string;

declare const __SOLID_VERSION__: string;

// Server build info (live from response headers)

export const [serverBuildInfo, setServerBuildInfo] = createSignal<{
  built_time?: string;

  name?: string;

  rust_version?: string;
}>({});

const BottomBar: Component = () => {
  const location = useLocation();

  const [healthState, setHealthState] = createSignal<
    | (HealthStateResponse["data"] & {
        client_latency_ms?: number;

        time_to_process?: string;

        baseline_uptime_ms?: number;
        baseline_timestamp?: string;
      })
    | null
  >(null);

  const [clientNow, setClientNow] = createSignal<Date | null>(null);

  // Refresh health state on route changes

  createEffect(() => {
    // depend on pathname so this re-runs on each navigation

    const _path = location.pathname;

    (async () => {
      const start = performance.now();

      try {
        const resp = await fetchHealthState();

        const end = performance.now();

        const client_latency_ms = end - start;

        if (resp.success && resp.data) {
          const baseline_uptime_ms = parseUptimeToMs(resp.data.server_uptime);

          setHealthState({
            ...resp.data,

            client_latency_ms,

            time_to_process: resp.meta.time_to_process,

            baseline_uptime_ms: baseline_uptime_ms ?? undefined,
            baseline_timestamp: resp.data.timestamp,
          });

          // serverBuildInfo will be populated via headers handled in apiFetch
        } else {
          setHealthState(null);
        }
      } catch {
        setHealthState(null);
      }
    })();
  });

  // Live ticking for uptime / age display

  createEffect(() => {
    const interval = setInterval(() => {
      setClientNow(new Date());
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  const formatIsoAge = (iso: string | undefined) => {
    if (!iso) return "–";

    const base = new Date(iso);

    const now = clientNow() ?? new Date();

    const diffMs = now.getTime() - base.getTime();

    if (Number.isNaN(diffMs) || diffMs < 0) return "just now";

    const totalSec = Math.floor(diffMs / 1000);

    const mins = Math.floor(totalSec / 60);

    const secs = totalSec % 60;

    if (mins <= 0) return `${secs}s ago`;

    return `${mins}m ${secs}s ago`;
  };

  // Parse uptime string like "3 minutes, 51 seconds, 688 milliseconds" into ms
  const parseUptimeToMs = (uptime: string | undefined): number | null => {
    if (!uptime) return null;
    let total = 0;
    const parts = uptime.split(",").map((p) => p.trim().toLowerCase());
    for (const part of parts) {
      const [numStr, unitRaw] = part.split(/\s+/, 2);
      const value = Number(numStr);
      if (!Number.isFinite(value)) continue;
      const unit = unitRaw ?? "";
      if (unit.startsWith("hour")) total += value * 60 * 60 * 1000;
      else if (unit.startsWith("minute")) total += value * 60 * 1000;
      else if (unit.startsWith("second")) total += value * 1000;
      else if (unit.startsWith("millisecond")) total += value;
    }
    return total || null;
  };

  const formatUptimeMs = (ms: number | null): string => {
    if (ms == null || !Number.isFinite(ms) || ms < 0) return "–";

    const totalSec = Math.floor(ms / 1000);

    const hours = Math.floor(totalSec / 3600);

    const mins = Math.floor((totalSec % 3600) / 60);

    const secs = totalSec % 60;

    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;

    if (mins > 0) return `${mins}m ${secs}s`;

    return `${secs}s`;
  };

  return (
    <footer
      class="fixed bottom-0 left-0 w-full transition-colors duration-90 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
      style={{
        "z-index": 50,
      }}
    >
      <div
        class="w-full px-3 py-1.5 text-xs flex flex-row justify-between items-start gap-3"
        style={{
          "font-family": "monospace",
        }}
      >
        <div class="text-gray-900 dark:text-white leading-tight space-y-0.5">
          <div>
            FE: built {__BUILD_TIMESTAMP__} w. solidjs {__SOLID_VERSION__}
          </div>

          <div>
            BE: built {serverBuildInfo().built_time ?? "…"} (
            {serverBuildInfo().name ?? "…"})
            {serverBuildInfo().rust_version && (
              <> rust/{serverBuildInfo().rust_version}</>
            )}
          </div>
        </div>

        <div class="text-gray-900 dark:text-white leading-tight text-right space-y-0.5">
          {healthState() ? (
            (() => {
              const hs = healthState()!;
              const baselineMs =
                hs.baseline_uptime_ms ?? parseUptimeToMs(hs.server_uptime);
              const baselineTs = hs.baseline_timestamp ?? hs.timestamp;
              let liveUptime: string = hs.server_uptime;

              if (baselineMs != null && baselineTs) {
                const base = new Date(baselineTs);
                const now = clientNow() ?? new Date();
                const extra = now.getTime() - base.getTime();
                const totalMs =
                  baselineMs +
                  (Number.isFinite(extra) ? Math.max(extra, 0) : 0);
                liveUptime = formatUptimeMs(totalMs);
              }

              return (
                <>
                  <div>
                    up {liveUptime} · handled {hs.responses_handled} responses ·
                    sessions {hs.users_logged_in}
                  </div>

                  <div>
                    db {hs.db_version} · db latency {hs.db_latency}
                  </div>

                  <div>
                    time to generate state report: {hs.time_to_process ?? "?"} · net{" "}
                    {hs.client_latency_ms?.toFixed(1) ?? "?"}ms · state{" "}
                    {formatIsoAge(hs.timestamp)}
                  </div>
                </>
              );
            })()
          ) : (
            <div>metrics: …</div>
          )}
        </div>
      </div>
    </footer>
  );
};

const App: Component = (props: { children: Element }) => {
  const location = useLocation();

  onMount(async () => {
    try {
      const resp = await authApi.me();
      if (resp?.success && resp.data) {
        setAuthenticated(true);
        setUser(resp.data);

        // Save backend build info from response
        setServerBuildInfo({
          built_time: resp.data.build_time,
          name: resp.data.axum_version,
        });
      } else {
        setAuthenticated(false);
        setUser(null);
        setServerBuildInfo({});
      }
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
      setServerBuildInfo({});
    }
  });
  createEffect(() => {
    applyTheme(theme());
  });

  return (
    <div
      id="app-root"
      class="transition-colors duration-90"
      style="display: flex; flex-direction: column; min-height: 100vh;"
    >
      <TopBar />

      <main
        class="transition-colors duration-90 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 pb-10"
        style="flex: 1 1 0%; min-height: 0;"
      >
        <Suspense>{props.children}</Suspense>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
