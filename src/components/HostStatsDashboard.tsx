import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import { theme } from "../state/theme";
import { Line } from "solid-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

type HostStats = {
  cpu_total: number;
  cpu_idle: number;
  mem_total: number;
  mem_free: number;
};

function parseHostStats(bytes: Uint8Array): HostStats | null {
  if (bytes.length < 24) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const cpu_total = view.getFloat32(0, false);
  const cpu_idle = view.getFloat32(4, false);
  const mem_total = view.getBigUint64(8, false);
  const mem_free = view.getBigUint64(16, false);
  return {
    cpu_total,
    cpu_idle,
    mem_total: Number(mem_total),
    mem_free: Number(mem_free),
  };
}

function formatMem(kib: number) {
  if (kib < 1024) return `${kib} KiB`;
  if (kib < 1024 * 1024) return `${(kib / 1024).toFixed(2)} MiB`;
  return `${(kib / (1024 * 1024)).toFixed(2)} GiB`;
}

interface HostStatsDashboardProps {
  wsUrl?: string;
  apiKey?: string;
}

const HISTORY_LIMIT = 60;

type DisplayStat = {
  ts: number; // timestamp ms
  cpu_total: number;
  cpu_idle: number;
  mem_used: number;
  mem_free: number;
  mem_total: number;
};

function genChartColors(isDark: boolean) {
  return isDark
    ? {
        bg: "#111827",
        card: "#1f2937",
        border: "#374151",
        cpu: "#38bdf8",
        cpuIdle: "#a7f3d0",
        memUsed: "#4ade80",
        memFree: "#818cf8",
        font: "#e2e8f0",
        axis: "#e5e7eb",
      }
    : {
        bg: "#f3f4f6",
        card: "#fff",
        border: "#d1d5db",
        cpu: "#2563eb",
        cpuIdle: "#38bdf8",
        memUsed: "#22c55e",
        memFree: "#6366f1",
        font: "#334155",
        axis: "#334155",
      };
}

export default function HostStatsDashboard(props: HostStatsDashboardProps) {
  const [statsHistory, setStatsHistory] = createSignal<DisplayStat[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  // Theme-aware color palette -- recompute on theme change
  const colors = () => genChartColors(theme() === "dark");

  // Socket & live state
  createEffect(() => {
    const wsUrl =
      props.wsUrl ??
      import.meta.env.VITE_API_URL?.replace(/^http/, "ws") + "/ws/host-stats";
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
    } catch (err: any) {
      setError("Failed to open WebSocket: " + err?.toString());
      return;
    }

    ws.onopen = () => {
      if (props.apiKey) {
        ws.send(JSON.stringify({ apiKey: props.apiKey }));
      }
    };

    ws.onmessage = (evt) => {
      const data = new Uint8Array(evt.data);
      const parsed = parseHostStats(data);
      if (parsed) {
        setStatsHistory((hist) => {
          const next = [
            ...hist,
            {
              ts: Date.now(),
              cpu_total: parsed.cpu_total,
              cpu_idle: parsed.cpu_idle,
              mem_used: parsed.mem_total - parsed.mem_free,
              mem_free: parsed.mem_free,
              mem_total: parsed.mem_total,
            },
          ];
          return next.length > HISTORY_LIMIT
            ? next.slice(-HISTORY_LIMIT)
            : next;
        });
        setError(null);
      } else {
        setError("Malformed host stats received");
      }
    };
    ws.onerror = () => setError("WebSocket error");
    ws.onclose = () => setError((s) => s || "WebSocket disconnected");

    onCleanup(() => {
      ws.close();
    });
  });

  const stats = () => statsHistory();
  const labels = () =>
    stats().map((stat) =>
      new Date(stat.ts).toLocaleTimeString(undefined, { hour12: false }),
    );
  const latest = () => stats()[stats().length - 1];

  // Chart.js Datasets (CPU and Mem)
  const cpuChartData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "CPU Total (%)",
        data: stats().map((s) => s.cpu_total),
        fill: true,
        backgroundColor: (ctx) => {
          // Area gradient, needs canvas context
          const chart = ctx.chart;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return colors().cpu;
          const gradient = canvas.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, colors().cpu);
          gradient.addColorStop(1, colors().card + "00"); // transparent
          return gradient;
        },
        borderColor: colors().cpu,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: "cpu",
      },
      {
        label: "CPU Idle (%)",
        data: stats().map((s) => s.cpu_idle),
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return colors().cpuIdle;
          const gradient = canvas.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0.2, colors().cpuIdle + "88");
          gradient.addColorStop(1, colors().card + "00");
          return gradient;
        },
        borderColor: colors().cpuIdle,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: "cpu",
      },
    ],
  });

  const cpuChartOptions = (): ChartOptions<"line"> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: colors().font,
          font: { size: 12, family: "monospace" },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: colors().card,
        titleColor: colors().font,
        bodyColor: colors().font,
        borderColor: colors().border,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: colors().border },
        ticks: { color: colors().axis, font: { size: 12 } },
      },
      cpu: {
        min: 0,
        max: 100,
        grid: { color: colors().border },
        ticks: { color: colors().axis, font: { size: 12 } },
      },
    },
  });

  const memChartData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "Used Mem (MiB)",
        data: stats().map((s) => s.mem_used / 1024),
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return colors().memUsed;
          const gradient = canvas.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, colors().memUsed);
          gradient.addColorStop(1, colors().card + "00");
          return gradient;
        },
        borderColor: colors().memUsed,
        tension: 0.45,
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: "mem",
      },
      {
        label: "Free Mem (MiB)",
        data: stats().map((s) => s.mem_free / 1024),
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return colors().memFree;
          const gradient = canvas.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0.2, colors().memFree);
          gradient.addColorStop(1, colors().card + "00");
          return gradient;
        },
        borderColor: colors().memFree,
        tension: 0.45,
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: "mem",
      },
    ],
  });

  const memChartOptions = (): ChartOptions<"line"> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: colors().font,
          font: { size: 12, family: "monospace" },
        },
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const label = ctx.dataset.label || "";
            const value =
              typeof ctx.parsed.y === "number"
                ? ctx.parsed.y.toFixed(2) + " MiB"
                : ctx.parsed.y;
            return `${label}: ${value}`;
          },
        },
        backgroundColor: colors().card,
        titleColor: colors().font,
        bodyColor: colors().font,
        borderColor: colors().border,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
        grid: { color: colors().border },
        ticks: { color: colors().axis, font: { size: 12 } },
      },
      mem: {
        beginAtZero: true,
        grid: { color: colors().border },
        ticks: { color: colors().axis, font: { size: 12 } },
        // Dynamically set upper bound
        max:
          stats().length > 0
            ? Math.max(...stats().map((s) => s.mem_total / 1024), 100)
            : 100,
      },
    },
  });

  // --- UI ---
  return (
    <section
      class={`flex flex-col items-center w-full min-h-screen transition-colors duration-90 ${theme() === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-700"}`}
    >
      <h1 class="text-2xl font-bold mb-2 pt-4">Host Stats Dashboard</h1>
      <p class="mb-6">Live resource usage (updated in real time)</p>

      <Show when={error()}>
        <div
          class="mb-4 p-2 rounded font-mono w-full max-w-2xl"
          style={{
            background: theme() === "dark" ? "#7f1d1d" : "#fee2e2",
            color: theme() === "dark" ? "#fee2e2" : "#b91c1c",
          }}
        >
          {error()}
        </div>
      </Show>

      <div class="w-full max-w-3xl flex flex-col gap-8">
        {/* CPU CARD */}
        <div
          class={`rounded-lg shadow h-64 flex flex-col justify-between transition-colors duration-100 ${theme() === "dark" ? "bg-gray-800" : "bg-white"}`}
          style={{
            border: `1px solid ${colors().border}`,
          }}
        >
          <div
            class="text-xs font-semibold mb-1 pl-3 pt-2"
            style={{ color: colors().axis }}
          >
            CPU Usage (%) · Last {HISTORY_LIMIT} samples
          </div>
          <div class="flex-1 relative">
            <Line data={cpuChartData()} options={cpuChartOptions()} />
          </div>
          <div class="flex justify-between items-baseline px-6 pb-2 pt-1 text-sm font-mono">
            <span>
              Current:{" "}
              <span class="font-bold">
                {latest() ? latest()!.cpu_total.toFixed(1) : "--"}%
              </span>
            </span>
            <span class="opacity-60">
              Idle: {latest() ? latest()!.cpu_idle.toFixed(1) : "--"}%
            </span>
          </div>
        </div>
        {/* MEMORY CARD */}
        <div
          class={`rounded-lg shadow h-64 flex flex-col justify-between transition-colors duration-100 ${theme() === "dark" ? "bg-gray-800" : "bg-white"}`}
          style={{
            border: `1px solid ${colors().border}`,
          }}
        >
          <div
            class="text-xs font-semibold mb-1 pl-3 pt-2"
            style={{ color: colors().axis }}
          >
            Memory · Last {HISTORY_LIMIT} samples
          </div>
          <div class="flex-1 relative">
            <Line data={memChartData()} options={memChartOptions()} />
          </div>
          <div class="flex justify-between items-baseline px-6 pb-2 pt-1 text-sm font-mono">
            <span>
              Current:{" "}
              <span class="font-bold">
                {latest()
                  ? `${formatMem(latest()!.mem_used)} / ${formatMem(latest()!.mem_total)}`
                  : "--"}
              </span>
            </span>
            <span class="opacity-60">
              Free: {latest() ? formatMem(latest()!.mem_free) : "--"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
