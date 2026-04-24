"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";

export default function DictionaryModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-accent hover:border-accent/50 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Kamus Kripto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          {/* Latar belakang untuk menutup ketika di-klik */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Panduan & Kamus Kripto 📖</h2>
                <p className="text-sm text-text-secondary mt-1">Biar lu makin paham dan ga asal nyebur ke market.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
              
              {/* Apa Itu Kripto */}
              <section>
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-xl">🤔</span> Apa Itu Kripto Sebenarnya?
                </h3>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    Gampangnya, kripto itu <strong>duit digital</strong> yang ga dikontrol sama bank atau pemerintah manapun. Semua catatannya disimpan di banyak komputer di seluruh dunia secara bersamaan lewat teknologi yang namanya <strong>Blockchain</strong>.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Karena ga ada bosnya (terdesentralisasi), transaksinya bisa lebih transparan, aman, dan cepat. Tapi ingat, harganya ditentukan sama supply & demand murni dari pasar, makanya bisa naik turun dengan sangat cepat!
                  </p>
                </div>
              </section>

              {/* Tips & Trik Ahli */}
              <section>
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Tips & Trik dari Suhu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-surface-alt border border-border hover:border-accent/30 transition-colors">
                    <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-dim flex items-center justify-center text-sm">❄️</div>
                      1. Pake Duit Dingin
                    </h4>
                    <p className="text-sm text-text-secondary">Jangan pernah pake duit dapur atau pinjol buat main kripto. Pake uang yang lu rela kalo besoknya hilang tak berbekas.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-alt border border-border hover:border-accent/30 transition-colors">
                    <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-dim flex items-center justify-center text-sm">🔍</div>
                      2. DYOR (Do Your Own Research)
                    </h4>
                    <p className="text-sm text-text-secondary">Jangan asal beli koin karena ikutan temen atau influencer. Cari tau sendiri proyeknya buat apa dan siapa pembuatnya.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-alt border border-border hover:border-accent/30 transition-colors">
                    <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-dim flex items-center justify-center text-sm">🐷</div>
                      3. Jangan Rakus
                    </h4>
                    <p className="text-sm text-text-secondary">Kalo udah dapet cuan lumayan, jangan lupa take profit (tarik untungnya). Market bisa tiba-tiba berbalik arah.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-alt border border-border hover:border-accent/30 transition-colors">
                    <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-accent-dim flex items-center justify-center text-sm">🧺</div>
                      4. Sebar Risiko (Diversifikasi)
                    </h4>
                    <p className="text-sm text-text-secondary">Jangan taruh semua duit lu di 1 koin aja. Kalo koin itu nyungsep, lu nangis di pojokan. Bagi ke beberapa koin yang bagus.</p>
                  </div>
                </div>
              </section>

              {/* Kamus Istilah */}
              <section>
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="text-xl">📚</span> Kamus Istilah Gaul
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">💸</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Cuan / Profit</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Momen pas lu beli koin murah terus harganya terbang ke bulan. Intinya dapet untung.</p>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">⚓</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Nyangkut / HODL</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Beli koin eh besoknya nyungsep. Terpaksa pura-pura sabar nahan koin (hold) nunggu balik modal.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">🏃‍♂️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">FOMO</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Fear Of Missing Out. Liat harga koin naik gila-gilaan, lu ikutan beli buru-buru karena takut ketinggalan.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">🐋</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Paus / Whale</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Sultan/institusi yang punya modal triliunan. Kalo mereka gerak, harga pasar langsung jedag-jedug.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">🛒</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Serok Bawah</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Pasar lagi anjlok parah? Ini waktunya borong (serok) koin di harga diskon.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-900/30 flex items-center justify-center shrink-0">
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Market Cap</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Ibarat seberapa tebel "dompet" koin itu. Makin gede nilainya, makin stabil harganya.</p>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">📉</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Bearish</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Tren market yang lagi lesu darah alias harganya pada turun berjamaah.</p>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-background border border-border hover:border-border-light transition-colors flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-dim flex items-center justify-center shrink-0">
                      <span className="text-xl">📈</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary mb-1">Bullish</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">Tren market yang lagi semangat 45 alias harganya pada naik ngaceng ke atas.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
