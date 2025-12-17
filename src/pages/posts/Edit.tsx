import { createSignal, createEffect, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { blogApi } from "../../services/all_api";
import MarkdownEditor from "../../components/MarkdownEditor";

export default function EditPostPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = createSignal("");
  const [tags, setTags] = createSignal("");
  const [body, setBody] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(async () => {
    const postId = params.post_id;
    if (!postId) {
      setError("No post ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const res = await blogApi.readPost(postId);
      if (res.success && res.data) {
        const post = res.data.post;
        setTitle(post.post_title);
        setBody(post.post_content);
        // Note: Tags might not be returned by readPost depending on backend implementation
        // If they are available in the future, we would set them here.
        // setTags(post.tags?.join(", ") ?? "");
      } else {
        setError("Failed to load post.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load post.");
    } finally {
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const postTags = tags()
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await blogApi.updatePost(
        {
          post_title: title(),
          post_content: body(),
          post_tags: postTags,
          post_is_published: true,
        },
        params.post_id,
      );
      if (res.success) {
        navigate(`/blog/${res.data.post_id}`, { replace: true });
      } else {
        setError("Failed to update post.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main class="w-full max-w-5xl mx-auto py-8 px-4 flex flex-row gap-8">
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-4">Edit Post</h2>

        <Show when={isLoading()}>
          <div class="text-gray-500">Loading post...</div>
        </Show>

        <Show when={!isLoading()}>
          <form onSubmit={handleSubmit} class="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              required
              class="px-3 py-2 rounded border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags()}
              onInput={(e) => setTags(e.currentTarget.value)}
              class="px-3 py-2 rounded border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <div class="w-full h-[28rem] min-w-0">
              <label class="font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                Content (Markdown)
              </label>
              <div class="h-full overflow-hidden">
                <MarkdownEditor
                  value={body()}
                  onChange={setBody}
                  options={{ minHeight: "100%" }}
                />
              </div>
            </div>
            {error() && <div class="text-red-600">{error()}</div>}
            <div class="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting()}
                class="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-70"
              >
                {isSubmitting() ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/blog/${params.post_id}`)}
                class="px-6 py-2 rounded font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </Show>
      </div>
    </main>
  );
}
