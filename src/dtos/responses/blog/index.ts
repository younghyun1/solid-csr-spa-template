export interface GetPostsResponse {
  posts: PostInfo[];
  available_pages: number;
}

export interface ReadPostResponse {
  post: Post;
  comments: Comment[];
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
}

export interface VotePostResponse {
  upvote_count: number;
  downvote_count: number;
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
  // add more as needed matching backend
}

export interface Post {
  post_id: string;
  post_title: string;
  post_content: string;
  post_slug: string;
  post_created_at: string;
  post_updated_at: string;
  post_is_published: boolean;
  post_tags: string[];
  // add more as needed matching backend
}

export interface Comment {
  comment_id: string;
  post_id: string;
  parent_comment_id: string | null;
  author_id: string | null;
  guest_id: string | null;
  comment_content: string;
  created_at: string;
  updated_at: string;
  children?: Comment[];
  // Add more fields as your backend Comment struct requires
}
