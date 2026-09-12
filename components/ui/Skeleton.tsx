export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#151515] animate-pulse rounded-none ${className}`}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[#0D0D0D] border-t border-dashed border-[rgba(255,255,255,0.14)] p-6 flex flex-col gap-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TaskSkeleton() {
  return (
    <div className="border-b border-dashed border-[rgba(255,255,255,0.14)] py-3 flex items-center gap-3">
      <Skeleton className="h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2 w-1/3" />
      </div>
    </div>
  )
}
