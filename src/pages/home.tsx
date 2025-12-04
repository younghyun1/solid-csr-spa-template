export default function Home() {
  return (
    <div class="flex items-center justify-center w-full h-full p-10">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold">Younghyun's Blog</h1>
        <p class="text-xl opacity-70">Welcome to my personal space.</p>
        <p>
          <a
            href="/backend-stats"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View System Health & Stats &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
