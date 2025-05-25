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
  server: async () => await get("/api/healthcheck/server"),
  state: async () => await get("/api/healthcheck/state"),
};

export const dropdownApi = {
  languageList: async () => await get("/api/dropdown/language"),
  language: async (language_id: string | number) =>
    await get(`/api/dropdown/language/{language_id}`, {
      params: { language_id },
    }),
  countryList: async () => await get("/api/dropdown/country"),
  country: async (country_id: string | number) =>
    await get("/api/dropdown/country/{country_id}", { params: { country_id } }),
  countrySubdivisions: async (country_id: string | number) =>
    await get("/api/dropdown/country/{country_id}/subdivision", {
      params: { country_id },
    }),
};

export const geoApi = {
  lookupIp: async (ip_address: string) =>
    await get("/api/geolocate/{ip_address}", { params: { ip_address } }),
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
  signup: async (body: SignupRequest) =>
    await post<ApiResponse<SignupResponse>>("/api/auth/signup", { body }),
  checkIfUserExists: async (body: CheckIfUserExistsRequest) =>
    await post<ApiResponse<EmailValidateResponse>>(
      "/api/auth/check-if-user-exists",
      { body },
    ),
  login: async (body: LoginRequest) =>
    await post<ApiResponse<LoginResponse>>("/api/auth/login", { body }),
  resetPasswordRequest: async (body: ResetPasswordRequest) =>
    await post<ApiResponse<ResetPasswordRequestResponse>>(
      "/api/auth/reset-password-request",
      { body },
    ),
  resetPassword: async (body: ResetPasswordProcessRequest) =>
    await post<ApiResponse<ResetPasswordResponse>>("/api/auth/reset-password", {
      body,
    }),
  verifyUserEmail: async (body: VerifyUserEmailRequest) =>
    await post<ApiResponse<EmailValidateResponse>>(
      "/api/auth/verify-user-email",
      { body },
    ),
  me: async () => await get<ApiResponse<MeResponse>>("/api/auth/me"),
  logout: async () =>
    await post<ApiResponse<LogoutResponse>>("/api/auth/logout"),
};

export const userApi = {
  uploadProfilePicture: async (body: FormData) =>
    await apiFetch("/api/user/upload-profile-picture", {
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
  getPosts: async (query?: GetPostsRequest) =>
    await get<ApiResponse<GetPostsResponse>>("/api/blog/posts", {
      params: query,
    }),
  readPost: async (post_id: string) =>
    await get<ApiResponse<ReadPostResponse>>("/api/blog/posts/{post_id}", {
      params: { post_id },
    }),
  submitPost: async (body: SubmitPostRequest) =>
    await post<ApiResponse<SubmitPostResponse>>("/api/blog/posts", { body }),
  // Add voting and commenting endpoints
  votePost: async (body: UpvotePostRequest) =>
    await post<ApiResponse<VotePostResponse>>("/api/blog/{post_id}/vote", {
      body,
    }),
  voteComment: async (body: UpvoteCommentRequest, post_id: string, comment_id: string) =>
    await post<ApiResponse<VoteCommentResponse>>(
      "/api/blog/{post_id}/{comment_id}/vote",
      { body, params: { post_id, comment_id } },
    ),
  rescindPostVote: async (post_id: string) =>
    await post<ApiResponse<VotePostResponse>>("/api/blog/{post_id}/vote", {
      params: { post_id },
    }),
  rescindCommentVote: async (post_id: string, comment_id: string) =>
    await post<ApiResponse<VoteCommentResponse>>(
      "/api/blog/{post_id}/{comment_id}/vote",
      { params: { post_id, comment_id } },
    ),
  submitComment: async (body: SubmitCommentRequest) =>
    await post<ApiResponse<Comment>>("/api/blog/submit-comment", { body }),
};

import type { GetCountryLanguageBundleRequest } from "../dtos/requests/i18n";
import type { GetCountryLanguageBundleResponse } from "../dtos/responses/i18n";

export const i18nApi = {
  getCountryLanguageBundle: async (query?: GetCountryLanguageBundleRequest) =>
    await get<ApiResponse<GetCountryLanguageBundleResponse>>(
      "/api/i18n/country-language-bundle",
      { params: query },
    ),
};

import type { SyncI18nCacheResponse } from "../dtos/responses/admin";

export const adminApi = {
  syncCountryLanguageBundle: async () =>
    await get<ApiResponse<SyncI18nCacheResponse>>(
      "/api/admin/sync-country-language-bundle",
    ),
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
