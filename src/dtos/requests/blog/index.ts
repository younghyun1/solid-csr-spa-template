export interface GetPostsRequest {
  page?: number;
  posts_per_page?: number;
}

export interface ReadPostRequest {
  post_id: string; // UUID
}

export interface SubmitCommentRequest {
  is_guest: boolean;
  guest_id: string | null;
  guest_password: string | null;
  parent_comment_id: string | null;
  comment_content: string;
}

export interface SubmitPostRequest {
  post_id?: string | null;
  post_title: string;
  post_content: string;
  post_tags: string[];
  post_is_published: boolean;
}

export interface UpvoteCommentRequest {
  is_upvote: boolean;
}

export interface UpvotePostRequest {
  is_upvote: boolean;
}
