export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="skeleton w-48 h-6 mb-1.5" />
        <div className="skeleton w-72 h-4" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-lg" />
        ))}
      </div>

      {/* Columns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-lg" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="skeleton h-10 rounded-none" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border"
          >
            <div className="skeleton w-6 h-4" />
            <div className="skeleton w-7 h-7 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton w-24 h-4" />
            </div>
            <div className="skeleton w-20 h-4" />
            <div className="skeleton w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
