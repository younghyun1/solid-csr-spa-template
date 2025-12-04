import { Component, createEffect, onCleanup } from "solid-js";
import { useLocation } from "@solidjs/router";
import {
  healthState,
  clientNow,
  setClientNow,
  refreshHealthState,
  parseUptimeToMs,
  formatUptimeMs,
  formatIsoAge,
} from "../state/health";
import { serverBuildInfo } from "../state/server_info";

// Expose build info injected by Vite
declare const __BUILD_TIMESTAMP__: string;
declare const __SOLID_VERSION__: string;

const BottomBar: Component = () => {
  const location = useLocation();

  // Refresh health state on route changes
  createEffect(() => {
    // depend on pathname so this re-runs on each navigation
    const _path = location.pathname;
    refreshHealthState();
  });

  // Live ticking for uptime / age display
  createEffect(() => {
    const interval = setInterval(() => {
      setClientNow(new Date());
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <footer
      class="fixed bottom-0 left-0 w-full transition-colors duration-90 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-[9px] sm:text-[11px]"
      style={{
        "z-index": 50,
      }}
    >
      <div
        class="w-full px-2 sm:px-3 py-0.5 sm:py-1.5 flex flex-row justify-between items-start gap-2 sm:gap-3"
        style={{
          "font-family": "monospace",
        }}
      >
        <div class="text-gray-900 dark:text-white leading-tight space-y-0.5 max-w-[55%]">
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

        <div class="text-gray-900 dark:text-white leading-tight text-right space-y-0.5 max-w-[45%]">
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

                  <div class="hidden xs:block sm:block">
                    db {hs.db_version} · db latency {hs.db_latency}
                  </div>

                  <div class="hidden sm:block">
                    time to generate state report: {hs.time_to_process ?? "?"} ·
                    net {hs.client_latency_ms?.toFixed(1) ?? "?"}ms · state{" "}
                    {formatIsoAge(hs.timestamp, clientNow())}
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

export default BottomBar;
