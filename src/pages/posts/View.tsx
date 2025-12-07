import { Show, createSignal, createResource, For, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams, useNavigate } from "@solidjs/router";
import { blogApi, dropdownApi } from "../../services/all_api";
import { isAuthenticated, user } from "../../state/auth";

// VoteState Mapping based on Rust Enum:
// 0: Upvoted
// 1: Downvoted
// 2: DidNotVote
type VoteState = 0 | 1 | 2;

export default function PostViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const postId = () => params.post_id;
  const [commentValue, setCommentValue] = createSignal("");
  const [commentLoading, setCommentLoading] = createSignal(false);
  const [commentError, setCommentError] = createSignal<string | null>(null);
  const [commentSort, setCommentSort] = createSignal<
    "best" | "top" | "new" | "old"
  >("best");

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
  // Load countries (cached by dropdownApi) and build a lookup for flag/name
  const [countries] = createResource(
    async () => await dropdownApi.countryList(),
  );
  const countryMap = createMemo(() => {
    const res: any = countries();
    const list = Array.isArray(res?.data?.countries)
      ? res.data.countries
      : Array.isArray(res?.data)
        ? res.data
        : (res?.countries ?? []);
    const m: Record<number, any> = {};
    for (const c of list) {
      m[Number(c.country_code)] = c;
    }
    return m;
  });
  const formatCountry = (code: any) => {
    if (code === null || code === undefined) return null;
    const c = countryMap()[Number(code)];
    if (!c) return null;
    const flag = c.country_flag ? c.country_flag + " " : "";
    const name = c.country_eng_name ?? c.country_name ?? "";
    return `${flag}${name}`;
  };
  // Store for locally added comments (optimistic replies)
  const [localComments, setLocalComments] = createStore<Record<string, any>>(
    {},
  );

  // Per-comment reply state
  const [replyOpen, setReplyOpen] = createStore<Record<string, boolean>>({});
  const [replyText, setReplyText] = createStore<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = createStore<Record<string, boolean>>(
    {},
  );
  const [replyError, setReplyError] = createStore<
    Record<string, string | null>
  >({});

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await blogApi.deletePost(postId());
      navigate("/blog");
    } catch (e) {
      alert("Failed to delete post: " + e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await blogApi.deleteComment(postId(), commentId);
      refetch();
    } catch (e) {
      alert("Failed to delete comment: " + e);
    }
  };

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
      // Success! The optimistic update is already showing.
      // refetch(); // <-- REMOVED for smoother UX
    } catch (error) {
      console.error("Vote failed:", error);
      // Roll back optimistic update instead of refetching entire post
      const rollback = {
        total_upvotes: currentUpvotes,
        total_downvotes: currentDownvotes,
        vote_state: currentState as VoteState,
      };
      if (type === "post") {
        setOptimisticVotes("post", rollback);
      } else if (ids.commentId) {
        setOptimisticVotes("comments", ids.commentId, rollback);
      }
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

  // Reply handlers
  const toggleReply = (commentId: string) => {
    const current = !!replyOpen[commentId];
    setReplyOpen(commentId, !current);
    if (!current) {
      setReplyText(commentId, "");
      setReplyError(commentId, null);
    }
  };
  const handleSubmitReply = async (parentCommentId: string) => {
    const content = (replyText[parentCommentId] ?? "").trim();
    if (!content) return;
    setReplyLoading(parentCommentId, true);
    setReplyError(parentCommentId, null);
    try {
      const res = await blogApi.submitComment(
        {
          is_guest: !isAuthenticated(),
          guest_id: null,
          guest_password: null,
          parent_comment_id: parentCommentId,
          comment_content: content,
        },
        postId(),
      );
      // Optimistically add the new reply locally so it appears immediately
      if (res && (res as any).data) {
        const newComment = (res as any).data;
        setLocalComments(newComment.comment_id, newComment);
      }
      setReplyText(parentCommentId, "");
      setReplyOpen(parentCommentId, false);
      // No immediate refetch; the local comment will reconcile on future refetch
    } catch (err: any) {
      setReplyError(parentCommentId, err?.message ?? "Failed to submit reply");
    } finally {
      setReplyLoading(parentCommentId, false);
    }
  };

  function buildCommentTree(flatComments: any[]): any[] {
    const commentsById: Record<string, any> = {};
    const roots: any[] = [];

    // Merge locally added comments (optimistic replies) without changing existing order
    const flat = [...flatComments];
    for (const id in localComments) {
      if (!flat.find((c) => c.comment_id === id)) {
        flat.push(localComments[id]);
      }
    }

    for (const c of flat) {
      commentsById[c.comment_id] = { ...c, children: [] };
    }
    for (const c of flat) {
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

  // Helpers for base-data sorting (ignore optimistic changes to keep order stable)
  function getBaseCommentState(c: any) {
    return {
      up: c.total_upvotes,
      down: c.total_downvotes,
      createdAt: new Date(c.comment_created_at).getTime(),
    };
  }
  function compareComments(a: any, b: any) {
    const sort = commentSort();
    const A = getBaseCommentState(a);
    const B = getBaseCommentState(b);
    switch (sort) {
      case "best": {
        const sa = A.up - A.down;
        const sb = B.up - B.down;
        if (sb !== sa) return sb - sa;
        return B.createdAt - A.createdAt; // tie-break by newer first
      }
      case "top": {
        if (B.up !== A.up) return B.up - A.up;
        return B.createdAt - A.createdAt;
      }
      case "new":
        return B.createdAt - A.createdAt;
      case "old":
        return A.createdAt - B.createdAt;
      default:
        return 0;
    }
  }
  function sortCommentsTree(nodes: any[]): any[] {
    const copy = nodes.map((n) => ({
      ...n,
      children:
        n.children && n.children.length > 0 ? sortCommentsTree(n.children) : [],
    }));
    copy.sort(compareComments);
    return copy;
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
              class={`mt-2 pl-3 md:pl-4 border-l border-gray-200 dark:border-gray-700`}
              style={{ "margin-left": `${depth * 16}px` }}
            >
              <div class="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Show when={(comment as any).user_profile_picture_url}>
                  <img
                    src={(comment as any).user_profile_picture_url}
                    alt={(comment as any).user_name}
                    class="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                </Show>
                <span class="font-bold">
                  {(comment as any).user_name ?? "Guest"}
                </span>
                <Show when={formatCountry((comment as any).user_country)}>
                  <span class="ml-2 text-[0.75rem] text-gray-500 dark:text-gray-400">
                    ({formatCountry((comment as any).user_country)})
                  </span>
                </Show>
                <span class="ml-3 text-xs">
                  {new Date(comment.comment_created_at).toLocaleString()}
                </span>
              </div>
              <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {comment.comment_content}
              </div>
              <div class="flex items-center gap-2 mt-2 mb-1">
                <button
                  class={`text-lg px-1 ${voteState() === 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"}`}
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

                <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {upvotes() - downvotes()}
                </span>

                <button
                  class={`text-lg px-1 ${voteState() === 1 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-500 hover:text-rose-600 dark:hover:text-rose-400"}`}
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
              <div class="mt-1 flex gap-3">
                <button
                  class="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => toggleReply(comment.comment_id)}
                >
                  Reply
                </button>
                <Show
                  when={
                    user()?.user_info?.user_id &&
                    (comment as any).user_id === user()?.user_info?.user_id
                  }
                >
                  <button
                    class="text-xs text-red-600 hover:underline dark:text-red-400"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                  >
                    Delete
                  </button>
                </Show>
              </div>
              <Show when={replyOpen[comment.comment_id]}>
                <div class="mt-2">
                  <textarea
                    class="w-full min-h-[80px] border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    value={replyText[comment.comment_id] ?? ""}
                    onInput={(e) =>
                      setReplyText(comment.comment_id, e.currentTarget.value)
                    }
                    placeholder="Write a reply..."
                  />
                  <Show when={replyError[comment.comment_id]}>
                    <div class="text-sm text-red-600">
                      {replyError[comment.comment_id]}
                    </div>
                  </Show>
                  <div class="mt-2 flex items-center gap-2">
                    <button
                      class="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-60"
                      disabled={
                        replyLoading[comment.comment_id] ||
                        !(replyText[comment.comment_id] ?? "").trim()
                      }
                      onClick={() => handleSubmitReply(comment.comment_id)}
                    >
                      {replyLoading[comment.comment_id]
                        ? "Posting..."
                        : "Submit Reply"}
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                      onClick={() => {
                        setReplyOpen(comment.comment_id, false);
                        setReplyText(comment.comment_id, "");
                        setReplyError(comment.comment_id, null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Show>
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
    <main class="w-full max-w-5xl mx-auto py-8 px-4 flex flex-row gap-8">
      <div class="flex-1">
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
            const sortedComments = createMemo(() =>
              sortCommentsTree(buildCommentTree(data().comments || [])),
            );

            return (
              <>
                <div class="mb-4 flex flex-row items-start gap-4">
                  <div class="flex flex-col items-center pr-4 select-none border-r border-gray-300 dark:border-gray-700 mr-2">
                    <button
                      class={`text-2xl transition ${postVoteState() === 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"}`}
                      onClick={() =>
                        handleVote("post", true, {
                          postId: data().post.post_id,
                        })
                      }
                      aria-label="Upvote"
                    >
                      ▲
                    </button>

                    <span class="text-sm font-semibold text-center my-1 text-gray-800 dark:text-gray-100">
                      {postUpvotes() - postDownvotes()}
                    </span>

                    <button
                      class={`text-2xl transition ${postVoteState() === 1 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-500 hover:text-rose-600 dark:hover:text-rose-400"}`}
                      onClick={() =>
                        handleVote("post", false, {
                          postId: data().post.post_id,
                        })
                      }
                      aria-label="Downvote"
                    >
                      ▼
                    </button>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                      <h1 class="text-3xl font-bold">
                        {data().post.post_title}
                      </h1>
                      <Show
                        when={
                          user()?.user_info?.user_id &&
                          (data().post as any).user_id ===
                            user()?.user_info?.user_id
                        }
                      >
                        <button
                          class="text-sm text-red-600 border border-red-600 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition whitespace-nowrap ml-4"
                          onClick={handleDeletePost}
                        >
                          Delete Post
                        </button>
                      </Show>
                    </div>
                    <div class="flex items-center text-sm text-gray-400 mb-2">
                      <Show
                        when={data().user_badge_info?.user_profile_picture_url}
                      >
                        <img
                          src={data().user_badge_info.user_profile_picture_url}
                          alt={data().user_badge_info.user_name}
                          class="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700 mr-2"
                        />
                      </Show>
                      <span class="text-gray-700 dark:text-gray-300">
                        {data().user_badge_info?.user_name ?? "Unknown"}
                      </span>
                      <Show
                        when={formatCountry((data().post as any).user_country)}
                      >
                        <span class="ml-2">
                          ({formatCountry((data().post as any).user_country)})
                        </span>
                      </Show>
                      <span class="ml-3">
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
                  <div class="mb-3 flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Comments</h2>
                    <label class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <span>Sort by</span>
                      <select
                        class="px-2 py-1 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        value={commentSort()}
                        onChange={(e) =>
                          setCommentSort(
                            e.currentTarget.value as
                              | "best"
                              | "top"
                              | "new"
                              | "old",
                          )
                        }
                      >
                        <option value="best">Best</option>
                        <option value="top">Top</option>
                        <option value="new">New</option>
                        <option value="old">Old</option>
                      </select>
                    </label>
                  </div>
                  {renderComments(sortedComments())}
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
      </div>
    </main>
  );
}
