"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, TrendingUp, Loader2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setResults(data.coins?.slice(0, 8) || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, handleSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsMobileSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !isMobileSearch) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileSearch(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSearch]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-0 shrink-0 py-2"
            id="nav-logo"
          >
            <img src="/Logo-InfoKripto.png" alt="Info Kripto Logo" className="h-14 w-auto -mr-5" />
            <span className="text-2xl font-extrabold text-text-primary tracking-tighter hidden sm:block">
              Info Kripto!
            </span>
          </Link>

          {/* Search - Desktop */}
          <div
            ref={containerRef}
            className="relative hidden sm:block flex-1 max-w-md mx-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mau nyari koin apa? ( / )"
                className="w-full h-9 pl-9 pr-8 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-light transition-colors"
                id="search-input"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-secondary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {isLoading && (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary animate-spin" />
              )}
            </div>

            {/* Results dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-2xl overflow-hidden fade-in">
                {results.map((coin) => (
                  <Link
                    key={coin.id}
                    href={`/coin/${coin.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover transition-colors"
                  >
                    <img
                      src={coin.thumb}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-text-primary font-medium">
                        {coin.name}
                      </span>
                      <span className="text-xs text-text-tertiary ml-2 uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                    {coin.market_cap_rank && (
                      <span className="text-xs text-text-tertiary">
                        #{coin.market_cap_rank}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile search button */}
          <button
            onClick={() => {
              setIsMobileSearch(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="sm:hidden p-2 text-text-secondary hover:text-text-primary"
            id="mobile-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Status & Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green pulse-dot" />
              <span className="text-xs text-text-tertiary hidden md:block">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isMobileSearch && (
        <div
          ref={containerRef}
          className="absolute inset-x-0 top-0 bg-background border-b border-border p-3 sm:hidden z-50 fade-in"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mau nyari koin apa?"
                className="w-full h-10 pl-9 pr-4 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-light"
              />
            </div>
            <button
              onClick={() => {
                setIsMobileSearch(false);
                clearSearch();
              }}
              className="text-sm text-text-secondary"
            >
              Gak jadi
            </button>
          </div>

          {isOpen && results.length > 0 && (
            <div className="mt-2 bg-surface border border-border rounded-lg overflow-hidden max-h-80 overflow-y-auto">
              {results.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coin/${coin.id}`}
                  onClick={() => {
                    setIsMobileSearch(false);
                    clearSearch();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover transition-colors"
                >
                  <img
                    src={coin.thumb}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-primary font-medium">
                      {coin.name}
                    </span>
                    <span className="text-xs text-text-tertiary ml-2 uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                  {coin.market_cap_rank && (
                    <span className="text-xs text-text-tertiary">
                      #{coin.market_cap_rank}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
