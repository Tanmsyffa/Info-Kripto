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
    <div className={`card ${theme.bg} ${theme.border} p-4 h-full flex items-center relative transition-all card-hover group overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* Left side: Value */}
        <div className="flex items-center gap-3 pr-4 border-b sm:border-b-0 sm:border-r border-border/50 h-full">
          <div className={`w-10 h-10 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center shrink-0`}>
            <Gauge className={`w-5 h-5 ${theme.color}`} />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl sm:text-2xl font-black ${theme.color} leading-none tracking-tighter`}>
              {fng.value}
            </span>
            <span className={`text-[9px] font-black uppercase mt-1 ${theme.color} tracking-tighter`}>
              {fng.value_classification}
            </span>
          </div>
        </div>

        {/* Right side: Bar & Text */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 h-1.5 rounded-full bg-background/50 border border-border/50 overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${fng.value}%`,
                  backgroundColor: `var(--color-${theme.color.split('-')[1]})`,
                  boxShadow: `0 0 12px var(--color-${theme.color.split('-')[1]})55`
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-text-tertiary uppercase whitespace-nowrap tracking-wider">
              <span>Panic</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span>Maruk</span>
            </div>
          </div>
          <p className="text-[10px] text-text-tertiary italic leading-tight">
            <span className={`font-bold ${theme.color}`}>{theme.label}</span>. {value < 30 ? "Pas nih buat serok cicil." : value > 70 ? "Hati-hati bro, udah mulai kemanisan." : "Market masih adem ayem."}
          </p>
        </div>
        
        {/* Info button */}
        <div className="hidden sm:block absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="tooltip-wrapper">
            <Info className="w-3.5 h-3.5 text-text-tertiary/50" />
            <div className="tooltip-text w-48 text-center text-[10px] right-0 translate-x-0">
              Indikator psikologi trader. Merah (takut) waktunya serok, Hijau (maruk) waktunya waspada.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
