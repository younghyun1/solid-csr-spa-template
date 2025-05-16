import { Suspense, type Component, onMount } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import TopBar from "./components/TopBar";
import { createEffect } from "solid-js";
import { theme, applyTheme } from "./state/theme";
import { authApi } from "./services/all_api";
import { setAuthenticated, setUser } from "./state/auth";

const App: Component = (props: { children: Element }) => {
  const location = useLocation();

  onMount(async () => {
    try {
      const resp = await authApi.me();
      if (resp?.success && resp.data) {
        setAuthenticated(true);
        setUser(resp.data);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
    }
  });
  createEffect(() => {
    applyTheme(theme());
  });

  return (
    <>
      <TopBar />
      <nav class="bg-white text-gray-900 px-4 transition-colors duration-90 dark:bg-gray-900 dark:text-gray-100">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <A href="/" class="no-underline hover:underline transition-colors duration-90">
              Home
            </A>
          </li>
          <li class="py-2 px-4">
            <A href="/about" class="no-underline hover:underline transition-colors duration-90">
              About
            </A>
          </li>
          <li class="py-2 px-4">
            <A href="/blog" class="no-underline hover:underline transition-colors duration-90">
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
