"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";
import { formatPrice } from "@/lib/fetcher";
import type { PredictionResult } from "@/lib/prediction";

interface PredictionBoxProps {
  coinId: string;
  currentPrice: number;
  onTrendLoaded?: (trend: "bullish" | "bearish" | "sideways") => void;
}

function PredictionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton w-32 h-5" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton w-full h-20 rounded-lg" />
        ))}
      </div>
      <div className="skeleton w-full h-16 rounded-lg" />
    </div>
  );
}

export default function PredictionBox({
  coinId,
  currentPrice,
  onTrendLoaded,
}: PredictionBoxProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const res = await fetch(`/api/prediction?coin=${coinId}`);
        const data = await res.json();
        if (!data.error) {
          setPrediction(data);
          onTrendLoaded?.(data.trend);
        }
      } catch {
        console.error("Failed to fetch prediction");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrediction();
  }, [coinId, onTrendLoaded]);

  if (isLoading) return <PredictionSkeleton />;
  if (!prediction) return null;

  const trendConfig = {
    bullish: {
      icon: TrendingUp,
      color: "text-green",
      bg: "bg-green/10",
      border: "border-green/20",
      label: "Bakal Terbang 🚀",
      desc: "Lagi kuat naik nih",
    },
    bearish: {
      icon: TrendingDown,
      color: "text-red",
      bg: "bg-red/10",
      border: "border-red/20",
      label: "Bakal Nyungsep 🩸",
      desc: "Lagi loyo beneran",
    },
    sideways: {
      icon: Minus,
      color: "text-blue",
      bg: "bg-blue/10",
      border: "border-blue/20",
      label: "Lagi Galau ⚖️",
      desc: "Belum jelas arahnya",
    },
  };

  const trend = trendConfig[prediction.trend];
  const TrendIcon = trend.icon;
  const priceDiff = prediction.predictedPrice - currentPrice;
  const priceDiffPct = (priceDiff / currentPrice) * 100;

  return (
    <div id="prediction-box" className="space-y-4 fade-in">
      <div className="flex items-center justify-between tooltip-wrapper">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 cursor-help border-b border-dashed border-text-tertiary/50">
          <Zap className="w-4 h-4 text-accent" />
          Bisikan AI 🤖
        </h3>
        <div className="tooltip-text">Ini cuma ramalan AI dari data masa lalu, bukan wangsit mutlak buat investasi ya!</div>
        <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
          Prakiraan 24 Jam
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Predicted Price */}
        <div className="card p-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 tooltip-wrapper">
            <Target className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider cursor-help border-b border-dashed border-text-tertiary/50">
              Target Harga Besok
            </span>
            <div className="tooltip-text">Perkiraan harga koin ini besok menurut hitungan bot AI</div>
          </div>
          <p className="text-sm md:text-base font-semibold text-text-primary font-mono break-all sm:break-normal" title={formatPrice(prediction.predictedPrice)}>
            {formatPrice(prediction.predictedPrice)}
          </p>
          <p
            className={`text-xs font-medium mt-0.5 ${
              priceDiff >= 0 ? "text-green" : "text-red"
            }`}
          >
            {priceDiff >= 0 ? "+" : ""}
            {priceDiffPct.toFixed(2)}%
          </p>
        </div>

        {/* Trend */}
        <div className="card p-3 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center gap-1.5 mb-1.5 tooltip-wrapper">
            <BarChart3 className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider cursor-help border-b border-dashed border-text-tertiary/50">
              Arah Harga
            </span>
            <div className="tooltip-text">Kecenderungan pergerakan harga dalam waktu dekat. Bakal terbang atau nyungsep?</div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`text-base font-bold ${trend.color} leading-tight`}>
              {trend.label}
            </span>
            <span className="text-xs leading-tight text-text-tertiary mt-1">
              {trend.desc}
            </span>
          </div>
        </div>

        {/* MA(7) */}
        <div className="card p-3 tooltip-wrapper flex flex-col justify-center">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider cursor-help border-b border-dashed border-text-tertiary/50 w-max">
            Rata-rata Seminggu
          </span>
          <div className="tooltip-text">Harga rata-rata selama 7 hari terakhir (seminggu)</div>
          <p className="text-xs sm:text-sm font-medium text-text-primary font-mono mt-1 truncate" title={formatPrice(prediction.movingAverage7)}>
            {formatPrice(prediction.movingAverage7)}
          </p>
        </div>

        {/* MA(30) */}
        <div className="card p-3 tooltip-wrapper flex flex-col justify-center">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider cursor-help border-b border-dashed border-text-tertiary/50 w-max">
            Rata-rata Sebulan
          </span>
          <div className="tooltip-text">Harga rata-rata selama 30 hari terakhir (sebulan)</div>
          <p className="text-xs sm:text-sm font-medium text-text-primary font-mono mt-1 truncate" title={formatPrice(prediction.movingAverage30)}>
            {formatPrice(prediction.movingAverage30)}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5 tooltip-wrapper w-full">
        <div className="flex justify-between text-xs w-full cursor-help">
          <span className="text-text-tertiary border-b border-dashed border-text-tertiary/50">Tingkat Pede AI</span>
          <span className="text-text-secondary font-medium">
            {prediction.confidence}%
          </span>
        </div>
        <div className="tooltip-text">Seberapa pede si bot AI ini sama hasil tebakannya</div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${prediction.confidence}%`,
              backgroundColor:
                prediction.confidence > 60
                  ? "var(--color-green)"
                  : prediction.confidence > 30
                  ? "var(--color-orange)"
                  : "var(--color-red)",
            }}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-surface-alt/50 border-accent/20 p-3">
        <p className="text-xs text-text-secondary leading-relaxed">
          {/* Note: summary is from API, which may still be in English unless we update the prediction.ts logic */}
          {prediction.summary}
        </p>
      </div>
    </div>
  );
}
