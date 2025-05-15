import { createSignal } from "solid-js";

function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-90">
      <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl min-w-[350px] flex flex-col items-center transition-colors duration-90">
        <h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-90">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email()}
          onInput={e => setEmail(e.currentTarget.value)}
          class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
        />
        <input
          type="password"
          placeholder="Password"
          value={password()}
          onInput={e => setPassword(e.currentTarget.value)}
          class="w-full mb-6 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
        />
        <div class="flex justify-between w-full mb-6">
          <button
            class="bg-transparent border-none text-blue-600 dark:text-blue-400 cursor-pointer text-sm p-0 hover:underline"
            tabIndex={-1}
            type="button"
          >
            Find Account
          </button>
          <button
            class="bg-transparent border-none text-blue-600 dark:text-blue-400 cursor-pointer text-sm p-0 hover:underline"
            tabIndex={-1}
            type="button"
          >
            Find Password
          </button>
        </div>
        <button
          class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-90 font-semibold"
          type="submit"
        >
          Login
        </button>
        <button
          class="w-full py-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-90 font-semibold"
          type="button"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default LoginPage;