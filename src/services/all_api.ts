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
  // Handle 204/empty-body responses gracefully for side-effect endpoints (e.g., vote rescinds)
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as unknown as T;
  }
  try {
    return await res.json();
  } catch {
    return undefined as unknown as T;
  }
}

/**
 * Generic HTTP DELETE
 */
async function del<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = interpolate(path, options.params);
  const res = await apiFetch(url, { ...options, method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as unknown as T;
  }
  try {
    return await res.json();
  } catch {
    return undefined as unknown as T;
  }
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
  countryList: (function () {
    let cache: any | null = null;
    return async () => {
      if (cache) return cache;
      cache = await get("/api/dropdown/country");
      return cache;
    };
  })(),
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
  // me: gets user info, but also reads server build info from headers for overlay
  me: async () => {
    const url = interpolate("/api/auth/me", {});
    const res = await apiFetch(url, { method: "GET" });
    if (!res.ok) throw new Error(await res.text());
    // Directly update overlay/serverBuildInfo from headers (apiFetch already handles, but for legacy, ensure here)
    // Optionally, you can parse or extract, but apiFetch should do it.
    return res.json();
  },
  logout: async () =>
    await post<ApiResponse<LogoutResponse>>("/api/auth/logout"),
  uploadProfilePicture: async (body: FormData) =>
    await apiFetch("/api/user/profile-picture", {
      method: "POST",
      body,
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }),
};

export const userApi = {
  uploadProfilePicture: async (body: FormData) =>
    await apiFetch("/api/user/upload-profile-picture", {
      method: "POST",
      body,
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
  SubmitCommentResponse,
  SubmitPostResponse,
  VoteCommentResponse,
  VotePostResponse,
} from "../dtos/responses/blog";

export const geoIpApi = {
  getGeoIpInfo: (ip: string) => get<any>(`/api/geo-ip-info/${ip}`),
};

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
  votePost: async (body: UpvotePostRequest, post_id: string) =>
    await post<ApiResponse<VotePostResponse>>("/api/blog/{post_id}/vote", {
      body,
      params: { post_id },
    }),
  voteComment: async (
    body: UpvoteCommentRequest,
    post_id: string,
    comment_id: string,
  ) =>
    await post<ApiResponse<VoteCommentResponse>>(
      "/api/blog/{post_id}/{comment_id}/vote",
      { body, params: { post_id, comment_id } },
    ),
  rescindPostVote: async (post_id: string) =>
    await del<ApiResponse<VotePostResponse>>("/api/blog/{post_id}/vote", {
      params: { post_id },
    }),
  rescindCommentVote: async (post_id: string, comment_id: string) =>
    await del<ApiResponse<VoteCommentResponse>>(
      "/api/blog/{post_id}/{comment_id}/vote",
      { params: { post_id, comment_id } },
    ),
  submitComment: async (body: SubmitCommentRequest, post_id: string) =>
    await post<ApiResponse<SubmitCommentResponse>>(
      "/api/blog/{post_id}/comment",
      { body, params: { post_id } },
    ),
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

export const visitorBoardApi = {
  getVisitorBoard: async () => await get("/api/visitor-board"),
};

export { get, post, del, interpolate };

/**
 * Usage Example:
 * import { authApi } from "./all_api";
 * await authApi.login({ user_email, user_password });
 *
 * // For path with params:
 * await dropdownApi.language(5);
 * await blogApi.readPost("abc-123");
 */
