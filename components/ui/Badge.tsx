import type { ReactNode } from 'react'

type BadgeVariant = 'purple' | 'cyan' | 'amber' | 'red' | 'green' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  purple: 'bg-[rgba(168,85,247,0.15)] text-[#a855f7] border-[rgba(168,85,247,0.3)]',
  cyan:   'bg-[rgba(34,211,238,0.15)] text-[#22d3ee] border-[rgba(34,211,238,0.3)]',
  amber:  'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]',
  red:    'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-[rgba(239,68,68,0.3)]',
  green:  'bg-[rgba(34,197,94,0.15)] text-[#22c55e] border-[rgba(34,197,94,0.3)]',
  neutral:'bg-[rgba(255,255,255,0.06)] text-[#a1a1aa] border-[rgba(255,255,255,0.10)]',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}
