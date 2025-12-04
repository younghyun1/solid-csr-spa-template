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
  });

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

  function padToLimit<T>(arr: T[], filler: any = null): (T | null)[] {
    const padLen = Math.max(0, props.limit - arr.length);
    return [...Array(padLen).fill(filler), ...arr];
  }

  const latest = () => props.data[props.data.length - 1];

  const labels = () => {
    const s = props.data;
    const blanks = Array(Math.max(0, props.limit - s.length)).fill("");
    const times = s.map((s) =>
      new Date(s.ts).toLocaleTimeString(undefined, { hour12: false }),
    );
    return [...blanks, ...times];
  };

  const chartData = (): ChartData<"line"> => ({
    labels: labels(),
    datasets: [
      {
        label: "Used MiB",
        data: padToLimit(
          props.data.map((s) => (s.memT - s.memF) / (1024 * 1024)),
        ),
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
    ],
  });

  const chartOptions = (): ChartOptions<"line"> => ({
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: C().border }, ticks: { color: C().font } },
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
        bodyColor: C().font,
        borderColor: C().border,
        borderWidth: 1,
      },
    },
  });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <div
            class="w-2 h-2 rounded-full"
            style={{ background: C().memU }}
          ></div>
          <h3
            class="text-sm font-bold uppercase tracking-wider opacity-80"
            style={{ color: C().font }}
          >
            Memory Usage
          </h3>
        </div>
        <div
          class="text-xl font-bold font-mono text-right"
          style={{ color: C().memU }}
        >
          {latest()
            ? `${formatMem(latest()!.memT - latest()!.memF)} / ${formatMem(
                latest()!.memT,
              )}`
            : "--/--"}
        </div>
      </div>

      <div
        class="relative flex-1 border rounded-xl shadow-sm overflow-hidden min-h-[250px]"
        style={{
          border: `1px solid ${C().border}`,
          background: C().bg,
        }}
      >
        <div class="absolute inset-0 p-4">
          <Line data={chartData()} options={chartOptions()} />
        </div>
      </div>
    </div>
  );
}
