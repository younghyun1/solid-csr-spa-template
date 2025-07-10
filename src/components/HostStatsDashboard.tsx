import { onMount, onCleanup, createSignal, Show, For } from "solid-js";
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
  const labels = () =>
    stats().map((s) =>
      new Date(s.ts).toLocaleTimeString(undefined, { hour12: false }),
    );
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

  // CPU chart
  const cpuData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "CPU %",
        data: stats().map((s) => s.cpu),
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
        data: stats().map((s) => (s.memT - s.memF) / 1024),
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
        data: stats().map((s) => s.memF / 1024),
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
          ? Math.ceil(latest()!.memT / 1024 / 100) * 100
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
    <section
      class={`p-4 min-h-screen ${isDark() ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-700"}`}
    >
      <h1 class="text-2xl mb-4">Host Stats Dashboard</h1>
      <p class="mb-4">
        Real-time CPU &amp; Memory (last {HISTORY_LIMIT} ticks)
      </p>

      <Show when={error()}>
        <div
          class="p-2 mb-4 rounded font-mono"
          style={{
            background: isDark() ? "#7f1d1d" : "#fee2e2",
            color: isDark() ? "#fee2e2" : "#b91c1c",
          }}
        >
          {error()}
        </div>
      </Show>

      <div class="space-y-8 max-w-3xl mx-auto">
        {/* CPU CARD */}
        <div
          class="relative h-64 border rounded-lg"
          style={{ border: C().border, background: C().cardBg }}
        >
          <div
            class="absolute top-2 left-4 text-xs"
            style={{ color: C().font }}
          >
            CPU Usage (%)
          </div>
          <div class="chart-wrapper absolute inset-0 pt-6 pb-6 px-4">
            <Line data={cpuData()} options={cpuOpts()} />
          </div>
          <div
            class="absolute bottom-2 left-4 text-sm font-mono"
            style={{ color: C().font }}
          >
            {latest() ? latest()!.cpu.toFixed(1) + "%" : "--%"}
          </div>
        </div>

        {/* MEMORY CARD */}
        <div
          class="relative h-64 border rounded-lg"
          style={{ border: C().border, background: C().cardBg }}
        >
          <div
            class="absolute top-2 left-4 text-xs"
            style={{ color: C().font }}
          >
            Memory (MiB)
          </div>
          <div class="chart-wrapper absolute inset-0 pt-6 pb-6 px-4">
            <Line data={memData()} options={memOpts()} />
          </div>
          <div
            class="absolute bottom-2 left-4 text-sm font-mono"
            style={{ color: C().font }}
          >
            {latest()
              ? `${formatMem(latest()!.memT - latest()!.memF)} / ${formatMem(latest()!.memT)}`
              : "--/--"}
          </div>
          <div
            class="absolute bottom-2 right-4 text-sm font-mono opacity-60"
            style={{ color: C().font }}
          >
            {latest() ? formatMem(latest()!.memF) : "--"}
          </div>
        </div>
      </div>
    </section>
  );
}
