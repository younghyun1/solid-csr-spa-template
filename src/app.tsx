import { Suspense, type Component, onMount, createSignal } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import TopBar from "./components/TopBar";
import { createEffect } from "solid-js";
import { theme, applyTheme } from "./state/theme";
import { authApi } from "./services/all_api";
import { setAuthenticated, setUser } from "./state/auth";

// Expose build info injected by Vite
declare const __BUILD_TIMESTAMP__: string;
declare const __SOLID_VERSION__: string;

// Define the backend build info signal outside App to allow reference in the overlay
const [backendBuildInfo, setBackendBuildInfo] = createSignal<{
  build_time?: string;
  axum_version?: string;
}>({});

const BuildInfoOverlay = () => (
  <div
    style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      background: "rgba(30,30,30,0.88)",
      color: "#fff",
      "font-size": "0.85em",
      padding: "6px 14px 7px 12px",
      "border-top-right-radius": "8px",
      "z-index": 9999,
      "font-family": "monospace",
      "pointer-events": "none",
    }}
  >
    FE: built {__BUILD_TIMESTAMP__} w. solidjs {__SOLID_VERSION__}
    <br />
    BE: built {backendBuildInfo().build_time ?? "…"} w. axum {backendBuildInfo().axum_version ?? "…"}
  </div>
);

const App: Component = (props: { children: Element }) => {
  const location = useLocation();

  onMount(async () => {
    try {
      const resp = await authApi.me();
      if (resp?.success && resp.data) {
        setAuthenticated(true);
        setUser(resp.data);

        // Save backend build info from response
        setBackendBuildInfo({
          build_time: resp.data.build_time,
          axum_version: resp.data.axum_version,
        });
      } else {
        setAuthenticated(false);
        setUser(null);
        setBackendBuildInfo({});
      }
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
      setBackendBuildInfo({});
    }
  });
  createEffect(() => {
    applyTheme(theme());
  });

  return (
    <>
      <TopBar />
      <BuildInfoOverlay />
      <nav class="bg-white text-gray-900 px-4 transition-colors duration-90 dark:bg-gray-900 dark:text-gray-100">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <A
              href="/"
              class="no-underline hover:underline transition-colors duration-90"
            >
              Home
            </A>
          </li>
          <li class="py-2 px-4">
            <A
              href="/about"
              class="no-underline hover:underline transition-colors duration-90"
            >
              About
            </A>
          </li>
          <li class="py-2 px-4">
            <A
              href="/blog"
              class="no-underline hover:underline transition-colors duration-90"
            >
              Blog
            </A>
          </li>

          <li class="text-sm flex items-center space-x-1 ml-auto">
            <span>URL:</span>
            <input
              class="w-75px p-1 bg-white text-sm rounded-lg dark:bg-gray-800 dark:text-white transition-colors duration-90"
              type="text"
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav>

      <main class="transition-colors duration-90 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen">
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
