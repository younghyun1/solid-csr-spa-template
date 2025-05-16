import { apiFetch } from "./api";

// Helper to interpolate path params, e.g. /path/{id}
function interpolate(path: string, params: Record<string, any> = {}) {
  return path.replace(/{([^}]+)}/g, (_, key) =>
    encodeURIComponent(params[key] ?? ""),
  );
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: any;
  params?: Record<string, any>;
};

/**
 * Generic HTTP GET
 */
async function get<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = interpolate(path, options.params);
  const res = await apiFetch(url, { ...options, method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Generic HTTP POST
 */
async function post<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = interpolate(path, options.params);
  const fetchOpts: RequestInit = {
    ...options,
    method: "POST",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  const res = await apiFetch(url, fetchOpts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * API Endpoints Grouped by Domain
 */
export const healthApi = {
  server: () => get("/api/healthcheck/server"),
  state: () => get("/api/healthcheck/state"),
};

export const dropdownApi = {
  languageList: () => get("/api/dropdown/language"),
  language: (language_id: string | number) =>
    get(`/api/dropdown/language/{language_id}`, { params: { language_id } }),
  countryList: () => get("/api/dropdown/country"),
  country: (country_id: string | number) =>
    get("/api/dropdown/country/{country_id}", { params: { country_id } }),
  countrySubdivisions: (country_id: string | number) =>
    get("/api/dropdown/country/{country_id}/subdivision", {
      params: { country_id },
    }),
};

export const geoApi = {
  lookupIp: (ip_address: string) =>
    get("/api/geolocate/{ip_address}", { params: { ip_address } }),
};

import type {
  CheckIfUserExistsRequest,
  LoginRequest,
  ResetPasswordRequest,
  ResetPasswordProcessRequest,
  SignupRequest,
  VerifyUserEmailRequest,
} from "../dtos/requests/auth";
import type {
  EmailValidateResponse,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  ResetPasswordRequestResponse,
  ResetPasswordResponse,
  SignupResponse,
} from "../dtos/responses/auth";
import type { ApiResponse } from "../dtos/shared/api_response";

export const authApi = {
  signup: (body: SignupRequest) =>
    post<ApiResponse<SignupResponse>>("/api/auth/signup", { body }),
  checkIfUserExists: (body: CheckIfUserExistsRequest) =>
    post<ApiResponse<EmailValidateResponse>>("/api/auth/check-if-user-exists", { body }),
  login: (body: LoginRequest) =>
    post<ApiResponse<LoginResponse>>("/api/auth/login", { body }),
  resetPasswordRequest: (body: ResetPasswordRequest) =>
    post<ApiResponse<ResetPasswordRequestResponse>>("/api/auth/reset-password-request", { body }),
  resetPassword: (body: ResetPasswordProcessRequest) =>
    post<ApiResponse<ResetPasswordResponse>>("/api/auth/reset-password", { body }),
  verifyUserEmail: (body: VerifyUserEmailRequest) =>
    post<ApiResponse<EmailValidateResponse>>("/api/auth/verify-user-email", { body }),
  me: () => get<ApiResponse<MeResponse>>("/api/auth/me"),
  logout: () => post<ApiResponse<LogoutResponse>>("/api/auth/logout"),
};

export const userApi = {
  uploadProfilePicture: (body: FormData) =>
    apiFetch("/api/user/upload-profile-picture", {
      method: "POST",
      body, // Do not stringify FormData
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }),
};

import type {
  GetPostsRequest,
  ReadPostRequest,
  SubmitCommentRequest,
  SubmitPostRequest,
  UpvoteCommentRequest,
  UpvotePostRequest,
} from "../dtos/requests/blog";
import type {
  GetPostsResponse,
  ReadPostResponse,
  SubmitPostResponse,
  VoteCommentResponse,
  VotePostResponse,
} from "../dtos/responses/blog";

export const blogApi = {
  getPosts: (query?: GetPostsRequest) =>
    get<ApiResponse<GetPostsResponse>>("/api/blog/posts", {
      params: query,
    }),
  readPost: (post_id: string) =>
    get<ApiResponse<ReadPostResponse>>("/api/blog/posts/{post_id}", { params: { post_id } }),
  submitPost: (body: SubmitPostRequest) =>
    post<ApiResponse<SubmitPostResponse>>("/api/blog/posts", { body }),
};

import type { GetCountryLanguageBundleRequest } from "../dtos/requests/i18n";
import type { GetCountryLanguageBundleResponse } from "../dtos/responses/i18n";

export const i18nApi = {
  getCountryLanguageBundle: (query?: GetCountryLanguageBundleRequest) =>
    get<ApiResponse<GetCountryLanguageBundleResponse>>("/api/i18n/country-language-bundle", { params: query }),
};

import type { SyncI18nCacheResponse } from "../dtos/responses/admin";

export const adminApi = {
  syncCountryLanguageBundle: () =>
    get<ApiResponse<SyncI18nCacheResponse>>("/api/admin/sync-country-language-bundle"),
};

export { get, post, interpolate };

/**
 * Usage Example:
 * import { authApi } from "./all_api";
 * await authApi.login({ user_email, user_password });
 *
 * // For path with params:
 * await dropdownApi.language(5);
 * await blogApi.readPost("abc-123");
 */