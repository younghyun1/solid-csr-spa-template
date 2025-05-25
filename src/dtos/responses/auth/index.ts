export interface EmailValidateResponse {
  user_email: string;
  verified_at: string; // ISO8601 date string
}

export interface LoginResponse {
  message: string;
  user_id: string;
}

export interface LogoutResponse {
  message: string;
}

export interface UserInfo {
  user_id: string;
  user_name: string;
  user_email: string;
  user_is_email_verified: boolean;
  user_country: number;
  user_language: number;
  user_subdivision: number | null;
}

export interface UserProfilePicture {
  user_profile_picture_id: string;
  user_id: string;
  user_profile_picture_created_at: string; // ISO8601 date string
  user_profile_picture_updated_at: string; // ISO8601 date string
  user_profile_picture_image_type: number;
  user_profile_picture_is_on_cloud: boolean;
  user_profile_picture_link: string | null;
}

export interface MeResponse {
  user_info: UserInfo | null;
  user_profile_picture: UserProfilePicture | null;
  build_time: string;
  axum_version: string;
}

export interface ResetPasswordRequestResponse {
  user_email: string;
  verify_by: string; // ISO8601 date string
}

export interface ResetPasswordResponse {
  user_id: string;
  user_name: string;
  user_email: string;
  user_updated_at: string; // ISO8601 date string
}

export interface SignupResponse {
  user_name: string;
  user_email: string;
  verify_by: string; // ISO8601 date string
}
