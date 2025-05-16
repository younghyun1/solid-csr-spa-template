import { Show, createSignal, createResource, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { blogApi } from "../../services/all_api";
import MarkdownEditor from "../../components/MarkdownEditor";
import { isAuthenticated } from "../../state/auth";

export default function PostViewPage() {
  const params = useParams();
  const postId = () => params.post_id;
  const [commentValue, setCommentValue] = createSignal("");
  const [commentLoading, setCommentLoading] = createSignal(false);
  const [commentError, setCommentError] = createSignal<string | null>(null);

  const [postResource, { refetch }] = createResource(postId, async (pid) => {
    if (!pid) return null;
    const res = await blogApi.readPost(pid);
    return res?.data;
  });

  const handleVotePost = async (is_upvote: boolean) => {
    if (!postId()) return;
    try {
      await blogApi.upvotePost({
        post_id: postId(),
        is_upvote,
      });
      refetch();
    } catch (_) {
      // Optionally handle error
    }
  };

  const handleVoteComment = async (comment_id: string, is_upvote: boolean) => {
    try {
      await blogApi.upvoteComment({
        comment_id,
        is_upvote,
      });
      refetch();
    } catch (_) {
      // Optionally handle error
    }
  };

  const handleSubmitComment = async (e: Event) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    try {
      await blogApi.submitComment({
        is_guest: !isAuthenticated(),
        guest_id: null,
        guest_password: null,
        post_id: postId(),
        parent_comment_id: null,
        comment_content: commentValue(),
      });
      setCommentValue("");
      refetch();
    } catch (err: any) {
      setCommentError(err?.message ?? "Failed to submit comment");
    } finally {
      setCommentLoading(false);
    }
  };

  function renderComments(comments: any[], depth = 0) {
    return (
      <For each={comments}>
        {(comment) => (
          <div class={`ml-${depth * 5} mt-3 p-3 rounded bg-gray-50 dark:bg-gray-800`}>
            <div class="mb-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span class="font-bold">{comment.author_id ?? "Guest"}</span>
              <span class="ml-3 text-xs">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <div
              class="prose prose-sm dark:prose-invert"
              innerHTML={comment.comment_content}
            />
            <div class="flex items-center gap-2 mt-2 mb-1">
              <button
                class="px-1 text-sm text-green-500"
                onClick={() => handleVoteComment(comment.comment_id, true)}
                title="Upvote"
              >▲</button>
              <button
                class="px-1 text-sm text-red-500"
                onClick={() => handleVoteComment(comment.comment_id, false)}
                title="Downvote"
              >▼</button>
              <span class="text-xs text-gray-400">
                {/* Optionally render upvote/downvote counts if available */}
              </span>
            </div>
            {/* Render children recursively if present */}
            {comment.children && comment.children.length > 0 && renderComments(comment.children, depth + 1)}
          </div>
        )}
      </For>
    );
  }

  return (
    <main class="max-w-2xl mx-auto py-8">
      <Show when={postResource.loading}>
        <div>Loading post...</div>
      </Show>
      <Show when={postResource.error}>
        <div class="text-red-600">Failed to load post: {String(postResource.error)}</div>
      </Show>
      <Show when={postResource()}>
        {(data) => (
          <>
            <div class="mb-4">
              <h1 class="text-3xl font-bold mb-2">{data().post.post_title}</h1>
              <div class="flex items-center text-sm text-gray-400 mb-2">
                <span>
                  {new Date(data().post.post_created_at).toLocaleString()}
                </span>
              </div>
              <div class="prose dark:prose-invert max-w-none mb-3"
                innerHTML={data().post.post_content}
              />
              <div class="flex items-center gap-2 mb-1">
                <button
                  class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded hover:bg-green-200 transition"
                  onClick={() => handleVotePost(true)}
                  title="Upvote Post"
                >▲ Upvote</button>
                <button
                  class="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded hover:bg-red-200 transition"
                  onClick={() => handleVotePost(false)}
                  title="Downvote Post"
                >▼ Downvote</button>
              </div>
            </div>
            <hr class="my-5" />
            <section>
              <h2 class="text-xl font-semibold mb-3">Comments</h2>
              {renderComments(data().comments || [])}
            </section>
            <hr class="my-5" />
            <section>
              <h3 class="text-lg font-semibold mb-2">Add Comment</h3>
              <form onSubmit={handleSubmitComment} class="flex flex-col gap-2">
                <MarkdownEditor
                  value={commentValue()}
                  onChange={setCommentValue}
                  textareaClass="w-full min-h-[120px] border border-gray-300 dark:border-gray-700 rounded"
                />
                <Show when={commentError()}>
                  <span class="text-red-600">{commentError()}</span>
                </Show>
                <button
                  class="self-end bg-blue-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-60 transition"
                  type="submit"
                  disabled={commentLoading() || !commentValue().trim()}
                >
                  {commentLoading() ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </section>
          </>
        )}
      </Show>
    </main>
  );
}
