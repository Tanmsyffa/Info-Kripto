"use client";

import { useState, useEffect } from "react";
import { X, Search, GitCompare, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPrice, formatMarketCap } from "@/lib/fetcher";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
}

export default function CompareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [coin1, setCoin1] = useState<Coin | null>(null);
  const [coin2, setCoin2] = useState<Coin | null>(null);
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [filtered1, setFiltered1] = useState<Coin[]>([]);
  const [filtered2, setFiltered2] = useState<Coin[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const res = await fetch("/api/coins?per_page=100");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllCoins(data);
        // Default selection
        setCoin1(data[0]);
        setCoin2(data[1]);
      }
    }
    if (isOpen) fetchAll();
  }, [isOpen]);

  useEffect(() => {
    if (search1) {
      setFiltered1(allCoins.filter(c => c.name.toLowerCase().includes(search1.toLowerCase()) || c.symbol.toLowerCase().includes(search1.toLowerCase())).slice(0, 5));
    } else {
      setFiltered1([]);
    }
  }, [search1, allCoins]);

  useEffect(() => {
    if (search2) {
      setFiltered2(allCoins.filter(c => c.name.toLowerCase().includes(search2.toLowerCase()) || c.symbol.toLowerCase().includes(search2.toLowerCase())).slice(0, 5));
    } else {
      setFiltered2([]);
    }
  }, [search2, allCoins]);

  if (!isOpen) return null;

  const ComparisonRow = ({ label, val1, val2, isPrice = false, isPercent = false }: any) => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    
    return (
      <div className="py-4 border-b border-border/50 last:border-0 hover:bg-surface-alt/20 transition-colors px-2 rounded-xl">
        <div className="text-[10px] text-text-tertiary uppercase font-black tracking-widest text-center mb-2">{label}</div>
        <div className="grid grid-cols-2 gap-8">
          <div className={`text-sm sm:text-base font-mono font-bold text-center ${isPercent ? (v1 > 0 ? 'text-green' : v1 < 0 ? 'text-red' : 'text-text-primary') : 'text-text-primary'}`}>
            {isPrice ? formatPrice(v1) : isPercent ? `${v1 >= 0 ? '+' : ''}${v1.toFixed(2)}%` : formatMarketCap(v1)}
          </div>
          <div className={`text-sm sm:text-base font-mono font-bold text-center ${isPercent ? (v2 > 0 ? 'text-green' : v2 < 0 ? 'text-red' : 'text-text-primary') : 'text-text-primary'}`}>
            {isPrice ? formatPrice(v2) : isPercent ? `${v2 >= 0 ? '+' : ''}${v2.toFixed(2)}%` : formatMarketCap(v2)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Adu Koin (VS Mode)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Area */}
        <div className="p-6 bg-surface-alt/30 grid grid-cols-2 gap-6 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-black text-accent shadow-xl italic">VS</div>
          </div>

          {/* Selector 1 */}
          <div className="relative">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Cari koin 1..."
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:border-accent"
              />
              {filtered1.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                  {filtered1.map(c => (
                    <button key={c.id} onClick={() => { setCoin1(c); setSearch1(""); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-hover text-xs">
                      <img src={c.image} className="w-4 h-4 rounded-full" /> {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {coin1 && (
              <div className="flex flex-col items-center text-center">
                <img src={coin1.image} className="w-16 h-16 rounded-full mb-2 shadow-lg" />
                <div className="font-bold text-text-primary">{coin1.name}</div>
                <div className="text-xs text-text-tertiary uppercase">{coin1.symbol}</div>
              </div>
            )}
          </div>

          {/* Selector 2 */}
          <div className="relative text-right">
            <div className="relative mb-3">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Cari koin 2..."
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                className="w-full h-9 pr-8 pl-3 bg-surface border border-border rounded-lg text-xs text-right focus:outline-none focus:border-accent"
              />
              {filtered2.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                  {filtered2.map(c => (
                    <button key={c.id} onClick={() => { setCoin2(c); setSearch2(""); }} className="w-full flex items-center justify-end gap-2 px-3 py-2 hover:bg-surface-hover text-xs">
                      {c.name} <img src={c.image} className="w-4 h-4 rounded-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {coin2 && (
              <div className="flex flex-col items-center text-center">
                <img src={coin2.image} className="w-16 h-16 rounded-full mb-2 shadow-lg" />
                <div className="font-bold text-text-primary">{coin2.name}</div>
                <div className="text-xs text-text-tertiary uppercase">{coin2.symbol}</div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Details */}
        <div className="flex-1 overflow-y-auto p-6">
          {coin1 && coin2 ? (
            <div className="space-y-1">
              <ComparisonRow label="Harga Saat Ini" val1={coin1.current_price} val2={coin2.current_price} isPrice />
              <ComparisonRow label="Perubahan 24 Jam" val1={coin1.price_change_percentage_24h} val2={coin2.price_change_percentage_24h} isPercent />
              <ComparisonRow label="Market Cap" val1={coin1.market_cap} val2={coin2.market_cap} />
              <ComparisonRow label="Volume 24 Jam" val1={coin1.total_volume} val2={coin2.total_volume} />
              <ComparisonRow label="Tertinggi 24 Jam" val1={coin1.high_24h} val2={coin2.high_24h} isPrice />
              <ComparisonRow label="Terendah 24 Jam" val1={coin1.low_24h} val2={coin2.low_24h} isPrice />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-tertiary gap-2">
              <GitCompare className="w-12 h-12 opacity-20" />
              <p className="text-sm">Coba adu dua koin favorit lu di sini bro...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-alt/50 text-center text-[10px] text-text-tertiary uppercase tracking-widest font-bold">
          Info Kripto Comparison Engine &copy; 2026
        </div>
      </div>
    </div>
  );
}
