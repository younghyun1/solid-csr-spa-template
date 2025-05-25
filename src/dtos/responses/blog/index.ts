export interface GetPostsResponse {
  posts: PostInfo[];
  available_pages: number;
}

export interface ReadPostResponse {
  post: Post;
  comments: Comment[];
  vote_state: 0 | 1 | 2;
}

export interface SubmitPostResponse {
  post_id: string; // UUID
  post_title: string;
  post_slug: string;
  post_created_at: string; // ISO8601 date string
  post_updated_at: string; // ISO8601 date string
  post_is_published: boolean;
}

export interface VoteCommentResponse {
  upvote_count: number;
  downvote_count: number;
  is_upvote: boolean;
}

export interface VotePostResponse {
  upvote_count: number;
  downvote_count: number;
  is_upvote: boolean;
}

// Blog domain shared types
export interface PostInfo {
  post_id: string;
  post_title: string;
  post_slug: string;
  post_created_at: string;
  post_updated_at: string;
  post_is_published: boolean;
  post_tags: string[];
  vote_state: 0 | 1 | 2;
  // add more as needed matching backend
}

export interface Post {
  post_id: string;
  user_id: string;
  post_title: string;
  post_slug: string;
  post_content: string;
  post_summary: string | null;
  post_created_at: string;
  post_updated_at: string;
  post_published_at: string | null;
  post_is_published: boolean;
  post_view_count: number;
  post_share_count: number;
  post_metadata: any;
  total_upvotes: number;
  total_downvotes: number;

  // add more as needed matching backend
}

export interface SubmitCommentResponse {
  comment_id: string;
  post_id: string;
  user_id: string;
  comment_content: string;
  comment_created_at: string;
  comment_updated_at: string | null;
  parent_comment_id: string | null;
  total_upvotes: number;
  total_downvotes: number;
  vote_state: 0 | 1 | 2;
}
