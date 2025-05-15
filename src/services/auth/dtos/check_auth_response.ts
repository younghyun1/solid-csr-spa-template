export interface MeResponse {
  user_info: UserInfo;
  user_profile_picture: UserProfilePicture | null;
}

export interface UserInfo {
  user_id: string; // UUID
  user_name: string;
  user_email: string;
  user_is_email_verified: boolean;
  user_country: number;
  user_language: number;
  user_subdivision: number | null;
}

export interface UserProfilePicture {
  user_profile_picture_id: string; // UUID
  user_id: string; // UUID
  user_profile_picture_created_at: string; // ISO8601 date string
  user_profile_picture_updated_at: string; // ISO8601 date string
  user_profile_picture_image_type: number;
  user_profile_picture_is_on_cloud: boolean;
  user_profile_picture_link: string | null;
}