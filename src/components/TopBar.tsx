import { Show, createSignal, onCleanup } from "solid-js";
import { isAuthenticated, user } from "../state/auth";
import { logout } from "../services/auth/auth";

const [menuOpen, setMenuOpen] = createSignal(false);

const handleProfileClick = (e: MouseEvent) => {
  e.preventDefault();
  setMenuOpen((open) => !open);
  // Close on click-outside:
  const handleClickOutside = (event: MouseEvent) => {
    if (
      !(event.target as HTMLElement).closest(".profile-menu, .profile-picture")
    ) {
      setMenuOpen(false);
      window.removeEventListener("mousedown", handleClickOutside);
    }
  };
  window.addEventListener("mousedown", handleClickOutside);
};

const handleLogout = async () => {
  await logout();
  setMenuOpen(false);
};

const TopBar = () => (
  <header class="bg-black text-white px-6 py-3 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-3">
      <span class="text-2xl font-bold tracking-tight">
        Younghyun&apos;s Blog
      </span>
    </div>
    <Show
      when={isAuthenticated()}
      fallback={
        <div class="flex items-center gap-3">
          <span class="relative">
            <span class="inline-block w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgb(239,68,68,0.6)] mr-2" />
          </span>
          <a
            href="/login"
            class="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Login
          </a>
        </div>
      }
    >
      <div class="flex items-center gap-4">
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
            class="profile-picture focus:outline-none"
            aria-label="User menu"
            tabIndex={0}
            onClick={handleProfileClick}
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
            <div class="profile-menu absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg py-1 z-50">
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
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
