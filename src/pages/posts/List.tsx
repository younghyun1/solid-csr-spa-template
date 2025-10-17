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
            <li class="mb-4">
              <A
                href={`/blog/${post.post_id}`}
                class="text-blue-600 hover:underline text-lg font-medium"
              >
                {post.post_title}
              </A>
              <div class="text-xs text-gray-400">
                {new Date(post.post_created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </Show>
      </ul>
    </main>
  );
}
