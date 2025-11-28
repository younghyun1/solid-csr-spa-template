import { Suspense, type Component, onMount, createSignal } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import TopBar from "./components/TopBar";
import { createEffect } from "solid-js";
import { theme, applyTheme } from "./state/theme"; // <-- import theme for dynamic color
import { authApi } from "./services/all_api";
import { setAuthenticated, setUser } from "./state/auth";

// Expose build info injected by Vite
declare const __BUILD_TIMESTAMP__: string;
declare const __SOLID_VERSION__: string;

// Server build info (live from response headers)
export const [serverBuildInfo, setServerBuildInfo] = createSignal<{
  built_time?: string;
  name?: string;
  rust_version?: string;
}>({});

const BuildInfoOverlay = () => {
  // Choose light/dark mode text color (reactive function)
  const textColor = () => (theme() === "dark" ? "#ededed" : "black");

  return (
    <div
      class="bg-gray-50 dark:bg-gray-950 transition-colors duration-90"
      style={{
        width: "100%",
        color: textColor(),
        "font-size": "0.85em",
        padding: "6px 14px 7px 12px",
        "font-family": "monospace",
        // Ensure it sits above if we ever used sticky, but here it's in flow
        "z-index": 10,
      }}
    >
      FE: built {__BUILD_TIMESTAMP__} w. solidjs {__SOLID_VERSION__}
      <br />
      BE: built {serverBuildInfo().built_time ?? "…"} (
      {serverBuildInfo().name ?? "…"})
      {serverBuildInfo().rust_version && (
        <> rust/{serverBuildInfo().rust_version}</>
      )}
    </div>
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
      style="display: flex; flex-direction: column; min-height: 100vh;"
    >
      <TopBar />

      <main
        class="transition-colors duration-90 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100"
        style="flex: 1 1 0%; min-height: 0;"
      >
        <Suspense>{props.children}</Suspense>
      </main>

      <BuildInfoOverlay />
    </div>
  );
};

export default App;
