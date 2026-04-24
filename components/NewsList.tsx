"use client";

import { useState, useEffect } from "react";
import { ExternalLink, ThumbsUp, ThumbsDown, Minus, Newspaper } from "lucide-react";
import { analyzeSentiment, type SentimentType } from "@/lib/sentiment";

interface Article {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string };
}

interface NewsListProps {
  coinName: string;
}

function SentimentBadge({ sentiment }: { sentiment: SentimentType }) {
  const config = {
    positive: {
      icon: ThumbsUp,
      label: "Positive",
      className: "text-green bg-green-dim",
    },
    negative: {
      icon: ThumbsDown,
      label: "Negative",
      className: "text-red bg-red-dim",
    },
    neutral: {
      icon: Minus,
      label: "Neutral",
      className: "text-text-tertiary bg-surface-hover",
    },
  };

  const { icon: Icon, label, className } = config[sentiment];

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${className}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
          <div className="skeleton w-20 h-16 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-3/4 h-3" />
            <div className="skeleton w-16 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsList({ coinName }: NewsListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `/api/news?q=${encodeURIComponent(coinName + " crypto")}`
        );
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles.slice(0, 6));
        }
      } catch {
        console.error("Failed to fetch news");
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [coinName]);

  if (isLoading) return <NewsSkeleton />;
  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-text-tertiary">
        <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No recent news found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" id="news-list">
      {articles.map((article, i) => {
        const sentiment = analyzeSentiment(
          `${article.title} ${article.description || ""}`
        );
        const timeAgo = getTimeAgo(article.publishedAt);

        return (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 p-3 rounded-lg border border-border hover:border-border-light hover:bg-surface-hover transition-all group"
          >
            {article.image && (
              <div className="w-20 h-14 rounded-md overflow-hidden shrink-0 bg-surface">
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-text-primary font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-text-tertiary">
                  {article.source.name}
                </span>
                <span className="text-[10px] text-text-tertiary">·</span>
                <span className="text-[10px] text-text-tertiary">
                  {timeAgo}
                </span>
                <SentimentBadge sentiment={sentiment.sentiment} />
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
          </a>
        );
      })}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
