export default function Skeleton({ className = '', width, height, rounded = 'xl' }) {
  const roundedClass = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full' }[rounded];
  return (
    <div
      className={`animate-shimmer bg-slate-200 ${roundedClass} ${className}`}
      style={{ width, height, minHeight: height || 20 }}
    />
  );
}

export function TrainCardSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={180} height={20} />
          <Skeleton width={120} height={14} />
        </div>
        <Skeleton width={80} height={32} rounded="full" />
      </div>
      <div className="flex items-center gap-8">
        <div className="space-y-1">
          <Skeleton width={60} height={28} />
          <Skeleton width={100} height={14} />
        </div>
        <Skeleton width={100} height={2} className="flex-1" />
        <div className="space-y-1">
          <Skeleton width={60} height={28} />
          <Skeleton width={100} height={14} />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton width={60} height={28} rounded="full" />
        <Skeleton width={60} height={28} rounded="full" />
        <Skeleton width={60} height={28} rounded="full" />
      </div>
    </div>
  );
}
