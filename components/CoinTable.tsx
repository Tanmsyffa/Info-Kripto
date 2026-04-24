"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { formatPrice, formatMarketCap, formatPercentage } from "@/lib/fetcher";
import { ChevronUp, ChevronDown, Minus, Loader2, Star } from "lucide-react";

interface Coin {
  id: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const step = width / (data.length - 1);

  const points = data
    .map((val, i) => `${i * step},${height - ((val - min) / range) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "var(--color-green)" : "var(--color-red)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PercentageBadge({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-text-tertiary">—</span>;

  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-medium ${
        isPositive ? "text-green" : "text-red"
      }`}
    >
      {isPositive ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      )}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-border"
        >
          <div className="skeleton w-6 h-4" />
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton w-24 h-4" />
            <div className="skeleton w-12 h-3" />
          </div>
          <div className="skeleton w-20 h-4" />
          <div className="skeleton w-16 h-4 hidden sm:block" />
          <div className="skeleton w-20 h-4 hidden md:block" />
          <div className="skeleton w-20 h-7 hidden lg:block" />
        </div>
      ))}
    </div>
  );
}

export default function CoinTable() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [watchlistCoins, setWatchlistCoins] = useState<Coin[]>([]);

  // Load watchlist on mount
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setWatchlistIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Fetch watchlist coins
  useEffect(() => {
    if (watchlistIds.length === 0) {
      setWatchlistCoins([]);
      return;
    }
    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`/api/coins?per_page=50&ids=${watchlistIds.join(",")}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Sort data to match watchlistIds order
          const sorted = data.sort((a, b) => watchlistIds.indexOf(a.id) - watchlistIds.indexOf(b.id));
          setWatchlistCoins(sorted);
        }
      } catch (e) {}
    };
    fetchWatchlist();
  }, [watchlistIds]);

  const toggleWatchlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlistIds((prev) => {
      const newIds = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("watchlist", JSON.stringify(newIds));
      return newIds;
    });
  };

  const renderCoinRow = (coin: Coin) => {
    const isWatchlisted = watchlistIds.includes(coin.id);
    return (
      <Link
        key={coin.id}
        href={`/coin/${coin.id}`}
        className="grid grid-cols-[auto_auto_1fr_auto] sm:grid-cols-[40px_40px_1.5fr_150px_80px_160px_100px] lg:grid-cols-[40px_40px_1.5fr_150px_80px_160px_160px_100px] gap-4 items-center px-4 py-4 border-b border-border table-row-hover cursor-pointer"
      >
        {/* Watchlist Star */}
        <button
          onClick={(e) => toggleWatchlist(e, coin.id)}
          className="p-1 -ml-1 text-text-tertiary hover:text-orange transition-colors"
        >
          <Star className={`w-4 h-4 ${isWatchlisted ? "fill-orange text-orange" : ""}`} />
        </button>

        {/* Rank */}
        <span className="text-xs text-text-tertiary hidden sm:block">
          {coin.market_cap_rank}
        </span>

        {/* Name + Icon */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-7 h-7 rounded-full shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <span className="text-sm font-medium text-text-primary truncate block">
              {coin.name}
            </span>
            <span className="text-xs text-text-tertiary uppercase">
              {coin.symbol}
            </span>
          </div>
        </div>

        {/* Price */}
        <span className="text-sm text-text-primary text-right font-mono">
          {formatPrice(coin.current_price)}
        </span>

        {/* 24h Change */}
        <div className="text-right hidden sm:block">
          <PercentageBadge value={coin.price_change_percentage_24h} />
        </div>

        {/* Mobile 24h Change */}
        <div className="text-right sm:hidden">
          <PercentageBadge value={coin.price_change_percentage_24h} />
        </div>

        {/* Market Cap */}
        <span className="text-sm text-text-secondary text-right hidden sm:block font-mono">
          {formatMarketCap(coin.market_cap)}
        </span>

        {/* Volume */}
        <span className="text-sm text-text-secondary text-right hidden lg:block font-mono">
          {formatMarketCap(coin.total_volume)}
        </span>

        {/* Sparkline */}
        <div className="text-right hidden sm:flex justify-end">
          {coin.sparkline_in_7d?.price && (
            <MiniSparkline
              data={coin.sparkline_in_7d.price}
              isPositive={coin.price_change_percentage_24h >= 0}
            />
          )}
        </div>
      </Link>
    );
  };

  const fetchPage = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/coins?page=${pageNum}&per_page=10`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCoins(data);
          setHasMore(data.length === 10);
        } else {
          setHasMore(false);
          if (pageNum > 1) setCoins([]);
        }
      } catch {
        console.error("Failed to fetch coins");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  if (isLoading && coins.length === 0) return <TableSkeleton />;

  return (
    <div className="w-full" id="coin-table">
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[40px_40px_1.5fr_150px_80px_160px_100px] lg:grid-cols-[40px_40px_1.5fr_150px_80px_160px_160px_100px] gap-4 px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider border-b border-border sticky top-14 bg-background/95 backdrop-blur-sm z-10">
        <span>⭐</span>
        <span>#</span>
        <span>Koin</span>
        <span className="text-right">Harga</span>
        <span className="text-right">24j</span>
        <div className="text-right tooltip-wrapper ml-auto">
          <span className="cursor-help border-b border-dashed border-text-tertiary/50">Market Cap</span>
          <div className="tooltip-text whitespace-normal w-48 text-center right-0 transform translate-x-1/4">Total duit dari semua koin yang beredar sekarang</div>
        </div>
        <div className="text-right hidden lg:block tooltip-wrapper ml-auto">
          <span className="cursor-help border-b border-dashed border-text-tertiary/50">Volume 24 Jam</span>
          <div className="tooltip-text whitespace-normal w-48 text-center right-0 transform translate-x-1/4">Total duit yang dipake buat transaksi dalam 24 jam terakhir</div>
        </div>
        <span className="text-right">Tren 7 Hari</span>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Watchlist Section */}
          {watchlistCoins.length > 0 && (
            <div className="bg-surface-alt/50 border-b border-border">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange fill-orange" />
                  Koin Pantauan Gue
                </h3>
              </div>
              {watchlistCoins.map((coin) => renderCoinRow(coin))}
            </div>
          )}

          {/* All Coins Section */}
          <div className="px-4 py-3 bg-surface border-b border-border">
            <h3 className="text-sm font-bold text-text-primary">Semua Koin</h3>
          </div>

          {/* Table rows */}
          {coins.map((coin) => renderCoinRow(coin))}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 bg-surface-alt/30">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                document.getElementById('coin-table')?.scrollIntoView({ behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Mundur ⏪
            </button>
            <span className="text-sm font-medium text-text-tertiary">
              Hal {page}
            </span>
            <button
              onClick={() => {
                setPage((p) => p + 1);
                document.getElementById('coin-table')?.scrollIntoView({ behavior: 'smooth' });
              }}
              disabled={!hasMore}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Lanjut ⏩
            </button>
          </div>
        </>
      )}
    </div>
  );
}
