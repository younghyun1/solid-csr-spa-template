export interface CheckIfUserExistsRequest {
  user_email: string;
}

export interface LoginRequest {
  user_email: string;
  user_password: string;
}

export interface ResetPasswordRequest {
  user_email: string;
}

export interface ResetPasswordProcessRequest {
  password_reset_token: string; // UUID
  new_password: string;
}

export interface SignupRequest {
  user_name: string;
  user_email: string;
  user_password: string;
  user_country: number;
  user_language: number;
  user_subdivision: number | null;
}

export interface VerifyUserEmailRequest {
  email_verification_token: string; // UUID
}
