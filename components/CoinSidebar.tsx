"use client";

import { useState, useCallback } from "react";
import PredictionBox from "./PredictionBox";
import CombinedSignal from "./CombinedSignal";

interface CoinSidebarProps {
  coinId: string;
  coinName: string;
  currentPrice: number;
}

export default function CoinSidebar({
  coinId,
  coinName,
  currentPrice,
}: CoinSidebarProps) {
  const [predictionTrend, setPredictionTrend] = useState<
    "bullish" | "bearish" | "sideways" | undefined
  >();

  const handleTrendLoaded = useCallback(
    (trend: "bullish" | "bearish" | "sideways") => {
      setPredictionTrend(trend);
    },
    []
  );

  return (
    <div className="space-y-4">
      {/* Prediction */}
      <div className="border border-border rounded-lg p-4">
        <PredictionBox
          coinId={coinId}
          currentPrice={currentPrice}
          onTrendLoaded={handleTrendLoaded}
        />
      </div>

      {/* Combined Signal — reuses prediction trend from PredictionBox */}
      <CombinedSignal
        coinId={coinId}
        coinName={coinName}
        predictionTrend={predictionTrend}
      />
    </div>
  );
}
