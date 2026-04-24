"use client";

import { useState } from "react";
import MarketOverview from "@/components/MarketOverview";
import CoinTable from "@/components/CoinTable";
import DictionaryModal from "@/components/DictionaryModal";
import CalculatorModal from "@/components/CalculatorModal";
import FearGreedIndex from "@/components/FearGreedIndex";
import CompareModal from "@/components/CompareModal";
import { GitCompare } from "lucide-react";

export default function HomePage() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-text-primary">
            Kondisi Market Hari Ini 📈
          </h1>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Pantau pergerakan harga koin sama tren market yang lagi hype sekarang
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-[10px] font-black text-text-secondary hover:text-accent hover:border-accent/50 transition-colors whitespace-nowrap shadow-sm"
          >
            <GitCompare className="w-3.5 h-3.5" />
            VS MODE
          </button>
          <CalculatorModal />
          <DictionaryModal />
        </div>
      </div>

      {/* Row 1: Stats & Fear/Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <MarketOverview show="stats" />
        </div>
        <div className="lg:col-span-4">
          <FearGreedIndex />
        </div>
      </div>

      {/* Row 2: Lists (Full Width now) */}
      <div className="grid grid-cols-1 gap-6">
        <MarketOverview show="lists" />
      </div>
      
      {/* Row 3: Coin Table (Full Width) */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
          List Koin Kripto
        </h2>
        <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
          <CoinTable />
        </div>
      </div>

      {/* Modals */}
      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}

