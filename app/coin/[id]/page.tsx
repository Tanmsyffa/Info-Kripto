import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { fetchCoinDetail } from "@/lib/fetcher";
import { formatPrice, formatMarketCap, formatPercentage } from "@/lib/fetcher";
import Chart from "@/components/Chart";
import CoinSidebar from "@/components/CoinSidebar";
import NewsList from "@/components/NewsList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `${title} — CryptoVision`,
    description: `${title} price, chart, prediction, and market analysis on CryptoVision.`,
  };
}

export default async function CoinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let coin;
  try {
    coin = await fetchCoinDetail(id);
  } catch {
    return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-dim mb-4">
          <ArrowLeft className="w-6 h-6 text-red" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Waduh, Gagal Muat Data Nih 😅
        </h2>
        <p className="text-sm text-text-tertiary mb-6 max-w-md mx-auto">
          Server lagi capek karena kebanyakan yang akses. Santai dulu bentar, terus coba lagi ya.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/coin/${id}`}
            className="px-4 py-2 text-sm font-medium bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors"
          >
            Coba Lagi
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            Balik ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const price = coin.market_data.current_price.idr;
  const change24h = coin.market_data.price_change_percentage_24h;
  const change7d = coin.market_data.price_change_percentage_7d;
  const change30d = coin.market_data.price_change_percentage_30d;
  const marketCap = coin.market_data.market_cap.idr;
  const volume = coin.market_data.total_volume.idr;
  const high24h = coin.market_data.high_24h?.idr;
  const low24h = coin.market_data.low_24h?.idr;
  const circulatingSupply = coin.market_data.circulating_supply;
  const maxSupply = coin.market_data.max_supply;
  const rank = coin.market_cap_rank;
  const isPositive24h = change24h >= 0;
  const liveSource = coin._liveSource as
    | { provider: string; exchange: string; lastUpdated: string }
    | undefined;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors mb-4"
        id="back-link"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Balik ke Dashboard
      </Link>

      {/* Coin header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-text-primary">
                {coin.name}
              </h1>
              <span className="text-sm text-text-tertiary uppercase font-medium">
                {coin.symbol}
              </span>
              {rank && (
                <span className="text-[10px] px-1.5 py-0.5 bg-surface border border-border rounded text-text-tertiary font-medium">
                  Peringkat #{rank}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sm:ml-auto flex flex-col items-end gap-1">
          <div className="flex items-end gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-text-primary font-mono">
              {formatPrice(price)}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-base font-semibold ${
                isPositive24h ? "text-green" : "text-red"
              }`}
            >
              {isPositive24h ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {Math.abs(change24h).toFixed(2)}%
            </span>
          </div>
          {liveSource && (
            <span className="text-[10px] text-text-tertiary flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
              Live dari {liveSource.exchange}
            </span>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Chart */}
          <div className="border border-border rounded-lg p-4">
            <Chart coinId={id} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatItem label="Market Cap" value={formatMarketCap(marketCap)} tooltip="Total duit dari semua koin yang beredar sekarang" />
            <StatItem label="Volume 24 Jam" value={formatMarketCap(volume)} tooltip="Total duit yang dipake transaksi seharian ini" />
            <StatItem
              label="Harga Pucuk (24j)"
              value={high24h ? formatPrice(high24h) : "—"}
            />
            <StatItem
              label="Harga Dasar (24j)"
              value={low24h ? formatPrice(low24h) : "—"}
            />
            <StatItem
              label="Naik/Turun 7 Hari"
              value={formatPercentage(change7d)}
              isChange
              positive={change7d >= 0}
            />
            <StatItem
              label="Naik/Turun Sebulan"
              value={formatPercentage(change30d)}
              isChange
              positive={change30d >= 0}
            />
            <StatItem
              label="Koin Beredar"
              value={
                circulatingSupply
                  ? `${(circulatingSupply / 1e6).toFixed(2)}M`
                  : "—"
              }
            />
            <StatItem
              label="Batas Koin"
              value={
                maxSupply ? `${(maxSupply / 1e6).toFixed(2)}M` : "Tak Terbatas"
              }
            />
          </div>

          {/* News section */}
          <div className="card">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Berita Anget 🔥
            </h3>
            <Suspense
              fallback={
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-lg" />
                  ))}
                </div>
              }
            >
              <NewsList coinName={coin.name} />
            </Suspense>
          </div>
        </div>

        {/* Right column (sidebar) */}
        <div className="space-y-4">
          {/* Prediction + Combined Signal (shared state) */}
          <CoinSidebar
            coinId={id}
            coinName={coin.name}
            currentPrice={price}
          />

          {/* Links */}
          {(coin.links?.homepage?.[0] || coin.links?.blockchain_site?.[0]) && (
            <div className="card">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                Link Penting 🔗
              </h3>
              <div className="space-y-2">
                {coin.links?.homepage?.[0] && (
                  <a
                    href={coin.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Website Resmi
                  </a>
                )}
                {coin.links?.blockchain_site
                  ?.filter((l: string) => l)
                  .slice(0, 2)
                  .map((link: string, i: number) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Explorer {i + 1}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  isChange,
  positive,
  tooltip,
}: {
  label: string;
  value: string;
  isChange?: boolean;
  positive?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="card card-hover p-4 border-none shadow-sm bg-surface/50 backdrop-blur-sm">
      <span 
        className={`text-[10px] text-text-tertiary uppercase tracking-widest font-black block mb-2 w-max ${tooltip ? 'cursor-help border-b border-dashed border-text-tertiary/40' : ''}`}
        title={tooltip}
      >
        {label}
      </span>
      <span
        className={`text-sm sm:text-base font-bold font-mono block ${
          isChange
            ? positive
              ? "text-green"
              : "text-red"
            : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
