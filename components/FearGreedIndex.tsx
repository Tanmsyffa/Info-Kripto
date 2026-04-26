"use client";

import { useState, useEffect } from "react";
import { Gauge, Info } from "lucide-react";

interface FNGData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

export default function FearGreedIndex() {
  const [fng, setFng] = useState<FNGData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFng() {
      try {
        const res = await fetch("/api/fear-greed");
        const data = await res.json();
        if (data.data && data.data[0]) {
          setFng(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching F&G Index:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFng();
  }, []);

  if (isLoading) return <div className="skeleton h-32 rounded-xl w-full" />;
  if (!fng) return null;

  const value = parseInt(fng.value);
  
  const getTheme = (val: number) => {
    if (val <= 25) return { color: "text-red", bg: "bg-red/5", border: "border-red/10", label: "Panik Parah! 😱" };
    if (val <= 45) return { color: "text-orange", bg: "bg-orange/5", border: "border-orange/10", label: "Lagi Panik 😨" };
    if (val <= 55) return { color: "text-blue", bg: "bg-blue/5", border: "border-blue/10", label: "Biasa Aja 😐" };
    if (val <= 75) return { color: "text-green", bg: "bg-green/5", border: "border-green/10", label: "Lagi Maruk 😎" };
    return { color: "text-green", bg: "bg-green/5", border: "border-green/10", label: "Maruk Parah! 🔥" };
  };

  const theme = getTheme(value);

  return (
    <div className={`card ${theme.bg} ${theme.border} p-5 h-full flex items-center relative transition-all card-hover group overflow-hidden border-none shadow-sm`}>
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        {/* Left side: Value */}
        <div className="flex items-center gap-4 pr-6 border-b sm:border-b-0 sm:border-r border-border/20 h-full">
          <div className={`w-12 h-12 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center shrink-0 shadow-sm`}>
            <Gauge className={`w-6 h-6 ${theme.color}`} />
          </div>
          <div className="flex flex-col">
            <span className={`text-3xl font-black ${theme.color} leading-none tracking-tighter`}>
              {fng.value}
            </span>
            <span className={`text-[10px] font-black uppercase mt-1.5 ${theme.color} tracking-[0.1em]`}>
              {fng.value_classification}
            </span>
          </div>
        </div>

        {/* Right side: Bar & Text */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 h-2 rounded-full bg-background/40 border border-border/10 overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{ 
                   width: `${fng.value}%`,
                   background: `linear-gradient(90deg, transparent, var(--color-${theme.color.split('-')[1]}))`,
                   backgroundColor: `var(--color-${theme.color.split('-')[1]})`,
                   boxShadow: `0 0 15px var(--color-${theme.color.split('-')[1]})44`
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-text-tertiary uppercase whitespace-nowrap tracking-widest opacity-60">
              <span>Panic</span>
              <div className="w-1 h-1 rounded-full bg-text-tertiary/20" />
              <span>Maruk</span>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            <span className={`font-black ${theme.color} uppercase tracking-wide`}>{theme.label}</span>. {value < 30 ? "Pas nih buat serok cicil." : value > 70 ? "Hati-hati bro, udah mulai kemanisan." : "Market masih adem ayem."}
          </p>
        </div>
        
        {/* Info button */}
        <div 
          className="hidden sm:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-help p-1 hover:bg-surface-alt rounded-lg"
          title="Indikator psikologi trader. Merah (takut) waktunya serok, Hijau (maruk) waktunya waspada."
        >
          <Info className="w-4 h-4 text-text-tertiary/40" />
        </div>
      </div>
    </div>
  );
}
