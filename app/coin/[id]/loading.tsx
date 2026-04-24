export default function CoinDetailLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Back link skeleton */}
      <div className="skeleton w-24 h-4 mb-4" />

      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <div className="skeleton w-32 h-6" />
            <div className="skeleton w-16 h-4" />
          </div>
        </div>
        <div className="sm:ml-auto space-y-1">
          <div className="skeleton w-40 h-8" />
          <div className="skeleton w-16 h-4" />
        </div>
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="skeleton h-[400px] rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-64 rounded-lg" />
          <div className="skeleton h-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
