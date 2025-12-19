import { createSignal } from "solid-js";
import { fetchHealthState, type HealthStateResponse } from "../services/api";

export type HealthState =
  | (HealthStateResponse["data"] & {
      client_latency_ms?: number;
      time_to_process?: string;
      baseline_uptime_ms?: number;
      baseline_timestamp?: string;
    })
  | null;

export const [healthState, setHealthState] = createSignal<HealthState>(null);
export const [clientNow, setClientNow] = createSignal<Date | null>(null);

export const parseUptimeToMs = (uptime: string | undefined): number | null => {
  if (!uptime) return null;
  let total = 0;
  const parts = uptime.split(",").map((p) => p.trim().toLowerCase());
  for (const part of parts) {
    const [numStr, unitRaw] = part.split(/\s+/, 2);
    const value = Number(numStr);
    if (!Number.isFinite(value)) continue;
    const unit = unitRaw ?? "";
    if (unit.startsWith("day")) total += value * 24 * 60 * 60 * 1000;
    else if (unit.startsWith("hour")) total += value * 60 * 60 * 1000;
    else if (unit.startsWith("minute")) total += value * 60 * 1000;
    else if (unit.startsWith("second")) total += value * 1000;
    else if (unit.startsWith("millisecond")) total += value;
  }
  return total || null;
};

export const formatUptimeMs = (ms: number | null): string => {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "–";

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

export const formatIsoAge = (
  iso: string | undefined,
  currentNow: Date | null,
) => {
  if (!iso) return "–";

  const base = new Date(iso);
  const now = currentNow ?? new Date();

  const diffMs = now.getTime() - base.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) return "just now";

  const totalSec = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;

  if (mins <= 0) return `${secs}s ago`;

  return `${mins}m ${secs}s ago`;
};

export async function refreshHealthState() {
  const start = performance.now();
  try {
    const resp = await fetchHealthState();
    const end = performance.now();
    const client_latency_ms = end - start;

    if (resp.success && resp.data) {
      const baseline_uptime_ms = parseUptimeToMs(resp.data.server_uptime);

      setHealthState({
        ...resp.data,
        client_latency_ms,
        time_to_process: resp.meta.time_to_process,
        baseline_uptime_ms: baseline_uptime_ms ?? undefined,
        baseline_timestamp: resp.data.timestamp,
      });
    } else {
      setHealthState(null);
    }
  } catch {
    setHealthState(null);
  }
}
