import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { blogApi } from "../../services/all_api";
import MarkdownEditor from "../../components/MarkdownEditor";

export default function NewPostPage() {
  const [title, setTitle] = createSignal("");
  const [tags, setTags] = createSignal("");
  const [body, setBody] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const postTags = tags()
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await blogApi.submitPost({
        post_title: title(),
        post_content: body(),
        post_tags: postTags,
        post_is_published: true,
      });
      if (res.success) {
        navigate(`/blog/${res.data.post_id}`, { replace: true });
      } else {
        setError("Failed to publish post.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main class="w-full max-w-5xl mx-auto py-8 px-4 flex flex-row gap-8">
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-4">New Post</h2>
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
          <div class="w-full min-w-[700px] h-96">
            <label class="font-medium text-gray-700 dark:text-gray-200 mb-2 block">
              Content (Markdown)
            </label>
            <MarkdownEditor value={body()} onChange={setBody} />
          </div>
          {error() && <div class="text-red-600">{error()}</div>}
          <button
            type="submit"
            disabled={isSubmitting()}
            class="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-70"
          >
            {isSubmitting() ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
      {/* Optionally, place a sidebar here if you want Reddit-style right column */}
    </main>
  );
}
