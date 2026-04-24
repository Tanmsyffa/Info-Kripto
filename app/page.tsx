import Link from "next/link";
import { Mail, Code2, Briefcase, Code, TrendingUp, Shield, Zap, ChevronRight, Newspaper } from "lucide-react";

export const metadata = {
  title: "Beranda — Info Kripto!",
  description: "Pelajari lebih lanjut tentang Info Kripto! dan hubungi pembuatnya.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-sm font-medium text-text-secondary mb-4">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            Platform Kripto Ramah Pemula
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary">
            Pantau Kripto Tanpa <span className="text-accent">Bikin Pusing</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Info Kripto! bikin data market yang ribet jadi super simpel. Cocok buat lu yang baru terjun dan nggak mau pusing liat grafik ruwet.
          </p>
          
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors"
            >
              Gas ke Dashboard <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur / Tentang Web */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-surface-alt/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Kenapa Harus Info Kripto!? 🤔</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Kita buang jauh-jauh grafik ruwet sama bahasa dewa yang bikin mabok. Semuanya dibikin chill biar lu gampang ngertinya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center group hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Dibisikin AI 🤖</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Langsung dikasih tau momen pas buat serok atau mending minggir dulu, di-backup langsung pake data AI pinter.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Data Paling Update ⚡</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Harga koin yang lu liat itu beneran harga live dari market global, dan pastinya otomatis dikonversi ke Rupiah (IDR).
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Ramah Pemula Biasa 🐣</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Ga usah takut nyasar, di sini tiap ada istilah kripto selalu ada penjelasan tongkrongan yang gampang dicerna.
              </p>
            </div>

            <div className="card p-8 text-center group hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                <Newspaper className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Berita Anget 🔥</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Biar ga kudet, lu bisa pantau berita terbaru soal koin favorit lu. Semua info yang lagi viral langsung kumpul di sini.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Kontak Developer */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Mau Ngobrol? 🤙</h2>
            <p className="text-text-secondary">
              Ada ide keren, atau nemu bug? Sabi lah kontak gue lewat link di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:sultantammam3@gmail.com"
              className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-accent hover:bg-surface-alt transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors shrink-0">
                <Mail className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">Kirim Email</div>
                <div className="text-sm text-text-tertiary mt-0.5">sultantammam3@gmail.com</div>
              </div>
            </a>

            <a
              href="https://github.com/Tanmsyffa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-accent hover:bg-surface-alt transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors shrink-0">
                <Code2 className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">GitHub</div>
                <div className="text-sm text-text-tertiary mt-0.5">Follow gue sabi lah </div>
              </div>
            </a>
            
            <a
              href="#"
              className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-accent hover:bg-surface-alt transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors shrink-0">
                <Code className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">Portofolio Developer</div>
                <div className="text-sm text-text-tertiary mt-0.5">Lihat proyek lainnya</div>
              </div>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-accent hover:bg-surface-alt transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center group-hover:bg-accent/10 transition-colors shrink-0">
                <Briefcase className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">LinkedIn</div>
                <div className="text-sm text-text-tertiary mt-0.5">Kuy konek</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
