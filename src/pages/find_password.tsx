import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { authApi } from "../services/all_api";

function FindPasswordPage() {
  const [email, setEmail] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);
  const navigate = useNavigate();

  const handleFindPassword = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authApi.resetPasswordRequest({
        user_email: email(),
      });

      setSuccessMessage(
        "If an account with that email exists, a password reset link has been sent.",
      );
      setEmail(""); // Clear the input on success
    } catch (e: any) {
      let msg = e?.message || "An unexpected error occurred. Please try again.";
      try {
        const json = JSON.parse(msg);
        if (json.message) {
          msg = json.message;
        }
      } catch {
        // ignore
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-90">
      <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl min-w-[350px] flex flex-col items-center transition-colors duration-90">
        <h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-90">
          Find Password
        </h2>
        <form
          onSubmit={handleFindPassword}
          class="w-full flex flex-col items-center"
        >
          <p class="w-full mb-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Enter your email to receive a password reset link.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
            autocomplete="email"
            required
          />

          <Show when={error()}>
            <div class="w-full text-sm text-red-600 dark:text-red-400 mb-3 text-center">
              {error()}
            </div>
          </Show>

          <Show when={successMessage()}>
            <div class="w-full text-sm text-green-600 dark:text-green-400 mb-3 text-center">
              {successMessage()}
            </div>
          </Show>

          <button
            class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-90 font-semibold disabled:opacity-70"
            type="submit"
            disabled={loading() || !!successMessage()}
          >
            {loading() ? "Sending..." : "Send Reset Link"}
          </button>
          <button
            class="w-full py-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-90 font-semibold"
            type="button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default FindPasswordPage;
