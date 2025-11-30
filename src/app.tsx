import {
  Suspense,
  type Component,
  onMount,
  createSignal,
  createEffect,
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
  const [healthState, setHealthState] = createSignal<
    HealthStateResponse["data"] | null
  >(null);
  const [healthLoaded, setHealthLoaded] = createSignal(false);

  // On first render, if BE line is effectively blank, fetch /api/healthcheck/state
  createEffect(() => {
    const info = serverBuildInfo();
    const hasBuiltInfo =
      !!info.built_time || !!info.name || !!info.rust_version;

    if (!hasBuiltInfo && !healthLoaded()) {
      setHealthLoaded(true);
      (async () => {
        try {
          const resp = await fetchHealthState();
          if (resp.success && resp.data) {
            setHealthState(resp.data);
            // serverBuildInfo will be populated via headers handled in apiFetch
          }
        } catch {
          // leave metrics blank if call fails
        }
      })();
    }
  });

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
            <>
              <div>
                up {healthState()!.server_uptime} · handled{" "}
                {healthState()!.responses_handled} · sessions{" "}
                {healthState()!.users_logged_in}
              </div>
              <div>
                db {healthState()!.db_version} · latency{" "}
                {healthState()!.db_latency}
              </div>
            </>
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
