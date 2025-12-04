import { Line } from "solid-chartjs";
import type { ChartOptions, ChartData } from "chart.js";
import { theme } from "../state/theme";
import type { HostStatPoint } from "../dtos/shared/host_stats";

function formatMem(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GiB`;
}

export default function RamStatsCard(props: {
  data: HostStatPoint[];
  limit: number;
}) {
  const isDark = () => theme() === "dark";

  const C = () => ({
    bg: isDark() ? "#1f2937" : "#fff",
    border: isDark() ? "#374151" : "#d1d5db",
    font: isDark() ? "#e2e8f0" : "#334155",
    memU: isDark() ? "#4ade80" : "#22c55e",
    memF: isDark() ? "#818cf8" : "#6366f1",
  });

  function makeGradient(
    ctx: CanvasRenderingContext2D,
    area: any,
    color: string
  ) {
    const grad = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + "00");
    return grad;
  }

  function padToLimit<T>(arr: T[], filler: any = null): (T | null)[] {
    const padLen = Math.max(0, props.limit - arr.length);
    return [...Array(padLen).fill(filler), ...arr];
  }

  const latest = () => props.data[props.data.length - 1];

  const labels = () => {
    const s = props.data;
    const blanks = Array(Math.max(0, props.limit - s.length)).fill("");
    const times = s.map((s) =>
      new Date(s.ts).toLocaleTimeString(undefined, { hour12: false })
    );
    return [...blanks, ...times];
  };

  const chartData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "Used MiB",
        data: padToLimit(props.data.map((s) => (s.memT - s.memF) / (1024 * 1024))),
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
        data: padToLimit(props.data.map((s) => s.memF / (1024 * 1024))),
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

  const chartOptions = (): ChartOptions<"line"> => ({
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
    <div
      class="relative flex-1 border rounded-lg shadow-sm flex flex-col min-h-[300px]"
      style={{
        border: isDark() ? "1px solid #059669" : "1px solid #10b981",
        background: isDark()
          ? "rgba(5, 150, 105, 0.1)"
          : "rgba(16, 185, 129, 0.05)",
      }}
    >
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full"
            style={{ background: C().memU }}
          ></div>
          <div class="font-bold text-lg" style={{ color: C().memU }}>
            Memory
          </div>
        </div>
        <div
          class="text-xl font-bold font-mono text-right"
          style={{ color: C().memU }}
        >
          {latest()
            ? `${formatMem(latest()!.memT - latest()!.memF)} / ${formatMem(
                latest()!.memT
              )}`
            : "--/--"}
        </div>
      </div>

      <div class="chart-wrapper flex-1 w-full px-2 pb-2 min-h-0">
        <Line data={chartData()} options={chartOptions()} />
      </div>
    </div>
  );
}
