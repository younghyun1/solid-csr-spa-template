import { onMount, onCleanup, createSignal, Show } from "solid-js";
import { theme } from "../state/theme";
import {
  healthState,
  clientNow,
  parseUptimeToMs,
  formatUptimeMs,
  refreshHealthState,
} from "../state/health";
import CpuStatsCard from "./CpuStatsCard";
import RamStatsCard from "./RamStatsCard";
import type { HostStatsRaw, HostStatPoint } from "../dtos/shared/host_stats";

// parse exactly 20 bytes: [f32][u64][u64] (all big-endian)
function parseHostStats(buf: ArrayBuffer): HostStatsRaw | null {
  if (buf.byteLength !== 20) return null;
  const dv = new DataView(buf);
  const cpu_usage = dv.getFloat32(0, false);
  const mem_total = Number(dv.getBigUint64(4, false));
  const mem_free = Number(dv.getBigUint64(12, false));
  return { cpu_usage, mem_total, mem_free };
}

const HISTORY_LIMIT = 60;

export default function HostStatsDashboard(props: {
  wsUrl?: string;
  apiKey?: string;
}) {
  const [history, setHistory] = createSignal<HostStatPoint[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const isDark = () => theme() === "dark";

  // simple palette helper
  const C = () => ({
    bg: isDark() ? "#1f2937" : "#fff",
    border: isDark() ? "#374151" : "#d1d5db",
    font: isDark() ? "#e2e8f0" : "#334155",
    cardBg: isDark() ? "#111827" : "#f3f4f6",
  });

  let ws: WebSocket;
  onMount(() => {
    const url =
      props.wsUrl ||
      (import.meta.env.VITE_API_URL || "")
        .replace(/^http/, "ws")
        .replace(/\/$/, "") + "/ws/host-stats";

    try {
      ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";
    } catch (e: any) {
      setError("WS open failed: " + e);
      return;
    }

    ws.onopen = () => {
      setError(null);
      if (props.apiKey) {
        ws.send(JSON.stringify({ apiKey: props.apiKey }));
      }
    };

    ws.onmessage = (evt) => {
      const raw = parseHostStats(evt.data as ArrayBuffer);
      if (!raw) {
        setError("Malformed host‐stats packet");
        return;
      }
      setHistory((old) => {
        const next: HostStatPoint = {
          ts: Date.now(),
          cpu: raw.cpu_usage,
          memT: raw.mem_total,
          memF: raw.mem_free,
        };
        const arr =
          old.length < HISTORY_LIMIT ? [...old, next] : [...old.slice(1), next];
        return arr;
      });
    };

    ws.onerror = () => setError("WebSocket error");
    ws.onclose = () => setError((e) => e || "WebSocket closed");

    onCleanup(() => {
      ws.close();
    });
  });

  return (
    <div class={`${isDark() ? "text-gray-100" : "text-gray-700"}`}>
      <Show when={error()}>
        <div
          class="p-2 mb-2 rounded text-xs font-mono max-w-xs"
          style={{
            background: isDark() ? "#7f1d1d" : "#fee2e2",
            color: isDark() ? "#fee2e2" : "#b91c1c",
          }}
        >
          {error()}
        </div>
      </Show>

      <div class="w-full max-w-7xl mx-auto space-y-6">
        {/* Backend Health Stats Panel */}
        <div
          class="p-6 rounded-xl shadow-lg border-2"
          style={{
            background: isDark()
              ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            "border-color": isDark() ? "#3b82f6" : "#2563eb",
          }}
        >
          <div
            class="flex items-center gap-3 mb-4 pb-2 border-b border-opacity-20"
            style={{ "border-color": C().border }}
          >
            <div class="flex items-center justify-between w-full">
              <h2
                class="text-lg font-bold tracking-wide"
                style={{ color: C().font }}
              >
                BACKEND HEALTH
              </h2>
              <button
                class="px-3 py-1 text-xs font-semibold rounded hover:opacity-80 transition-opacity"
                style={{
                  background: C().cardBg,
                  color: C().font,
                  border: `1px solid ${C().border}`,
                }}
                onClick={() => refreshHealthState()}
              >
                Refresh
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const hs = healthState();
              if (!hs)
                return <div class="col-span-full">Loading health stats...</div>;

              const baselineMs =
                hs.baseline_uptime_ms ?? parseUptimeToMs(hs.server_uptime);
              const baselineTs = hs.baseline_timestamp ?? hs.timestamp;
              let liveUptime: string = hs.server_uptime;
              if (baselineMs != null && baselineTs) {
                const base = new Date(baselineTs);
                const now = clientNow() ?? new Date();
                const extra = now.getTime() - base.getTime();
                const totalMs =
                  baselineMs +
                  (Number.isFinite(extra) ? Math.max(extra, 0) : 0);
                liveUptime = formatUptimeMs(totalMs);
              }

              return (
                <>
                  <div
                    class="p-4 rounded-lg bg-opacity-50"
                    style={{ background: C().cardBg }}
                  >
                    <div class="text-xs opacity-70 mb-1">Uptime</div>
                    <div class="text-xl font-mono font-bold">{liveUptime}</div>
                  </div>
                  <div
                    class="p-4 rounded-lg bg-opacity-50"
                    style={{ background: C().cardBg }}
                  >
                    <div class="text-xs opacity-70 mb-1">Responses Handled</div>
                    <div class="text-xl font-mono font-bold">
                      {hs.responses_handled.toLocaleString()}
                    </div>
                  </div>
                  <div
                    class="p-4 rounded-lg bg-opacity-50"
                    style={{ background: C().cardBg }}
                  >
                    <div class="text-xs opacity-70 mb-1">Active Sessions</div>
                    <div class="text-xl font-mono font-bold">
                      {hs.users_logged_in}
                    </div>
                  </div>
                  <div
                    class="p-4 rounded-lg bg-opacity-50"
                    style={{ background: C().cardBg }}
                  >
                    <div class="text-xs opacity-70 mb-1">DB Latency</div>
                    <div class="text-xl font-mono font-bold">
                      {hs.db_latency}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Live Host Stats Panel */}
        <div
          class="p-6 rounded-xl shadow-lg border-2"
          style={{
            background: isDark()
              ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            "border-color": isDark() ? "#3b82f6" : "#2563eb",
          }}
        >
          <div
            class="flex items-center gap-3 mb-6 pb-2 border-b"
            style={{ "border-color": C().border }}
          >
            <div
              class="w-3 h-3 rounded-full animate-pulse"
              style={{ background: isDark() ? "#10b981" : "#059669" }}
            ></div>
            <h2
              class="text-lg font-bold tracking-wide"
              style={{ color: C().font }}
            >
              LIVE HOST METRICS
            </h2>
            <div class="flex-1"></div>
            <div class="text-xs opacity-60" style={{ color: C().font }}>
              Realtime WebSocket
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <CpuStatsCard data={history()} limit={HISTORY_LIMIT} />
            <RamStatsCard data={history()} limit={HISTORY_LIMIT} />
          </div>
        </div>
      </div>
    </div>
  );
}
