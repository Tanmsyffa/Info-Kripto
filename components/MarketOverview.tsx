"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, formatPercentage, formatMarketCap } from "@/lib/fetcher";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  DollarSign,
  Layers,
} from "lucide-react";

interface MarketData {
  global: {
    total_market_cap: { usd: number; idr: number };
    total_volume: { usd: number; idr: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number; // CoinGecko always returns this as _usd
    active_cryptocurrencies: number;
  };
  trending: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      market_cap_rank: number;
      data?: {
        price: number;
        price_change_percentage_24h?: { usd: number; idr: number };
      };
    };
  }>;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function MarketOverview({ show = "all" }: { show?: "all" | "stats" | "lists" }) {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [marketRes, coinsRes] = await Promise.all([
          fetch("/api/market"),
          fetch("/api/coins?page=1&per_page=20"),
        ]);
        const marketData = await marketRes.json();
        const coinsData = await coinsRes.json();
        setMarket(marketData);
        if (Array.isArray(coinsData)) {
          setTopCoins(coinsData);
        }
      } catch {
        console.error("Failed to fetch market data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <OverviewSkeleton />;
  if (!market?.global) return null;

  const { global, trending } = market;

  // Sort for gainers/losers
  const gainers = [...topCoins]
    .filter((c) => c.price_change_percentage_24h != null)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...topCoins]
    .filter((c) => c.price_change_percentage_24h != null)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const marketCapChange = global.market_cap_change_percentage_24h_usd;

  return (
    <div className="space-y-6 fade-in" id="market-overview">
      {/* Stats row */}
      {(show === "all" || show === "stats") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Total Market Cap"
            value={formatMarketCap(global.total_market_cap.idr)}
            change={marketCapChange}
            tooltip="Total duit dari semua koin kripto sedunia"
          />
          <StatCard
            icon={<BarChart3 className="w-4 h-4" />}
            label="Volume 24 Jam"
            value={formatMarketCap(global.total_volume.idr)}
            tooltip="Total duit yang muter 24 jam terakhir"
          />
          <StatCard
            icon={<Layers className="w-4 h-4" />}
            label="Pengaruh BTC"
            value={`${global.market_cap_percentage.btc.toFixed(1)}%`}
            tooltip="Seberapa kuat dominasi Bitcoin dibanding koin-koin lain"
          />
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="Koin Hidup"
            value={global.active_cryptocurrencies.toLocaleString()}
            tooltip="Jumlah koin yang masih aktif di market"
          />
        </div>
      )}

      {/* Three columns: Trending, Gainers, Losers */}
      {(show === "all" || show === "lists") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card card-hover p-0 border-none shadow-sm bg-surface/50 backdrop-blur-sm overflow-hidden">
            <div 
              className="flex items-center gap-2 px-5 py-4 border-b border-border/40 cursor-help"
              title="Koin yang lagi banyak diomongin orang-orang hari ini"
            >
              <div className="p-1.5 bg-accent/10 rounded-lg">
                <Activity className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.1em]">
                Lagi Hype
              </h3>
            </div>
            <div className="divide-y divide-border/30">
              {trending.slice(0, 5).map((t, i) => (
                <Link
                  key={t.item.id}
                  href={`/coin/${t.item.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors"
                >
                  <span className="text-[10px] text-text-tertiary w-3">
                    {i + 1}
                  </span>
                  <img
                    src={t.item.thumb}
                    alt={t.item.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-text-primary font-medium flex-1 truncate">
                    {t.item.name}
                  </span>
                  <span className="text-xs text-text-tertiary uppercase">
                    {t.item.symbol}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card card-hover p-0 border-none shadow-sm bg-surface/50 backdrop-blur-sm overflow-hidden">
            <div 
              className="flex items-center gap-2 px-5 py-4 border-b border-border/40 cursor-help"
              title="Koin yang ngasih untung paling gede hari ini"
            >
              <div className="p-1.5 bg-green/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green" />
              </div>
              <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.1em]">
                Top Cuan
              </h3>
            </div>
            <div className="divide-y divide-border/30">
              {gainers.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coin/${coin.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors"
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-text-primary font-medium flex-1 truncate">
                    {coin.name}
                  </span>
                  <span className="text-sm text-green font-medium font-mono">
                    +{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card card-hover p-0 border-none shadow-sm bg-surface/50 backdrop-blur-sm overflow-hidden">
            <div 
              className="flex items-center gap-2 px-5 py-4 border-b border-border/40 cursor-help"
              title="Koin yang harganya lagi terjun payung hari ini"
            >
              <div className="p-1.5 bg-red/10 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red" />
              </div>
              <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.1em]">
                Lagi Nyungsep
              </h3>
            </div>
            <div className="divide-y divide-border/30">
              {losers.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coin/${coin.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors"
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-text-primary font-medium flex-1 truncate">
                    {coin.name}
                  </span>
                  <span className="text-sm text-red font-medium font-mono">
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  tooltip?: string;
}) {
  return (
    <div className="card card-hover sm:p-4">
      <div 
        className="flex items-center gap-2 mb-2 cursor-help w-max"
        title={tooltip}
      >
        <div className="p-1 bg-surface-alt rounded-lg border border-border/50">
          <span className="text-text-secondary">{icon}</span>
        </div>
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-base sm:text-lg font-semibold text-text-primary font-mono">
        {value}
      </p>
      {change !== undefined && (
        <p
          className={`text-xs font-medium mt-0.5 ${
            change >= 0 ? "text-green" : "text-red"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}% (24j)
        </p>
      )}
    </div>
  );
}
