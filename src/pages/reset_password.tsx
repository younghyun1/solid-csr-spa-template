import { createSignal, Show, onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { authApi } from "../services/all_api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal(false);
  const navigate = useNavigate();

  onMount(() => {
    if (!searchParams.token) {
      setError("Missing password reset token. Please check your email link.");
    }
  });

  const handleResetPassword = async (e: Event) => {
    e.preventDefault();
    const val = searchParams.token;
    const token = Array.isArray(val) ? val[0] : val;

    if (!token) {
      setError("Missing password reset token.");
      return;
    }

    if (password().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password() !== confirmPassword()) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.resetPassword({
        password_reset_token: token,
        new_password: password(),
      });
      setSuccess(true);
      // Optional: Automatically redirect after a few seconds
      setTimeout(() => navigate("/login"), 3000);
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
          Reset Password
        </h2>

        <Show when={success()}>
          <div class="w-full text-center">
            <div class="w-full text-sm text-green-600 dark:text-green-400 mb-6">
              Your password has been successfully reset.
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Redirecting to login...
            </p>
            <button
              class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors duration-90"
              onClick={() => navigate("/login")}
            >
              Go to Login Now
            </button>
          </div>
        </Show>

        <Show when={!success()}>
          <form
            onSubmit={handleResetPassword}
            class="w-full flex flex-col items-center"
          >
            <p class="w-full mb-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              Enter your new password below.
            </p>

            <input
              type="password"
              placeholder="New Password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
              required
              minlength={8}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
              required
            />

            <Show when={error()}>
              <div class="w-full text-sm text-red-600 dark:text-red-400 mb-3 text-center">
                {error()}
              </div>
            </Show>

            <button
              class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-90 font-semibold disabled:opacity-70"
              type="submit"
              disabled={loading() || !searchParams.token}
            >
              {loading() ? "Resetting..." : "Reset Password"}
            </button>

            <button
              class="w-full py-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-90 font-semibold"
              type="button"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </form>
        </Show>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
