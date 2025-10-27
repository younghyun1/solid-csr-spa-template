import { createSignal, Show } from "solid-js";
import { authApi } from "../services/all_api";
import { setAuthenticated, setUser } from "../state/auth";
import { useNavigate } from "@solidjs/router";

function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const saved = sessionStorage.getItem("post_login_redirect");
      const target = next || saved || "/";
      sessionStorage.setItem("post_login_redirect", target);

      const res = await authApi.login({
        user_email: email(),
        user_password: password(),
      });
      if (res.success) {
        // Redirect is handled globally in apiFetch using sessionStorage.post_login_redirect
        return;
      } else {
        setAuthenticated(false);
        setUser(null);
        setError(res?.data?.message ?? "Login failed");
      }
    } catch (e: any) {
      setAuthenticated(false);
      setUser(null);
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-90">
      <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl min-w-[350px] flex flex-col items-center transition-colors duration-90">
        <h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-90">
          Login
        </h2>
        <form onSubmit={handleLogin} class="w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
            autocomplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full mb-6 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
            autocomplete="current-password"
            required
          />
          <div class="flex justify-end w-full mb-6">
            <button
              class="bg-transparent border-none text-blue-600 dark:text-blue-400 cursor-pointer text-sm p-0 hover:underline"
              tabIndex={-1}
              type="button"
              onClick={() => navigate("/find-password")}
            >
              Find Password
            </button>
          </div>
          <Show when={error()}>
            <div class="w-full text-sm text-red-600 dark:text-red-400 mb-3 text-center">
              {error()}
            </div>
          </Show>
          <button
            class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-90 font-semibold disabled:opacity-70"
            type="submit"
            disabled={loading()}
          >
            {loading() ? "Logging in..." : "Login"}
          </button>
          <button
            class="w-full py-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-90 font-semibold"
            type="button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
