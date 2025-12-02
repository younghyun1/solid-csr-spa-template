import { Show, createSignal, onCleanup, JSX } from "solid-js";
import {
  isAuthenticated,
  user,
  setAuthenticated,
  setUser,
} from "../state/auth";
import { theme, toggleTheme } from "../state/theme";
import { authApi } from "../services/all_api";

const [menuOpen, setMenuOpen] = createSignal(false);

const handleMenuToggle = (e: MouseEvent) => {
  e.preventDefault();
  setMenuOpen((open) => !open);
  // Close on click-outside:
  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".profile-menu, .menu-toggle")) {
      setMenuOpen(false);
      window.removeEventListener("mousedown", handleClickOutside);
    }
  };
  window.addEventListener("mousedown", handleClickOutside);
};

const handleLogout = async () => {
  try {
    await authApi.logout();
  } catch (e) {
    // Ignore error; in either case we void the state.
  }
  setAuthenticated(false);
  setUser(null);
  setMenuOpen(false);
};

const TopBar = () => (
  <header class="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-90">
    <div class="w-full px-3 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between gap-2 py-2 sm:py-3">
        <div class="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
          <a
            href="/"
            class="shrink-0 text-lg sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap"
          >
            Younghyun&apos;s Blog
          </a>

          {/* Nav: scrollable on small screens, inline on md+ */}

          <nav class="ml-2 flex-1 overflow-x-auto md:overflow-visible">
            <ul class="flex items-center text-xs sm:text-sm md:text-base min-w-max md:min-w-0">
              <li class="py-1 px-2 md:px-3">
                <a
                  href="/"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Home
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/about"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  About Me
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/about-blog"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  About Blog
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/blog"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Blog
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/photographs"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Photographs
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/forum"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Forum
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/projects"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Projects and Demos
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/visitor-board"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Visitor Board
                </a>
              </li>

              <li class="py-1 px-2 md:px-3">
                <a
                  href="/geo-ip-db"
                  class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                >
                  Geo-IP Database
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Right: auth / theme */}
        <div class="flex shrink-0 items-center gap-3 sm:gap-4">
          <Show
            when={isAuthenticated()}
            fallback={
              <div class="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  class="text-xs border px-2 py-1 rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center justify-center gap-1 w-[70px] min-w-[70px]"
                  aria-label="Toggle dark/light mode"
                  onClick={toggleTheme}
                >
                  <span class="inline-block transition-colors duration-90">
                    {theme() === "dark" ? "🌙" : "☀️"}
                  </span>

                  <span class="transition-colors duration-90 sr-only">
                    {theme() === "dark" ? "Dark" : "Light"}
                  </span>
                </button>

                <span class="relative">
                  <span class="inline-block w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgb(239,68,68,0.6)] mr-1 sm:mr-2" />
                </span>

                <a
                  href="/login"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors duration-90 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-white whitespace-nowrap"
                >
                  Login
                </a>
              </div>
            }
          >
            <div class="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                class="text-xs border px-2 py-1 rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center justify-center gap-1 w-[70px] min-w-[70px]"
                aria-label="Toggle dark/light mode"
                onClick={toggleTheme}
              >
                <span class="inline-block transition-colors duration-90">
                  {theme() === "dark" ? "🌙" : "☀️"}
                </span>

                <span class="transition-colors duration-90 sr-only">
                  {theme() === "dark" ? "Dark" : "Light"}
                </span>
              </button>

              <span class="relative flex items-center">
                <span class="inline-block w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgb(34,197,94,0.7)] mr-1 sm:mr-2" />
              </span>

              <div class="hidden sm:flex flex-col items-end mr-1 sm:mr-2 select-none">
                <span class="font-medium text-xs sm:text-sm">
                  {user()?.user_info.user_name}
                </span>

                <span class="text-[10px] sm:text-xs text-gray-300">
                  {user()?.user_info.user_email}
                </span>
              </div>

              <div class="relative">
                <button
                  class="menu-toggle profile-picture focus:outline-none"
                  aria-label="Open user menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen() ? "true" : "false"}
                  tabIndex={0}
                  onClick={handleMenuToggle}
                >
                  <img
                    src={
                      user()?.user_profile_picture?.user_profile_picture_link ||
                      "/default-profile.png"
                    }
                    alt="User"
                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md object-cover transition ring-2 ring-transparent hover:ring-blue-500"
                  />
                </button>

                <Show when={menuOpen()}>
                  <div class="profile-menu absolute right-0 mt-2 w-40 sm:w-48 bg-white text-gray-900 rounded shadow-lg py-1 z-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-90">
                    <a
                      href="/edit-profile"
                      class="w-full text-left px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded flex items-center gap-2 text-xs sm:text-sm transition-colors duration-90"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 20h9" />

                        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      Edit Profile
                    </a>

                    <button
                      class="w-full text-left px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded flex items-center gap-2 text-xs sm:text-sm transition-colors duration-90"
                      onClick={handleLogout}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2h-3a2 2 0 01-2-2V7a2 2 0 012-2h3a2 2 0 012 2v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  </header>
);

export default TopBar;
