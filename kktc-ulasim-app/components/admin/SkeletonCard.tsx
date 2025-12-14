export default function SkeletonCard() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 w-12 h-12" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
    </div>
  );
}
