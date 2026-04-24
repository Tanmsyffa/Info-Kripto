"use client";

import { useState } from "react";
import { Calculator, X, TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/fetcher";

export default function CalculatorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const amountNum = parseFloat(amount);
  const buyPriceNum = parseFloat(buyPrice);
  const currentPriceNum = parseFloat(currentPrice);

  const isCalculable = amountNum > 0 && buyPriceNum > 0 && currentPriceNum > 0;
  
  let totalCoins = 0;
  let currentValue = 0;
  let profitLoss = 0;
  let percentage = 0;

  if (isCalculable) {
    totalCoins = amountNum / buyPriceNum;
    currentValue = totalCoins * currentPriceNum;
    profitLoss = currentValue - amountNum;
    percentage = (profitLoss / amountNum) * 100;
  }

  const isProfit = profitLoss >= 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg shadow-sm hover:text-accent hover:border-accent/50 transition-colors"
      >
        <Calculator className="w-4 h-4 text-blue" />
        <span className="hidden sm:inline">Kalkulator Cuan</span>
        <span className="sm:hidden">Kalkulator</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue" />
                Kalkulator Cuan / Nyangkut 🧮
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Modal Awal (Rp)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 1000000"
                  className="w-full h-10 px-3 bg-surface-alt border border-border rounded-lg text-sm focus:outline-none focus:border-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Harga Beli (Rp)
                  </label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="w-full h-10 px-3 bg-surface-alt border border-border rounded-lg text-sm focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Harga Sekarang (Rp)
                  </label>
                  <input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="Contoh: 20000"
                    className="w-full h-10 px-3 bg-surface-alt border border-border rounded-lg text-sm focus:outline-none focus:border-blue"
                  />
                </div>
              </div>

              {isCalculable && (
                <div className={`mt-6 p-4 rounded-xl border ${isProfit ? 'bg-green-dim border-green/30' : 'bg-red-dim border-red/30'}`}>
                  <div className="text-sm text-text-secondary mb-1">Hasil:</div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-text-primary">
                      {formatPrice(currentValue)}
                    </span>
                    <div className={`flex items-center gap-1 font-bold ${isProfit ? 'text-green' : 'text-red'}`}>
                      {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {Math.abs(percentage).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-sm font-medium mt-2 pt-2 border-t border-border/50">
                    {isProfit ? (
                      <span className="text-green">Wah, lu cuan {formatPrice(Math.abs(profitLoss))}! 🎉</span>
                    ) : (
                      <span className="text-red">Waduh, nyangkut {formatPrice(Math.abs(profitLoss))} 😭</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
