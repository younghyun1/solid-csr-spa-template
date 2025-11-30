import { onMount, onCleanup, createSignal, Show } from "solid-js";
import { Line } from "solid-chartjs";
import type { ChartOptions, ChartData } from "chart.js";
import { theme } from "../state/theme";
type HostStatsRaw = {
  cpu_usage: number; // percent, 0–100
  mem_total: number; // bytes
  mem_free: number; // bytes
};

// parse exactly 20 bytes: [f32][u64][u64] (all big-endian)
function parseHostStats(buf: ArrayBuffer): HostStatsRaw | null {
  if (buf.byteLength !== 20) return null;
  const dv = new DataView(buf);
  const cpu_usage = dv.getFloat32(0, false);
  const mem_total = Number(dv.getBigUint64(4, false));
  const mem_free = Number(dv.getBigUint64(12, false));
  return { cpu_usage, mem_total, mem_free };
}

function formatMem(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GiB`;
}

const HISTORY_LIMIT = 60;
type Stat = {
  ts: number;
  cpu: number;
  memT: number;
  memF: number;
};

export default function HostStatsDashboard(props: {
  wsUrl?: string;
  apiKey?: string;
}) {
  const [history, setHistory] = createSignal<Stat[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const isDark = () => theme() === "dark";

  // simple palette helper
  const C = () => ({
    bg: isDark() ? "#1f2937" : "#fff",
    border: isDark() ? "#374151" : "#d1d5db",
    font: isDark() ? "#e2e8f0" : "#334155",
    cpu: isDark() ? "#38bdf8" : "#2563eb",
    memU: isDark() ? "#4ade80" : "#22c55e",
    memF: isDark() ? "#818cf8" : "#6366f1",
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
        const next: Stat = {
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

  // convenience
  const stats = () => history();
  const labels = () => {
    const s = stats();
    const blanks = Array(Math.max(0, HISTORY_LIMIT - s.length)).fill("");
    const times = s.map((s) =>
      new Date(s.ts).toLocaleTimeString(undefined, { hour12: false }),
    );
    return [...blanks, ...times];
  };
  const latest = () => stats()[stats().length - 1];

  // gradient factory
  function makeGradient(
    ctx: CanvasRenderingContext2D,
    area: any,
    color: string,
  ) {
    const grad = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + "00");
    return grad;
  }

  // helpers
  function padToLimit<T>(arr: T[], filler: any = null): (T | null)[] {
    const padLen = Math.max(0, HISTORY_LIMIT - arr.length);
    return [...Array(padLen).fill(filler), ...arr];
  }

  // CPU chart
  const cpuData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "CPU %",
        data: padToLimit(stats().map((s) => s.cpu)),
        fill: true,
        backgroundColor: (ctx) => {
          const c = ctx.chart;
          if (!c.chartArea) return C().cpu;
          return makeGradient(c.ctx, c.chartArea, C().cpu);
        },
        borderColor: C().cpu,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        yAxisID: "y",
      },
    ],
  });
  const cpuOpts = (): ChartOptions<"line"> => ({
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: C().border }, ticks: { color: C().font } },
      y: {
        min: 0,
        max: 100,
        grid: { color: C().border },
        ticks: { color: C().font },
      },
    },
    plugins: {
      legend: { labels: { color: C().font } },
      tooltip: {
        backgroundColor: C().bg,
        titleColor: C().font,
        bodyColor: C().font,
        borderColor: C().border,
        borderWidth: 1,
      },
    },
  });

  // MEM chart
  const memData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "Used MiB",
        data: padToLimit(stats().map((s) => (s.memT - s.memF) / (1024 * 1024))),
        fill: true,
        backgroundColor: (ctx) => {
          const c = ctx.chart;
          if (!c.chartArea) return C().memU;
          return makeGradient(c.ctx, c.chartArea, C().memU);
        },
        borderColor: C().memU,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Free MiB",
        data: padToLimit(stats().map((s) => s.memF / (1024 * 1024))),
        fill: true,
        backgroundColor: (ctx) => {
          const c = ctx.chart;
          if (!c.chartArea) return C().memF;
          return makeGradient(c.ctx, c.chartArea, C().memF);
        },
        borderColor: C().memF,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });
  const memOpts = (): ChartOptions<"line"> => ({
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false, grid: { color: C().border } },
      y: {
        beginAtZero: true,
        grid: { color: C().border },
        ticks: { color: C().font },
        max: latest()
          ? Math.ceil(latest()!.memT / (1024 * 1024) / 100) * 100
          : undefined,
      },
    },
    plugins: {
      legend: { labels: { color: C().font } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y as number;
            return `${ctx.dataset.label}: ${v.toFixed(1)} MiB`;
          },
        },
        backgroundColor: C().bg,
        titleColor: C().font,
        borderColor: C().border,
        borderWidth: 1,
      },
    },
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

      <div
        class="p-8 rounded-xl shadow-lg border-2 w-[600px]"
        style={{
          background: isDark()
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          "border-color": isDark() ? "#3b82f6" : "#2563eb",
        }}
      >
        <div
          class="flex items-center gap-3 mb-4 pb-2 border-b"
          style={{ "border-color": C().border }}
        >
          <div
            class="w-3 h-3 rounded-full animate-pulse"
            style={{ background: isDark() ? "#10b981" : "#059669" }}
          ></div>
          <h2
            class="text-sm font-bold tracking-wide"
            style={{ color: C().font }}
          >
            HOST STATS
          </h2>
          <div class="flex-1"></div>
          <div class="text-xs opacity-60" style={{ color: C().font }}>
            Live
          </div>
        </div>

        <div class="flex gap-8">
          {/* CPU CARD */}
          <div class="flex-1">
            <div
              class="relative h-36 border rounded-lg shadow-sm"
              style={{
                border: isDark() ? "#1e40af" : "#3b82f6",
                background: isDark()
                  ? "rgba(30, 64, 175, 0.1)"
                  : "rgba(59, 130, 246, 0.05)",
              }}
            >
              <div class="absolute top-2 left-2 flex items-center gap-1">
                <div
                  class="w-2 h-2 rounded-full"
                  style={{ background: C().cpu }}
                ></div>
                <div class="text-xs font-semibold" style={{ color: C().cpu }}>
                  CPU Usage
                </div>
              </div>
              <div class="chart-wrapper absolute inset-0 pt-7 pb-8 px-3">
                <Line data={cpuData()} options={cpuOpts()} />
              </div>
              <div class="absolute bottom-2 left-2">
                <div
                  class="text-lg font-bold font-mono"
                  style={{ color: C().cpu }}
                >
                  {latest() ? latest()!.cpu.toFixed(1) + "%" : "--%"}
                </div>
                <div class="text-xs opacity-60" style={{ color: C().font }}>
                  Current
                </div>
              </div>
            </div>
          </div>

          {/* MEMORY CARD */}
          <div class="flex-1">
            <div
              class="relative h-36 border rounded-lg shadow-sm"
              style={{
                border: isDark() ? "#059669" : "#10b981",
                background: isDark()
                  ? "rgba(5, 150, 105, 0.1)"
                  : "rgba(16, 185, 129, 0.05)",
              }}
            >
              <div class="absolute top-2 left-2 flex items-center gap-1">
                <div
                  class="w-2 h-2 rounded-full"
                  style={{ background: C().memU }}
                ></div>
                <div class="text-xs font-semibold" style={{ color: C().memU }}>
                  Memory Usage
                </div>
              </div>
              <div class="chart-wrapper absolute inset-0 pt-7 pb-8 px-3">
                <Line data={memData()} options={memOpts()} />
              </div>
              <div class="absolute bottom-2 left-2">
                <div
                  class="text-xs font-bold font-mono"
                  style={{ color: C().memU }}
                >
                  {latest()
                    ? `${formatMem(latest()!.memT - latest()!.memF)} / ${formatMem(latest()!.memT)}`
                    : "--/--"}
                </div>
                <div class="text-xs opacity-60" style={{ color: C().font }}>
                  Used / Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
