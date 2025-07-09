import { Show, createSignal, createResource, For } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";
import { blogApi } from "../../services/all_api";
import { isAuthenticated } from "../../state/auth";

// VoteState Mapping based on Rust Enum:
// 0: Upvoted
// 1: Downvoted
// 2: DidNotVote
type VoteState = 0 | 1 | 2;

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

  // Store for optimistic vote states (Post + Comments)
  const [optimisticVotes, setOptimisticVotes] = createStore<{
    post?: {
      total_upvotes: number;
      total_downvotes: number;
      vote_state: VoteState;
    };
    comments: Record<
      string,
      {
        total_upvotes: number;
        total_downvotes: number;
        vote_state: VoteState;
      }
    >;
  }>({ comments: {} });

  const handleVote = async (
    type: "post" | "comment",
    isUpvote: boolean,
    ids: { postId: string; commentId?: string },
  ) => {
    const originalPostState = postResource()?.post;
    const originalCommentState =
      type === "comment" && ids.commentId
        ? postResource()?.comments.find((c) => c.comment_id === ids.commentId)
        : undefined;

    if (type === "post" && !originalPostState) return;
    if (type === "comment" && !originalCommentState) return;

    // Determine current state from optimistic store or initial data
    const currentState =
      type === "post"
        ? (optimisticVotes.post?.vote_state ?? postResource()?.vote_state)
        : (optimisticVotes.comments[ids.commentId!]?.vote_state ??
          originalCommentState?.vote_state);

    const currentUpvotes =
      (type === "post"
        ? (optimisticVotes.post?.total_upvotes ??
          originalPostState?.total_upvotes)
        : (optimisticVotes.comments[ids.commentId!]?.total_upvotes ??
          originalCommentState?.total_upvotes)) || 0;
    const currentDownvotes =
      (type === "post"
        ? (optimisticVotes.post?.total_downvotes ??
          originalPostState?.total_downvotes)
        : (optimisticVotes.comments[ids.commentId!]?.total_downvotes ??
          originalCommentState?.total_downvotes)) || 0;

    const isRescinding =
      (isUpvote && currentState === 0) || (!isUpvote && currentState === 1);

    // --- Optimistic Update ---
    let newVoteState: VoteState = isUpvote ? 0 : 1;
    let newUpvotes = currentUpvotes;
    let newDownvotes = currentDownvotes;

    if (isRescinding) {
      newVoteState = 2; // DidNotVote
      if (isUpvote) newUpvotes--;
      else newDownvotes--;
    } else {
      if (currentState === 0) newUpvotes--; // changing from upvote
      if (currentState === 1) newDownvotes--; // changing from downvote
      if (isUpvote) newUpvotes++;
      else newDownvotes++;
    }

    const optimisticUpdate = {
      total_upvotes: newUpvotes,
      total_downvotes: newDownvotes,
      vote_state: newVoteState,
    };
    if (type === "post") {
      setOptimisticVotes("post", optimisticUpdate);
    } else {
      setOptimisticVotes("comments", ids.commentId!, optimisticUpdate);
    }

    // --- API Call ---
    try {
      if (isRescinding) {
        if (type === "post") await blogApi.rescindPostVote(ids.postId);
        else await blogApi.rescindCommentVote(ids.postId, ids.commentId!);
      } else {
        if (type === "post")
          await blogApi.votePost({ is_upvote: isUpvote }, ids.postId);
        else
          await blogApi.voteComment(
            { is_upvote: isUpvote },
            ids.postId,
            ids.commentId!,
          );
      }
      // Success, refetch to sync with server truth
      refetch();
    } catch (error) {
      // On error, revert the optimistic update by refetching
      console.error("Vote failed:", error);
      refetch();
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
        {(comment) => {
          const voteState = () =>
            optimisticVotes.comments[comment.comment_id]?.vote_state ??
            comment.vote_state;
          const upvotes = () =>
            optimisticVotes.comments[comment.comment_id]?.total_upvotes ??
            comment.total_upvotes;
          const downvotes = () =>
            optimisticVotes.comments[comment.comment_id]?.total_downvotes ??
            comment.total_downvotes;

          return (
            <div
              class={`mt-3 p-3 rounded bg-gray-50 dark:bg-gray-800`}
              style={{ "margin-left": `${depth * 24}px` }}
            >
              <div class="mb-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span class="font-bold">{comment.user_name ?? "Guest"}</span>
                <span class="ml-3 text-xs">
                  {new Date(comment.comment_created_at).toLocaleString()}
                </span>
              </div>
              <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {comment.comment_content}
              </div>
              <div class="flex items-center gap-2 mt-2 mb-1">
                <button
                  class={`text-lg px-1 ${voteState() === 0 ? "text-green-500 font-bold" : "text-gray-400 hover:text-green-500"}`}
                  onClick={() =>
                    handleVote("comment", true, {
                      postId: postId(),
                      commentId: comment.comment_id,
                    })
                  }
                  title="Upvote"
                >
                  ▲
                </button>
                <span class="text-sm text-green-700 dark:text-green-400">
                  {upvotes()}
                </span>
                <span class="text-sm text-red-500">
                  {downvotes() > 0 ? `-${downvotes()}` : 0}
                </span>
                <button
                  class={`text-lg px-1 ${voteState() === 1 ? "text-red-500 font-bold" : "text-gray-400 hover:text-red-500"}`}
                  onClick={() =>
                    handleVote("comment", false, {
                      postId: postId(),
                      commentId: comment.comment_id,
                    })
                  }
                  title="Downvote"
                >
                  ▼
                </button>
              </div>
              {comment.children &&
                comment.children.length > 0 &&
                renderComments(comment.children, depth + 1)}
            </div>
          );
        }}
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
        {(data) => {
          const postVoteState = () =>
            optimisticVotes.post?.vote_state ?? data().vote_state;
          const postUpvotes = () =>
            optimisticVotes.post?.total_upvotes ?? data().post.total_upvotes;
          const postDownvotes = () =>
            optimisticVotes.post?.total_downvotes ??
            data().post.total_downvotes;

          return (
            <>
              <div class="mb-4 flex flex-row items-start gap-4">
                <div class="flex flex-col items-center pr-4 select-none border-r border-gray-300 dark:border-gray-700 mr-2">
                  <button
                    class={`text-2xl transition ${postVoteState() === 0 ? "text-green-500 font-bold" : "text-gray-400 hover:text-green-500"}`}
                    onClick={() =>
                      handleVote("post", true, { postId: data().post.post_id })
                    }
                    aria-label="Upvote"
                  >
                    ▲
                  </button>
                  <span class="text-base font-semibold text-center min-w-[2ch] my-1">
                    {postUpvotes()}
                  </span>
                  <span class="text-base font-semibold text-center min-w-[2ch] my-1 text-red-500">
                    {postDownvotes() > 0 ? `-${postDownvotes()}` : 0}
                  </span>
                  <button
                    class={`text-2xl transition ${postVoteState() === 1 ? "text-red-500 font-bold" : "text-gray-400 hover:text-red-500"}`}
                    onClick={() =>
                      handleVote("post", false, { postId: data().post.post_id })
                    }
                    aria-label="Downvote"
                  >
                    ▼
                  </button>
                </div>
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
                <form
                  onSubmit={handleSubmitComment}
                  class="flex flex-col gap-2"
                >
                  <textarea
                    class="w-full min-h-[120px] border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
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
          );
        }}
      </Show>
    </main>
  );
}
