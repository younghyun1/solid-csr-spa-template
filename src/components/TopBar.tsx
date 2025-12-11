import { Show, createSignal, For } from "solid-js";
import {
  isAuthenticated,
  user,
  setAuthenticated,
  setUser,
} from "../state/auth";
import { theme, toggleTheme } from "../state/theme";
import { authApi } from "../services/all_api";

const [menuOpen, setMenuOpen] = createSignal(false);
const [sidebarOpen, setSidebarOpen] = createSignal(false);

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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/about-blog", label: "About Blog" },
  { href: "/blog", label: "Blog" },
  { href: "/photographs", label: "Photographs" },
  { href: "/forum", label: "Forum" },
  { href: "/projects", label: "Projects and Demos" },
  { href: "/visitor-board", label: "Visitor Board" },
  { href: "/geo-ip-db", label: "Geo-IP Database" },
  { href: "/backend-stats", label: "Backend Stats" },
];

const TopBar = () => (
  <>
    <header class="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-90">
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="flex items-center justify-between gap-2 py-2 sm:py-3">
          <div class="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
            {/* Hamburger Button (Mobile Only) */}
            <button
              class="md:hidden p-1 text-gray-700 dark:text-gray-200 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo: Emoji on mobile, Text on desktop */}
            <a
              href="/"
              class="shrink-0 text-lg sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap"
            >
              <span class="block md:hidden text-2xl">Home</span>
              <span class="hidden md:block">Younghyun&apos;s Blog</span>
            </a>

            {/* Nav: Hidden on mobile, inline on md+ */}
            <nav class="hidden md:block flex-1 overflow-x-auto md:overflow-visible ml-2">
              <ul class="flex items-center text-xs sm:text-sm md:text-base min-w-max md:min-w-0">
                <For each={NAV_LINKS}>
                  {(link) => (
                    <li class="py-1 px-2 md:px-3">
                      <a
                        href={link.href}
                        class="whitespace-nowrap no-underline hover:underline transition-colors duration-90"
                      >
                        {link.label}
                      </a>
                    </li>
                  )}
                </For>
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
                    class="text-xs border rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center justify-center gap-1 w-8 h-8 p-0"
                    aria-label="Toggle dark/light mode"
                    onClick={toggleTheme}
                  >
                    <span class="inline-block transition-colors duration-90">
                      {theme() === "dark" ? "🌙" : "☀️"}
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
                  class="text-xs border rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center justify-center gap-1 w-8 h-8 p-0"
                  aria-label="Toggle dark/light mode"
                  onClick={toggleTheme}
                >
                  <span class="inline-block transition-colors duration-90">
                    {theme() === "dark" ? "🌙" : "☀️"}
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
                        user()?.user_profile_picture
                          ?.user_profile_picture_link || "/default-profile.png"
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

    {/* Mobile Sidebar (Drawer) */}
    <Show when={sidebarOpen()}>
      <div class="fixed inset-0 z-50 flex md:hidden">
        {/* Backdrop */}
        <div
          class="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside class="relative z-50 w-64 bg-white dark:bg-gray-900 h-full shadow-xl flex flex-col transition-transform">
          <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span class="font-bold text-lg text-gray-900 dark:text-white">
              Menu
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1 px-2">
              <For each={NAV_LINKS}>
                {(link) => (
                  <li>
                    <a
                      href={link.href}
                      class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </aside>
      </div>
    </Show>
  </>
);

export default TopBar;
