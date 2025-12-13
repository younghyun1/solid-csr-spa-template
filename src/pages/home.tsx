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
    <div class="w-full min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white py-24 px-6 overflow-hidden">
        <div class="relative max-w-5xl mx-auto flex flex-col items-center text-center z-10">
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white pb-2 leading-tight">
            Young Hyun Chi
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8 leading-relaxed">
            Backend engineer, Korean-English interpreter, photographer, and
            former soldier passionate about high-performance web technologies,
            open-source software, infrastructure, and safe and correct systems.
          </p>

          {/* Contact Info */}
          <div class="flex flex-wrap justify-center gap-6 mb-10 text-gray-300">
            <a
              href="mailto:younghyun1@gmail.com"
              class="flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>younghyun1@gmail.com</span>
            </a>
            <a
              href="https://github.com/younghyun1"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg
                fill="currentColor"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/young-hyun-chi-553431376/"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg
                fill="currentColor"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <A
              href="/blog"
              class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <span>Read Blog</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </A>
            <A
              href="/photographs"
              class="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg font-bold text-lg transition-all border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
            >
              <span>View Gallery</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </A>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div class="flex-grow max-w-7xl mx-auto w-full px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Latest Blog Posts */}
        <section class="flex flex-col h-full">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 class="text-3xl font-bold flex items-center gap-3">
              <span class="text-blue-600 dark:text-blue-400">#</span> Latest
              Posts
            </h2>
            <A
              href="/blog"
              class="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              View All <span aria-hidden="true">&rarr;</span>
            </A>
          </div>

          <div class="flex-grow space-y-6">
            <Suspense
              fallback={
                <div class="space-y-4 animate-pulse">
                  <div class="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div class="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div class="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
              }
            >
              <Show
                when={posts()}
                fallback={
                  <p class="text-gray-500 dark:text-gray-400 italic">
                    No posts found.
                  </p>
                }
              >
                <For each={posts()?.data?.posts}>
                  {(post) => (
                    <article class="group relative bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:-translate-y-1">
                      <div class="flex flex-col gap-1">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {new Date(post.post_created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <A href={`/blog/${post.post_id}`}>
                            <span class="absolute inset-0" />
                            {post.post_title}
                          </A>
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mt-2">
                          {/* Simple content preview extraction if available or just generic text */}
                          Click to read more about this topic...
                        </p>
                      </div>
                    </article>
                  )}
                </For>
              </Show>
            </Suspense>
          </div>
        </section>

        {/* Recent Photographs */}
        <section class="flex flex-col h-full">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 class="text-3xl font-bold flex items-center gap-3">
              <span class="text-purple-600 dark:text-purple-400">#</span> Recent
              Shots
            </h2>
            <A
              href="/photographs"
              class="text-sm font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              View Gallery <span aria-hidden="true">&rarr;</span>
            </A>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <Suspense
              fallback={
                <>
                  <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                </>
              }
            >
              <Show
                when={getPhotoItems().length > 0}
                fallback={
                  <p class="col-span-2 text-gray-500 dark:text-gray-400 italic">
                    No photos found.
                  </p>
                }
              >
                <For each={getPhotoItems()}>
                  {(photo) => (
                    <A
                      href="/photographs"
                      class="group relative block aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm transition-all hover:shadow-lg hover:ring-2 hover:ring-purple-500 dark:hover:ring-purple-400"
                    >
                      <img
                        src={
                          photo.photograph_thumbnail_link ||
                          photo.photograph_link
                        }
                        alt={photo.photograph_comments || "Photograph"}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
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
