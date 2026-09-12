'use client'

import { getGreetingPrefix } from '@/utils/date'
import { useUser } from '@/hooks/useUser'
import { Skeleton } from '@/components/ui/Skeleton'

export function GreetingHeader() {
  const { profile, loading } = useUser()

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }

  const firstName = profile?.name?.split(' ')[0] ?? 'there'
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-bold text-[#f4f4f5]">
        {getGreetingPrefix()}, {firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-[#71717a]">{dateStr}</p>
    </div>
  )
}
