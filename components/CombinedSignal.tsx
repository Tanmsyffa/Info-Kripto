"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { getCombinedSignal } from "@/lib/sentiment";
import { analyzeSentiment } from "@/lib/sentiment";

interface CombinedSignalProps {
  coinId: string;
  coinName: string;
  /** Prediction trend passed from parent to avoid duplicate API call */
  predictionTrend?: "bullish" | "bearish" | "sideways";
}

export default function CombinedSignal({
  coinId,
  coinName,
  predictionTrend,
}: CombinedSignalProps) {
  const [signal, setSignal] = useState<ReturnType<
    typeof getCombinedSignal
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState(predictionTrend);

  useEffect(() => {
    async function fetchSignal() {
      try {
        // Only fetch prediction if not provided by parent
        let finalTrend = trend;
        if (!finalTrend) {
          const predRes = await fetch(`/api/prediction?coin=${coinId}`);
          const prediction = await predRes.json();
          if (!prediction.error) {
            finalTrend = prediction.trend;
            setTrend(finalTrend);
          }
        }

        if (!finalTrend) {
          setIsLoading(false);
          return;
        }

        // Fetch news for sentiment (uses separate API — GNews, not CoinGecko)
        // Small delay to stagger requests
        await new Promise((r) => setTimeout(r, 300));
        const newsRes = await fetch(
          `/api/news?q=${encodeURIComponent(coinName + " crypto")}`
        );
        const newsData = await newsRes.json();

        let overallSentiment: "positive" | "negative" | "neutral" = "neutral";
        if (newsData.articles && newsData.articles.length > 0) {
          let totalScore = 0;
          for (const article of newsData.articles) {
            const result = analyzeSentiment(
              `${article.title} ${article.description || ""}`
            );
            totalScore += result.score;
          }
          const avgScore = totalScore / newsData.articles.length;
          overallSentiment =
            avgScore > 0.15
              ? "positive"
              : avgScore < -0.15
              ? "negative"
              : "neutral";
        }

        const combined = getCombinedSignal(finalTrend, overallSentiment);
        setSignal(combined);
      } catch {
        console.error("Failed to compute signal");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSignal();
  }, [coinId, coinName, trend]);

  // Update if parent provides trend later
  useEffect(() => {
    if (predictionTrend && predictionTrend !== trend) {
      setTrend(predictionTrend);
    }
  }, [predictionTrend, trend]);

  if (isLoading) {
    return <div className="skeleton w-full h-24 rounded-lg" />;
  }

  if (!signal) return null;

  const colorMap: Record<
    string,
    { border: string; bg: string; icon: string }
  > = {
    green: {
      border: "border-green/30",
      bg: "bg-green-dim",
      icon: "text-green",
    },
    red: {
      border: "border-red/30",
      bg: "bg-red-dim",
      icon: "text-red",
    },
    orange: {
      border: "border-orange/30",
      bg: "bg-orange-dim",
      icon: "text-orange",
    },
    blue: {
      border: "border-blue/30",
      bg: "bg-blue-dim",
      icon: "text-blue",
    },
  };

  const style = colorMap[signal.color] || colorMap.blue;

  const IconComponent =
    signal.color === "green"
      ? TrendingUp
      : signal.color === "red"
      ? AlertTriangle
      : signal.color === "orange"
      ? Shield
      : Activity;

  return (
    <div
      id="combined-signal"
      className={`card border-${style.icon.split('-')[1]}/30 fade-in`}
      style={{ borderColor: `var(--color-${style.icon.split('-')[1]})` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}
        >
          <IconComponent className={`w-5 h-5 ${style.icon}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-semibold ${style.icon}`}>
              {signal.signal}
            </h4>
            <span 
              className="text-[10px] text-text-tertiary uppercase tracking-wider cursor-help border-b border-dashed border-text-tertiary/50"
              title="Gabungan dari prediksi harga dan sentimen berita di internet"
            >
              Kesimpulan AI
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {signal.description}
          </p>
        </div>
      </div>
    </div>
  );
}
