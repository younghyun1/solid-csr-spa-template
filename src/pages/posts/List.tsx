import { A, useNavigate } from "@solidjs/router";
import { createResource, Show, For } from "solid-js"; // Import For
import { blogApi } from "../../services/all_api";

export default function PostsList() {
  const [posts] = createResource(() => blogApi.getPosts());
  const navigate = useNavigate();

  return (
    <main class="max-w-5xl mx-auto py-8 px-4">
      {/* 1. LAYOUT FIX: Align title and button in a row */}
      <div class="flex flex-row items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Blog Posts</h1>
        <button
          class="px-4 py-2 text-sm rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => navigate("/blog/new")}
        >
          + New Post
        </button>
      </div>

      <hr class="border-gray-200 dark:border-gray-700 mb-6" />

      <Show when={posts.loading}>
        <div class="p-4 text-center text-gray-500">Loading posts...</div>
      </Show>

      <Show when={posts.error}>
        <div class="text-red-600 p-4 border border-red-200 rounded bg-red-50">
          Error loading posts: {String(posts.error)}
        </div>
      </Show>

      <ul class="flex flex-col gap-4">
        {" "}
        {/* added gap for spacing between items */}
        {/* 2. SOLID FIX: Use <For> instead of .map for better performance */}
        <Show
          when={posts()}
          fallback={
            <div class="text-center py-8 text-gray-500">No posts found.</div>
          }
        >
          <For each={posts()?.data.posts}>
            {(post) => (
              <li class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md">
                <div class="flex">
                  {/* Content Column */}
                  <div class="flex-1 px-4 py-3">
                    <div class="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Show when={(post as any).user_profile_picture_url}>
                        <img
                          src={(post as any).user_profile_picture_url}
                          alt={(post as any).user_name}
                          class="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </Show>
                      <span class="font-medium text-gray-900 dark:text-gray-300">
                        {(post as any).user_name ?? "Unknown"}
                      </span>
                      <span class="text-gray-400">•</span>
                      <span>
                        {new Date(post.post_created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <A
                      href={`/blog/${post.post_id}`}
                      class="block text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 decoration-2 hover:underline underline-offset-2"
                    >
                      {post.post_title}
                    </A>
                  </div>
                </div>
              </li>
            )}
          </For>
        </Show>
      </ul>
    </main>
  );
}
