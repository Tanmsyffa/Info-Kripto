"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatPrice } from "@/lib/fetcher";

interface ChartProps {
  coinId: string;
}

const TIME_RANGES = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "1Y", value: "365" },
];

interface ChartDataPoint {
  time: number;
  price: number;
  label: string;
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton w-12 h-7 rounded-md" />
        ))}
      </div>
      <div className="skeleton w-full h-[300px] rounded-lg" />
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface border border-border-light rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-text-tertiary">{payload[0].payload.label}</p>
      <p className="text-sm font-semibold text-text-primary font-mono">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

export default function Chart({ coinId }: ChartProps) {
  const [range, setRange] = useState("7");
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/chart?coin=${coinId}&days=${range}`
      );
      const json = await res.json();

      if (json.prices) {
        const formatted = json.prices.map((p: [number, number]) => {
          const date = new Date(p[0]);
          let label: string;
          if (range === "1") {
            label = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (range === "365") {
            label = date.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            });
          } else {
            label = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }
          return { time: p[0], price: p[1], label };
        });

        // Sample data points to avoid over-rendering
        const maxPoints = 120;
        if (formatted.length > maxPoints) {
          const step = Math.floor(formatted.length / maxPoints);
          const sampled = formatted.filter(
            (_: ChartDataPoint, i: number) =>
              i % step === 0 || i === formatted.length - 1
          );
          setData(sampled);
        } else {
          setData(formatted);
        }
      }
    } catch {
      console.error("Failed to fetch chart");
    } finally {
      setIsLoading(false);
    }
  }, [coinId, range]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const priceChange =
    data.length >= 2 ? data[data.length - 1].price - data[0].price : 0;
  const isPositive = priceChange >= 0;
  const chartColor = isPositive ? "var(--color-green)" : "var(--color-red)";

  if (isLoading) return <ChartSkeleton />;

  return (
    <div id="price-chart">
      {/* Time range selector */}
      <div className="flex gap-1 mb-4">
        {TIME_RANGES.map((tr) => (
          <button
            key={tr.value}
            onClick={() => setRange(tr.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              range === tr.value
                ? "bg-accent/10 text-accent"
                : "text-text-tertiary hover:text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.15} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) =>
                v >= 1 ? `$${v.toLocaleString()}` : `$${v.toFixed(4)}`
              }
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: chartColor,
                stroke: "var(--color-background)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
