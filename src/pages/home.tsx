import { createSignal } from 'solid-js';

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <section class="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100 p-8 min-h-screen transition-colors duration-150">
      <h1 class="text-2xl font-bold">Home</h1>
      <p class="mt-4">This is the home page.</p>

      <div class="flex items-center space-x-2">
        <button
          type="button"
          class="border rounded-lg px-2 border-gray-900 dark:border-gray-200 transition-colors duration-150"
          onClick={() => setCount(count() - 1)}
        >
          -
        </button>

        <output class="p-10px">Count: {count()}</output>

        <button
          type="button"
          class="border rounded-lg px-2 border-gray-900 dark:border-gray-200 transition-colors duration-150"
          onClick={() => setCount(count() + 1)}
        >
          +
        </button>
      </div>
    </section>
  );
}
