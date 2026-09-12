export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[rgba(255,255,255,0.06)] animate-pulse rounded-xl ${className}`}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass p-4 flex flex-col gap-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TaskSkeleton() {
  return (
    <div className="glass p-4 flex items-center gap-3">
      <Skeleton className="h-5 w-5 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  )
}
