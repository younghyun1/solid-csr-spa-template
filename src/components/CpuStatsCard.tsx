import { Line } from "solid-chartjs";
import type { ChartOptions, ChartData } from "chart.js";
import { theme } from "../state/theme";
import type { HostStatPoint } from "../dtos/shared/host_stats";

export default function CpuStatsCard(props: {
  data: HostStatPoint[];
  limit: number;
}) {
  const isDark = () => theme() === "dark";

  const C = () => ({
    bg: isDark() ? "#1f2937" : "#fff",
    border: isDark() ? "#374151" : "#d1d5db",
    font: isDark() ? "#e2e8f0" : "#334155",
    cpu: isDark() ? "#38bdf8" : "#2563eb",
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
        label: "CPU %",
        data: padToLimit(props.data.map((s) => s.cpu)),
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

  const chartOptions = (): ChartOptions<"line"> => ({
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

  return (
    <div
      class="relative flex-1 border rounded-lg shadow-sm flex flex-col min-h-[300px]"
      style={{
        border: isDark() ? "1px solid #1e40af" : "1px solid #3b82f6",
        background: isDark()
          ? "rgba(30, 64, 175, 0.1)"
          : "rgba(59, 130, 246, 0.05)",
      }}
    >
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full"
            style={{ background: C().cpu }}
          ></div>
          <div class="font-bold text-lg" style={{ color: C().cpu }}>
            CPU Usage
          </div>
        </div>
        <div class="text-2xl font-bold font-mono" style={{ color: C().cpu }}>
          {latest() ? latest()!.cpu.toFixed(1) + "%" : "--%"}
        </div>
      </div>

      <div class="chart-wrapper flex-1 w-full px-2 pb-2 min-h-0">
        <Line data={chartData()} options={chartOptions()} />
      </div>
    </div>
  );
}
