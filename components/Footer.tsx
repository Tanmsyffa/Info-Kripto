import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-8 bg-surface-alt/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-0">
          <img src="/Logo-InfoKripto.png" alt="Info Kripto Logo" className="h-14 w-auto -mr-5" />
          <span className="text-xl font-extrabold text-text-primary tracking-tighter">
            Info Kripto!
          </span>
        </div>
        
        <div className="text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Info Kripto!. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
