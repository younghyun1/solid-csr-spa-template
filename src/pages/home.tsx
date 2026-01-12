import { createResource, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import { blogApi, photographyApi, healthApi } from "../services/all_api";

export default function Home() {
  const [posts] = createResource(() =>
    blogApi.getPosts({ page: 1, posts_per_page: 3 }),
  );
  const [photos] = createResource(() => photographyApi.getPhotographs(1, 4));

  // Helper to extract photo items safely
  const getPhotoItems = () => {
    const res = photos();
    if (!res) return [];

    const payload = (res as any).data || res;

    if (payload?.data?.items) {
      return payload.data.items;
    }

    return payload?.items || [];
  };

  return (
    <div class="w-full min-h-screen flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Navigation / Compact Hero */}
      <header class="border-b-2 border-zinc-900 dark:border-zinc-200 bg-white dark:bg-zinc-900">
        <div class="max-w-7xl mx-auto px-6 py-8 md:py-10">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Identity Block */}
            <div class="space-y-2 max-w-2xl">
              <h1 class="text-4xl md:text-3xl font-black tracking-tighter uppercase font-mono">
                Younghyun Chi //{" "}
                <span class="font-sans tracking-normal normal-case">
                  지영현
                </span>{" "}
                // 池營賢 // 池营贤
              </h1>
              <p class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed border-l-4 border-amber-500 pl-4">
                Experienced backend, infrastructure, and data engineer.
                <span class="block text-sm mt-2 font-mono text-zinc-500">
                  Passionate about creating secure and high-performance servers
                  and infrastructure. I also enjoy photography and have dabbled
                  in journalism, translation/interpretation, soldiering, manual
                  labor, activism, and various misadventures.
                  <br></br>
                  <br></br>I hold craftsmanship and good governance to be
                  sacred.
                </span>
              </p>
            </div>

            {/* Quick Links / Command Center */}
            <div class="flex flex-col gap-3 font-mono text-sm shrink-0">
              <div class="text-zinc-400 uppercase text-xs tracking-widest mb-1">
                Connect
              </div>
              <a
                href="mailto:younghyun1@gmail.com"
                class="group flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span class="opacity-50 group-hover:opacity-100">[</span> EMAIL{" "}
                <span class="opacity-50 group-hover:opacity-100">]</span>
              </a>
              <a
                href="https://github.com/younghyun1"
                target="_blank"
                rel="noreferrer"
                class="group flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span class="opacity-50 group-hover:opacity-100">[</span> GITHUB{" "}
                <span class="opacity-50 group-hover:opacity-100">]</span>
              </a>
              <a
                href="https://www.linkedin.com/in/young-hyun-chi-553431376/"
                target="_blank"
                rel="noreferrer"
                class="group flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span class="opacity-50 group-hover:opacity-100">[</span>{" "}
                LINKEDIN{" "}
                <span class="opacity-50 group-hover:opacity-100">]</span>
              </a>
            </div>
          </div>

          {/* Action Bar */}
          <div class="mt-8 flex gap-4">
            <A
              href="/blog"
              class="px-6 py-3 bg-transparent border-2 border-zinc-900 dark:border-zinc-200 text-zinc-900 dark:text-zinc-100 font-bold font-mono hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Read Blog
            </A>
            <A
              href="/photographs"
              class="px-6 py-3 bg-transparent border-2 border-zinc-900 dark:border-zinc-200 text-zinc-900 dark:text-zinc-100 font-bold font-mono hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              View My Photography
            </A>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div class="flex-grow max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Latest Blog Posts - Spans 7 columns */}
        <section class="lg:col-span-7 flex flex-col h-full">
          <div class="flex items-end justify-between mb-6 pb-2 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
            <h2 class="text-2xl font-black uppercase font-mono tracking-tight flex items-center gap-2">
              <span class="w-3 h-3 bg-amber-500"></span> Latest Posts
            </h2>
            <A
              href="/blog"
              class="font-mono text-sm underline decoration-zinc-400 hover:decoration-amber-500 hover:text-amber-600 transition-colors"
            >
              view blog posts &rarr;
            </A>
          </div>

          <div class="flex-grow space-y-4">
            <Suspense
              fallback={
                <div class="space-y-4">
                  {[1, 2, 3].map(() => (
                    <div class="h-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse border border-zinc-300 dark:border-zinc-700"></div>
                  ))}
                </div>
              }
            >
              <Show
                when={posts()}
                fallback={
                  <div class="p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-sm">
                    No data found.
                  </div>
                }
              >
                <For each={posts()?.data?.posts}>
                  {(post) => (
                    <article class="group relative bg-white dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200">
                      <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-center text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                          <span>
                            {new Date(post.post_created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                            )}
                          </span>
                          <span class="opacity-0 group-hover:opacity-100 text-amber-600 dark:text-amber-400 transition-opacity">
                            &lt;READ&gt;
                          </span>
                        </div>
                        <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          <A href={`/blog/${post.post_id}`}>
                            <span class="absolute inset-0" />
                            {post.post_title}
                          </A>
                        </h3>
                        <p class="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm mt-2 font-mono opacity-80">
                          {/* Decorative snippet to look like code/preview */}
                          &gt; Click to decrypt contents...
                        </p>
                      </div>
                    </article>
                  )}
                </For>
              </Show>
            </Suspense>
          </div>
        </section>

        {/* Recent Photographs - Spans 5 columns */}
        <section class="lg:col-span-5 flex flex-col h-full">
          <div class="flex items-end justify-between mb-6 pb-2 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700">
            <h2 class="text-2xl font-black uppercase font-mono tracking-tight flex items-center gap-2">
              <span class="w-3 h-3 bg-purple-500"></span> Photography
            </h2>
            <A
              href="/photographs"
              class="font-mono text-sm underline decoration-zinc-400 hover:decoration-purple-500 hover:text-purple-600 transition-colors"
            >
              view gallery &rarr;
            </A>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Suspense
              fallback={
                <>
                  {[1, 2, 3, 4].map(() => (
                    <div class="aspect-square bg-zinc-200 dark:bg-zinc-800 animate-pulse border border-zinc-300 dark:border-zinc-700"></div>
                  ))}
                </>
              }
            >
              <Show
                when={getPhotoItems().length > 0}
                fallback={
                  <div class="col-span-2 p-6 border border-zinc-200 dark:border-zinc-800 font-mono text-sm text-center">
                    /img/null
                  </div>
                }
              >
                <For each={getPhotoItems()}>
                  {(photo) => (
                    <A
                      href="/photographs"
                      class="group relative block aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                    >
                      <img
                        src={
                          photo.photograph_thumbnail_link ||
                          photo.photograph_link
                        }
                        alt={photo.photograph_comments || "Photograph"}
                        class="w-full h-full object-cover transition-all duration-300 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Crosshair overlay effect */}
                      <div class="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 transition-colors pointer-events-none z-10"></div>
                      <div class="absolute top-2 right-2 text-[10px] font-mono bg-black text-white px-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        IMG_{photo.photograph_id}
                      </div>
                    </A>
                  )}
                </For>
              </Show>
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
