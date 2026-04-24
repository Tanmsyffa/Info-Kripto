export type SentimentType = "positive" | "negative" | "neutral";

export interface SentimentResult {
  sentiment: SentimentType;
  score: number; // -1 to 1
  label: string;
}

const POSITIVE_WORDS = [
  "bullish", "surge", "rally", "gain", "rise", "soar", "pump", "moon",
  "breakout", "all-time high", "ath", "growth", "adoption", "partnership",
  "upgrade", "launch", "innovation", "approval", "positive", "optimistic",
  "support", "accumulation", "recover", "rebound", "profit", "milestone",
  "success", "boom", "strong", "momentum", "institutional", "buy",
  "outperform", "upgrade", "uptrend", "boost", "exciting", "bullrun",
];

const NEGATIVE_WORDS = [
  "bearish", "crash", "dump", "drop", "fall", "plunge", "decline",
  "sell-off", "selloff", "hack", "exploit", "vulnerability", "scam",
  "fraud", "ban", "regulation", "crackdown", "lawsuit", "fine",
  "negative", "pessimistic", "fear", "panic", "collapse", "loss",
  "bankruptcy", "delisting", "warning", "risk", "concern", "downturn",
  "correction", "overhead", "resistance", "breakdown", "weak", "trouble",
];

/**
 * Analyze sentiment of a text string using keyword matching
 */
export function analyzeSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of POSITIVE_WORDS) {
    if (lower.includes(word)) positiveCount++;
  }
  for (const word of NEGATIVE_WORDS) {
    if (lower.includes(word)) negativeCount++;
  }

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { sentiment: "neutral", score: 0, label: "Neutral" };
  }

  const score = (positiveCount - negativeCount) / total;

  if (score > 0.2) {
    return { sentiment: "positive", score, label: "Positive" };
  } else if (score < -0.2) {
    return { sentiment: "negative", score, label: "Negative" };
  }
  return { sentiment: "neutral", score, label: "Neutral" };
}

/**
 * Analyze sentiment across multiple news articles
 */
export function analyzeNewsSentiment(
  articles: { title: string; description?: string }[]
): {
  overall: SentimentResult;
  breakdown: { positive: number; negative: number; neutral: number };
} {
  if (!articles || articles.length === 0) {
    return {
      overall: { sentiment: "neutral", score: 0, label: "Neutral" },
      breakdown: { positive: 0, negative: 0, neutral: 0 },
    };
  }

  let totalScore = 0;
  const breakdown = { positive: 0, negative: 0, neutral: 0 };

  for (const article of articles) {
    const text = `${article.title} ${article.description || ""}`;
    const result = analyzeSentiment(text);
    totalScore += result.score;
    breakdown[result.sentiment]++;
  }

  const avgScore = totalScore / articles.length;

  let overall: SentimentResult;
  if (avgScore > 0.15) {
    overall = { sentiment: "positive", score: avgScore, label: "Positive" };
  } else if (avgScore < -0.15) {
    overall = { sentiment: "negative", score: avgScore, label: "Negative" };
  } else {
    overall = { sentiment: "neutral", score: avgScore, label: "Neutral" };
  }

  return { overall, breakdown };
}

/**
 * Combine prediction trend and news sentiment into a combined signal
 */
export function getCombinedSignal(
  trend: "bullish" | "bearish" | "sideways",
  sentiment: SentimentType
): {
  signal: string;
  color: string;
  description: string;
} {
  if (trend === "bullish" && sentiment === "positive") {
    return {
      signal: "Sangat Bagus (Momen Pas)",
      color: "green",
      description: "Harga diprediksi naik dan berita di internet sedang sangat positif. Banyak orang optimis.",
    };
  }
  if (trend === "bearish" && sentiment === "negative") {
    return {
      signal: "Bahaya (Hindari Dulu)",
      color: "red",
      description: "Harga diprediksi turun dan banyak berita negatif di luar sana. Sangat berisiko.",
    };
  }
  if (trend === "bullish" && sentiment === "negative") {
    return {
      signal: "Hati-hati (Berisiko)",
      color: "orange",
      description: "Secara data mungkin naik, tapi berita di luar sedang negatif. Harga bisa tiba-tiba anjlok.",
    };
  }
  if (trend === "bearish" && sentiment === "positive") {
    return {
      signal: "Pantau Terus (Ada Peluang)",
      color: "orange",
      description: "Harga sedang turun, tapi berita mulai positif. Mungkin sebentar lagi harga akan memantul naik.",
    };
  }
  if (trend === "sideways") {
    return {
      signal: "Biasa Saja (Tunggu)",
      color: "blue",
      description: "Pasar sedang sepi atau stabil. Belum ada arah pergerakan harga yang jelas.",
    };
  }
  return {
    signal: "Belum Jelas",
    color: "blue",
    description: "Data kurang lengkap untuk memberikan kesimpulan yang akurat.",
  };
}
