import { Suspense, type Component, onMount, createEffect } from "solid-js";

import { useLocation } from "@solidjs/router";

import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";

import { theme, applyTheme } from "./state/theme"; // <-- import theme for dynamic color

import { authApi } from "./services/all_api";

import { setAuthenticated, setUser } from "./state/auth";
import { setServerBuildInfo } from "./state/server_info";

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
      class="transition-colors duration-90 min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 overflow-x-hidden"
    >
      <TopBar />

      <main class="flex-1 min-h-0 pb-10 pt-12 sm:pt-14">
        <Suspense>{props.children}</Suspense>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
