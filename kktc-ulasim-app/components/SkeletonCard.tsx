export default function SkeletonCard() {
  return (
    <div className="group bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50 animate-pulse">
      {/* Route Header Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
        </div>
        <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
      </div>

      {/* Route Legs Skeleton */}
      <div className="space-y-2">
        {/* First Leg */}
        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-lg p-3 border border-zinc-200/50 dark:border-zinc-700/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3.5 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Transfer Indicator Skeleton (optional, sometimes shown) */}
        <div className="flex items-center gap-2 py-2 px-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
            <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
          </div>
        </div>

        {/* Second Leg (sometimes shown for transfer routes) */}
        <div className="bg-white/80 dark:bg-zinc-900/40 rounded-lg p-3 border border-zinc-200/50 dark:border-zinc-700/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3.5 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

