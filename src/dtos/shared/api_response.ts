// Shared DTOs for standard API responses and metadata

export interface ApiResponse<D = unknown, M = unknown> {
  success: boolean;
  data: D;
  meta: ResponseMeta<M>;
}

export interface ResponseMeta<M = unknown> {
  time_to_process: string;
  timestamp: string; // ISO8601 date string
  metadata: M;
}
