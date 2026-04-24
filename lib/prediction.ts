export interface PredictionResult {
  predictedPrice: number;
  trend: "bullish" | "bearish" | "sideways";
  confidence: number;
  movingAverage7: number;
  movingAverage30: number;
  trendSlope: number;
  summary: string;
}

/**
 * Calculate Simple Moving Average from price data
 */
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  const slice = prices.slice(-period);
  return slice.reduce((sum, p) => sum + p, 0) / slice.length;
}

/**
 * Calculate trend slope using linear regression
 */
function calculateSlope(prices: number[]): number {
  const n = prices.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = prices.reduce((s, p) => s + p, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (prices[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Generate price prediction based on moving averages and trend slope
 */
export function generatePrediction(
  prices: number[],
  currentPrice: number
): PredictionResult {
  if (!prices || prices.length < 7) {
    return {
      predictedPrice: currentPrice,
      trend: "sideways",
      confidence: 0,
      movingAverage7: currentPrice,
      movingAverage30: currentPrice,
      trendSlope: 0,
      summary: "Datanya kurang nih buat diramal.",
    };
  }

  const ma7 = calculateSMA(prices, 7);
  const ma30 = calculateSMA(prices, Math.min(30, prices.length));
  const slope = calculateSlope(prices.slice(-14));

  // Normalize slope relative to price
  const normalizedSlope = slope / currentPrice;

  // Determine trend
  let trend: "bullish" | "bearish" | "sideways";
  const threshold = 0.001; // 0.1% daily change threshold

  if (normalizedSlope > threshold && currentPrice > ma7) {
    trend = "bullish";
  } else if (normalizedSlope < -threshold && currentPrice < ma7) {
    trend = "bearish";
  } else {
    trend = "sideways";
  }

  // Calculate predicted price using weighted average of signals
  const momentumFactor = 1 + normalizedSlope;
  const maRatio = currentPrice / ma7;
  const predictedPrice =
    currentPrice * momentumFactor * 0.6 + currentPrice * maRatio * 0.4;

  // Calculate confidence (0–100)
  // Higher weight on data consistency and ma alignment
  const trendConsistency = Math.min(Math.abs(normalizedSlope) / 0.005, 1); // More sensitive slope
  const maAlignment =
    trend === "bullish"
      ? currentPrice > ma7 && ma7 > ma30
        ? 0.9
        : 0.7
      : trend === "bearish"
      ? currentPrice < ma7 && ma7 < ma30
        ? 0.9
        : 0.7
      : 0.5; // Base alignment for sideways
  
  // Base confidence if data is enough, then add based on signals
  const baseConfidence = 40; 
  const signalConfidence = trendConsistency * maAlignment * 55;
  const confidence = Math.min(Math.round(baseConfidence + signalConfidence), 99);

  // Generate summary
  const priceVsMa = ((currentPrice - ma30) / ma30) * 100;
  let summary = "";

  if (trend === "bullish") {
    summary = `Harga koin ini lagi ada di ${priceVsMa > 0 ? "atas" : "bawah"} rata-rata 30 hari sebesar ${Math.abs(priceVsMa).toFixed(1)}%. Momen jangka pendeknya lagi positif banget nih. Peluang buat terbang (naik terus) makin keliatan.`;
  } else if (trend === "bearish") {
    summary = `Harganya sekarang ada di ${priceVsMa > 0 ? "atas" : "bawah"} rata-rata 30 hari sebesar ${Math.abs(priceVsMa).toFixed(1)}%. Momen jangka pendeknya lagi loyo. Hati-hati, ada kemungkinan harganya masih bakal nyungsep ke bawah.`;
  } else {
    summary = `Harga koin ini masih galau di sekitaran rata-rata 30 hari (${Math.abs(priceVsMa).toFixed(1)}% di ${priceVsMa > 0 ? "atas" : "bawah"}). Belum ada sinyal kuat mau ke mana. Mending santai dulu sambil mantau (wait and see).`;
  }

  return {
    predictedPrice,
    trend,
    confidence,
    movingAverage7: ma7,
    movingAverage30: ma30,
    trendSlope: normalizedSlope,
    summary,
  };
}
