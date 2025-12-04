export type HostStatsRaw = {
  cpu_usage: number; // percent, 0–100
  mem_total: number; // bytes
  mem_free: number; // bytes
};

export type HostStatPoint = {
  ts: number;
  cpu: number;
  memT: number;
  memF: number;
};
