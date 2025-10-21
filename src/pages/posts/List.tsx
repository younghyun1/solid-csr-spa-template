import { A, useNavigate } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { blogApi } from "../../services/all_api";

export default function PostsList() {
  const [posts] = createResource(() => blogApi.getPosts());
  const navigate = useNavigate();

  return (
    <main class="max-w-2xl mx-auto py-8">
      <div class="flex flex-col items-start gap-3 mb-6">
        <h1 class="text-2xl font-bold">Blog Posts</h1>
        <button
          class="px-4 py-2 text-sm rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => navigate("/blog/new")}
        >
          + New Post
        </button>
      </div>
      <Show when={posts.loading}>
        <div>Loading posts...</div>
      </Show>
      <Show when={posts.error}>
        <div class="text-red-600">
          Error loading posts: {String(posts.error)}
        </div>
      </Show>
      <ul>
        <Show when={posts()} fallback={<div>No posts found.</div>}>
          {posts()?.data.posts.map((post) => (
            <li class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
              <div class="flex">
                <div class="flex flex-col items-center gap-1 px-2 py-3 w-12 bg-gray-50 dark:bg-gray-800 text-gray-500">
                  <span class="text-lg leading-none">▲</span>
                  <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {((post as any)?.total_upvotes ?? 0) -
                      ((post as any)?.total_downvotes ?? 0)}
                  </span>
                  <span class="text-lg leading-none">▼</span>
                </div>
                <div class="flex-1 px-4 py-3">
                  <div class="text-xs text-gray-500 mb-1">
                    <span>
                      Posted by {(post as any).user_name ?? "Unknown"}
                    </span>
                    <span class="mx-1">•</span>
                    <span>
                      {new Date(post.post_created_at).toLocaleString()}
                    </span>
                  </div>

                  <A
                    href={`/blog/${post.post_id}`}
                    class="block text-lg font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    {post.post_title}
                  </A>
                </div>
              </div>
            </li>
          ))}
        </Show>
      </ul>
    </main>
  );
}
