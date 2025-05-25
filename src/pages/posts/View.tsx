import { Show, createSignal, createResource, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { blogApi } from "../../services/all_api";
// import MarkdownEditor from "../../components/MarkdownEditor";
import { isAuthenticated } from "../../state/auth";

export default function PostViewPage() {
  const params = useParams();
  const postId = () => params.post_id;
  const [commentValue, setCommentValue] = createSignal("");
  const [commentLoading, setCommentLoading] = createSignal(false);
  const [commentError, setCommentError] = createSignal<string | null>(null);
  const [replyTo, setReplyTo] = createSignal<string | null>(null);
  const [replyValue, setReplyValue] = createSignal("");
  const [replyLoadingId, setReplyLoadingId] = createSignal<string | null>(null);
  const [replyError, setReplyError] = createSignal<string | null>(null);

  const [postResource, { refetch }] = createResource(postId, async (pid) => {
    if (!pid) return null;
    const res = await blogApi.readPost(pid);
    return res?.data;
  });

  const handleVotePost = async (is_upvote: boolean) => {
    if (!postId()) return;
    try {
      await blogApi.votePost({
        is_upvote,
        // For the new API, post_id is now in the path, not the body.
        // If your API expects post_id only as a path param, remove it from body.
      });
      refetch();
    } catch (_) {
      // Optionally handle error
    }
  };

  const handleVoteComment = async (comment_id: string, is_upvote: boolean) => {
    try {
      await blogApi.voteComment({ is_upvote }, postId(), comment_id);
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
      await blogApi.submitComment(
        {
          is_guest: !isAuthenticated(),
          guest_id: null,
          guest_password: null,
          parent_comment_id: null,
          comment_content: commentValue(),
        },
        postId(),
      );
      setCommentValue("");
      refetch();
    } catch (err: any) {
      setCommentError(err?.message ?? "Failed to submit comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Convert flat comment array to hierarchy for parent-child rendering
  function buildCommentTree(flatComments: any[]): any[] {
    const commentsById: Record<string, any> = {};
    const roots: any[] = [];

    for (const c of flatComments) {
      commentsById[c.comment_id] = { ...c, children: [] };
    }
    for (const c of flatComments) {
      if (c.parent_comment_id && commentsById[c.parent_comment_id]) {
        commentsById[c.parent_comment_id].children.push(
          commentsById[c.comment_id],
        );
      } else {
        roots.push(commentsById[c.comment_id]);
      }
    }
    return roots;
  }

  function renderComments(comments: any[], depth = 0) {
    return (
      <For each={comments}>
        {(comment) => (
          <div
            class={`mt-3 p-3 rounded bg-gray-50 dark:bg-gray-800`}
            style={{ "margin-left": `${depth * 24}px` }}
          >
            <div class="mb-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span class="font-bold">{comment.user_id ?? "Guest"}</span>
              <span class="ml-3 text-xs">
                {new Date(comment.comment_created_at).toLocaleString()}
              </span>
            </div>
            <div
              class="prose prose-sm dark:prose-invert"
              innerHTML={comment.comment_content}
            />
            <div class="flex items-center gap-2 mt-2 mb-1">
              {/* Horizontal voting bar: Up arrow | Up count | Down count | Down arrow */}
              <button
                class={`text-lg px-1 ${comment.vote_state === 1 ? "text-green-500 font-bold" : "text-gray-400 hover:text-green-500"}`}
                onClick={() => handleVoteComment(comment.comment_id, true)}
                title="Upvote"
              >
                ▲
              </button>
              <span class="text-sm text-green-700 dark:text-green-400">
                {comment.total_upvotes ?? 0}
              </span>
              <span class="text-sm text-red-500">
                {comment.total_downvotes > 0
                  ? "-" + comment.total_downvotes
                  : 0}
              </span>
              <button
                class={`text-lg px-1 ${comment.vote_state === 2 ? "text-red-500 font-bold" : "text-gray-400 hover:text-red-500"}`}
                onClick={() => handleVoteComment(comment.comment_id, false)}
                title="Downvote"
              >
                ▼
              </button>
              {/* <button class="ml-3 text-xs text-blue-500 hover:underline" onClick={() => setReplyTo(comment.comment_id)}>
              Reply
            </button> */}
            </div>
            {/* Reply editor: Uncomment to enable replying to individual comments */}
            {/* {replyTo() === comment.comment_id && (
            <form
              class="flex flex-col gap-2 mt-1"
              onSubmit={async (e) => {
                e.preventDefault();
                setReplyLoadingId(comment.comment_id);
                setReplyError(null);
                try {
                  await blogApi.submitComment({
                    is_guest: !isAuthenticated(),
                    guest_id: null,
                    guest_password: null,
                    post_id: postId(),
                    parent_comment_id: comment.comment_id,
                    comment_content: replyValue(),
                  });
                  setReplyTo(null);
                  setReplyValue("");
                  refetch();
                } catch (err: any) {
                  setReplyError(err?.message ?? "Failed to submit reply");
                } finally {
                  setReplyLoadingId(null);
                }
              }}
            >
              <textarea
                class="w-full min-h-[60px] border border-gray-300 dark:border-gray-700 rounded p-2"
                value={replyValue()}
                onInput={(e) => setReplyValue(e.currentTarget.value)}
                placeholder="Write a reply..."
              />
              <Show when={replyError()}>
                <span class="text-red-600">{replyError()}</span>
              </Show>
              <button
                class="self-end bg-blue-600 text-white px-3 py-1 rounded font-semibold disabled:opacity-60 transition"
                type="submit"
                disabled={replyLoadingId() === comment.comment_id || !replyValue().trim()}
              >
                {replyLoadingId() === comment.comment_id ? "Posting..." : "Reply"}
              </button>
            </form>
          )} */}
            {comment.children &&
              comment.children.length > 0 &&
              renderComments(comment.children, depth + 1)}
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
        <div class="text-red-600">
          Failed to load post: {String(postResource.error)}
        </div>
      </Show>
      <Show when={postResource()}>
        {(data) => (
          <>
            <div class="mb-4 flex flex-row items-start gap-4">
              {/* Vote vertical bar */}
              <div class="flex flex-col items-center pr-2 select-none">
                <button
                  class={`text-2xl transition px-1 ${data().vote_state === 0 ? "text-green-500 font-bold" : "text-gray-400 hover:text-green-500"}`}
                  aria-label="Upvote"
                  onClick={() => handleVotePost(true)}
                  title="Upvote Post"
                >
                  ▲
                </button>
                <span class="text-base font-semibold text-center min-w-[2ch]">
                  {typeof data().post?.total_upvotes === "number"
                    ? data().post.total_upvotes
                    : 0}
                </span>
                <span class="text-base font-semibold text-center min-w-[2ch] text-red-500">
                  {typeof data().post?.total_downvotes === "number"
                    ? data().post.total_downvotes > 0
                      ? "-" + data().post.total_downvotes
                      : 0
                    : 0}
                </span>
                <button
                  class={`text-2xl transition px-1 ${data().vote_state === 1 ? "text-red-500 font-bold" : "text-gray-400 hover:text-red-500"}`}
                  aria-label="Downvote"
                  onClick={() => handleVotePost(false)}
                  title="Downvote Post"
                >
                  ▼
                </button>
              </div>

              {/* Post content */}
              <div class="flex-1">
                <h1 class="text-3xl font-bold mb-2">
                  {data().post.post_title}
                </h1>
                <div class="flex items-center text-sm text-gray-400 mb-2">
                  <span>
                    {new Date(data().post.post_created_at).toLocaleString()}
                  </span>
                </div>
                <div
                  class="prose dark:prose-invert max-w-none mb-3"
                  innerHTML={data().post.post_content}
                />
              </div>
            </div>
            <hr class="my-5" />
            <section>
              <h2 class="text-xl font-semibold mb-3">Comments</h2>
              {renderComments(buildCommentTree(data().comments || []))}
            </section>
            <hr class="my-5" />
            <section>
              <h3 class="text-lg font-semibold mb-2">Add Comment</h3>
              <form onSubmit={handleSubmitComment} class="flex flex-col gap-2">
                <textarea
                  class="w-full min-h-[120px] border border-gray-300 dark:border-gray-700 rounded p-2"
                  value={commentValue()}
                  onInput={(e) => setCommentValue(e.currentTarget.value)}
                  placeholder="Write a comment (plaintext)..."
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
