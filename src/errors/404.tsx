export default function NotFound() {
  return (
    <section class="relative overflow-hidden text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-950 p-8 transition-colors duration-90 min-h-screen flex items-center justify-center">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-br from-violet-300/35 via-fuchsia-300/15 to-transparent blur-3xl dark:from-violet-500/20 dark:via-fuchsia-500/10" />
        <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-300/30 via-sky-300/20 to-transparent blur-3xl dark:from-indigo-500/20 dark:via-sky-500/15" />
      </div>

      <div class="relative w-full max-w-2xl rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-950/60 backdrop-blur p-8 sm:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 ring-1 ring-violet-200/60 dark:ring-violet-500/20">
            <span class="text-xl" aria-hidden="true">
              🚧
            </span>
          </div>

          <div class="min-w-0">
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Under Construction
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              I'm working on it!
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-gray-200/70 dark:border-gray-800/70 p-4">
            <p class="text-sm font-semibold">Status</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              In progress
            </p>
          </div>
          <div class="rounded-xl border border-gray-200/70 dark:border-gray-800/70 p-4">
            <p class="text-sm font-semibold">ETA</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Soon™</p>
          </div>
          <div class="rounded-xl border border-gray-200/70 dark:border-gray-800/70 p-4">
            <p class="text-sm font-semibold">Meanwhile</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Drink water.
            </p>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            href="/"
            class="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
          >
            Go to homepage
          </a>
          <button
            type="button"
            onClick={() => history.back()}
            class="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </section>
  );
}
