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

const BottomBar: Component = () => {
  return (
    <footer
      class="fixed bottom-0 left-0 w-full transition-colors duration-90 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
      style={{
        "z-index": 50,
      }}
    >
      <div
        class="max-w-5xl mx-auto flex flex-col justify-start items-start gap-0 px-3 py-1.5 text-xs"
        style={{
          "font-family": "monospace",
        }}
      >
        <div class="text-gray-900 dark:text-white leading-tight">
          FE: built {__BUILD_TIMESTAMP__} w. solidjs {__SOLID_VERSION__}
        </div>
        <div class="text-gray-900 dark:text-white">
          BE: built {serverBuildInfo().built_time ?? "…"} (
          {serverBuildInfo().name ?? "…"})
          {serverBuildInfo().rust_version && (
            <> rust/{serverBuildInfo().rust_version}</>
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
