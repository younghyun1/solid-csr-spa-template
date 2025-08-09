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
  <header class="bg-white text-gray-900 dark:bg-black dark:text-white px-6 py-3 flex items-center justify-between shadow-md transition-colors duration-90">
    <div class="flex items-center gap-6">
      <a href="/" class="text-2xl font-bold tracking-tight">
        Younghyun&apos;s Blog
      </a>
      <nav>
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <a
              href="/"
              class="no-underline hover:underline transition-colors duration-90"
            >
              Home
            </a>
          </li>
          <li class="py-2 px-4">
            <a
              href="/about"
              class="no-underline hover:underline transition-colors duration-90"
            >
              About
            </a>
          </li>
          <li class="py-2 px-4">
            <a
              href="/blog"
              class="no-underline hover:underline transition-colors duration-90"
            >
              Blog
            </a>
          </li>
          <li class="py-2 px-4">
            <a
              href="/visitor-board"
              class="no-underline hover:underline transition-colors duration-90"
            >
              Visitor Board
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <Show
      when={isAuthenticated()}
      fallback={
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="text-xs border px-2 py-1 rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center gap-1"
            aria-label="Toggle dark/light mode"
            onClick={toggleTheme}
            style={{
              width: "70px",
              "min-width": "70px",
              "justify-content": "center",
            }}
          >
            <span class="inline-block transition-colors duration-90">
              {theme() === "dark" ? "🌙" : "☀️"}
            </span>
            <span class="transition-colors duration-90 sr-only">
              {theme() === "dark" ? "Dark" : "Light"}
            </span>
          </button>
          <span class="relative">
            <span class="inline-block w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgb(239,68,68,0.6)] mr-2" />
          </span>
          <a
            href="/login"
            class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded transition-colors duration-90 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-white"
          >
            Login
          </a>
        </div>
      }
    >
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="text-xs border px-2 py-1 rounded border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-90 flex items-center gap-1"
          aria-label="Toggle dark/light mode"
          onClick={toggleTheme}
          style={{
            width: "70px",
            "min-width": "70px",
            "justify-content": "center",
          }}
        >
          <span class="inline-block transition-colors duration-90">
            {theme() === "dark" ? "🌙" : "☀️"}
          </span>
          <span class="transition-colors duration-90 sr-only">
            {theme() === "dark" ? "Dark" : "Light"}
          </span>
        </button>
        <span class="relative flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgb(34,197,94,0.7)] mr-2" />
        </span>
        <div class="flex flex-col items-end mr-2 select-none">
          <span class="font-medium">{user()?.user_info.user_name}</span>
          <span class="text-xs text-gray-300">
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
              class="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover transition ring-2 ring-transparent hover:ring-blue-500"
            />
          </button>
          <Show when={menuOpen()}>
            <div class="profile-menu absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg py-1 z-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-90">
              <a
                href="/edit-profile"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded flex items-center gap-2 transition-colors duration-90"
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
                class="w-full text-left px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded flex items-center gap-2 transition-colors duration-90"
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
  </header>
);

export default TopBar;
