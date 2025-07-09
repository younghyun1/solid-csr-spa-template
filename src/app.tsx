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
  // Choose light/dark mode text color
  const textColor = theme() === "dark" ? "#ededed" : "#18181b";

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        background: "none", // remove box color
        color: textColor,
        "font-size": "0.85em",
        padding: "6px 14px 7px 12px",
        "border-top-right-radius": "8px",
        "z-index": 9999,
        "font-family": "monospace",
        "pointer-events": "none",
        // no border or shadow
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
      <BuildInfoOverlay />

      <main
        class="transition-colors duration-90 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100"
        style="flex: 1 1 0%; min-height: 0;"
      >
        <Suspense>{props.children}</Suspense>
      </main>
    </div>
  );
};

export default App;
